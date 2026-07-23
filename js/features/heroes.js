import { CLASSES, ELEMENTS, ELEMENT_ICONS, HERO_NAMES, RARITIES, ITEM_RARITIES, CLASS_SKILLS } from '../data/constants.js';
import { game, synthMainHeroId, setSynthMainHeroId, synthMaterialHeroId, setSynthMaterialHeroId, equipTargetHeroId, setEquipTargetHeroId, equipTargetType, setEquipTargetType, equipTargetSkillSlot, setEquipTargetSkillSlot } from '../core/state.js';
import { notify, openModal, closeModal } from '../core/ui.js';
import { renderInventory } from './inventory.js';

export function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export function generateHero(forceStars = null) {
    const classes = Object.keys(CLASSES); 
    const heroClass = classes[getRandomInt(0, classes.length - 1)];
    const element = ELEMENTS[getRandomInt(0, ELEMENTS.length - 1)];
    
    const usedNames = new Set([...game.heroes, ...game.village].map(h => h.name));
    const availableNames = HERO_NAMES.filter(n => !usedNames.has(n));
    const name = availableNames.length > 0 ? availableNames[getRandomInt(0, availableNames.length - 1)] : "Herói " + getRandomInt(100, 999);

    let rarityObj = RARITIES[0];
    if (forceStars) { rarityObj = RARITIES.find(r => r.stars === forceStars); } 
    else { let roll = Math.random() * 100, cumulative = 0; for (let r of RARITIES) { cumulative += r.chance; if (roll <= cumulative) { rarityObj = r; break; } } }
    
    const cMods = CLASSES[heroClass];
    return {
        id: Date.now() + Math.random(), name: name, class: heroClass, element: element, rarity: rarityObj.name, stars: rarityObj.stars,
        level: 1, exp: 0, rank: 1,
        selectedSkills: [null, null], /* Novos Slots de Skill */
        baseStats: { 
            hp: Math.floor(100 * cMods.hp * rarityObj.statMod), 
            atk: Math.floor(15 * cMods.atk * rarityObj.statMod), 
            mag: Math.floor(12 * cMods.mag * rarityObj.statMod), 
            def: Math.floor(10 * cMods.def * rarityObj.statMod), 
            res: Math.floor(10 * cMods.res * rarityObj.statMod), 
            spd: Math.floor(10 * cMods.spd), 
            acc: Math.floor(100 * cMods.acc), 
            eva: Math.floor(5 * cMods.eva),
            critRate: Math.floor(cMods.crit * 100),
            critDmg: 150,
            penetration: 5,
            lifesteal: 0,
            tenacity: 10,
            control: 10
        },
        equipment: { Arma: null, Armadura: null }
    };
}

export function getTotalStats(hero) {
    let rankMultiplier = 1 + ((hero.rank - 1) * 0.3); 
    let stats = { 
        hp: Math.floor(hero.baseStats.hp * rankMultiplier), 
        atk: Math.floor(hero.baseStats.atk * rankMultiplier), 
        mag: Math.floor(hero.baseStats.mag * rankMultiplier), 
        def: Math.floor(hero.baseStats.def * rankMultiplier), 
        res: Math.floor(hero.baseStats.res * rankMultiplier), 
        spd: hero.baseStats.spd, 
        acc: hero.baseStats.acc,
        eva: hero.baseStats.eva,
        critRate: hero.baseStats.critRate,
        critDmg: hero.baseStats.critDmg,
        penetration: hero.baseStats.penetration,
        lifesteal: hero.baseStats.lifesteal,
        tenacity: hero.baseStats.tenacity,
        control: hero.baseStats.control
    };
    if(hero.equipment.Arma) { stats.atk += hero.equipment.Arma.stats.atk || 0; stats.spd += hero.equipment.Arma.stats.spd || 0; }
    if(hero.equipment.Armadura) { stats.def += hero.equipment.Armadura.stats.def || 0; stats.hp += hero.equipment.Armadura.stats.hp || 0; }
    return stats;
}

