export let currentSaveKey = null;
export function setCurrentSaveKey(key) { currentSaveKey = key; }

export let game = {
    playerName: 'Aventureiro',
    playerIcon: '🧙‍♂️',
    playerLevel: 1,
    playerExp: 0,
    gold: 500, 
    maxFloor: 1, 
    heroes: [],     
    village: [],    
    inventory: { materials: { Minério: 0, Madeira: 0, Couro: 0, Tecido: 0, Cristal: 0, 'Essência de Dragão': 0 }, equips: [] },
    settings: { farmLoop: false },
    playTime: 0,
    pendingLevelUps: [],
    sessionStartStats: {},
    heroPositions: {},
    towerHeroPositions: {},
    lastOnline: Date.now()
};
export function setGame(newGame) { game = newGame; }

export let battleState = { 
    active: false, 
    floor: 1, 
    heroes: [], 
    monsters: [], 
    tickRate: 40, 
    runLoot: {},
    totalCommonMonsters: 0, 
    defeatedMonstersCount: 0, 
    bossSpawned: false 
};

export let battleInterval = null;
export function setBattleInterval(val) { battleInterval = val; }

export let selectedEquipIndex = null; 
export function setSelectedEquipIndex(val) { selectedEquipIndex = val; }

export let equipTargetHeroId = null;
export function setEquipTargetHeroId(val) { equipTargetHeroId = val; }

export let equipTargetType = null;
export function setEquipTargetType(val) { equipTargetType = val; }

export let equipTargetSkillSlot = null;
export function setEquipTargetSkillSlot(val) { equipTargetSkillSlot = val; }

export let synthMainHeroId = null;
export function setSynthMainHeroId(val) { synthMainHeroId = val; }

export let synthMaterialHeroId = null;
export function setSynthMaterialHeroId(val) { synthMaterialHeroId = val; }

// Variável para armazenar o avatar selecionado temporariamente antes de criar o jogo
export let selectedPlayerIcon = '🧙‍♂️';
export function setSelectedPlayerIcon(icon) { selectedPlayerIcon = icon; }

export function getSaveList() {
    const list = localStorage.getItem('pickMeIdleSavesList');
    return list ? JSON.parse(list) : [];
}

export function saveGameList(list) {
    localStorage.setItem('pickMeIdleSavesList', JSON.stringify(list));
}

export function saveGame() {
    if (!currentSaveKey) return;
    game.lastOnline = Date.now();
    localStorage.setItem(currentSaveKey, JSON.stringify(game));
}

export function formatPlayTime(totalSeconds) {
    if (!totalSeconds) totalSeconds = 0;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}