import { game } from '../core/state.js';
import { CLASSES } from '../data/constants.js';

let lobbyInterval = null;
let wanderingHeroes = [];

let towerInterval = null;
let wanderingTeamHeroes = [];

export function initLobbyWalk() {
    stopLobbyWalk();
    
    const container = document.getElementById('lobby-walk-area');
    if (!container) return;
    container.innerHTML = '';

    const heroesList = game.village || [];
    if (heroesList.length === 0) return;

    if (!game.heroPositions) game.heroPositions = {};

    const getValidLobbyCoords = () => {
        if (Math.random() < 0.35) {
            return {
                x: Math.random() * (52 - 28) + 28,
                y: Math.random() * (50 - 48) + 48
            };
        } else {
            return {
                x: Math.random() * (79 - 28) + 28,
                y: Math.random() * (87 - 52) + 52
            };
        }
    };

    wanderingHeroes = heroesList.map((h, index) => {
        const heroId = h.id || index;
        
        if (!game.heroPositions[heroId]) {
            const pos = getValidLobbyCoords();
            game.heroPositions[heroId] = { x: pos.x, y: pos.y, targetX: pos.x, targetY: pos.y };
        }

        const savedPos = game.heroPositions[heroId];
        return {
            id: heroId,
            name: h.name,
            level: h.level,
            icon: CLASSES[h.class] ? CLASSES[h.class].icon : '⭐',
            x: savedPos.x,
            y: savedPos.y,
            targetX: savedPos.targetX,
            targetY: savedPos.targetY
        };
    });

    wanderingHeroes.forEach(hero => {
        const div = document.createElement('div');
        div.className = 'walking-hero';
        div.id = `walk-hero-${hero.id}`;
        div.style.left = `${hero.x}%`;
        div.style.top = `${hero.y}%`;
        
        div.innerHTML = `
            <div class="walking-hero-avatar">${hero.icon}</div>
            <div class="walking-hero-tag">${hero.name} <br><span>LVL ${hero.level}</span></div>
        `;
        container.appendChild(div);
    });

    lobbyInterval = setInterval(() => {
        wanderingHeroes.forEach(hero => {
            if (Math.random() < 0.65) {
                if (Math.random() < 0.35) {
                    hero.targetX = Math.random() * (52 - 28) + 28;
                    hero.targetY = Math.random() * (50 - 48) + 48;
                } else {
                    hero.targetX = Math.random() * (79 - 28) + 28;
                    hero.targetY = Math.random() * (87 - 52) + 52;
                }
            }

            hero.x += (hero.targetX - hero.x) * 0.3;
            hero.y += (hero.targetY - hero.y) * 0.3;

            if (game.heroPositions[hero.id]) {
                game.heroPositions[hero.id].x = hero.x;
                game.heroPositions[hero.id].y = hero.y;
                game.heroPositions[hero.id].targetX = hero.targetX;
                game.heroPositions[hero.id].targetY = hero.targetY;
            }

            const el = document.getElementById(`walk-hero-${hero.id}`);
            if (el) {
                el.style.left = `${hero.x}%`;
                el.style.top = `${hero.y}%`;
            }
        });
    }, 3000);
}

export function stopLobbyWalk() {
    if (lobbyInterval) {
        clearInterval(lobbyInterval);
        lobbyInterval = null;
    }
}

export function initTowerWalk() {
    stopTowerWalk();
    
    const container = document.getElementById('tower-walk-area');
    if (!container) return;
    container.innerHTML = '';

    const heroesList = game.heroes || [];
    if (heroesList.length === 0) return;

    const minX = 35, maxX = 78;
    const minY = 71, maxY = 88;

    if (!game.towerHeroPositions) game.towerHeroPositions = {};

    wanderingTeamHeroes = heroesList.map((h, index) => {
        const heroId = h.id || index;

        if (!game.towerHeroPositions[heroId]) {
            const rx = Math.random() * (maxX - minX) + minX;
            const ry = Math.random() * (maxY - minY) + minY;
            game.towerHeroPositions[heroId] = { x: rx, y: ry, targetX: rx, targetY: ry };
        }

        const savedPos = game.towerHeroPositions[heroId];
        return {
            id: heroId,
            name: h.name,
            level: h.level,
            icon: CLASSES[h.class] ? CLASSES[h.class].icon : '⭐',
            x: savedPos.x,
            y: savedPos.y,
            targetX: savedPos.targetX,
            targetY: savedPos.targetY
        };
    });

    wanderingTeamHeroes.forEach(hero => {
        const div = document.createElement('div');
        div.className = 'walking-hero';
        div.id = `walk-tower-hero-${hero.id}`;
        div.style.left = `${hero.x}%`;
        div.style.top = `${hero.y}%`;
        
        div.innerHTML = `
            <div class="walking-hero-avatar">${hero.icon}</div>
            <div class="walking-hero-tag">${hero.name} <br><span>LVL ${hero.level}</span></div>
        `;
        container.appendChild(div);
    });

    towerInterval = setInterval(() => {
        wanderingTeamHeroes.forEach(hero => {
            if (Math.random() < 0.65) {
                hero.targetX = Math.random() * (maxX - minX) + minX;
                hero.targetY = Math.random() * (maxY - minY) + minY;
            }

            hero.x += (hero.targetX - hero.x) * 0.3;
            hero.y += (hero.targetY - hero.y) * 0.3;

            if (game.towerHeroPositions[hero.id]) {
                game.towerHeroPositions[hero.id].x = hero.x;
                game.towerHeroPositions[hero.id].y = hero.y;
                game.towerHeroPositions[hero.id].targetX = hero.targetX;
                game.towerHeroPositions[hero.id].targetY = hero.targetY;
            }

            const el = document.getElementById(`walk-tower-hero-${hero.id}`);
            if (el) {
                el.style.left = `${hero.x}%`;
                el.style.top = `${hero.y}%`;
            }
        });
    }, 3000);

        // Executa o primeiro movimento instantaneamente para não deixá-los parados na torre
    updateTowerWalk();

    towerInterval = setInterval(updateTowerWalk, 1);
}

export function stopTowerWalk() {
    if (towerInterval) {
        clearInterval(towerInterval);
        towerInterval = null;
    }
}