export function summonHero(amount) {
    const costPerSummon = 100;
    let count = amount;
    let totalCost = count * costPerSummon;

    if (game.gold < totalCost) {
        return notify(`Ouro insuficiente para ${count}x invocações! Necessário: ${totalCost} 💰`);
    }

    game.gold -= totalCost;
    let summonedList = [];

    for (let i = 0; i < count; i++) {
        const h = generateHero();
        summonedList.push(h);
        if (game.heroes.length < 5) {
            game.heroes.push(h);
        } else {
            if (!game.village) game.village = [];
            game.village.push(h);
        }
    }

    window.updateUI();
    showSummonResultsModal(summonedList);
}

export function showSummonResultsModal(list) {
    const wrapper = document.getElementById('summon-content-wrapper');
    
    wrapper.innerHTML = `
        <div class="summon-animation-box">
            <div class="summon-orb">🔮✨</div>
            <h3 class="text-primary" style="font-size: 1.5rem;">Canalizando Portal Dimensional...</h3>
            <p style="color: #94a3b8; font-size: 0.95rem;">Manifestando energias estelares para invocar heróis...</p>
        </div>
    `;
    
    openModal('modal-summon-results');

    setTimeout(() => {
        let heroText = list.length === 1 ? '1 herói convocado com sucesso!' : `${list.length} heróis convocados com sucesso!`;
        
        let gridHTML = `
            <h2 class="text-primary" style="margin-bottom: 5px;">🔮 Invocação Concluída!</h2>
            <p style="color: #94a3b8; font-size: 0.95rem; margin-bottom: 15px;">${heroText}</p>
            <div class="summon-results-scroll-grid">
        `;

        list.forEach(h => {
            let cColor = RARITIES.find(r => r.stars === h.stars).color;
            gridHTML += `
                <div class="summon-result-item" style="border-top: 3px solid ${cColor}">
                    <div style="font-size: 2.2rem; margin-bottom: 6px;">${CLASSES[h.class].icon}</div>
                    <strong style="font-size: 1rem; color: white; margin-bottom: 2px;">${h.name}</strong>
                    <span style="color:${cColor}; font-size: 0.8rem; margin-bottom: 2px;">${'⭐'.repeat(h.stars)}</span>
                    <span style="font-size: 0.75rem; color: #94a3b8;">${h.class} (${ELEMENT_ICONS[h.element]} ${h.element})</span>
                </div>`;
        });

        gridHTML += `
            </div>
            <button onclick="window.closeModal('modal-summon-results')" class="btn-primary" style="margin-top: 20px; width: 100%; padding: 12px; font-size: 1.1rem;">Continuar</button>
        `;

        wrapper.innerHTML = gridHTML;
    }, 1200);
}

export function sendToVillage(id) {
    const heroIndex = game.heroes.findIndex(h => h.id === id);
    if (heroIndex !== -1) {
        const [hero] = game.heroes.splice(heroIndex, 1);
        game.village.push(hero);
        notify(`${hero.name} foi enviado para o Lobby.`);
        window.updateUI();
    }
}

export function sendToTeam(id) {
    if (game.heroes.length >= 5) return notify("A equipe de batalha já está cheia!");
    const heroIndex = game.village.findIndex(h => h.id === id);
    if (heroIndex !== -1) {
        const [hero] = game.village.splice(heroIndex, 1);
        game.heroes.push(hero);
        notify(`${hero.name} saiu do Lobby para a Equipe de Batalha!`);
        window.updateUI();
    }
}

export function sortHeroes(heroesList, sortType) {
    let sorted = [...heroesList];
    sorted.sort((a, b) => {
        if (sortType === 'stars-desc') return b.stars - a.stars || b.level - a.level;
        if (sortType === 'level-desc') return b.level - a.level || b.stars - a.stars;
        if (sortType === 'name-asc') return a.name.localeCompare(b.name);
        if (sortType === 'class-asc') return a.class.localeCompare(b.class) || b.stars - a.stars;
        return 0;
    });
    return sorted;
}

