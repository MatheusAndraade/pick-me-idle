import { REGIONS_DATA, RARITIES } from '../data/constants.js';
import { game } from '../core/state.js';
import { getAllHeroes } from './heroes.js';

export function getRegionData(floor) {
    let f = Math.min(100, Math.max(1, floor));
    for (let reg of REGIONS_DATA) {
        if (f >= reg.range[0] && f <= reg.range[1]) return reg;
    }
    return REGIONS_DATA[0];
}

export function renderMap() {
    const container = document.getElementById('map-container'); container.innerHTML = '';
    
    for(let i = 1; i <= 100; i++) {
        let isBoss = i % 10 === 0; 
        let region = getRegionData(i);
        let teamAvg = 1;
        let allH = getAllHeroes();
        if(allH.length > 0) teamAvg = Math.round(allH.reduce((s, h) => s + h.stars, 0) / allH.length);
        let mStarsBase = Math.min(7, Math.max(1, Math.ceil((Math.min(7, Math.ceil(i / 10)) + teamAvg) / 2)));
        if(isBoss) mStarsBase = Math.min(7, mStarsBase + 1);
        
        let icon = isBoss ? '🐉' : '⚔️';
        let statusClass = 'locked'; let clickAttr = '';
        
        if (i < game.maxFloor) { statusClass = 'cleared'; icon = '✅'; clickAttr = `onclick="window.startTowerLevel(${i})"`; } 
        else if (i === game.maxFloor) { statusClass = 'current'; clickAttr = `onclick="window.startTowerLevel(${i})"`; icon = '🚩'; } 
        else { icon = '🔒'; }

        let starStr = `<span style="color:${RARITIES.find(r=>r.stars===mStarsBase).color}">${'⭐'.repeat(mStarsBase)}</span>`;
        
        container.innerHTML += `
            <div class="map-node ${statusClass}" ${clickAttr} id="map-node-${i}">
                <div class="map-icon" style="font-size:1.8rem;">${icon}</div>
                <div class="map-label">Andar ${i} - ${region.name} ${isBoss ? ' [CHEFE]' : ''} <br> ${starStr}</div>
            </div>`;
    }

    setTimeout(() => {
        let current = document.getElementById(`map-node-${game.maxFloor}`);
        if(current) current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
}