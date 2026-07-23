import { game, battleState, battleInterval, setBattleInterval, saveGame } from '../core/state.js';
import { getRegionData } from './map.js';
import { CLASSES, ELEMENTS, ELEMENT_ADVANTAGES, MONSTER_ICONS, RARITIES, MAT_ICONS, ELEMENT_ICONS, CLASS_SKILLS } from '../data/constants.js';
import { notify, notifyLoot, openModal, closeModal } from '../core/ui.js';
import { getTotalStats, getAllHeroes, getRandomInt } from './heroes.js';

export function startTowerLevel(floor) {
    if (game.heroes.length === 0) return notify("Sua equipe está vazia! Convoque heróis do Lobby.");
    
    if (battleState.floor !== floor || !battleState.runLoot) {
        battleState.runLoot = {};
        battleState.floor = floor;
    }
    
    game.sessionStartStats = {};
    game.pendingLevelUps = [];
    game.heroes.forEach(h => {
        let tot = getTotalStats(h);
        game.sessionStartStats[h.id] = { 
            level: h.level, hp: tot.hp, atk: tot.atk, mag: tot.mag, 
            def: tot.def, res: tot.res, spd: tot.spd, acc: tot.acc, 
            eva: tot.eva, critRate: tot.critRate, penetration: tot.penetration 
        };
    });

    document.getElementById('screen-hub').classList.remove('active'); 
    document.getElementById('screen-battle').classList.add('active');
    setupBattle();
}

export function setupBattle() {
    if (battleInterval) { clearInterval(battleInterval); setBattleInterval(null); }

const region = getRegionData(battleState.floor);
    const isBoss = battleState.floor % 10 === 0;
    
    // Média de estrelas do seu time
    let teamAvgStars = 1; 
    let allH = getAllHeroes();
    if (allH.length > 0) {
        teamAvgStars = Math.max(1, Math.round(allH.reduce((sum, h) => sum + (h.stars || 1), 0) / allH.length));
    }
    
    // TETO RESTRITO POR ANDAR: Garante que no Andar 1 os monstros fiquem travados em um limite seguro (ex: máximo de 3 estrelas)
    let floorTier = Math.floor((battleState.floor - 1) / 10);
    let maxAllowedStars = Math.min(7, Math.max(1, teamAvgStars + floorTier));

    document.getElementById('battle-floor-title').innerHTML = `Andar ${battleState.floor} (${region.name}) ${isBoss ? '(CHEFE 🐉)' : ''} | Média Time: ⭐${teamAvgStars}`;
    
    const hCount = game.heroes.length;
    battleState.heroes = game.heroes.map((h, i) => {
        let tot = getTotalStats(h);
        return { 
            ...h, uid: 'h'+i, stats: tot, maxHp: tot.hp, currentHp: tot.hp, 
            actionGauge: 0, isDead: false, icon: CLASSES[h.class].icon,
            cooldowns: {}, buffs: [] 
        }
    });
    
    battleState.monsters = [];
    const numMonsters = hCount === 0 ? 1 : getRandomInt(hCount + 2, hCount + 7);
    
    for(let i=0; i<numMonsters; i++) {
        let isThisBoss = isBoss && i === 0; 

        // Variação estrita: No andar 1 (e iniciais), a variação é contida entre -1 e +0/+1 no máximo.
        let starVariance = battleState.floor <= 10 ? getRandomInt(-1, 1) : getRandomInt(-1, 2);
        
        let mStars = isThisBoss 
            ? Math.min(7, maxAllowedStars + 1) 
            : Math.min(maxAllowedStars, Math.max(1, teamAvgStars + starVariance));

        let mRarityColor = RARITIES.find(r => r.stars === mStars)?.color || '#94a3b8';

        // Multiplicador equilibrado
        let mMult = 1 + ((battleState.floor - 1) * 0.12) + (mStars * 0.08); 
        if (isThisBoss) mMult *= 3.0; 
        
        let mName = isThisBoss ? region.boss : region.monsters[getRandomInt(0, region.monsters.length - 1)];
        let mIcon = MONSTER_ICONS[mName] || '👾';
        let mElement = ELEMENTS[getRandomInt(0, ELEMENTS.length - 1)];
        let mAIList = ['Combatente', 'Arqueiro', 'Assassino', 'Guardião', 'Curandeiro'];
        let mAI = isThisBoss ? 'Chefe' : mAIList[getRandomInt(0, mAIList.length - 1)];

        let spdMod = 1.0; let hpMod = 1.0; let atkMod = 1.0; let evaMod = 5;
        if (mAI === 'Assassino') { spdMod = 1.5; atkMod = 1.2; evaMod = 15; }
        else if (mAI === 'Arqueiro') { spdMod = 1.2; atkMod = 1.1; evaMod = 10; }
        else if (mAI === 'Guardião') { spdMod = 0.8; hpMod = 1.4; atkMod = 0.85; evaMod = 2; }
        else if (mAI === 'Curandeiro') { spdMod = 1.0; hpMod = 1.1; atkMod = 0.75; }
        else if (mAI === 'Chefe') { spdMod = 1.1; hpMod = 3.5; atkMod = 1.3; evaMod = 8; }

        let individualSpdVariance = getRandomInt(-2, 3);
        let finalHp = Math.floor((isThisBoss ? 180 : 65) * mMult * hpMod);
        let finalAtk = Math.floor((isThisBoss ? 18 : 11) * mMult * atkMod);
        let finalSpd = Math.max(4, Math.floor(((isThisBoss ? 10 : 7.5) + (battleState.floor * 0.05)) * spdMod) + individualSpdVariance);

        battleState.monsters.push({
            uid: 'm'+i, name: mName, isBoss: isThisBoss, icon: mIcon, element: mElement, ai: mAI, stars: mStars, level: battleState.floor,
            stats: { 
                hp: finalHp, atk: finalAtk, mag: Math.floor(finalAtk * 0.8), def: Math.floor((isThisBoss ? 8 : 4) * mMult), 
                res: Math.floor((isThisBoss ? 8 : 4) * mMult), spd: finalSpd, acc: 100, eva: evaMod, critRate: 8 + (mStars * 1.5), critDmg: 150
            },
            maxHp: finalHp, currentHp: finalHp, actionGauge: getRandomInt(0, 30), isDead: false, buffs: [] 
        });
    }
    
    renderBattleField();
    battleState.active = true;
    setBattleInterval(setInterval(battleTick, battleState.tickRate));
}

