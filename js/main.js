import { game, setGame, currentSaveKey, setCurrentSaveKey, getSaveList, saveGameList, saveGame, formatPlayTime, battleState, battleInterval, setBattleInterval, selectedPlayerIcon, setSelectedPlayerIcon } from './core/state.js';
import { notify, openModal, closeModal, switchTab, toggleFarmLoop } from './core/ui.js';
import { generateHero, summonHero, sendToVillage, sendToTeam, dismissVillageHero, pickHeroForSynthesis, clearSynthSlot, autoFillSynthesis, executeSynthesis, moveHero, renderTeam, renderVillage, renderSynthesis, openHeroEquipModal, equipItemToTarget, unequip, dismissHero, openHeroSkillModal, equipSkillToTarget, unequipSkill, getRandomInt } from './features/heroes.js';
import { craftItem, renderInventory, renderCraft } from './features/inventory.js';
import { startTowerLevel, fleeBattle, repeatFloor, nextFloor } from './features/battle.js';
import { renderMap } from './features/map.js';
import { initLobbyWalk, stopLobbyWalk, initTowerWalk, stopTowerWalk } from './features/lobby.js';

// Função auxiliar para renderizar o ícone do jogador corretamente (seja emoji ou imagem customizada)
function getPlayerIconHtml(icon) {
    if (!icon) icon = 'avatar_wizard';
    if (icon.startsWith('avatar_')) {
        return `<img src="img/${icon}.png" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    }
    return icon; // Caso seja emoji antigo
}

export function updateUI() {
    // Atualiza Ouro e Andar Max
    document.getElementById('ui-gold').innerText = game.gold;
    document.getElementById('ui-max-floor').innerText = game.maxFloor;

    // Atualiza nome e ícone do perfil do jogador na sidebar
    const nameEl = document.getElementById('ui-player-name');
    const iconEl = document.getElementById('ui-player-icon');
    const welcomeNameEl = document.getElementById('ui-welcome-name');

    if (nameEl) nameEl.innerText = game.playerName || 'Aventureiro';
    if (iconEl) iconEl.innerHTML = getPlayerIconHtml(game.playerIcon);
    if (welcomeNameEl) welcomeNameEl.innerText = game.playerName || 'Aventureiro';

    renderTeam();
    renderVillage();
    renderSynthesis();
    if (document.getElementById('tab-lobby').classList.contains('active')) {
        initLobbyWalk();
    }
    if (document.getElementById('tab-team').classList.contains('active')) {
        initTowerWalk();
    }
}

export function selectAvatar(icon, element) {
    setSelectedPlayerIcon(icon);
    // Remove a classe 'active' de todos os avatares customizados para garantir seleção única
    document.querySelectorAll('.custom-avatar-option').forEach(el => {
        el.classList.remove('active');
    });
    // Adiciona apenas no elemento clicado
    element.classList.add('active');
}

export function openNewGameModal() {
    document.getElementById('new-save-name').value = '';
    setSelectedPlayerIcon('avatar_wizard');
    document.querySelectorAll('.custom-avatar-option').forEach((el, index) => {
        if(index === 0) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    openModal('modal-new-game');
}

export function createNewGame() {
    const nameInput = document.getElementById('new-save-name').value.trim();
    const saveName = nameInput !== "" ? nameInput : "Aventura " + (getSaveList().length + 1);
    const saveKey = 'pickMeIdle_save_' + Date.now();

    let saves = getSaveList();
    saves.push({ key: saveKey, name: saveName, icon: selectedPlayerIcon });
    saveGameList(saves);

    setCurrentSaveKey(saveKey);
    setGame({
        playerName: saveName,
        playerIcon: selectedPlayerIcon,
        playerLevel: 1,
        playerExp: 0,
        gold: 0, 
        maxFloor: 1, 
        heroes: [], // Equipe de batalha inicia vazia
        village: Array.from({ length: 5 }, () => generateHero(getRandomInt(1, 3))), // 5 heróis iniciais direto no Lobby
        inventory: { materials: { Minério: 0, Madeira: 0, Couro: 0, Tecido: 0, Cristal: 0, 'Essência de Dragão': 0 }, equips: [] },
        settings: { farmLoop: false },
        playTime: 0, pendingLevelUps: [], sessionStartStats: {}, 
        heroPositions: {}, towerHeroPositions: {},
        lastOnline: Date.now()
    });
    saveGame();
    closeModal('modal-new-game');
    startMainGameUI();
}

export function openLoadGameModal() {
    const saves = getSaveList();
    const container = document.getElementById('saves-container');
    container.innerHTML = '';
    document.getElementById('saves-modal-title').innerText = "Carregar Jogo";

    if (saves.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:15px;">Nenhum save encontrado. Crie um Novo Jogo!</div>`;
    } else {
        saves.forEach(s => {
            let savedData = JSON.parse(localStorage.getItem(s.key) || '{}');
            let pTime = formatPlayTime(savedData.playTime || 0);
            let iconCode = s.icon || savedData.playerIcon || 'avatar_wizard';
            let iconHtml = iconCode.startsWith('avatar_') ? `<img src="img/${iconCode}.png" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">` : iconCode;

            container.innerHTML += `
                <button onclick="window.loadSpecificSave('${s.key}')" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">${iconHtml}</div>
                        <div style="font-weight:bold; font-size:1.1rem; color:var(--primary);">${s.name}</div>
                    </div>
                    <div style="font-size:0.85rem; color:#94a3b8;">⏱️ ${pTime}</div>
                </button>`;
        });
    }
    openModal('modal-saves-list');
}