export function renderVillage() {
    const container = document.getElementById('village-container');
    container.innerHTML = '';
    
    if (!game.village || game.village.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">O Lobby está sossegado. Invoque heróis para preencher o local!</div>`;
    } else {
        const sortSelect = document.getElementById('village-sort-select');
        const sortType = sortSelect ? sortSelect.value : 'stars-desc';
        const sortedVillage = sortHeroes(game.village, sortType);

        sortedVillage.forEach(h => {
            const rObj = RARITIES.find(r => r.stars === h.stars);
            const cColor = rObj ? rObj.color : '#94a3b8';
            const total = getTotalStats(h);
            
            container.innerHTML += `
                <div class="hero-card" style="border-top: 4px solid ${cColor}">
                    <div class="hero-header">
                        <div class="avatar-container">
                            <div class="avatar">${CLASSES[h.class].icon}</div>
                        </div>
                        <div class="hero-info">
                            <h3>${h.name} <span style="font-size:0.8rem; background:#334155; padding:2px 6px; border-radius:4px;">R${h.rank}</span></h3>
                            <span style="color:${cColor}">${'⭐'.repeat(h.stars)} (${h.rarity})</span>
                            <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px">${h.class} &bull; ${ELEMENT_ICONS[h.element]} ${h.element}</div>
                        </div>
                    </div>
                    <div class="hero-level-badge">Nível ${h.level}</div>
                    <div class="hero-stats">
                        <p><span>❤️ HP</span> <span style="color:var(--hp-color)">${total.hp}</span></p>
                        <p><span>⚔️ ATK</span> <span style="color:#f59e0b">${total.atk}</span> &bull; <span>🔮 MAG</span> <span style="color:#38bdf8">${total.mag}</span></p>
                        <p><span>🛡️ DEF</span> <span style="color:#94a3b8">${total.def}</span> &bull; <span>✨ RES</span> <span style="color:#c084fc">${total.res}</span></p>
                        <p><span>⚡ SPD</span> <span>${total.spd}</span> &bull; <span>🎯 ACC/EVA</span> <span>${total.acc}/${total.eva}</span></p>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: auto;">
                        <button class="btn-secondary" style="flex:1; font-size:0.85rem;" onclick="window.sendToTeam(${h.id})">Convocar p/ Equipe</button>
                        <button class="btn-danger" style="font-size:0.85rem;" onclick="window.dismissVillageHero(${h.id})">Dispensar</button>
                    </div>
                </div>`;
        });
    }
}

export function dismissVillageHero(id) {
    if(confirm("Dispensar este herói do Lobby por 50 de Ouro?")) {
        if(synthMainHeroId === id) setSynthMainHeroId(null);
        if(synthMaterialHeroId === id) setSynthMaterialHeroId(null);
        game.village = game.village.filter(h => h.id !== id);
        game.gold += 50;
        window.updateUI();
    }
}

export function getAllHeroes() { return [...game.heroes, ...game.village]; }
export function findHeroById(id) { return getAllHeroes().find(h => h.id === id); }

export function pickHeroForSynthesis(id) {
    const hero = findHeroById(id);
    if (!hero) return;

    if (!synthMainHeroId) {
        setSynthMainHeroId(id);
        notify(`Herói ${hero.name} definido como Principal.`);
    } else if (synthMainHeroId === id) {
        setSynthMainHeroId(null);
        setSynthMaterialHeroId(null);
        notify(`Herói principal removido.`);
    } else if (!synthMaterialHeroId) {
        const mainH = findHeroById(synthMainHeroId);
        if (hero.class !== mainH.class || hero.stars !== mainH.stars) {
            return notify(`Incompatível! O material precisa ser da mesma classe (${mainH.class}) e mesmas estrelas (⭐${mainH.stars}).`);
        }
        setSynthMaterialHeroId(id);
        notify(`Herói ${hero.name} definido como Material de Sacrifício.`);
    } else if (synthMaterialHeroId === id) {
        setSynthMaterialHeroId(null);
        notify(`Material removido.`);
    } else {
        const mainH = findHeroById(synthMainHeroId);
        if (hero.class !== mainH.class || hero.stars !== mainH.stars) {
            return notify(`Incompatível! O material precisa ser da mesma classe (${mainH.class}) e mesmas estrelas (⭐${mainH.stars}).`);
        }
        setSynthMaterialHeroId(id);
    }
    renderSynthesis();
}

