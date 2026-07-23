export const CLASSES = {
    Guerreiro: { icon: '🛡️', hp: 1.5, atk: 1.0, mag: 0.5, def: 1.5, res: 1.0, spd: 0.9, acc: 1.0, eva: 0.9, crit: 0.05 },
    Cavaleiro: { icon: '⚔️', hp: 2.0, atk: 0.8, mag: 0.4, def: 2.0, res: 1.5, spd: 0.8, acc: 1.0, eva: 0.8, crit: 0.05 },
    Bárbaro: { icon: '🪓', hp: 1.6, atk: 1.8, mag: 0.3, def: 1.0, res: 0.8, spd: 1.1, acc: 1.0, eva: 1.0, crit: 0.2 },
    Arqueiro: { icon: '🏹', hp: 0.8, atk: 1.4, mag: 0.6, def: 0.8, res: 0.9, spd: 1.5, acc: 1.3, eva: 1.2, crit: 0.15 },
    Assassino: { icon: '🗡️', hp: 0.7, atk: 1.6, mag: 0.5, def: 0.7, res: 0.7, spd: 1.6, acc: 1.2, eva: 1.5, crit: 0.25 },
    Mago: { icon: '🧙‍♂️', hp: 0.7, atk: 0.5, mag: 2.0, def: 0.7, res: 1.5, spd: 1.0, acc: 1.1, eva: 1.0, crit: 0.1 },
    Sacerdote: { icon: '⛪', hp: 1.2, atk: 0.6, mag: 1.3, def: 1.1, res: 1.5, spd: 1.0, acc: 1.0, eva: 1.0, crit: 0.05 },
    Invocador: { icon: '🔮', hp: 0.9, atk: 0.7, mag: 1.5, def: 0.9, res: 1.2, spd: 1.1, acc: 1.0, eva: 1.1, crit: 0.1 }
};

export const ELEMENTS = ['Fogo', 'Água', 'Natureza', 'Raio', 'Luz', 'Trevas'];
export const ELEMENT_ICONS = { Fogo: '🔥', Água: '💧', Natureza: '🌿', Raio: '⚡', Luz: '✨', Trevas: '🌑' };

export const ELEMENT_ADVANTAGES = { Fogo: 'Natureza', Natureza: 'Água', Água: 'Fogo', Luz: 'Trevas', Trevas: 'Luz' };

export const MAT_ICONS = { Minério: '🪨', Madeira: '🪵', Couro: '🦇', Tecido: '🧵', Cristal: '💎', Ouro: '💰', 'Essência de Dragão': '🐉' };

export const REGIONS_DATA = [
    { range: [1, 10], name: "Campos e Florestas", monsters: ["Rato", "Morcego", "Slime", "Aranha Pequena", "Goblin"], boss: "Rei dos Ratos", bossLevel: 10 },
    { range: [11, 20], name: "Floresta Sombria", monsters: ["Lobo", "Kobold", "Javali Selvagem", "Orc Batedor", "Vespa Gigante"], boss: "Chefe Orc", bossLevel: 20 },
    { range: [21, 30], name: "Minas e Cavernas", monsters: ["Troll", "Homem-Lagarto", "Escorpião Gigante", "Golem de Pedra", "Besouro Blindado"], boss: "Troll Ancião", bossLevel: 30 },
    { range: [31, 40], name: "Pântanos", monsters: ["Ogro", "Hidra Jovem", "Aranha Venenosa Gigante", "Lagarto Espinhoso", "Bruxa do Pântano"], boss: "Hidra do Pântano", bossLevel: 40 },
    { range: [41, 50], name: "Ruínas Antigas", monsters: ["Esqueleto Guerreiro", "Múmia", "Espírito Amaldiçoado", "Cavaleiro Caído", "Gárgula"], boss: "Lorde Lich", bossLevel: 50 },
    { range: [51, 60], name: "Montanhas Congeladas", monsters: ["Yeti", "Elemental de Gelo", "Lobo Ártico", "Gigante de Gelo", "Harpia Glacial"], boss: "Rei Yeti", bossLevel: 60 },
    { range: [61, 70], name: "Vulcões", monsters: ["Salamandra de Fogo", "Demônio Menor", "Golem de Lava", "Fênix Jovem", "Verme de Magma"], boss: "Balrog das Chamas", bossLevel: 70 },
    { range: [71, 80], name: "Reino dos Dragões", monsters: ["Wyvern", "Drake Elétrico", "Dragão Verde", "Dragão Negro Jovem", "Basilisco"], boss: "Dragão Ancião", bossLevel: 80 },
    { range: [81, 90], name: "Abismo", monsters: ["Ceifador Sombrio", "Demônio Abissal", "Arqui-Demônio", "Quimera", "Beholder"], boss: "Senhor do Abismo", bossLevel: 90 },
    { range: [91, 100], name: "Plano Celestial", monsters: ["Titã", "Guardião Celestial", "Serafim Corrompido", "Leviatã", "Fera do Vazio"], boss: "Deus Dragão Primordial", bossLevel: 100 }
];