const BUFF_ICONS = { 'taunt': '🛡️!', 'def_up': '🛡️↑', 'atk_up': '⚔️↑', 'spd_up': '💨↑', 'eva_up': '🍃↑', 'def_down': '🛡️↓', 'atk_down': '⚔️↓' };

export function renderBattleField() {
    const renderEntity = (ent, isEnemy) => {
        let lvlColor = isEnemy ? 'var(--primary)' : 'var(--success)';
        let rObj = RARITIES.find(r => r.stars === ent.stars);
        let starColor = rObj ? rObj.color : '#94a3b8';
        
        let buffsHTML = ent.buffs.map(b => `<div class="buff-icon">${BUFF_ICONS[b.type]||'✨'}</div>`).join('');

        return `
            <div id="ent-${ent.uid}" class="entity-box ${ent.isDead ? 'dead' : ''} ${ent.isBoss ? 'boss-entity' : ''}">
                <div class="entity-avatar">${ent.icon}<div id="lvlup-${ent.uid}"></div></div>
                <div class="entity-stars" style="color:${starColor}">${'⭐'.repeat(ent.stars)}</div>
                <div class="entity-name" style="color: ${ent.isBoss ? 'var(--danger)' : 'white'}">${ent.name}</div>
                <div style="text-align: center; font-size: 0.75rem; font-weight: bold; color: ${lvlColor}; margin-bottom: 2px; width: 100%;">LVL ${ent.level} &bull; ${ELEMENT_ICONS[ent.element] || ''}</div>
                <div class="bar-container">
                    <div class="bar-fill hp-fill" id="hp-${ent.uid}" style="width: ${(ent.currentHp/ent.maxHp)*100}%"></div>
                    <div class="hp-text" id="hp-txt-${ent.uid}">${Math.floor(ent.currentHp)}/${ent.maxHp}</div>
                </div>
                <div class="buffs-container" id="buffs-${ent.uid}">${buffsHTML}</div>
                <div class="bar-container" style="height: 4px; margin-top:2px; background: #1e293b;">
                    <div class="bar-fill action-fill" id="act-${ent.uid}" style="width: ${ent.actionGauge}%"></div>
                </div>
            </div>`;
    };
    
    document.getElementById('battle-heroes').innerHTML = battleState.heroes.map(h => renderEntity(h, false)).join('');
    document.getElementById('battle-monsters').innerHTML = battleState.monsters.map(m => renderEntity(m, true)).join('');
}