export function clearSynthSlot(slot) {
    if (slot === 'main') {
        setSynthMainHeroId(null);
        setSynthMaterialHeroId(null);
    } else {
        setSynthMaterialHeroId(null);
    }
    renderSynthesis();
}

export function autoFillSynthesis() {
    const villageHeroes = game.village;
    if (villageHeroes.length < 2) return notify("Você precisa de pelo menos 2 heróis no Lobby para usar o auto-preencher.");

    if (!synthMainHeroId) {
        let map = {};
        for (let h of villageHeroes) {
            let key = `${h.class}_${h.stars}`;
            if (!map[key]) map[key] = [];
            map[key].push(h.id);
        }
        let validKey = Object.keys(map).find(k => map[k].length >= 2);
        if (!validKey) {
            return notify("Nenhum par compatível encontrado no Lobby.");
        }
        setSynthMainHeroId(map[validKey][0]);
        setSynthMaterialHeroId(map[validKey][1]);
        notify("✨ Heróis compatíveis auto-preenchidos!");
    } else {
        const mainH = findHeroById(synthMainHeroId);
        let mat = villageHeroes.find(h => h.id !== mainH.id && h.class === mainH.class && h.stars === mainH.stars);
        if (!mat) {
            return notify(`Nenhum material compatível encontrado para ${mainH.name}.`);
        }
        setSynthMaterialHeroId(mat.id);
        notify(`✨ Material compatível encontrado!`);
    }
    renderSynthesis();
}