export const MONSTER_ICONS = {
    "Rato": "🐀", "Morcego": "🦇", "Slime": "🟢", "Aranha Pequena": "🕷️", "Goblin": "👺", "Rei dos Ratos": "🐀👑",
    "Lobo": "🐺", "Kobold": "👺", "Javali Selvagem": "🐗", "Orc Batedor": "👹", "Vespa Gigante": "🐝", "Chefe Orc": "👹👑",
    "Troll": "🧌", "Homem-Lagarto": "🦎", "Escorpião Gigante": "🦂", "Golem de Pedra": "🗿", "Besouro Blindado": "🪲", "Troll Ancião": "🧌👑",
    "Ogro": "👹", "Hidra Jovem": "🐍", "Aranha Venenosa Gigante": "🕷️", "Lagarto Espinhoso": "🦎", "Bruxa do Pântano": "🧙‍♀️", "Hidra do Pântano": "🐉",
    "Esqueleto Guerreiro": "💀", "Múmia": "🧟", "Espírito Amaldiçoado": "👻", "Cavaleiro Caído": "🛡️", "Gárgula": "🗿", "Lorde Lich": "💀👑",
    "Yeti": "🦍", "Elemental de Gelo": "❄️", "Lobo Ártico": "🐺", "Gigante de Gelo": "🧊", "Harpia Glacial": "🦅", "Rei Yeti": "🦍👑",
    "Salamandra de Fogo": "🦎", "Demônio Menor": "👿", "Golem de Lava": "🌋", "Fênix Jovem": "🦅", "Verme de Magma": "🐛", "Balrog das Chamas": "🔥👑",
    "Wyvern": "🐉", "Drake Elétrico": "⚡", "Dragão Verde": "🐲", "Dragão Negro Jovem": "🐉", "Basilisco": "🐍", "Dragão Ancião": "🐉👑",
    "Ceifador Sombrio": "👻", "Demônio Abissal": "😈", "Arqui-Demônio": "👿", "Quimera": "🦁", "Beholder": "👁️", "Senhor do Abismo": "🖤👑",
    "Titã": "🗿", "Guardião Celestial": "👼", "Serafim Corrompido": "🪽", "Leviatã": "🐋", "Fera do Vazio": "🕳️", "Deus Dragão Primordial": "✨🐉👑"
};

export const HERO_NAMES = [
    "Arthur", "Merlin", "Elara", "Sylas", "Lyra", "Grom", "Vex", "Kael",
    "Thorne", "Valeria", "Darius", "Isolde", "Zephyr", "Rowan", "Cassian",
    "Aric", "Balthazar", "Cynthia", "Dmitri", "Elowen", "Faelar", "Gideon",
    "Hadrian", "Ignis", "Jora", "Kiran", "Lucian", "Morgan", "Nyx", "Orion",
    "Pendleton", "Quillon", "Ragnar", "Seraphina", "Tristan", "Uriah", "Vesper",
    "Wren", "Xander", "Yvaine", "Zephyrus", "Aethel", "Bran", "Corin", "Drusilla",
    "Ethered", "Freya", "Gareth", "Hilda", "Ivar", "Jocelyn", "Kada", "Leif",
    "Alaric", "Brenna", "Caius", "Deirdre", "Emeric", "Fiona", "Gavin", "Helena"
];