export function updateEntityBars(ent) {
    if (ent.isDead) return;
    const hpBar = document.getElementById(`hp-${ent.uid}`); const actBar = document.getElementById(`act-${ent.uid}`); const hpTxt = document.getElementById(`hp-txt-${ent.uid}`);
    if(hpBar) hpBar.style.width = `${Math.max(0, (ent.currentHp/ent.maxHp)*100)}%`; if(actBar) actBar.style.width = `${Math.min(100, ent.actionGauge)}%`; if(hpTxt) hpTxt.innerText = `${Math.floor(ent.currentHp)}/${ent.maxHp}`;
    
    const buffsContainer = document.getElementById(`buffs-${ent.uid}`);
    if(buffsContainer) { buffsContainer.innerHTML = ent.buffs.map(b => `<div class="buff-icon" style="color:${b.type.includes('down') ? '#ef4444' : '#38bdf8'}">${BUFF_ICONS[b.type]||'✨'}</div>`).join(''); }
}

export function getEffectiveStats(ent) {
    let stats = { ...ent.stats };
    ent.buffs.forEach(b => {
        if(b.type === 'def_up') stats.def *= 1.5;
        if(b.type === 'atk_up') stats.atk *= 1.5;
        if(b.type === 'spd_up') stats.spd *= 1.3;
        if(b.type === 'eva_up') stats.eva += 20;
        if(b.type === 'def_down') stats.def *= 0.7;
        if(b.type === 'atk_down') stats.atk *= 0.7;
    });
    return stats;
}

export function battleTick() {
    if (!battleState.active) return;
    let all = [...battleState.heroes, ...battleState.monsters].filter(e => !e.isDead);
    all.forEach(ent => { 
        let currentStats = getEffectiveStats(ent);
        ent.actionGauge += (currentStats.spd * 0.2); 
        updateEntityBars(ent); 
        if (ent.actionGauge >= 100) { 
            ent.actionGauge = 0; 
            takeAction(ent); 
        } 
    });
}

function processTurnStart(actor) {
    if (actor.cooldowns) {
        for(let key in actor.cooldowns) { if(actor.cooldowns[key] > 0) actor.cooldowns[key]--; }
    }
    if (actor.buffs) {
        actor.buffs.forEach(b => b.duration--);
        actor.buffs = actor.buffs.filter(b => b.duration > 0);
    }
    updateEntityBars(actor);
}

function selectSkillAI(actor, allies) {
    if (!actor.selectedSkills) return null;
    let availableSkills = actor.selectedSkills.map(sId => {
        if (!sId) return null;
        let skill = CLASS_SKILLS[actor.class].find(s => s.id === sId);
        if (skill && (actor.cooldowns[sId] || 0) === 0) return skill;
        return null;
    }).filter(s => s !== null);

    if (availableSkills.length === 0) return null;

    let needHeal = allies.some(a => a.currentHp / a.maxHp < 0.65);
    for(let s of availableSkills) {
        if (s.type === 'heal' && needHeal) return s;
        if (s.type === 'buff' || s.type === 'debuff' || s.type === 'damage') return s;
    }
    return null;
}