export function renderSynthesis() {
    const mainPrev = document.getElementById('synth-main-preview');
    const matPrev = document.getElementById('synth-material-preview');
    const slotMain = document.getElementById('slot-main');
    const slotMat = document.getElementById('slot-material');
    const btnPerform = document.getElementById('btn-perform-synth');
    const lobbyList = document.getElementById('synth-lobby-list');

    const mainH = findHeroById(synthMainHeroId);
    const matH = findHeroById(synthMaterialHeroId);

    if (mainH) {
        slotMain.className = 'synth-slot filled-main';
        const cColor = RARITIES.find(r => r.stars === mainH.stars).color;
        mainPrev.innerHTML = `
            <div style="font-size: 1.8rem; margin-bottom: 2px;">${CLASSES[mainH.class].icon}</div>
            <span style="color:${cColor}; font-size:0.8rem;">${'⭐'.repeat(mainH.stars)}</span>
            <strong style="font-size: 0.95rem; color: white; display: block; margin: 2px 0;">${mainH.name}</strong>
            <span style="font-size:0.75rem; color:#cbd5e1;">${mainH.class} (Rank ${mainH.rank})</span>
            <span style="font-size:0.7rem; color:var(--danger); font-weight: bold; margin-top: 3px; display: block;">(Clique para remover)</span>
        `;
    } else {
        slotMain.className = 'synth-slot';
        mainPrev.innerHTML = "+ Clique no Lobby ao lado";
    }

    if (matH) {
        slotMat.className = 'synth-slot filled-mat';
        const cColor = RARITIES.find(r => r.stars === matH.stars).color;
        matPrev.innerHTML = `
            <div style="font-size: 1.8rem; margin-bottom: 2px;">${CLASSES[matH.class].icon}</div>
            <span style="color:${cColor}; font-size:0.8rem;">${'⭐'.repeat(matH.stars)}</span>
            <strong style="font-size: 0.95rem; color: white; display: block; margin: 2px 0;">${matH.name}</strong>
            <span style="font-size:0.75rem; color:#cbd5e1;">${matH.class} (Rank ${matH.rank})</span>
            <span style="font-size:0.7rem; color:var(--danger); font-weight: bold; margin-top: 3px; display: block;">(Clique para remover)</span>
        `;
    } else {
        slotMat.className = 'synth-slot';
        matPrev.innerHTML = mainH ? "+ Clique no Lobby (compatível)" : "+ Selecione o Principal 1º";
    }

    btnPerform.disabled = !(mainH && matH);

    lobbyList.innerHTML = '';
    const sortSelect = document.getElementById('synth-sort-select');
    const sortType = sortSelect ? sortSelect.value : 'stars-desc';
    const villageHeroes = sortHeroes(game.village, sortType); 
    
    if (villageHeroes.length === 0) {
        lobbyList.innerHTML = `<p style="font-size:0.85rem; color:#94a3b8; text-align:center; padding:15px;">Nenhum herói no Lobby.</p>`;
    } else {
        villageHeroes.forEach(h => {
            const cColor = RARITIES.find(r => r.stars === h.stars).color;
            let isSelectedMain = synthMainHeroId === h.id;
            let isSelectedMat = synthMaterialHeroId === h.id;
            
            let borderStyle = '1px solid #334155';
            let bgStyle = '#0f1115';
            let extraStyle = '';

            if (isSelectedMain) {
                borderStyle = '3px solid var(--primary)';
                bgStyle = 'linear-gradient(135deg, #3d2c12 0%, #1f170b 100%)';
                extraStyle = 'box-shadow: 0 0 15px rgba(245, 158, 11, 0.6); transform: scale(1.02); z-index: 2;';
            } else if (isSelectedMat) {
                borderStyle = '3px solid var(--success)';
                bgStyle = 'linear-gradient(135deg, #123322 0%, #0b1f15 100%)';
                extraStyle = 'box-shadow: 0 0 15px rgba(16, 185, 129, 0.6); transform: scale(1.02); z-index: 2;';
            }

            lobbyList.innerHTML += `
                <div class="synth-lobby-item" style="border: ${borderStyle}; background: ${bgStyle}; ${extraStyle}" onclick="window.pickHeroForSynthesis(${h.id})">
                    <div class="avatar" style="width:40px; height:40px; font-size:1.5rem;">${CLASSES[h.class].icon}</div>
                    <div class="synth-lobby-info" style="flex:1;">
                        <h4>${h.name} ${isSelectedMain ? '<span style="color:var(--primary); font-weight:bold;">[PRINCIPAL]</span>' : ''} ${isSelectedMat ? '<span style="color:var(--success); font-weight:bold;">[MATERIAL]</span>' : ''}</h4>
                        <span style="color:${cColor}">${'⭐'.repeat(h.stars)} ${h.class} - R${h.rank} &bull; <strong style="color:var(--success)">Nvl ${h.level}</strong></span>
                    </div>
                </div>`;
        });
    }
}

export function executeSynthesis() {
    const mainH = findHeroById(synthMainHeroId);
    const matH = findHeroById(synthMaterialHeroId);

    if (!mainH || !matH) return;

    game.heroes = game.heroes.filter(h => h.id !== matH.id);
    game.village = game.village.filter(h => h.id !== matH.id);

    mainH.rank++;
    mainH.baseStats.hp = Math.floor(mainH.baseStats.hp * 1.2);
    mainH.baseStats.atk = Math.floor(mainH.baseStats.atk * 1.2);
    mainH.baseStats.mag = Math.floor(mainH.baseStats.mag * 1.2);
    mainH.baseStats.def = Math.floor(mainH.baseStats.def * 1.2);
    mainH.baseStats.res = Math.floor(mainH.baseStats.res * 1.2);

    notify(`✨ SÍNTESE BEM-SUCEDIDA! ${mainH.name} evoluiu para o Rank ${mainH.rank}!`);
    setSynthMainHeroId(null);
    setSynthMaterialHeroId(null);
    window.updateUI();
}