export function loadSpecificSave(key) {
    const data = localStorage.getItem(key);
    if (!data) return notify("Erro ao carregar save.");
    setCurrentSaveKey(key);
    let loadedGame = JSON.parse(data);
    
    if(!loadedGame.inventory.materials) loadedGame.inventory = { materials: {Minério:0, Madeira:0, Couro:0, Tecido:0, Cristal:0, 'Essência de Dragão': 0}, equips: [] };
    if(loadedGame.inventory.materials['Essência de Dragão'] === undefined) loadedGame.inventory.materials['Essência de Dragão'] = 0;
    if(!loadedGame.village) loadedGame.village = [];
    if(!loadedGame.settings) loadedGame.settings = { farmLoop: false };
    if(loadedGame.playTime === undefined) loadedGame.playTime = 0;
    if(!loadedGame.pendingLevelUps) loadedGame.pendingLevelUps = [];
    if(!loadedGame.sessionStartStats) loadedGame.sessionStartStats = {};
    if(!loadedGame.heroPositions) loadedGame.heroPositions = {};
    if(!loadedGame.towerHeroPositions) loadedGame.towerHeroPositions = {};
    if(!loadedGame.playerName) loadedGame.playerName = key;
    if(!loadedGame.playerIcon) loadedGame.playerIcon = 'avatar_wizard';
    if(!loadedGame.playerLevel) loadedGame.playerLevel = 1;
    if(!loadedGame.playerExp) loadedGame.playerExp = 0;
    
    if (loadedGame.heroes) { loadedGame.heroes.forEach(h => { if (!h.selectedSkills) h.selectedSkills = [null, null]; }); }
    if (loadedGame.village) { loadedGame.village.forEach(h => { if (!h.selectedSkills) h.selectedSkills = [null, null]; }); }

    setGame({ ...game, ...loadedGame });

    closeModal('modal-saves-list');
    startMainGameUI();
}

export function openDeleteGameModal() {
    const saves = getSaveList();
    const container = document.getElementById('saves-container');
    container.innerHTML = '';
    document.getElementById('saves-modal-title').innerText = "Deletar Jogo";

    if (saves.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#94a3b8; padding:15px;">Nenhum save para deletar.</div>`;
    } else {
        saves.forEach(s => {
            let savedData = JSON.parse(localStorage.getItem(s.key) || '{}');
            let pTime = formatPlayTime(savedData.playTime || 0);
            let iconCode = s.icon || savedData.playerIcon || 'avatar_wizard';
            let iconHtml = iconCode.startsWith('avatar_') ? `<img src="img/${iconCode}.png" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">` : iconCode;

            container.innerHTML += `
                <button onclick="window.deleteSpecificSave('${s.key}')" style="border-color: var(--danger); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">${iconHtml}</div>
                        <div>
                            <div style="font-weight:bold; font-size:1.1rem; color:var(--danger);">${s.name}</div>
                            <div style="font-size:0.75rem; color:#94a3b8;">Clique para excluir</div>
                        </div>
                    </div>
                    <div style="font-size:0.85rem; color:#94a3b8;">⏱️ ${pTime}</div>
                </button>`;
        });
    }
    openModal('modal-saves-list');
}