export function takeAction(actor) {
    processTurnStart(actor);

    const isHero = actor.uid.startsWith('h'); 
    const allies = isHero ? battleState.heroes : battleState.monsters; 
    const enemies = isHero ? battleState.monsters : battleState.heroes;
    const aliveEnemies = enemies.filter(e => !e.isDead); 
    const aliveAllies = allies.filter(e => !e.isDead); 

    if (aliveEnemies.length === 0) return checkBattleEnd();

    let chosenSkill = isHero ? selectSkillAI(actor, aliveAllies) : null;
    let effActorStats = getEffectiveStats(actor);

    if (chosenSkill) {
        executeSkill(actor, effActorStats, chosenSkill, aliveAllies, aliveEnemies);
        actor.cooldowns[chosenSkill.id] = chosenSkill.cd;
        return;
    }

    let target = aliveEnemies[0];
    let isHeal = false;
    let taunters = aliveEnemies.filter(e => e.buffs.some(b => b.type === 'taunt'));
    
    if ((!isHero && actor.ai === 'Curandeiro') || (isHero && (actor.class === 'Curandeiro' || actor.class === 'Sacerdote'))) {
        let lowestAlly = aliveAllies.reduce((prev, curr) => (curr.currentHp/curr.maxHp < prev.currentHp/prev.maxHp ? curr : prev));
        if (lowestAlly.currentHp < lowestAlly.maxHp) { target = lowestAlly; isHeal = true; }
    } else {
        if (taunters.length > 0) {
            target = taunters[getRandomInt(0, taunters.length - 1)];
        } else {
            target = aliveEnemies[0];
        }
    }

    if (isHeal) {
        let healAmount = Math.floor((effActorStats.mag || effActorStats.atk) * 1.5);
        applyHeal(actor, target, healAmount);
    } else {
        applyDamage(actor, effActorStats, target, 1.0, isHero);
    }
}

function executeSkill(actor, effStats, skill, allies, enemies) {
    showFloatingText(actor.uid, skill.name, 'dmg-normal');
    animateAttack(actor.uid, !actor.uid.startsWith('h'));
    
    let isHero = actor.uid.startsWith('h');
    let power = skill.power || 1.0;

    let targets = [];
    if(skill.target === 'self') targets = [actor];
    if(skill.target === 'allies') targets = allies;
    if(skill.target === 'enemies') targets = enemies;
    if(skill.target === 'single' || skill.target === 'ally') {
        if(skill.type === 'heal' || skill.target === 'ally') {
            targets = [allies.reduce((prev, curr) => (curr.currentHp/curr.maxHp < prev.currentHp/prev.maxHp ? curr : prev))];
        } else {
            let taunters = enemies.filter(e => e.buffs.some(b => b.type === 'taunt'));
            if(taunters.length > 0) targets = [taunters[getRandomInt(0, taunters.length - 1)]];
            else targets = [enemies[0]];
        }
    }

    targets.forEach(t => {
        if(skill.type === 'damage') {
            applyDamage(actor, effStats, t, power, isHero);
            if(skill.effect === 'delay' && !t.isDead) t.actionGauge = Math.max(0, t.actionGauge - 30);
            if(skill.effect === 'def_down' && !t.isDead) t.buffs.push({ type: 'def_down', duration: 3 });
        } 
        else if (skill.type === 'heal') applyHeal(actor, t, Math.floor((effStats.mag || effStats.atk) * power * 1.5));
        else if (skill.type === 'buff') t.buffs.push({ type: skill.effect, duration: skill.duration || 3 });
        else if (skill.type === 'debuff') t.buffs.push({ type: skill.effect, duration: skill.duration || 3 });
        updateEntityBars(t);
    });
}