export function moveHero(index, direction) {
    if (direction === 'left' && index > 0) {
        let temp = game.heroes[index];
        game.heroes[index] = game.heroes[index - 1];
        game.heroes[index - 1] = temp;
    } else if (direction === 'right' && index < game.heroes.length - 1) {
        let temp = game.heroes[index];
        game.heroes[index] = game.heroes[index + 1];
        game.heroes[index + 1] = temp;
    }
    window.updateUI();
}

export function renderTeam() {
    const container = document.getElementById('team-container');
    container.innerHTML = '';
    
    if (game.heroes.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--danger); padding: 30px;">Sua equipe está vazia! Convoque heróis do Lobby para a linha de frente.</div>`;
        return;
    }

    game.heroes.forEach((h, index) => {
        const rObj = RARITIES.find(r => r.stars === h.stars);
        const cColor = rObj ? rObj.color : '#94a3b8'; 
        const total = getTotalStats(h);
        
        // Items
        const armaClick = h.equipment.Arma ? `window.unequip(${h.id}, 'Arma')` : `window.openHeroEquipModal(${h.id}, 'Arma')`;
        const armaHTML = h.equipment.Arma ? `<span style="color:${ITEM_RARITIES[h.equipment.Arma.rarity || 'Comum'].color}; font-size:0.75rem;">${h.equipment.Arma.name}</span>` : `<span style="font-size:1.3rem">+</span><span>Arma</span>`;
        const armaduraClick = h.equipment.Armadura ? `window.unequip(${h.id}, 'Armadura')` : `window.openHeroEquipModal(${h.id}, 'Armadura')`;
        const armaduraHTML = h.equipment.Armadura ? `<span style="color:${ITEM_RARITIES[h.equipment.Armadura.rarity || 'Comum'].color}; font-size:0.75rem;">${h.equipment.Armadura.name}</span>` : `<span style="font-size:1.3rem">+</span><span>Armadura</span>`;

        // Skills (Retrocompatibilidade)
        if(!h.selectedSkills) h.selectedSkills = [null, null];
        const heroClassSkills = CLASS_SKILLS[h.class] || [];
        
        let skillsHTML = h.selectedSkills.map((sId, slotIdx) => {
            let sk = sId ? heroClassSkills.find(s => s.id === sId) : null;
            if(sk) {
                return `<div class="skill-slot filled" onclick="window.unequipSkill(${h.id}, ${slotIdx})"><span style="font-size:1.2rem;">${sk.icon}</span><span style="font-size:0.65rem;">${sk.name}</span></div>`;
            } else {
                return `<div class="skill-slot" onclick="window.openHeroSkillModal(${h.id}, ${slotIdx})"><span style="font-size:1.1rem">+</span><span>Skill ${slotIdx+1}</span></div>`;
            }
        }).join('');

        let orderBadge = index === 0 ? '<span class="order-badge vanguard">🛡️ Vanguarda</span>' : `<span class="order-badge">Posição ${index + 1}</span>`;

        container.innerHTML += `
            <div class="hero-card" style="border-top: 4px solid ${cColor}">
                <div class="hero-order-controls">
                    <button onclick="window.moveHero(${index}, 'left')" ${index === 0 ? 'disabled' : ''}>◀️</button>
                    ${orderBadge}
                    <button onclick="window.moveHero(${index}, 'right')" ${index === game.heroes.length - 1 ? 'disabled' : ''}>▶️</button>
                </div>
                <div class="hero-header">
                    <div class="avatar-container">
                        <div class="avatar">${CLASSES[h.class].icon}</div>
                    </div>
                    <div class="hero-info">
                        <h3>${h.name} <span style="font-size:0.8rem; background:#334155; padding:2px 6px; border-radius:4px;">R${h.rank}</span></h3>
                        <span style="color:${cColor}">${'⭐'.repeat(h.stars)} (${h.rarity})</span>
                        <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px">${h.class} &bull; ${ELEMENT_ICONS[h.element]} ${h.element}</div>
                    </div>
                </div>
                <div class="hero-level-badge">Nível ${h.level}</div>
                
                <!-- Habilidades -->
                <div class="hero-skills">${skillsHTML}</div>

                <div class="hero-stats">
                    <p><span>❤️ HP</span> <span style="color:var(--hp-color)">${total.hp}</span></p>
                    <p><span>⚔️ ATK</span> <span style="color:#f59e0b">${total.atk}</span> &bull; <span>🔮 MAG</span> <span style="color:#38bdf8">${total.mag}</span></p>
                    <p><span>🛡️ DEF</span> <span style="color:#94a3b8">${total.def}</span> &bull; <span>✨ RES</span> <span style="color:#c084fc">${total.res}</span></p>
                    <p><span>⚡ SPD</span> <span>${total.spd}</span> &bull; <span>🎯 ACC/EVA</span> <span>${total.acc}/${total.eva}</span></p>
                </div>
                
                <!-- Equipamentos -->
                <div class="hero-equips">
                    <div class="equip-slot ${h.equipment.Arma ? 'filled' : ''}" onclick="${armaClick}">${armaHTML}</div>
                    <div class="equip-slot ${h.equipment.Armadura ? 'filled' : ''}" onclick="${armaduraClick}">${armaduraHTML}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn-secondary" style="flex:1;" onclick="window.sendToVillage(${h.id})">Mandar Lobby</button>
                    <button class="btn-danger" style="flex:1;" onclick="window.dismissHero(${h.id})">Dispensar</button>
                </div>
            </div>`;
    });
}

