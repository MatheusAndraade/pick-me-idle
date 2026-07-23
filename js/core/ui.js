import { game, saveGame } from './state.js';
import { MAT_ICONS } from '../data/constants.js';

let lastNotificationText = "";
let lastNotificationTime = 0;

export function notify(msg) {
    const now = Date.now();
    if (msg === lastNotificationText && now - lastNotificationTime < 3000) return;
    lastNotificationText = msg;
    lastNotificationTime = now;

    const area = document.getElementById('notification-area');
    const el = document.createElement('div'); 
    el.className = 'notification'; 
    el.innerText = msg; 
    area.appendChild(el); 
    setTimeout(() => el.remove(), 4000);
}

export function notifyLoot(lootCounts, floor) {
    const area = document.getElementById('loot-notification-area');
    if (!area) return;
    
    let lootTextEntries = [];
    for (let [item, qtd] of Object.entries(lootCounts)) {
        lootTextEntries.push(`${MAT_ICONS[item] || ''} ${item} x${qtd}`);
    }
    
    const el = document.createElement('div');
    el.className = 'loot-notification';
    el.innerHTML = `<div style="font-weight:bold; color:var(--primary); margin-bottom:2px;">🎁 Loot Andar ${floor}</div><div>${lootTextEntries.join(' | ')}</div>`;
    area.appendChild(el);
    setTimeout(() => el.remove(), 4000);
}

export function openModal(id) { document.getElementById(id).classList.add('active'); }
export function closeModal(id) { document.getElementById(id).classList.remove('active'); }

export function toggleFarmLoop(checkbox) {
    game.settings.farmLoop = checkbox.checked;
    document.getElementById('farm-loop-checkbox').checked = game.settings.farmLoop;
    document.getElementById('battle-loop-checkbox').checked = game.settings.farmLoop;
    notify(game.settings.farmLoop ? "🔄 Modo Loop ativado!" : "⏹️ Modo Loop desativado.");
    saveGame();
}

export function switchTab(tabId) {
    // Atualiza a aparência de todos os botões do menu lateral para o estado padrão (inativo)
    document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
        btn.style.background = '#161b22';
        btn.style.borderColor = '#21262d';
        btn.style.color = '#94a3b8';
    });

    // Destaca visualmente o botão da aba que foi clicada/selecionada
    const targetBtn = document.getElementById('btn-' + tabId);
    if(targetBtn && !targetBtn.classList.contains('play-tower-btn')) {
        targetBtn.style.background = '#1f2937';
        targetBtn.style.borderColor = 'var(--primary)';
        targetBtn.style.color = '#ffffff';
    }

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // Altera dinamicamente o botão superior do cabeçalho com base na aba ativa
    const headerBtn = document.getElementById('header-manage-btn');
    if (headerBtn) {
        if (tabId === 'tab-lobby') {
            headerBtn.style.display = 'block';
            headerBtn.innerHTML = '🎒 Gerenciar Heróis';
            headerBtn.setAttribute('onclick', "openModal('modal-lobby-manage')");
        } else if (tabId === 'tab-team') {
            headerBtn.style.display = 'block';
            headerBtn.innerHTML = '⚔️ Gerenciar Equipe';
            headerBtn.setAttribute('onclick', "openModal('modal-team-manage')");
        } else {
            headerBtn.style.display = 'none'; // Oculta nas outras abas
        }
    }

    if(tabId === 'tab-inventory') window.renderInventory();
    if(tabId === 'tab-craft') window.renderCraft();
    if(tabId === 'tab-map') window.renderMap();
    
    if(tabId === 'tab-team') {
        window.renderTeam();
        if(window.initTowerWalk) window.initTowerWalk();
    } else {
        if(window.stopTowerWalk) window.stopTowerWalk();
    }

    if(tabId === 'tab-lobby') {
        window.renderVillage();
        if(window.initLobbyWalk) window.initLobbyWalk();
    } else {
        if(window.stopLobbyWalk) window.stopLobbyWalk();
    }
    
    if(tabId === 'tab-synthesis') window.renderSynthesis();
}