function applyDamage(actor, effActorStats, target, multiplier, isHero) {
    let effTargetStats = getEffectiveStats(target);
    let hitChance = Math.max(20, Math.min(99, (effActorStats.acc || 100) - (effTargetStats.eva || 5)));
    
    if (Math.random() * 100 > hitChance) {
        animateAttack(actor.uid, !isHero);
        showFloatingText(target.uid, "ESQUIVA", "dmg-weak");
        return;
    }

    let elementMult = 1.0;
    if (ELEMENT_ADVANTAGES[actor.element] === target.element) elementMult = 1.25;
    else if (ELEMENT_ADVANTAGES[target.element] === actor.element) elementMult = 0.75;

    let isCrit = Math.random() * 100 < (effActorStats.critRate || 10); 
    
    let atkPower = effActorStats.atk || 10;
    let targetDef = effTargetStats.def || 1;

    // Mitigação de defesa suave e progressiva
    let mitigation = targetDef / (targetDef + 60);
    let rawDmg = (atkPower * multiplier) * (1 - mitigation);

    // Bônus equilibrado: Heróis causam um pouco mais de dano, monstros batem de forma justa
    let roleMultiplier = isHero ? 1.15 : 0.85; 

    // Fator leve de nível para recompensar evolução
    let levelFactor = 1 + ((actor.level || 1) * 0.03);
    let starDiff = actor.stars - target.stars;
    let starMultiplier = Math.max(0.6, Math.min(2.0, 1 + (starDiff * 0.15))); 

    let baseDmg = rawDmg * roleMultiplier * levelFactor;

    let finalDmg = Math.floor(baseDmg * starMultiplier * elementMult);
    finalDmg = Math.floor(isCrit ? finalDmg * ((effActorStats.critDmg || 150) / 100) : finalDmg);
    
    // Piso dinâmico de dano para evitar números excessivamente baixos ou altos demais
    let minDmg = Math.max(4, Math.floor(atkPower * 0.20));
    finalDmg = Math.max(minDmg, finalDmg);

    target.currentHp -= finalDmg; 
    animateAttack(actor.uid, !isHero); 
    
    let dmgClass = isCrit ? 'dmg-crit' : 'dmg-normal';
    if(starMultiplier < 0.8) dmgClass = 'dmg-weak'; 
    if(starMultiplier > 1.2 && !isCrit) dmgClass = 'dmg-strong'; 

    showFloatingText(target.uid, finalDmg, dmgClass);
    
    if (target.currentHp <= 0) { 
        target.currentHp = 0; 
        target.isDead = true; 
        const entEl = document.getElementById(`ent-${target.uid}`);
        if(entEl) entEl.classList.add('dead'); 
    }
    updateEntityBars(target); 
    checkBattleEnd();
}

function applyHeal(actor, target, amount) {
    target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
    animateAttack(actor.uid, actor.uid.startsWith('m')); 
    showFloatingText(target.uid, `+${amount}`, 'heal'); 
    updateEntityBars(target); 
}

export function showFloatingText(uid, text, type) {
    const el = document.getElementById(`ent-${uid}`); 
    if (!el) return;
    const rect = el.getBoundingClientRect(); 
    const fText = document.createElement('div'); fText.className = `floating-text ${type}`; fText.innerText = text;
    const randX = (Math.random() - 0.5) * 45; const randY = (Math.random() - 0.5) * 20; const driftX = (Math.random() - 0.5) * 30;
    fText.style.setProperty('--rand-x', (rect.left + rect.width / 2 + randX) + 'px'); fText.style.setProperty('--rand-y', (rect.top + randY) + 'px'); fText.style.setProperty('--drift-x', driftX + 'px');
    document.getElementById('floating-text-container').appendChild(fText); setTimeout(() => fText.remove(), 850);
}

export function showBattleLvlUpBadge(uid) {
    const badgeContainer = document.getElementById(`lvlup-${uid}`);
    if (badgeContainer) { badgeContainer.innerHTML = `<div class="battle-lvlup-badge">LVL UP!</div>`; setTimeout(() => { badgeContainer.innerHTML = ''; }, 2500); }
}

export function animateAttack(uid, isEnemy) {
    const el = document.getElementById(`ent-${uid}`); if(!el) return;
    el.classList.add(isEnemy ? 'attack-enemy' : 'attack'); setTimeout(() => el.classList.remove('attack', 'attack-enemy'), 150);
}

