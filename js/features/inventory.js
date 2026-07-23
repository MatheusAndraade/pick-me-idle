import { game } from '../core/state.js';
import { MAT_ICONS, RECIPES, ITEM_RARITIES } from '../data/constants.js';
import { notify } from '../core/ui.js';

let activeRarityFilters = {
    Comum: true,
    Raro: true,
    Épico: true,
    Lendário: true,
    Único: true
};

export function renderInventory() {
    const matList = document.getElementById('material-list');
    matList.innerHTML = '';
    
    for (let [mat, count] of Object.entries(game.inventory.materials)) {
        matList.innerHTML += `
            <li>
                <span>${MAT_ICONS[mat] || '📦'} ${mat}</span>
                <strong style="color: var(--primary);">${count}</strong>
            </li>`;
    }

    const equipList = document.getElementById('equip-grid');
    equipList.innerHTML = '';

    if (game.inventory.equips.length === 0) {
        equipList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 20px;">Sua mochila de equipamentos está vazia.</div>`;
    } else {
        game.inventory.equips.forEach((eq, index) => {
            let rColor = ITEM_RARITIES[eq.rarity || 'Comum'].color;
            let statsText = '';
            if (eq.stats.atk) statsText += `⚔️ ATK +${eq.stats.atk} &nbsp;`;
            if (eq.stats.mag) statsText += `🔮 MAG +${eq.stats.mag} &nbsp;`;
            if (eq.stats.def) statsText += `🛡️ DEF +${eq.stats.def} &nbsp;`;
            if (eq.stats.res) statsText += `✨ RES +${eq.stats.res} &nbsp;`;
            if (eq.stats.hp) statsText += `❤️ HP +${eq.stats.hp} &nbsp;`;
            if (eq.stats.spd) statsText += `⚡ SPD +${eq.stats.spd} &nbsp;`;
            if (eq.stats.acc) statsText += `🎯 ACC +${eq.stats.acc} &nbsp;`;
            if (eq.stats.eva) statsText += `🍃 EVA +${eq.stats.eva} &nbsp;`;
            if (eq.stats.critRate) statsText += `💥 CRIT +${eq.stats.critRate}% &nbsp;`;
            if (eq.stats.penetration) statsText += `🗡️ PEN +${eq.stats.penetration} &nbsp;`;

            equipList.innerHTML += `
                <div class="equip-item" style="border-top: 3px solid ${rColor}">
                    <div>
                        <strong style="color: ${rColor}">${eq.name}</strong>
                        <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 6px;">[${eq.type} - ${eq.rarity || 'Comum'}]</span>
                        <div style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.4;">${statsText}</div>
                    </div>
                    <button class="btn-danger" style="font-size: 0.75rem; padding: 6px;" onclick="window.discardEquip(${index})">Descartar</button>
                </div>`;
        });
    }
}

export function discardEquip(index) {
    if (confirm("Deseja descartar este equipamento?")) {
        game.inventory.equips.splice(index, 1);
        window.updateUI();
        renderInventory();
        notify("Equipamento descartado.");
    }
}

export function toggleRarityFilter(rarityName) {
    activeRarityFilters[rarityName] = !activeRarityFilters[rarityName];
    const btn = document.querySelector(`.filter-pill[data-rarity="${rarityName}"]`);
    if (btn) {
        if (activeRarityFilters[rarityName]) btn.classList.add('active');
        else btn.classList.remove('active');
    }
    renderCraft();
}