export const RARITIES = [
    { name: "Comum", stars: 1, color: "var(--star-1)", chance: 50, statMod: 1.0 },
    { name: "Incomum", stars: 2, color: "var(--star-2)", chance: 25, statMod: 1.2 },
    { name: "Raro", stars: 3, color: "var(--star-3)", chance: 15, statMod: 1.5 },
    { name: "Épico", stars: 4, color: "var(--star-4)", chance: 7,  statMod: 2.0 },
    { name: "Lendário", stars: 5, color: "var(--star-5)", chance: 2.5,statMod: 3.0 },
    { name: "Mítico", stars: 6, color: "var(--star-6)", chance: 0.4,statMod: 5.0 },
    { name: "Divino", stars: 7, color: "var(--star-7)", chance: 0.1,statMod: 8.0 }
];

export const ITEM_RARITIES = {
    Comum: { color: '#94a3b8', label: 'Comum' },
    Raro: { color: '#38bdf8', label: 'Raro' },
    Épico: { color: '#c084fc', label: 'Épico' },
    Lendário: { color: '#fbbf24', label: 'Lendário' },
    Único: { color: '#ef4444', label: 'Único 🌟' }
};

export const RECIPES = [
    // TIER 1 - COMUM
    { id: 'w1', name: 'Espada Curta', type: 'Arma', rarity: 'Comum', icon: '🗡️', stats: { atk: 12, spd: 1 }, cost: { Minério: 3, Ouro: 50 } },
    { id: 'a1', name: 'Trapo de Couro', type: 'Armadura', rarity: 'Comum', icon: '🧥', stats: { def: 5, hp: 40, eva: 2 }, cost: { Couro: 3, Ouro: 40 } },
    { id: 'w1b', name: 'Adaga Rápida', type: 'Arma', rarity: 'Comum', icon: '🔪', stats: { atk: 8, spd: 4, critRate: 5 }, cost: { Madeira: 3, Ouro: 45 } },
    { id: 'a1b', name: 'Escudo de Madeira', type: 'Armadura', rarity: 'Comum', icon: '🛡️', stats: { def: 8, hp: 30, res: 3 }, cost: { Madeira: 4, Ouro: 45 } },
    { id: 'w1c', name: 'Cajado Rústico', type: 'Arma', rarity: 'Comum', icon: '🪄', stats: { mag: 14, res: 3 }, cost: { Madeira: 4, Ouro: 50 } },
    { id: 'a1c', name: 'Túnica de Linho', type: 'Armadura', rarity: 'Comum', icon: '👘', stats: { mag: 8, hp: 25, res: 4 }, cost: { Tecido: 4, Ouro: 40 } },

    // TIER 2 - RARO
    { id: 'w2', name: 'Espada Larga', type: 'Arma', rarity: 'Raro', icon: '⚔️', stats: { atk: 26, spd: 0, acc: 5 }, cost: { Minério: 6, Ouro: 120 } },
    { id: 'a2', name: 'Armadura de Placas Leves', type: 'Armadura', rarity: 'Raro', icon: '🛡️', stats: { def: 20, hp: 120, res: 5 }, cost: { Minério: 6, Couro: 4, Ouro: 150 } },
    { id: 'w2_mag', name: 'Cajado de Aprendiz', type: 'Arma', rarity: 'Raro', icon: '🔮', stats: { mag: 32, res: 6, spd: 1 }, cost: { Madeira: 6, Cristal: 1, Ouro: 130 } },
    { id: 'a2_mag', name: 'Manto do Místico', type: 'Armadura', rarity: 'Raro', icon: '👘', stats: { mag: 20, res: 16, hp: 80 }, cost: { Tecido: 6, Ouro: 110 } },
    { id: 'w2_bow', name: 'Arco Recurvo', type: 'Arma', rarity: 'Raro', icon: '🏹', stats: { atk: 22, spd: 3, acc: 8 }, cost: { Madeira: 6, Couro: 3, Ouro: 125 } },
    { id: 'a2_helm', name: 'Elmo de Ferro', type: 'Armadura', rarity: 'Raro', icon: '🪖', stats: { def: 15, hp: 70, acc: 5 }, cost: { Minério: 5, Ouro: 100 } },

    // TIER 3 - ÉPICO
    { id: 'w3', name: 'Arco Élfico', type: 'Arma', rarity: 'Épico', icon: '🏹', stats: { atk: 45, spd: 3, acc: 12, critRate: 8 }, cost: { Madeira: 8, Couro: 5, Ouro: 250 } },
    { id: 'w3_mag', name: 'Orbe dos Ventos', type: 'Arma', rarity: 'Épico', icon: '🔮', stats: { mag: 55, spd: 4, res: 12 }, cost: { Cristal: 2, Madeira: 6, Ouro: 300 } },
    { id: 'a3', name: 'Armadura de Escamas', type: 'Armadura', rarity: 'Épico', icon: '🛡️', stats: { def: 35, hp: 220, eva: 6 }, cost: { Couro: 10, Minério: 6, Ouro: 280 } },
    { id: 'a3_mag', name: 'Túnica Etérea', type: 'Armadura', rarity: 'Épico', icon: '👘', stats: { mag: 38, res: 30, hp: 170, eva: 8 }, cost: { Tecido: 10, Cristal: 1, Ouro: 310 } },
    { id: 'w3_hammer', name: 'Martelo de Guerra Rúnico', type: 'Arma', rarity: 'Épico', icon: '🔨', stats: { atk: 50, spd: -1, critRate: 10 }, cost: { Minério: 10, Cristal: 1, Ouro: 320 } },
    { id: 'a3_plate', name: 'Peitoral de Aço Pesado', type: 'Armadura', rarity: 'Épico', icon: '🛡️', stats: { def: 45, hp: 300, res: 10 }, cost: { Minério: 12, Couro: 6, Ouro: 350 } },

    // TIER 4 - LENDÁRIO
    { id: 'w4', name: 'Cajado Arcano Supremo', type: 'Arma', rarity: 'Lendário', icon: '🪄', stats: { mag: 90, res: 22, spd: 2, critRate: 12 }, cost: { Madeira: 10, Cristal: 3, Ouro: 600 } },
    { id: 'w4_atk', name: 'Espada Flamejante', type: 'Arma', rarity: 'Lendário', icon: '⚔️', stats: { atk: 80, spd: 3, acc: 15, critRate: 15 }, cost: { Minério: 15, Cristal: 2, Ouro: 700 } },
    { id: 'a4', name: 'Peitoral Titânico', type: 'Armadura', rarity: 'Lendário', icon: '🛡️', stats: { def: 70, hp: 450, res: 30 }, cost: { Minério: 18, Cristal: 2, Ouro: 650 } },
    { id: 'a4_mag', name: 'Manto do Arquimago', type: 'Armadura', rarity: 'Lendário', icon: '👘', stats: { mag: 65, res: 55, hp: 320, eva: 12 }, cost: { Tecido: 15, Cristal: 3, Ouro: 720 } },
    { id: 'w4_blade', name: 'Lâmina das Sombras', type: 'Arma', rarity: 'Lendário', icon: '🗡️', stats: { atk: 85, spd: 5, critRate: 20, eva: 10 }, cost: { Couro: 15, Cristal: 2, Ouro: 750 } },

    // TIER 5 - ÚNICO
    { id: 'w5', name: 'Lâmina do Lorde Dragão', type: 'Arma', rarity: 'Único', icon: '🐉', stats: { atk: 120, spd: 4, critRate: 25, penetration: 20 }, cost: { 'Essência de Dragão': 1, Cristal: 3, Minério: 15, Ouro: 1400 } },
    { id: 'w5_mag', name: 'Cajado do Cosmos', type: 'Arma', rarity: 'Único', icon: '✨', stats: { mag: 135, res: 40, spd: 4, critRate: 18 }, cost: { 'Essência de Dragão': 1, Cristal: 4, Madeira: 15, Ouro: 1600 } },
    { id: 'a5', name: 'Armadura Escamosa do Abismo', type: 'Armadura', rarity: 'Único', icon: '👑', stats: { def: 110, hp: 900, res: 50, eva: 15 }, cost: { 'Essência de Dragão': 1, Cristal: 3, Couro: 20, Ouro: 1700 } },
    { id: 'w5_bow', name: 'Arco Estelar do Infinito', type: 'Arma', rarity: 'Único', icon: '🏹', stats: { atk: 130, spd: 6, acc: 25, critRate: 22 }, cost: { 'Essência de Dragão': 1, Cristal: 4, Madeira: 20, Ouro: 1900 } }
];