export function checkBattleEnd() {
    if (!battleState.active) return;
    if (!battleState.monsters.some(m => !m.isDead)) { 
        battleState.active = false; 
        if (battleInterval) { clearInterval(battleInterval); setBattleInterval(null); }
        processPermadeath(); winBattle(); 
    } 
    else if (!battleState.heroes.some(h => !h.isDead)) { 
        battleState.active = false; 
        if (battleInterval) { clearInterval(battleInterval); setBattleInterval(null); }
        processPermadeath(); checkGameOverCondition();
    }
}

export function processPermadeath() {
    battleState.heroes.forEach(bHero => { if (bHero.isDead) game.heroes = game.heroes.filter(h => h.id !== bHero.id); });
    saveGame();
}

export function checkGameOverCondition() {
    if (game.heroes.length === 0 && game.village.length === 0) {
        document.getElementById('screen-battle').classList.remove('active'); document.getElementById('screen-gameover').classList.add('active');
    } else { loseBattle(); }
}

export function winBattle() {
    const isBoss = battleState.floor % 10 === 0;
    const goldEarned = Math.floor(15 * battleState.floor + (isBoss ? 150 : 0)); game.gold += goldEarned;

    battleState.heroes.forEach((bHero, idx) => {
        let realHero = game.heroes.find(h => h.id === bHero.id);
        if (!realHero) return;
        let leveledUp = false; realHero.exp += 75 + (battleState.floor * 25);
        let expRequired = Math.floor(200 * Math.pow(realHero.level, 1.5));
        while (realHero.exp >= expRequired) { 
            realHero.exp -= expRequired; realHero.level++; 
            realHero.baseStats.hp = Math.floor(realHero.baseStats.hp * 1.1); 
            realHero.baseStats.atk = Math.floor(realHero.baseStats.atk * 1.1); 
            realHero.baseStats.mag = Math.floor(realHero.baseStats.mag * 1.1); 
            realHero.baseStats.def = Math.floor(realHero.baseStats.def * 1.1); 
            realHero.baseStats.res = Math.floor(realHero.baseStats.res * 1.1); 
            leveledUp = true; expRequired = Math.floor(200 * Math.pow(realHero.level, 1.5));
        }
        if (leveledUp) showBattleLvlUpBadge('h'+idx);
    });

    game.pendingLevelUps = [];
    game.heroes.forEach(h => {
        let startInfo = game.sessionStartStats[h.id];
        if (startInfo && h.level > startInfo.level) {
            let finalStats = getTotalStats(h);
            game.pendingLevelUps.push({ 
                heroId: h.id, name: h.name, class: h.class, 
                oldLevel: startInfo.level, newLevel: h.level, 
                oldHp: startInfo.hp, newHp: finalStats.hp, 
                oldAtk: startInfo.atk, newAtk: finalStats.atk, 
                oldMag: startInfo.mag, newMag: finalStats.mag, 
                oldDef: startInfo.def, newDef: finalStats.def, 
                oldRes: startInfo.res, newRes: finalStats.res, 
                oldSpd: startInfo.spd, newSpd: finalStats.spd, 
                oldCrit: startInfo.critRate, newCrit: finalStats.critRate 
            });
        }
    });

    let lootCounts = { 'Ouro': goldEarned }; const matPool = ['Minério', 'Minério', 'Madeira', 'Couro', 'Tecido'];
    battleState.monsters.forEach(m => { if(Math.random() > 0.4) { let item = matPool[getRandomInt(0, matPool.length-1)]; game.inventory.materials[item]++; lootCounts[item] = (lootCounts[item] || 0) + 1; } });
    if(isBoss) { game.inventory.materials['Cristal']++; lootCounts['Cristal'] = (lootCounts['Cristal'] || 0) + 1; if(Math.random() < 0.35) { game.inventory.materials['Essência de Dragão'] = (game.inventory.materials['Essência de Dragão'] || 0) + 1; lootCounts['Essência de Dragão'] = 1; } }

    if (!battleState.runLoot) battleState.runLoot = {};
    for (let [item, qtd] of Object.entries(lootCounts)) battleState.runLoot[item] = (battleState.runLoot[item] || 0) + qtd;
    if (battleState.floor === game.maxFloor && game.maxFloor < 100) game.maxFloor++; saveGame();
    
    notifyLoot(lootCounts, battleState.floor);

    if (game.settings.farmLoop) { setTimeout(() => { setupBattle(); }, 1200); return; }

    document.getElementById('victory-floor-text').innerText = `Você dominou o Andar ${battleState.floor}!`;
    const lootDiv = document.getElementById('victory-loot'); lootDiv.innerHTML = '';
    for(let [item, qtd] of Object.entries(battleState.runLoot)) lootDiv.innerHTML += `<div class="loot-item">${MAT_ICONS[item] || ''} ${item} x${qtd}</div>`; 

    const levelUpContainer = document.getElementById('victory-levelup-container'); 
    const levelUpList = document.getElementById('victory-levelup-list'); 
    levelUpList.innerHTML = '';
    
    let displayReports = game.pendingLevelUps ? [...game.pendingLevelUps] : [];
    if (displayReports.length > 0) {
        displayReports.forEach(up => {
            let classIcon = CLASSES[up.class] ? CLASSES[up.class].icon : '⭐';
            levelUpList.innerHTML += `
                <div class="level-up-card">
                    <div class="level-up-card-header">
                        <div class="level-up-avatar">${classIcon}</div>
                        <div class="level-up-hero-info">
                            <span class="level-up-hero-name">${up.name}</span>
                            <span class="level-up-hero-lvl">Nível ${up.oldLevel} ➔ ${up.newLevel}</span>
                        </div>
                    </div>
                    <div class="level-up-stats">
                        <div class="stat-row"><span>❤️ HP</span> <span>${up.oldHp} ➔ <strong style="color:var(--hp-color)">${up.newHp}</strong></span></div>
                        <div class="stat-row"><span>⚔️ ATK</span> <span>${up.oldAtk} ➔ <strong style="color:var(--primary)">${up.newAtk}</strong></span></div>
                        <div class="stat-row"><span>🔮 MAG</span> <span>${up.oldMag} ➔ <strong style="color:#c084fc">${up.newMag}</strong></span></div>
                        <div class="stat-row"><span>🛡️ DEF</span> <span>${up.oldDef} ➔ <strong style="color:#38bdf8">${up.newDef}</strong></span></div>
                        <div class="stat-row"><span>✨ RES</span> <span>${up.oldRes} ➔ <strong style="color:#38bdf8">${up.newRes}</strong></span></div>
                        <div class="stat-row"><span>⚡ SPD</span> <span>${up.oldSpd} ➔ <strong style="color:var(--primary)">${up.newSpd}</strong></span></div>
                        <div class="stat-row" style="grid-column: span 2;"><span>💥 CRIT</span> <span>${up.oldCrit}% ➔ <strong style="color:#fbbf24">${up.newCrit}%</strong></span></div>
                    </div>
                </div>`;
        });
        levelUpContainer.style.display = 'block';
    } else { levelUpContainer.style.display = 'none'; }
    setTimeout(() => openModal('modal-victory'), 1000); 
}

export function repeatFloor() { closeModal('modal-victory'); startTowerLevel(battleState.floor); }

export function nextFloor() { 
    closeModal('modal-victory'); battleState.floor++; battleState.runLoot = {};
    game.sessionStartStats = {};
    game.heroes.forEach(h => { 
        let tot = getTotalStats(h); 
        game.sessionStartStats[h.id] = { 
            level: h.level, hp: tot.hp, atk: tot.atk, mag: tot.mag, 
            def: tot.def, res: tot.res, spd: tot.spd, acc: tot.acc, 
            eva: tot.eva, critRate: tot.critRate, penetration: tot.penetration 
        }; 
    });
    setupBattle(); 
}

export function fleeBattle() { 
    battleState.active = false; 
    if (battleInterval) { clearInterval(battleInterval); setBattleInterval(null); }
    closeModal('modal-victory'); 
    game.pendingLevelUps = {}; game.sessionStartStats = {}; battleState.runLoot = {};
    window.updateUI(); 
    document.getElementById('screen-battle').classList.remove('active'); document.getElementById('screen-hub').classList.add('active'); window.switchTab('tab-map'); 
}