export function renderCraft() {
    const container = document.getElementById('craft-container');
    container.innerHTML = '';

    const typeFilterEl = document.getElementById('craft-type-filter');
    const selectedType = typeFilterEl ? typeFilterEl.value : 'All';

    let filteredRecipes = RECIPES.filter(recipe => {
        if (selectedType !== 'All' && recipe.type !== selectedType) return false;
        if (!activeRarityFilters[recipe.rarity]) return false;
        return true;
    });

    if (filteredRecipes.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 30px;">Nenhum item encontrado com os filtros selecionados.</div>`;
        return;
    }

    filteredRecipes.forEach(recipe => {
        let rColor = ITEM_RARITIES[recipe.rarity].color;
        
        let statsText = '';
        if (recipe.stats.atk) statsText += `<span>⚔️ ATK +${recipe.stats.atk}</span>`;
        if (recipe.stats.mag) statsText += `<span>🔮 MAG +${recipe.stats.mag}</span>`;
        if (recipe.stats.def) statsText += `<span>🛡️ DEF +${recipe.stats.def}</span>`;
        if (recipe.stats.res) statsText += `<span>✨ RES +${recipe.stats.res}</span>`;
        if (recipe.stats.hp) statsText += `<span>❤️ HP +${recipe.stats.hp}</span>`;
        if (recipe.stats.spd) statsText += `<span>⚡ SPD +${recipe.stats.spd}</span>`;
        if (recipe.stats.acc) statsText += `<span>🎯 ACC +${recipe.stats.acc}</span>`;
        if (recipe.stats.eva) statsText += `<span>🍃 EVA +${recipe.stats.eva}</span>`;
        if (recipe.stats.critRate) statsText += `<span>💥 CRIT +${recipe.stats.critRate}%</span>`;
        if (recipe.stats.penetration) statsText += `<span>🗡️ PEN +${recipe.stats.penetration}</span>`;

        let canCraft = true;
        let materialsHTML = '';

        for (let [mat, reqQty] of Object.entries(recipe.cost)) {
            let hasQty = 0;
            let matIcon = MAT_ICONS[mat] || '📦';
            if (mat === 'Ouro') {
                hasQty = game.gold;
            } else {
                hasQty = game.inventory.materials[mat] || 0;
            }

            if (hasQty < reqQty) canCraft = false;

            let percentage = Math.min(100, Math.floor((hasQty / reqQty) * 100));
            let fillColor = hasQty >= reqQty ? '#22c55e' : '#f59e0b';

            materialsHTML += `
                <div class="recipe-mat-row">
                    <div class="recipe-mat-info">
                        <div class="recipe-mat-left">
                            <span>${matIcon}</span>
                            <span>${mat}</span>
                        </div>
                        <span style="color: ${hasQty >= reqQty ? '#22c55e' : '#f87171'}">${hasQty} / ${reqQty}</span>
                    </div>
                    <div class="recipe-mat-bar">
                        <div class="recipe-mat-fill" style="width: ${percentage}%; background: ${fillColor};"></div>
                    </div>
                </div>`;
        }

        container.innerHTML += `
            <div class="recipe-card" style="border-top: 4px solid ${rColor}">
                <div class="recipe-content-wrapper">
                    <div class="recipe-top">
                        <div class="recipe-icon-box">${recipe.icon || '⚔️'}</div>
                        <div class="recipe-info">
                            <div class="recipe-name">${recipe.name}</div>
                            <div><span class="recipe-rarity-badge" style="background: ${rColor}22; color: ${rColor}; border: 1px solid ${rColor};">${recipe.rarity} &bull; ${recipe.type}</span></div>
                            <div class="recipe-stats-box">${statsText}</div>
                        </div>
                    </div>

                    <div class="recipe-materials-section">
                        <div class="recipe-materials-title">Materiais Necessários</div>
                        <div class="recipe-materials-list">${materialsHTML}</div>
                    </div>
                </div>

                <button class="btn-primary btn-craft" ${!canCraft ? 'disabled' : ''} onclick="window.craftItem('${recipe.id}')">
                    🔨 Forjar Item
                </button>
            </div>`;
    });
}

export function craftItem(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    for (let [mat, reqQty] of Object.entries(recipe.cost)) {
        if (mat === 'Ouro') {
            if (game.gold < reqQty) return notify("Ouro insuficiente!");
        } else {
            if ((game.inventory.materials[mat] || 0) < reqQty) return notify(`Material insuficiente: ${mat}`);
        }
    }

    for (let [mat, reqQty] of Object.entries(recipe.cost)) {
        if (mat === 'Ouro') {
            game.gold -= reqQty;
        } else {
            game.inventory.materials[mat] -= reqQty;
        }
    }

    const newItem = {
        name: recipe.name,
        type: recipe.type,
        rarity: recipe.rarity,
        stats: { ...recipe.stats }
    };

    game.inventory.equips.push(newItem);
    notify(`⚒️ ${recipe.name} forjado com sucesso!`);
    window.updateUI();
    renderInventory();
    renderCraft();
}

window.discardEquip = discardEquip;
window.toggleRarityFilter = toggleRarityFilter;