/* ======== SKILLS/HABILIDADES ======== */
export const CLASS_SKILLS = {
    Guerreiro: [
        { id: 'gue_1', name: 'Golpe Forte', icon: '⚔️', type: 'damage', target: 'single', power: 1.5, cd: 3, desc: 'Causa 150% de dano a um alvo.' },
        { id: 'gue_2', name: 'Provocação', icon: '🛡️', type: 'buff', target: 'self', effect: 'taunt', duration: 2, cd: 4, desc: 'Atrai a atenção dos inimigos para si por 2 turnos.' },
        { id: 'gue_3', name: 'Fenda', icon: '🌪️', type: 'damage', target: 'enemies', power: 0.8, cd: 4, desc: 'Dano moderado em todos os inimigos.' },
        { id: 'gue_4', name: 'Postura Defensiva', icon: '🛡️', type: 'buff', target: 'self', effect: 'def_up', duration: 3, cd: 4, desc: 'Aumenta a própria DEF por 3 turnos.' },
        { id: 'gue_5', name: 'Investida', icon: '🏃', type: 'damage', target: 'single', effect: 'delay', power: 1.2, cd: 4, desc: 'Dano e reduz a barra de ação do alvo.' }
    ],
    Cavaleiro: [
        { id: 'cav_1', name: 'Provocação', icon: '🛡️', type: 'buff', target: 'self', effect: 'taunt', duration: 2, cd: 4, desc: 'Força os inimigos a te atacarem por 2 turnos.' },
        { id: 'cav_2', name: 'Escudo Sagrado', icon: '✨', type: 'buff', target: 'allies', effect: 'def_up', duration: 3, cd: 5, desc: 'Aumenta a DEF da equipe por 3 turnos.' },
        { id: 'cav_3', name: 'Golpe de Escudo', icon: '💥', type: 'damage', target: 'single', effect: 'delay', power: 1.2, cd: 3, desc: 'Dano e atrasa bastante o alvo.' },
        { id: 'cav_4', name: 'Falange', icon: '🏰', type: 'buff', target: 'self', effect: 'def_up', duration: 4, cd: 6, desc: 'Aumenta massivamente a própria DEF.' },
        { id: 'cav_5', name: 'Lâmina da Justiça', icon: '⚔️', type: 'damage', target: 'single', power: 1.6, cd: 4, desc: 'Dano preciso em um alvo único.' }
    ],
    Bárbaro: [
        { id: 'bar_1', name: 'Grito Provocante', icon: '🗣️', type: 'buff', target: 'self', effect: 'taunt', duration: 2, cd: 4, desc: 'Provoca os inimigos atraindo ataques.' },
        { id: 'bar_2', name: 'Golpe Esmagador', icon: '🔨', type: 'damage', target: 'single', power: 1.8, cd: 4, desc: 'Dano pesado em um único alvo.' },
        { id: 'bar_3', name: 'Ciclone', icon: '🌪️', type: 'damage', target: 'enemies', power: 0.9, cd: 4, desc: 'Dano giratório equilibrado em área.' },
        { id: 'bar_4', name: 'Sede de Sangue', icon: '🩸', type: 'heal', target: 'self', power: 1.3, cd: 5, desc: 'Cura a si mesmo baseada no ATK.' },
        { id: 'bar_5', name: 'Grito Intimidador', icon: '🗣️', type: 'debuff', target: 'enemies', effect: 'atk_down', duration: 3, cd: 5, desc: 'Reduz o ATK de todos os inimigos.' }
    ],
    Arqueiro: [
        { id: 'arq_1', name: 'Tiro Certeiro', icon: '🎯', type: 'damage', target: 'single', power: 1.6, cd: 3, desc: 'Disparo preciso de alto dano unitário.' },
        { id: 'arq_2', name: 'Chuva de Flechas', icon: '🌧️', type: 'damage', target: 'enemies', power: 0.75, cd: 4, desc: 'Dispara flechas contra todos os inimigos.' },
        { id: 'arq_3', name: 'Passo Rápido', icon: '💨', type: 'buff', target: 'self', effect: 'spd_up', duration: 3, cd: 5, desc: 'Aumenta a própria Velocidade.' },
        { id: 'arq_4', name: 'Tiro Penetrante', icon: '🏹', type: 'damage', target: 'single', effect: 'def_down', power: 1.3, cd: 4, desc: 'Dano e reduz a DEF do alvo.' },
        { id: 'arq_5', name: 'Emboscada', icon: '🌿', type: 'buff', target: 'allies', effect: 'eva_up', duration: 2, cd: 5, desc: 'Aumenta a Esquiva de toda a equipe.' }
    ],
    Assassino: [
        { id: 'ass_1', name: 'Apunhalada', icon: '🗡️', type: 'damage', target: 'single', power: 1.8, cd: 3, desc: 'Ataque furtivo de dano crítico elevado.' },
        { id: 'ass_2', name: 'Veneno Mortal', icon: '🧪', type: 'debuff', target: 'single', effect: 'atk_down', duration: 3, cd: 4, desc: 'Envenena o alvo reduzindo seu ATK.' },
        { id: 'ass_3', name: 'Desafio Sombrio', icon: '👤', type: 'buff', target: 'self', effect: 'taunt', duration: 2, cd: 4, desc: 'Atrai os olhares dos inimigos das sombras.' },
        { id: 'ass_4', name: 'Dança das Sombras', icon: '👥', type: 'damage', target: 'enemies', power: 0.8, cd: 5, desc: 'Golpes rápidos em área contra todos.' },
        { id: 'ass_5', name: 'Corte Rápido', icon: '⚡', type: 'damage', target: 'single', effect: 'delay', power: 1.1, cd: 2, desc: 'Corte ágil com recarga rápida.' }
    ],
    Mago: [
        { id: 'mag_1', name: 'Bola de Fogo', icon: '🔥', type: 'damage', target: 'enemies', power: 0.9, cd: 4, desc: 'Conjura chamas em área moderadas.' },
        { id: 'mag_2', name: 'Raio de Gelo', icon: '❄️', type: 'damage', target: 'single', effect: 'delay', power: 1.4, cd: 3, desc: 'Dano mágico e atrasa o alvo.' },
        { id: 'mag_3', name: 'Meteoro', icon: '☄️', type: 'damage', target: 'enemies', power: 1.1, cd: 6, desc: 'Invoca um meteoro de impacto equilibrado em área.' },
        { id: 'mag_4', name: 'Escudo de Mana', icon: '🔮', type: 'buff', target: 'self', effect: 'def_up', duration: 3, cd: 5, desc: 'Aumenta a própria Defesa.' },
        { id: 'mag_5', name: 'Fissura Arcana', icon: '✨', type: 'debuff', target: 'enemies', effect: 'def_down', duration: 2, cd: 5, desc: 'Reduz a DEF de todos os inimigos.' }
    ],
    Sacerdote: [
        { id: 'sac_1', name: 'Cura Maior', icon: '💚', type: 'heal', target: 'ally', power: 1.6, cd: 3, desc: 'Restaura bastante a vida do aliado ferido.' },
        { id: 'sac_2', name: 'Oração', icon: '🙏', type: 'heal', target: 'allies', power: 0.9, cd: 4, desc: 'Cura equilibrada para toda a equipe.' },
        { id: 'sac_3', name: 'Bênção Divina', icon: '✨', type: 'buff', target: 'allies', effect: 'def_up', duration: 3, cd: 5, desc: 'Aumenta a DEF de todos os aliados.' },
        { id: 'sac_4', name: 'Luz Purificadora', icon: '☀️', type: 'damage', target: 'single', power: 1.3, cd: 3, desc: 'Dano sagrado em um inimigo.' },
        { id: 'sac_5', name: 'Cântico Sagrado', icon: '🎵', type: 'buff', target: 'allies', effect: 'atk_up', duration: 2, cd: 5, desc: 'Concede bônus de ATK para a equipe.' }
    ],
    Invocador: [
        { id: 'inv_1', name: 'Raio Negro', icon: '🌑', type: 'damage', target: 'single', power: 1.5, cd: 3, desc: 'Disparo de energia sombria em um alvo.' },
        { id: 'inv_2', name: 'Pacto de Sangue', icon: '🩸', type: 'buff', target: 'allies', effect: 'atk_up', duration: 3, cd: 5, desc: 'Amplia o ATK da equipe através de pacto.' },
        { id: 'inv_3', name: 'Drenar Vida', icon: '🧛', type: 'heal', target: 'self', power: 1.3, cd: 4, desc: 'Restaura a própria vida sugando energia.' },
        { id: 'inv_4', name: 'Explosão Caótica', icon: '💥', type: 'damage', target: 'enemies', power: 0.85, cd: 4, desc: 'Ondas de dano caótico em área.' },
        { id: 'inv_5', name: 'Aura Sombria', icon: '🌫️', type: 'debuff', target: 'enemies', effect: 'atk_down', duration: 3, cd: 6, desc: 'Reduz o ATK de todos os inimigos.' }
    ]
};