import { game, setGame, currentSaveKey, setCurrentSaveKey, getSaveList, saveGameList, saveGame, formatPlayTime, battleState, battleInterval, setBattleInterval } from './core/state.js';
import { notify, openModal, closeModal, switchTab, toggleFarmLoop } from './core/ui.js';
import { generateHero, summonHero, sendToVillage, sendToTeam, dismissVillageHero, pickHeroForSynthesis, clearSynthSlot, autoFillSynthesis, executeSynthesis, moveHero, renderTeam, renderVillage, renderSynthesis, openHeroEquipModal, equipItemToTarget, unequip, dismissHero, openHeroSkillModal, equipSkillToTarget, unequipSkill } from './features/heroes.js';
import { craftItem, renderInventory, renderCraft } from './features/inventory.js';
import { startTowerLevel, fleeBattle, repeatFloor, nextFloor } from './features/battle.js';
import { renderMap } from './features/map.js';

export function updateUI() {
    document.getElementById('ui-gold').innerText = game.gold;
    document.getElementById('ui-max-floor').innerText = game.maxFloor;
    renderTeam();
    renderVillage();
    renderSynthesis();
}

export function openNewGameModal() {
    document.getElementById('new-save-name').value = '';
    openModal('modal-new-game');
}

export function createNewGame() {
    const nameInput = document.getElementById('new-save-name').value.trim();
    const saveName = nameInput !== "" ? nameInput : "Aventura " + (getSaveList().length + 1);
    const saveKey = 'pickMeIdle_save_' + Date.now();

    let saves = getSaveList();
    saves.push({ key: saveKey, name: saveName });
    saveGameList(saves);

    setCurrentSaveKey(saveKey);
    setGame({
        gold: 500, maxFloor: 1, 
        heroes: [generateHero(3)],     
        village: [],    
        inventory: { materials: { Minério: 0, Madeira: 0, Couro: 0, Tecido: 0, Cristal: 0, 'Essência de Dragão': 0 }, equips: [] },
        settings: { farmLoop: false },
        playTime: 0, pendingLevelUps: [], sessionStartStats: {}, lastOnline: Date.now()
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
            container.innerHTML += `
                <button onclick="window.loadSpecificSave('${s.key}')" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight:bold; font-size:1.1rem; color:var(--primary);">${s.name}</div>
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
    
    /* Garante a compatibilidade com saves antigos sem habilidades */
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
            container.innerHTML += `
                <button onclick="window.deleteSpecificSave('${s.key}')" style="border-color: var(--danger); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight:bold; font-size:1.1rem; color:var(--danger);">${s.name}</div>
                        <div style="font-size:0.75rem; color:#94a3b8;">Clique para excluir</div>
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
    updateUI();
    document.getElementById('screen-start').classList.remove('active');
    document.getElementById('screen-gameover').classList.remove('active');
    document.getElementById('screen-hub').classList.add('active');
    switchTab('tab-team');
    
    if (window.gameInterval) clearInterval(window.gameInterval);
    window.gameInterval = setInterval(saveGame, 5000);

    if (window.playTimeInterval) clearInterval(window.playTimeInterval);
    window.playTimeInterval = setInterval(() => {
        game.playTime = (game.playTime || 0) + 1;
    }, 1000);
}

// ================= EXPOSIÇÃO GLOBAL PARA O HTML =================
window.updateUI = updateUI;
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

/* Inventário / Itens */
window.openHeroEquipModal = openHeroEquipModal;
window.equipItemToTarget = equipItemToTarget;
window.unequip = unequip;

/* Habilidades (NOVAS) */
window.openHeroSkillModal = openHeroSkillModal;
window.equipSkillToTarget = equipSkillToTarget;
window.unequipSkill = unequipSkill;

window.dismissHero = dismissHero;
window.craftItem = craftItem;

/* Batalha */
window.startTowerLevel = startTowerLevel;
window.fleeBattle = fleeBattle;
window.nextFloor = nextFloor;
window.repeatFloor = repeatFloor;