export function openHeroEquipModal(heroId, type) {
    setEquipTargetHeroId(heroId); 
    setEquipTargetType(type);
    const hero = game.heroes.find(h => h.id === heroId);
    document.getElementById('hero-equip-title').innerText = `Equipar ${type} em ${hero.name}`;
    
    const list = document.getElementById('modal-equip-list'); list.innerHTML = '';
    let availableItems = game.inventory.equips.map((eq, i) => ({...eq, originalIndex: i})).filter(eq => eq.type === type);
    
    if(availableItems.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:#94a3b8; padding: 20px;">Nenhum item de <b>${type}</b> na mochila. <br> Vá à Forja para criar!</div>`;
    } else {
        availableItems.forEach(eq => {
            let rColor = ITEM_RARITIES[eq.rarity || 'Comum'].color;
            list.innerHTML += `
                <button class="equip-select-btn" onclick="window.equipItemToTarget(${eq.originalIndex})" style="border-left: 4px solid ${rColor}">
                    <div style="font-weight:bold; color:${rColor}; font-size:1.1rem; margin-bottom:4px;">[${eq.rarity || 'Comum'}] ${eq.name}</div>
                    <div style="font-size:0.85rem; color:#cbd5e1;">
                        ${eq.stats.atk ? `⚔️ ATK +${eq.stats.atk} &nbsp;` : ''} 
                        ${eq.stats.def ? `🛡️ DEF +${eq.stats.def} &nbsp;` : ''} 
                        ${eq.stats.hp ? `❤️ HP +${eq.stats.hp} &nbsp;` : ''} 
                    </div>
                </button>`;
        });
    }
    openModal('modal-hero-equip');
}

export function equipItemToTarget(itemIndex) {
    const hero = game.heroes.find(h => h.id === equipTargetHeroId);
    const item = game.inventory.equips[itemIndex];
    if (hero.equipment[equipTargetType]) game.inventory.equips.push(hero.equipment[equipTargetType]); 
    hero.equipment[equipTargetType] = item;
    game.inventory.equips.splice(itemIndex, 1);
    notify(`✅ ${item.name} equipado em ${hero.name}!`);
    closeModal('modal-hero-equip'); 
    window.updateUI(); 
    renderInventory();
}

