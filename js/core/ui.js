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
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if(!btn.classList.contains('play-tower-btn')) btn.classList.remove('active');
    });
    const targetBtn = document.getElementById('btn-' + tabId);
    if(targetBtn && !targetBtn.classList.contains('play-tower-btn')) targetBtn.classList.add('active');

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    // As chamadas de renderização vão utilizar o window. para evitar problema circular.
    if(tabId === 'tab-inventory') window.renderInventory();
    if(tabId === 'tab-craft') window.renderCraft();
    if(tabId === 'tab-map') window.renderMap();
    if(tabId === 'tab-team') window.renderTeam();
    if(tabId === 'tab-lobby') window.renderVillage();
    if(tabId === 'tab-synthesis') window.renderSynthesis();
}