export function deleteSpecificSave(key) {
    if (confirm("Deseja realmente deletar este save?")) {
        localStorage.removeItem(key);
        let saves = getSaveList().filter(s => s.key !== key);
        saveGameList(saves);
        closeModal('modal-saves-list');
        openDeleteGameModal();
        notify("Save deletado com sucesso.");
    }
}

export function returnToTitle() {
    battleState.active = false;
    battleState.runLoot = {};
    if (battleInterval) { clearInterval(battleInterval); setBattleInterval(null); }
    if (window.gameInterval) clearInterval(window.gameInterval);
    if (window.playTimeInterval) clearInterval(window.playTimeInterval);
    stopLobbyWalk();
    stopTowerWalk();
    saveGame();
    setCurrentSaveKey(null);
    game.pendingLevelUps = [];
    game.sessionStartStats = {};
    
    document.getElementById('screen-battle').classList.remove('active');
    document.getElementById('screen-hub').classList.remove('active');
    document.getElementById('screen-gameover').classList.remove('active');
    document.getElementById('screen-start').classList.add('active');
}

export function startMainGameUI() {
    document.getElementById('farm-loop-checkbox').checked = game.settings.farmLoop;
    document.getElementById('battle-loop-checkbox').checked = game.settings.farmLoop;
    if(!game.pendingLevelUps) game.pendingLevelUps = [];
    if(!game.sessionStartStats) game.sessionStartStats = {};
    if(!game.heroPositions) game.heroPositions = {};
    if(!game.towerHeroPositions) game.towerHeroPositions = {};
    
    const welcomeBanner = document.getElementById('welcome-banner');
    if (welcomeBanner) {
        welcomeBanner.style.opacity = '1';
        welcomeBanner.style.visibility = 'visible';
        
        setTimeout(() => {
            welcomeBanner.style.opacity = '0';
            welcomeBanner.style.visibility = 'hidden';
        }, 5000);
    }

    updateUI();
    document.getElementById('screen-start').classList.remove('active');
    document.getElementById('screen-gameover').classList.remove('active');
    document.getElementById('screen-hub').classList.add('active');
    switchTab('tab-lobby');
    
    if (window.gameInterval) clearInterval(window.gameInterval);
    window.gameInterval = setInterval(saveGame, 5000);

    if (window.playTimeInterval) clearInterval(window.playTimeInterval);
    window.playTimeInterval = setInterval(() => {
        game.playTime = (game.playTime || 0) + 1;
    }, 1000);
}

// ================= EXPOSIÇÃO GLOBAL PARA O HTML =================
window.updateUI = updateUI;
window.selectAvatar = selectAvatar;
window.openNewGameModal = openNewGameModal;
window.createNewGame = createNewGame;
window.openLoadGameModal = openLoadGameModal;
window.loadSpecificSave = loadSpecificSave;
window.openDeleteGameModal = openDeleteGameModal;
window.deleteSpecificSave = deleteSpecificSave;
window.returnToTitle = returnToTitle;
window.startMainGameUI = startMainGameUI;

window.switchTab = switchTab;
window.toggleFarmLoop = toggleFarmLoop;
window.openModal = openModal;
window.closeModal = closeModal;

window.renderVillage = renderVillage; 
window.renderSynthesis = renderSynthesis;
window.renderInventory = renderInventory;
window.renderCraft = renderCraft;
window.renderMap = renderMap;
window.renderTeam = renderTeam;

window.summonHero = summonHero;
window.sendToVillage = sendToVillage;
window.sendToTeam = sendToTeam;
window.dismissVillageHero = dismissVillageHero;
window.pickHeroForSynthesis = pickHeroForSynthesis;
window.clearSynthSlot = clearSynthSlot;
window.autoFillSynthesis = autoFillSynthesis;
window.executeSynthesis = executeSynthesis;
window.moveHero = moveHero;

window.openHeroEquipModal = openHeroEquipModal;
window.equipItemToTarget = equipItemToTarget;
window.unequip = unequip;

window.openHeroSkillModal = openHeroSkillModal;
window.equipSkillToTarget = equipSkillToTarget;
window.unequipSkill = unequipSkill;

window.dismissHero = dismissHero;
window.craftItem = craftItem;

window.startTowerLevel = startTowerLevel;
window.fleeBattle = fleeBattle;
window.nextFloor = nextFloor;
window.repeatFloor = repeatFloor;

window.initLobbyWalk = initLobbyWalk;
window.stopLobbyWalk = stopLobbyWalk;
window.initTowerWalk = initTowerWalk;
window.stopTowerWalk = stopTowerWalk;