export function unequip(heroId, type) {
    const hero = game.heroes.find(h => h.id === heroId);
    if(hero.equipment[type]) { 
        game.inventory.equips.push(hero.equipment[type]); 
        hero.equipment[type] = null; 
        window.updateUI(); 
        notify(`Item guardado na mochila.`); 
    }
}

/* ======== GESTÃO DE SKILLS ======== */

export function openHeroSkillModal(heroId, slotIndex) {
    setEquipTargetHeroId(heroId);
    setEquipTargetSkillSlot(slotIndex);
    const hero = game.heroes.find(h => h.id === heroId);
    
    document.getElementById('hero-skill-title').innerText = `Selecionar Habilidade (Slot ${slotIndex + 1})`;
    const list = document.getElementById('modal-skill-list'); 
    list.innerHTML = '';
    
    const availableSkills = CLASS_SKILLS[hero.class] || [];
    availableSkills.forEach(sk => {
        let isEquipped = hero.selectedSkills.includes(sk.id);
        
        let targetText = sk.target === 'single' ? 'Alvo Único' : sk.target === 'enemies' ? 'Em Área (Inimigos)' : sk.target === 'self' ? 'Si Mesmo' : 'Equipe';
        let typeColor = sk.type === 'damage' ? '#ef4444' : sk.type === 'heal' ? '#10b981' : sk.type === 'buff' ? '#38bdf8' : '#c084fc';

        if(isEquipped) {
            list.innerHTML += `
                <div style="opacity:0.5; cursor:not-allowed; border-left: 4px solid #475569; background:#0f1115; padding:12px; margin-top:10px; border-radius:8px; display:flex; flex-direction:column; gap:5px;">
                    <div style="font-weight:bold; color:#94a3b8; font-size:1.1rem;">${sk.icon} ${sk.name} (Já Equipada)</div>
                </div>`;
        } else {
            list.innerHTML += `
                <button class="equip-select-btn" onclick="window.equipSkillToTarget('${sk.id}')" style="border-left: 4px solid ${typeColor}">
                    <div style="font-weight:bold; color:${typeColor}; font-size:1.1rem; margin-bottom:4px;">${sk.icon} ${sk.name}</div>
                    <div style="font-size:0.8rem; color:#94a3b8; margin-bottom: 4px;">🎯 ${targetText} &nbsp;|&nbsp; ⏳ Recarga: ${sk.cd} turnos</div>
                    <div style="font-size:0.85rem; color:#cbd5e1;">${sk.desc}</div>
                </button>`;
        }
    });
    
    openModal('modal-skill-equip');
}

export function equipSkillToTarget(skillId) {
    const hero = game.heroes.find(h => h.id === equipTargetHeroId);
    hero.selectedSkills[equipTargetSkillSlot] = skillId;
    notify(`✅ Habilidade equipada em ${hero.name}!`);
    closeModal('modal-skill-equip'); 
    window.updateUI(); 
}

export function unequipSkill(heroId, slotIndex) {
    const hero = game.heroes.find(h => h.id === heroId);
    hero.selectedSkills[slotIndex] = null;
    window.updateUI(); 
    notify(`Habilidade removida do slot.`); 
}

export function dismissHero(id) {
    if(confirm("Dispensar herói da equipe? Itens voltarão para a mochila.")) {
        const hero = game.heroes.find(h => h.id === id);
        if(hero.equipment.Arma) game.inventory.equips.push(hero.equipment.Arma);
        if(hero.equipment.Armadura) game.inventory.equips.push(hero.equipment.Armadura);
        game.heroes = game.heroes.filter(h => h.id !== id);
        game.gold += 50; 
        window.updateUI();
    }
}