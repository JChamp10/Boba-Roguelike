

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const GAME_CENTER_X = GAME_WIDTH / 2;
const GAME_CENTER_Y = GAME_HEIGHT / 2;
// GAMEPLAY TUNING: change these first when balancing pickups, passive income, and store boosts.
const HEALING_ORB_HEAL_AMOUNT = 5;
const XP_ORB_MAGNET_RANGE = 210;
const XP_ORB_MIN_SPEED = 340;
const XP_ORB_MAX_SPEED = 820;
const XP_ORB_PLAYER_SPEED_BONUS = 120;
const IDLE_RUN_TAPIOCA_TICK_MS = 1000;
const PER_RUN_DAMAGE_BOOST_PERCENT = 0.05;
const LYCHEE_PROJECTILE_LIFESPAN_MS = 1200;
const BUILD_ABILITY_DURATION_MS = 4200;
const ENEMY_BASE_HEALTH = 30;
const CHARACTER_UNLOCK_COST_STEP = 1000000;
const GUN_UNLOCK_COST_STEP = 500000;
const BOOST_BAY_SPIN_COST = 500000;
const SPECIAL_DRAFT_ENABLED = false;
globalThis.BOBA_SPECIAL_DRAFT_ENABLED = SPECIAL_DRAFT_ENABLED;

// BUILD SETUP: swap the texture keys here after you add custom character/weapon assets.
// For new files, add them to BOOT_IMAGE_ASSETS below, then point playerTexture/gunTexture/projectileTexture at the new keys.
const DRINK_OPTIONS = [
    {
        id: 'classic',
        name: 'Classic Milk Tea',
        desc: 'Dash reloads ammo and briefly boosts fire rate',
        playerTexture: 'player_boba',
        playerScale: 0.14,
        abilityType: 'classicDash',
        accent: 0xf6b84b
    },
    {
        id: 'strawberry',
        name: 'Strawberry Boba',
        desc: 'Sugar Rush gives infinite ammo and briefly boosts fire rate',
        playerTexture: 'strawberry_player',
        playerScale: 0.28,
        playerOrigin: { x: 0.527, y: 0.578 },
        abilityType: 'sugarRush',
        accent: 0xff6f9f
    },
    {
        id: 'matcha',
        name: 'Matcha Boba',
        desc: 'Zen Garden heals and slows nearby enemies',
        playerTexture: 'matcha_player',
        playerScale: 0.14,
        playerOrigin: { x: 0.503, y: 0.466 },
        abilityType: 'zenGarden',
        accent: 0x83f28f
    },
    {
        id: 'lychee',
        name: 'Lychee Boba',
        desc: 'Crystal Focus slows time and tightens aim',
        playerTexture: 'lychee_player_ui',
        playerScale: 0.18,
        playerOrigin: { x: 0.5, y: 0.5 },
        abilityType: 'crystalFocus',
        accent: 0xff5fa2
    },
    {
        id: 'tiger',
        name: 'Tiger Boba',
        desc: 'Tiger Focus makes sword slashes deal damage',
        playerTexture: 'tiger_player',
        playerScale: 0.34,
        playerOrigin: { x: 0.51, y: 0.502 },
        abilityType: 'tigerFocus',
        accent: 0xffb14f
    }
];

const GUN_OPTIONS = [
    {
        id: 'classic',
        name: 'Boba Blaster',
        desc: 'Medium-speed pearls with steady DPS',
        gunTexture: 'boba_gun',
        projectileTexture: 'projectile_boba',
        gunScale: 0.055,
        projectileScale: 0.18,
        projectileSpeed: 500,
        projectileCount: 1,
        spread: 0.4,
        damageMultiplier: 1,
        fireRateMultiplier: 1,
        synergy: 'Dash through enemies to reload ammo and briefly boost fire rate.',
        accent: 0x7ed2ff
    },
    {
        id: 'strawberry-shotgun',
        name: 'Strawberry Shotgun',
        desc: 'Wide spread, high damage up close',
        gunTexture: 'strawberry_gun',
        projectileTexture: 'strawberry_projectile',
        gunScale: 0.17,
        projectileScale: 0.16,
        projectileSpeed: 500,
        projectileLifespan: 320,
        projectileCount: 6,
        spread: 0.95,
        damageMultiplier: 0.42,
        fireRateMultiplier: 1.45,
        reloadDurationMultiplier: 2,
        weaponType: 'strawberryShotgun',
        synergy: 'Closer hits land harder; SPACE increases pellet pressure.',
        accent: 0xff6f9f
    },
    {
        id: 'matcha-orb',
        name: 'Matcha Orb Launcher',
        desc: 'Single-pierce poison orbs linger and lifesteal',
        gunTexture: 'matcha_gun',
        projectileTexture: 'matcha_projectile',
        gunScale: 0.105,
        projectileScale: 0.24,
        projectileSpeed: 260,
        projectileLifespan: 4300,
        projectileCount: 1,
        spread: 0.15,
        pierce: 1,
        damageMultiplier: 0.55,
        fireRateMultiplier: 1.05,
        reloadDurationMultiplier: 5,
        weaponType: 'matchaOrb',
        synergy: 'One-pierce poison steals life; SPACE doubles orb duration.',
        accent: 0x83f28f
    },
    {
        id: 'lychee-shotgun',
        name: 'Lychee Shotgun',
        desc: 'Tight fast pellets with high burst damage',
        gunTexture: 'lychee_shotgun_ui',
        projectileTexture: 'lychee_projectile_ui',
        gunScale: 0.0825,
        projectileScale: 0.035,
        projectileSpeed: 540,
        projectileLifespan: LYCHEE_PROJECTILE_LIFESPAN_MS,
        projectileCount: 4,
        spread: 0.62,
        damageMultiplier: 0.3,
        fireRateMultiplier: 1.7,
        weaponType: 'lycheeShotgun',
        synergy: 'Repeated pellet hits on one target ramp damage; SPACE tightens spread.',
        accent: 0xff5fa2
    },
    {
        id: 'tiger-blade',
        name: 'Tiger Blade',
        desc: 'Sword slash plus a focused tiger pearl',
        gunTexture: 'tiger_gun',
        projectileTexture: 'tiger_projectile',
        gunScale: 0.26,
        gunFacesRight: true,
        projectileScale: 0.18,
        projectileSpeed: 520,
        projectileLifespan: 1700,
        projectileCount: 1,
        spread: 0.08,
        damageMultiplier: 1.12,
        fireRateMultiplier: 1.12,
        weaponType: 'tigerBlade',
        synergy: 'Every shot swings the sword; SPACE makes slashes hit for 2x one projectile.',
        accent: 0xffb14f
    }
];

function getDrinkOption(id = GameState.selectedDrink) {
    return DRINK_OPTIONS.find(option => option.id === id) || DRINK_OPTIONS[0];
}

function getGunOption(id = GameState.selectedGun) {
    return GUN_OPTIONS.find(option => option.id === id) || GUN_OPTIONS[0];
}

function sanitizeBuildState() {
    GameState.selectedDrink = getDrinkOption(GameState.selectedDrink).id;
    GameState.selectedGun = getGunOption(GameState.selectedGun).id;
    GameState.unlockedDrinks = sanitizeBuildUnlockMap(GameState.unlockedDrinks, DRINK_OPTIONS);
    GameState.unlockedGuns = sanitizeBuildUnlockMap(GameState.unlockedGuns, GUN_OPTIONS);
}

function sanitizeBuildUnlockMap(unlocks, options) {
    const sanitized = { [options[0].id]: true };
    const source = unlocks || {};
    options.forEach(option => {
        if (source[option.id]) sanitized[option.id] = true;
    });
    return sanitized;
}

function getBuildUnlockMap(type) {
    return type === 'drink' ? GameState.unlockedDrinks : GameState.unlockedGuns;
}

function isBuildOptionUnlocked(type, id) {
    return !!getBuildUnlockMap(type)?.[id];
}

function getBuildOptionUnlockCost(type, id) {
    const options = type === 'drink' ? DRINK_OPTIONS : GUN_OPTIONS;
    const index = Math.max(0, options.findIndex(option => option.id === id));
    if (index === 0) return 0;
    return index * (type === 'drink' ? CHARACTER_UNLOCK_COST_STEP : GUN_UNLOCK_COST_STEP);
}

function formatTapiocaCost(cost) {
    if (cost >= 1000000) return `${(cost / 1000000).toFixed(cost % 1000000 === 0 ? 0 : 1)}M TP`;
    if (cost >= 1000) return `${Math.floor(cost / 1000)}K TP`;
    return `${cost} TP`;
}

function getSelectedBuildLock() {
    const drink = getDrinkOption();
    const gun = getGunOption();
    if (!isBuildOptionUnlocked('drink', drink.id)) {
        return { type: 'drink', option: drink, cost: getBuildOptionUnlockCost('drink', drink.id) };
    }
    if (!isBuildOptionUnlocked('gun', gun.id)) {
        return { type: 'gun', option: gun, cost: getBuildOptionUnlockCost('gun', gun.id) };
    }
    return null;
}

function getSelectedBuildProfile() {
    sanitizeBuildState();
    const drink = getDrinkOption();
    const gun = getGunOption();
    const synergy = getBuildSynergyText(drink, gun);
    return {
        id: `${drink.id}-${gun.id}`,
        drink,
        gun,
        playerTexture: drink.playerTexture,
        gunTexture: gun.gunTexture,
        projectileTexture: gun.projectileTexture,
        playerScale: drink.playerScale,
        playerOrigin: drink.playerOrigin || { x: 0.5, y: 0.5 },
        gunScale: gun.gunScale,
        gunFacesRight: !!gun.gunFacesRight,
        projectileScale: gun.projectileScale,
        projectileSpeed: gun.projectileSpeed,
        projectileLifespan: gun.projectileLifespan || 2400,
        projectileCount: gun.projectileCount,
        spread: gun.spread,
        pierce: gun.pierce || 0,
        damageMultiplier: gun.damageMultiplier,
        fireRateMultiplier: gun.fireRateMultiplier,
        reloadDurationMultiplier: gun.reloadDurationMultiplier || 1,
        weaponType: gun.weaponType || 'classic',
        abilityType: drink.abilityType || 'classicDash',
        synergy
    };
}

function getBoostBayLoadoutOptions(categoryId) {
    const category = BOOST_BAY_DATA.find(item => item.id === categoryId);
    return [
        { id: 'none', name: `No ${category?.title?.slice(0, -1) || 'Boost'}`, text: 'Leave this slot empty.', icon: 'NO', color: BOBA_THEME.muted },
        ...(category?.items || []).map((item, index) => ({
            id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            name: item.name,
            text: item.text,
            icon: item.icon || `${category.icon}${index + 1}`,
            assetKey: item.assetKey,
            color: category.color
        }))
    ];
}

function getBoostBayLoadoutOption(categoryId, id) {
    const options = getBoostBayLoadoutOptions(categoryId);
    return options.find(option => option.id === id) || options[0];
}

function isBoostBayLoadoutUnlocked(categoryId, id) {
    if (id === 'none') return true;
    const option = getBoostBayLoadoutOption(categoryId, id);
    return !!GameState.boostBayInventory?.[categoryId]?.[option.name];
}

function getLoadoutStateKey(categoryId) {
    return ({ pets: 'selectedPet', charms: 'selectedCharm', auras: 'selectedAura' })[categoryId] || 'selectedPet';
}

function sanitizeBoostBayLoadoutState() {
    ['pets', 'charms', 'auras'].forEach(categoryId => {
        const key = getLoadoutStateKey(categoryId);
        GameState[key] = getBoostBayLoadoutOption(categoryId, GameState[key]).id;
    });
}

function doesBuildHaveSynergy(drink = getDrinkOption(), gun = getGunOption()) {
    if (!drink?.id || !gun?.id) return false;
    if (drink.id === 'classic' && gun.id === 'classic') return true;
    return gun.id.startsWith(`${drink.id}-`);
}

function getBuildSynergyText(drink = getDrinkOption(), gun = getGunOption()) {
    return doesBuildHaveSynergy(drink, gun) ? (gun.synergy || '') : '';
}

// ============================================
// SAVE MANAGER
// ============================================
const SaveManager = {
    STORAGE_KEY: 'boba_roguelike_save',
    VERSION: 9,

    save() {
        const data = {
            version: this.VERSION,
            tapioca: GameState.tapioca,
            totalTapioca: GameState.totalTapioca,
            rage: GameState.rage,
            totalRage: GameState.totalRage,
            totalEnemiesKilled: GameState.totalEnemiesKilled,
            aimMode: GameState.aimMode,
            selectedDrink: GameState.selectedDrink,
            selectedGun: GameState.selectedGun,
            selectedPet: GameState.selectedPet,
            selectedCharm: GameState.selectedCharm,
            selectedAura: GameState.selectedAura,
            unlockedDrinks: GameState.unlockedDrinks,
            unlockedGuns: GameState.unlockedGuns,
            idleMachines: GameState.idleMachines,
            idleFactoryTech: GameState.idleFactoryTech,
            evolutionBoost: GameState.evolutionBoost,
            savedAt: Date.now(),
            factoryUpgrades: this.sanitizeFactoryUpgrades(GameState.factoryUpgrades),
            runBoosts: this.sanitizeRunBoosts(GameState.runBoosts),
            boostBayInventory: this.sanitizeBoostBayInventory(GameState.boostBayInventory)
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            window.BobaAuth?.queueSaveUpload?.();
        } catch (e) { /* storage full or unavailable */ }
    },

    load() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);
            if (data.version !== this.VERSION) return this.migrate(data);
            GameState.tapioca = data.tapioca || 0;
            GameState.totalTapioca = data.totalTapioca || 0;
            GameState.rage = data.rage || 0;
            GameState.totalRage = data.totalRage || 0;
            GameState.totalEnemiesKilled = data.totalEnemiesKilled || 0;
            GameState.aimMode = data.aimMode === 'manual' ? 'manual' : 'auto';
            GameState.selectedDrink = data.selectedDrink || GameState.selectedDrink || 'classic';
            GameState.selectedGun = data.selectedGun || GameState.selectedGun || 'classic';
            GameState.selectedPet = data.selectedPet || GameState.selectedPet || 'none';
            GameState.selectedCharm = data.selectedCharm || GameState.selectedCharm || 'none';
            GameState.selectedAura = data.selectedAura || GameState.selectedAura || 'none';
            GameState.unlockedDrinks = this.sanitizeBuildUnlocks(data.unlockedDrinks, DRINK_OPTIONS);
            GameState.unlockedGuns = this.sanitizeBuildUnlocks(data.unlockedGuns, GUN_OPTIONS);
            sanitizeBuildState();
            sanitizeBoostBayLoadoutState();
            GameState.idleMachines = data.idleMachines || {};
            GameState.idleFactoryTech = data.idleFactoryTech || {};
            GameState.evolutionBoost = data.evolutionBoost || 0;
            GameState.factoryUpgrades = this.sanitizeFactoryUpgrades(data.factoryUpgrades);
            GameState.runBoosts = this.sanitizeRunBoosts(data.runBoosts);
            GameState.boostBayInventory = this.sanitizeBoostBayInventory(data.boostBayInventory);
            this.applyOfflineIdleProgress(data.savedAt);
            return true;
        } catch (e) {
            return false;
        }
    },

    migrate(data) {
        // Version 9 preserves progression, character build picks, and build unlocks.
        GameState.tapioca = data.tapioca || 0;
        GameState.totalTapioca = data.totalTapioca || 0;
        GameState.rage = data.rage || 0;
        GameState.totalRage = data.totalRage || 0;
        GameState.totalEnemiesKilled = data.totalEnemiesKilled || 0;
        GameState.aimMode = data.aimMode === 'manual' ? 'manual' : 'auto';
        GameState.selectedDrink = data.selectedDrink || GameState.selectedDrink || 'classic';
        GameState.selectedGun = data.selectedGun || GameState.selectedGun || 'classic';
        GameState.selectedPet = data.selectedPet || GameState.selectedPet || 'none';
        GameState.selectedCharm = data.selectedCharm || GameState.selectedCharm || 'none';
        GameState.selectedAura = data.selectedAura || GameState.selectedAura || 'none';
        GameState.unlockedDrinks = this.sanitizeBuildUnlocks(data.unlockedDrinks, DRINK_OPTIONS);
        GameState.unlockedGuns = this.sanitizeBuildUnlocks(data.unlockedGuns, GUN_OPTIONS);
        sanitizeBuildState();
        sanitizeBoostBayLoadoutState();
        GameState.idleMachines = data.idleMachines || {};
        GameState.idleFactoryTech = data.idleFactoryTech || {};
        GameState.evolutionBoost = data.evolutionBoost || 0;
        GameState.factoryUpgrades = this.sanitizeFactoryUpgrades(data.factoryUpgrades);
        GameState.runBoosts = this.sanitizeRunBoosts(data.runBoosts);
        GameState.boostBayInventory = this.sanitizeBoostBayInventory(data.boostBayInventory);
        GameState.reset();
        this.applyOfflineIdleProgress(data.savedAt);
        this.save();
        return true;
    },

    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
        GameState.tapioca = 0;
        GameState.totalTapioca = 0;
        GameState.rage = 0;
        GameState.totalRage = 0;
        GameState.totalEnemiesKilled = 0;
        GameState.aimMode = 'auto';
        GameState.selectedDrink = 'classic';
        GameState.selectedGun = 'classic';
        GameState.selectedPet = 'none';
        GameState.selectedCharm = 'none';
        GameState.selectedAura = 'none';
        GameState.unlockedDrinks = { classic: true };
        GameState.unlockedGuns = { classic: true };
        GameState.idleMachines = {};
        GameState.idleFactoryTech = {};
        GameState.evolutionBoost = 0;
        GameState.factoryUpgrades = {};
        GameState.runBoosts = {};
        GameState.boostBayInventory = {};
        GameState.reset();
    },

    sanitizeFactoryUpgrades(factoryUpgrades) {
        const allowedIds = new Set((PERMA_UPGRADES || []).map(upgrade => upgrade.id));
        const sanitized = {};
        Object.entries(factoryUpgrades || {}).forEach(([id, level]) => {
            if (!allowedIds.has(id)) return;
            if (isTemporaryPerRunUpgrade(id)) return;
            sanitized[id] = Math.max(0, level || 0);
        });
        return sanitized;
    },

    sanitizeRunBoosts(runBoosts) {
        const sanitized = {};
        Object.entries(runBoosts || {}).forEach(([id, level]) => {
            if (!isTemporaryPerRunUpgrade(id)) return;
            sanitized[id] = Math.max(0, level || 0);
        });
        return sanitized;
    },

    sanitizeBoostBayInventory(inventory) {
        const sanitized = {};
        const source = inventory || {};
        BOOST_BAY_DATA.forEach(category => {
            const savedCategory = source[category.id] || {};
            sanitized[category.id] = {};
            category.items.forEach(item => {
                const count = Math.max(0, Math.floor(savedCategory[item.name] || 0));
                if (count > 0) sanitized[category.id][item.name] = count;
            });
        });
        return sanitized;
    },

    sanitizeBuildUnlocks(unlocks, options) {
        return sanitizeBuildUnlockMap(unlocks, options);
    },

    applyOfflineIdleProgress(savedAt) {
        const tps = calcIdleMachineTPS();
        if (!savedAt || tps <= 0) return;
        const elapsedMs = Math.max(0, Date.now() - savedAt);
        const offlineGain = tps * (elapsedMs / 1000);
        if (offlineGain <= 0) return;
        GameState.tapioca += offlineGain;
        GameState.totalTapioca += offlineGain;
    }
};

// ============================================
// CHARACTER DEFINITIONS
// ============================================
const CHARACTERS = [
    { name: 'Classic Milk Tea', color: 0x8B4513, speed: 160, damage: 10, fireRate: 300, desc: 'Balanced starter' },
    { name: 'Strawberry Boba', color: 0xff6f9f, speed: 170, damage: 11, fireRate: 320, desc: 'Close-range rush build' },
    { name: 'Matcha Boba', color: 0x27AE60, speed: 145, damage: 9, fireRate: 420, desc: 'Zone control and healing' },
    { name: 'Lychee Boba', color: 0xff5fa2, speed: 165, damage: 10, fireRate: 290, desc: 'Burst accuracy build' },
    { name: 'Tiger Boba', color: 0xffb14f, speed: 168, damage: 12, fireRate: 260, desc: 'Blade-and-pearl burst build' }
];

// IDLE FACTORY TUNING: these machines create tapioca offline, in menus, and now during runs.
const IDLE_MACHINE_TABLE = [
    { id: 'ballRoller', name: 'Ball Roller', desc: 'Steady hand-rolled tapioca', icon: 'BR', baseCost: 10, costScale: 1.20, tps: 0.1, evolutionPts: 1, mutationText: '+1% run speed each' },
    { id: 'ballMaker', name: 'Ball Maker', desc: 'Reliable machine-made pearls', icon: 'BM', baseCost: 50, costScale: 1.15, tps: 1, evolutionPts: 2, mutationText: '+0.5% run damage each' },
    { id: 'megaPress', name: 'Mega Press', desc: 'Bulk pressing line', icon: 'MP', baseCost: 200, costScale: 1.10, tps: 5, evolutionPts: 5, mutationText: '+1% rage per kill each' },
    { id: 'quantumGen', name: 'Quantum Gen', desc: 'Reality-warped generator', icon: 'QG', baseCost: 1000, costScale: 1.20, tps: 10, evolutionPts: 10, mutationText: '-0.1% upgrade costs each' }
];
const IDLE_MACHINE_MUTATION_UNLOCK_LEVEL = 10;

const IDLE_FACTORY_TECH = [
    { id: 'factoryUpgrade', name: 'Factory Upgrade', desc: 'Multiply all machine output by 1.5x', icon: 'F+', baseCost: 100000, costScale: 2.50, evolutionPts: 200, effectText: '1.5x all machine output' },
    { id: 'speedLine', name: 'Speed Line', desc: 'Upgrade Ball Roller efficiency', icon: 'SPD', baseCost: 1000, costScale: 1.30, evolutionPts: 10, effectText: '+10% Ball Roller output' },
    { id: 'moreLabors', name: 'More Labors', desc: 'Upgrade Ball Maker efficiency', icon: 'LAB', baseCost: 5000, costScale: 1.30, evolutionPts: 20, effectText: '+10% Ball Maker output' },
    { id: 'hugePress', name: 'Huge Press', desc: 'Upgrade Mega Press efficiency', icon: 'HUG', baseCost: 20000, costScale: 1.30, evolutionPts: 50, effectText: '+10% Mega Press output' },
    { id: 'tapiocaAtomizer', name: 'Tapioca Atomizer', desc: 'Upgrade Quantum Gen efficiency', icon: 'ATM', baseCost: 1000000, costScale: 1.30, evolutionPts: 100, effectText: '+20% Quantum Gen output' }
];

// ============================================
const PERMA_UPGRADES = [
    { id: 'menuSpeed', branch: 'Small Boosts', name: 'Speed', desc: '+1% run speed per level', icon: 'SPD', baseCost: 1000, costScale: 1.10, maxLevel: 999, effectText: '+1% speed', apply: scene => { scene.playerSpeed += scene.basePlayerSpeed * 0.01; } },
    { id: 'menuDamage', branch: 'Small Boosts', name: 'Damage', desc: '+1% run damage per level', icon: 'DMG', baseCost: 2500, costScale: 1.25, maxLevel: 999, effectText: '+1% damage', apply: scene => { scene.playerDamage += scene.basePlayerDamage * 0.01; } },
    { id: 'menuReload', branch: 'Small Boosts', name: 'Reload Speed', desc: '+1% reload speed per level', icon: 'RLD', baseCost: 1000, costScale: 1.10, maxLevel: 999, effectText: '+1% reload speed', apply: scene => { scene.permaReloadSpeedBonus += 0.01; } },
    { id: 'menuHealth', branch: 'Small Boosts', name: 'Health', desc: '+1 max HP per level', icon: 'HP', baseCost: 5000, costScale: 1.30, maxLevel: 999, effectText: '+1 max HP', apply: () => { GameState.maxHealth += 1; } },
    { id: 'menuAmmo', branch: 'Small Boosts', name: 'Ammo Capacity', desc: '+1 max boba ammo per level', icon: 'AMMO', baseCost: 100000, costScale: 1.25, maxLevel: 999, effectText: '+1 max ammo', apply: scene => { scene.permaMaxAmmoBonus += 1; } },
    { id: 'menuRageBonus', branch: 'Per-Run Boosts', name: 'Rage Bonus', desc: '+2% rage gained per level', icon: 'RAGE', baseCost: 10000, costScale: 1, maxLevel: 999, effectText: '+2% rage', apply: scene => { scene.permaRageBonusPercent += 0.02; } },
    { id: 'menuRunDamage', branch: 'Per-Run Boosts', name: 'Damage Bonus', desc: '+5% run damage per level', icon: 'DMG+', baseCost: 10000, costScale: 1, maxLevel: 999, effectText: '+5% damage', apply: scene => { scene.playerDamage += scene.basePlayerDamage * PER_RUN_DAMAGE_BOOST_PERCENT; } },
    { id: 'menuXpBonus', branch: 'Per-Run Boosts', name: 'XP Bonus', desc: '+5% XP gained per level', icon: 'XP', baseCost: 20000, costScale: 1, maxLevel: 999, effectText: '+5% XP', apply: scene => { scene.permaXpBonusPercent += 0.05; } }
];

const TEMPORARY_PER_RUN_UPGRADE_IDS = new Set(
    PERMA_UPGRADES
        .filter(upgrade => upgrade.branch === 'Per-Run Boosts')
        .map(upgrade => upgrade.id)
);

function isTemporaryPerRunUpgrade(id) {
    return TEMPORARY_PER_RUN_UPGRADE_IDS.has(id);
}

// ============================================
// UPGRADE DEFINITIONS (in-run upgrades — existing)
// ============================================
const UPGRADES = [
    { id: 'shot1', branch: 'shot', tier: 1, name: 'Extra Tapioca', desc: '+1 shot, -20% damage', icon: '+1', apply: scene => { scene.multiShot += 1; scene.playerDamage *= 0.80; } },
    { id: 'shot2', branch: 'shot', tier: 2, name: 'Tapioca+', desc: '+1 shot, -30% damage', icon: '+1', requires: ['shot1'], apply: scene => { scene.multiShot += 1; scene.playerDamage *= 0.70; } },
    { id: 'shot3', branch: 'shot', tier: 3, name: 'Mostly Boba', desc: '+2 shots', icon: '+2', requires: ['shot2'], apply: scene => { scene.multiShot += 2; } },
    { id: 'shot4', branch: 'shot', tier: 4, name: 'All Boba', desc: '+3 shots', icon: '+3', requires: ['shot3'], apply: scene => { scene.multiShot += 3; } },
    { id: 'shot5', branch: 'shot', tier: 5, name: 'Boba God', desc: 'Shots split when killing enemies', icon: 'SPLIT', requires: ['shot4'], apply: scene => { scene.splitOnKill = true; } },
    { id: 'speed1', branch: 'speed', tier: 1, name: 'Fast Service', desc: '+10% speed', icon: 'SPD', apply: scene => { scene.playerSpeed *= 1.10; } },
    { id: 'speed2', branch: 'speed', tier: 2, name: 'Sugar Rush', desc: '+10% speed', icon: 'SPD', requires: ['speed1'], apply: scene => { scene.playerSpeed *= 1.10; } },
    { id: 'speed3', branch: 'speed', tier: 3, name: 'Sugar Fiend', desc: '+30% speed', icon: 'SPD', requires: ['speed2'], apply: scene => { scene.playerSpeed *= 1.30; } },
    { id: 'speed4', branch: 'speed', tier: 4, name: 'High on Boba', desc: '+20% speed. Speed bonus also boosts damage.', icon: 'SPD', requires: ['speed3'], apply: scene => { scene.playerSpeed *= 1.20; scene.applySpeedDamageBonus(); } },
    { id: 'speed5', branch: 'speed', tier: 5, name: 'Boba God', desc: 'XP gives +100% speed for 3 seconds', icon: 'XP', requires: ['speed4'], apply: scene => { scene.xpSpeedBoostEnabled = true; } },
    { id: 'attack1', branch: 'attack', tier: 1, name: 'Quick Straw', desc: '+25% attack speed', icon: 'AS', apply: scene => { scene.applyAttackSpeedBoost(0.25); } },
    { id: 'attack2', branch: 'attack', tier: 2, name: 'Faster Sips', desc: '+35% attack speed', icon: 'AS+', requires: ['attack1'], apply: scene => { scene.applyAttackSpeedBoost(0.35); } },
    { id: 'attack3', branch: 'attack', tier: 3, name: 'Last Pearl Sting', desc: '+50% attack speed. Last ammo deals double damage.', icon: '1x2', requires: ['attack2'], apply: scene => { scene.applyAttackSpeedBoost(0.50); scene.lastAmmoDoubleCount = Math.max(scene.lastAmmoDoubleCount || 0, 1); } },
    { id: 'attack4', branch: 'attack', tier: 4, name: 'Final Two Sting', desc: '+80% attack speed. Last two ammo deal double damage.', icon: '2x2', requires: ['attack3'], apply: scene => { scene.applyAttackSpeedBoost(0.80); scene.lastAmmoDoubleCount = Math.max(scene.lastAmmoDoubleCount || 0, 2); } },
    { id: 'attack5', branch: 'attack', tier: 5, name: 'Combo Straw', desc: 'Each ammo deals double the last shot damage.', icon: '2^N', requires: ['attack4'], apply: scene => { scene.ammoDamageRamp = true; } },
    { id: 'damage1', branch: 'damage', tier: 1, name: 'Big Boba', desc: '+25% damage, +50% boba size', icon: 'DMG', apply: scene => { scene.playerDamage *= 1.25; scene.projectileScale *= 1.50; } },
    { id: 'damage2', branch: 'damage', tier: 2, name: 'Huge Tapioca', desc: '+30% damage', icon: 'DMG', requires: ['damage1'], apply: scene => { scene.playerDamage *= 1.30; } },
    { id: 'damage3', branch: 'damage', tier: 3, name: 'Towering Tapioca', desc: '+20% damage, +100% boba size', icon: 'DMG', requires: ['damage2'], apply: scene => { scene.playerDamage *= 1.20; scene.projectileScale *= 2; } },
    { id: 'damage4', branch: 'damage', tier: 4, name: 'Giganticestest Boba', desc: '+60% damage, +50% boba size', icon: 'DMG', requires: ['damage3'], apply: scene => { scene.playerDamage *= 1.60; scene.projectileScale *= 1.50; } },
    { id: 'damage5', branch: 'damage', tier: 5, name: 'Boba Steamroller', desc: 'Boba expands while moving and gains damage with size', icon: 'GROW', requires: ['damage4'], apply: scene => { scene.growingBoba = true; } },
    { id: 'health1', branch: 'health', tier: 1, name: 'Tough Cup', desc: '+25 max HP, heal 25', icon: 'HP', apply: scene => { GameState.maxHealth += 25; GameState.health = Math.min(GameState.maxHealth, GameState.health + 25); scene.updateUI(); } },
    { id: 'health2', branch: 'health', tier: 2, name: 'Insulated Cup', desc: '+50 max HP, heal 50', icon: 'HP', requires: ['health1'], apply: scene => { GameState.maxHealth += 50; GameState.health = Math.min(GameState.maxHealth, GameState.health + 50); scene.updateUI(); } },
    { id: 'health3', branch: 'health', tier: 3, name: 'Denser Sugar', desc: '+15% damage reduction', icon: 'DR', requires: ['health2'], apply: scene => { scene.damageReductionPercent += 0.15; } },
    { id: 'health4', branch: 'health', tier: 4, name: 'Reinforced Tea', desc: '+25% damage reduction', icon: 'DR', requires: ['health3'], apply: scene => { scene.damageReductionPercent += 0.25; } },
    { id: 'health5', branch: 'health', tier: 5, name: 'Hugemongous Cup', desc: '+25% size. Block all damage once every 5 seconds.', icon: 'CUP', requires: ['health4'], apply: scene => { scene.player.setScale(scene.player.scaleX * 1.25); scene.periodicFullBlock = true; } },
    { id: 'pierce1', branch: 'pierce', tier: 1, name: 'Sharp Tapioca', desc: '+1 pierce', icon: 'P', apply: scene => { scene.projectilePierce += 1; } },
    { id: 'pierce2', branch: 'pierce', tier: 2, name: 'Straw too small for the boba', desc: '+1 pierce', icon: 'P', requires: ['pierce1'], apply: scene => { scene.projectilePierce += 1; } },
    { id: 'pierce3', branch: 'pierce', tier: 3, name: 'Carbonated Boba', desc: '+1 pierce, +50% boba speed', icon: 'P', requires: ['pierce2'], apply: scene => { scene.projectilePierce += 1; scene.projectileSpeed *= 1.50; } },
    { id: 'pierce4', branch: 'pierce', tier: 4, name: 'Aerodynamic Tapioca', desc: '+2 pierce, +25% boba speed', icon: 'P', requires: ['pierce3'], apply: scene => { scene.projectilePierce += 2; scene.projectileSpeed *= 1.25; } },
    { id: 'pierce5', branch: 'pierce', tier: 5, name: 'Sharp Boba', desc: 'Damage scales +10% per enemy pierced', icon: 'P+', requires: ['pierce4'], apply: scene => { scene.pierceDamageScale = 0.10; } },
    { id: 'bounce1', branch: 'bounce', tier: 1, name: 'More bouncy', desc: '+1 bounce', icon: 'B', apply: scene => { scene.maxBounces += 1; } },
    { id: 'bounce2', branch: 'bounce', tier: 2, name: 'Basically rubber', desc: '+1 bounce. Damage scales +10% per bounce.', icon: 'B', requires: ['bounce1'], apply: scene => { scene.maxBounces += 1; scene.bounceDamageScale = 0.10; } },
    { id: 'bounce3', branch: 'bounce', tier: 3, name: 'Ok the walls may be rubber too', desc: '+2 bounces', icon: 'B', requires: ['bounce2'], apply: scene => { scene.maxBounces += 2; } },
    { id: 'bounce4', branch: 'bounce', tier: 4, name: 'Everything is bouncy', desc: 'Boba split off walls once for half damage', icon: 'B2', requires: ['bounce3'], apply: scene => { scene.wallSplitCount = 1; } },
    { id: 'bounce5', branch: 'bounce', tier: 5, name: 'Boba God', desc: 'Wall split can happen twice; first split keeps full damage', icon: 'B3', requires: ['bounce4'], apply: scene => { scene.wallSplitCount = 2; scene.wallFullDamageSplits = 1; } }
];

const SPECIAL_UPGRADES = [
    { id: 'specialInfiniteLoop', branch: 'special', tier: 5, name: 'Infinite Loop Core', desc: 'Each attack repeats one half-power pearl after a short delay.', icon: 'LOOP', apply: scene => { scene.infiniteLoopCore = true; } },
    { id: 'specialPulseWave', branch: 'special', tier: 5, name: 'Pulse Wave Generator', desc: 'Shots emit a blue pulse for half damage and slow nearby enemies.', icon: 'WAVE', apply: scene => { scene.pulseWaveGenerator = true; } },
    { id: 'specialRandomizedSpread', branch: 'special', tier: 5, name: 'Randomized Spread Core', desc: 'Double attack speed, but shots gain unpredictable spread.', icon: 'RNG', apply: scene => { scene.randomizedSpreadCore = true; scene.applyAttackSpeedBoost(1); } },
    { id: 'specialBounceCascade', branch: 'special', tier: 5, name: 'Bounce Cascade Engine', desc: 'Piercing shots chain toward the next enemy after each hit.', icon: 'CHAIN', apply: scene => { scene.bounceCascadeEngine = true; } },
    { id: 'specialOrbPet', branch: 'special', tier: 5, name: 'Dash Detonation Core', desc: 'Replaces dash explosions with a small pet that collects orbs.', icon: 'PET', apply: scene => { scene.orbPetEnabled = true; scene.createOrbPet(); } }
];

// UI THEME: these read the CSS variables in index.html, so colors are easy to retheme.
function cssThemeColor(name, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    const match = raw.match(/^#?([0-9a-f]{6})$/i);
    return match ? parseInt(match[1], 16) : parseInt(fallback.replace('#', ''), 16);
}

const BOBA_THEME = {
    ink: cssThemeColor('--boba-bg', '#070b14'),
    plum: 0x17111f,
    glass: cssThemeColor('--boba-panel', '#101827'),
    glassDeep: cssThemeColor('--boba-panel-deep', '#07111d'),
    cream: cssThemeColor('--boba-cream', '#fff4d6'),
    white: 0xfff7e6,
    muted: cssThemeColor('--boba-muted', '#b8c9d8'),
    bobaBrown: 0x5a2d1d,
    caramel: cssThemeColor('--boba-gold', '#ffd86f'),
    lychee: cssThemeColor('--boba-pink', '#ff6fb0'),
    taro: cssThemeColor('--boba-purple', '#c99af7'),
    matcha: cssThemeColor('--boba-green', '#83f28f'),
    aqua: cssThemeColor('--boba-aqua', '#58ddff'),
    danger: cssThemeColor('--boba-danger', '#ff5368')
};

const BRANCH_VISUALS = {
    damage: { accent: BOBA_THEME.lychee, glow: 0x4a1026, label: 'LYCHEE IMPACT' },
    speed: { accent: BOBA_THEME.aqua, glow: 0x063746, label: 'SUGAR RUSH' },
    attack: { accent: BOBA_THEME.aqua, glow: 0x0d3144, label: 'TAPIOCA TEMPO' },
    health: { accent: BOBA_THEME.matcha, glow: 0x123a20, label: 'MATCHA GUARD' },
    pierce: { accent: BOBA_THEME.taro, glow: 0x2b1543, label: 'TARO STRAW' },
    bounce: { accent: BOBA_THEME.caramel, glow: 0x422d08, label: 'CARAMEL RICOCHET' },
    shot: { accent: BOBA_THEME.lychee, glow: 0x3f1426, label: 'PEARL STORM' },
    special: { accent: BOBA_THEME.aqua, glow: 0x0b2a44, label: 'SPECIAL CORE' },
    machine: { accent: BOBA_THEME.caramel, glow: 0x30200a, label: 'SHOP MACHINE' },
    boost: { accent: BOBA_THEME.cream, glow: 0x33240f, label: 'STAMP CARD' },
    runboost: { accent: BOBA_THEME.danger, glow: 0x3d080e, label: 'RUN BOOST' },
    evolution: { accent: BOBA_THEME.taro, glow: 0x2e1749, label: 'NEON EVOLUTION' }
};

const PERMA_STORE_VISUALS = {
    menuSpeed: { theme: 'speed', tag: 'BOOST', icon: 'SPD', assetKey: 'perma_speed_1', main: '+1%', sub: 'Speed per level' },
    menuDamage: { theme: 'damage', tag: 'BOOST', icon: 'DMG', assetKey: 'perma_damage_1', main: '+1%', sub: 'Damage per level' },
    menuReload: { theme: 'speed', tag: 'BOOST', icon: 'RLD', assetKey: 'perma_reload_1', main: '+1%', sub: 'Reload per level' },
    menuHealth: { theme: 'health', tag: 'BOOST', icon: 'HP', assetKey: 'perma_health_1', main: '+1', sub: 'Max HP per level' },
    menuAmmo: { theme: 'machine', tag: 'BOOST', icon: 'AMMO', main: '+1', sub: 'Ammo per level' },
    menuRageBonus: { theme: 'runboost', tag: 'RUN BOOST', icon: 'RAGE', assetKey: 'temp_rage_2', main: '+2%', sub: 'Rage gain' },
    menuRunDamage: { theme: 'damage', tag: 'RUN BOOST', icon: 'DMG', assetKey: 'temp_damage_5', main: '+5%', sub: 'Run damage' },
    menuXpBonus: { theme: 'speed', tag: 'RUN BOOST', icon: 'XP', assetKey: 'temp_xp_5', main: '+5%', sub: 'XP gain' }
};

const BOOST_BAY_DATA = [
    {
        id: 'pets',
        title: 'PETS',
        icon: 'PET',
        color: BOBA_THEME.matcha,
        subtitle: 'Companions that act on their own',
        items: [
            { name: 'Tapioca Slime', text: 'Follows enemies, explodes for 50 damage, leaves sticky slowing puddles, then respawns.', assetKey: 'boost_pet_0' },
            { name: 'Lychee Drone', text: 'Floats above you and fires 10 damage tracking shots at low-health enemies.', assetKey: 'boost_pet_1' },
            { name: 'Matcha Spirit', text: 'Charges for 3 seconds, then releases a 20 damage beam synced with your attacks.', assetKey: 'boost_pet_2' },
            { name: 'Tiger Cub', text: 'Dashes between enemies and marks targets so they take 1.5x follow-up damage.', assetKey: 'boost_pet_3' },
            { name: 'Sugar Ghost', text: 'Phases through enemies and duplicates your attacks every 3 seconds.', assetKey: 'boost_pet_4' },
            { name: 'Boba Magnet Crab', text: 'Collects drops around the arena and brings them back to you.', assetKey: 'boost_pet_5' }
        ]
    },
    {
        id: 'charms',
        title: 'CHARMS',
        icon: 'CHM',
        color: BOBA_THEME.caramel,
        subtitle: 'Rule-breaking modifiers',
        items: [
            { name: 'Fracture Charm', text: 'Projectiles split once into two 75% damage shards.', assetKey: 'boost_charm_0' },
            { name: 'Reversal Charm', text: 'Some attacks automatically fire backwards.', assetKey: 'boost_charm_1' },
            { name: 'Boomerang Charm', text: '1 in 7 expired shots boomerang back, hit enemies, and refund 1 ammo.', assetKey: 'boost_charm_2' },
            { name: 'Phase Charm', text: 'Attacks have a 50% chance to ignore an enemy and keep piercing.', assetKey: 'boost_charm_3' },
            { name: 'Delay Charm', text: 'Hits explode after a short delay for 10% of shot damage in an area.', assetKey: 'boost_charm_4' },
            { name: 'Combo Charm', text: 'Consecutive hits scale effect strength from 1.0x up to 2.0x.', assetKey: 'boost_charm_5' }
        ]
    },
    {
        id: 'auras',
        title: 'AURAS',
        icon: 'AUR',
        color: BOBA_THEME.lychee,
        subtitle: 'Constant area effects around the player',
        items: [
            { name: 'Gravity Aura', text: 'Slowly pulls enemies toward you.', assetKey: 'boost_aura_0' },
            { name: 'Pulse Aura', text: 'Emits shockwaves every few seconds that knock back and deal 10 damage.', assetKey: 'boost_aura_1' },
            { name: 'Freeze Aura', text: 'Nearby enemies slow and can freeze over time.', assetKey: 'boost_aura_2' },
            { name: 'Burn Aura', text: 'Deals 1 damage per second to enemies in range.', assetKey: 'boost_aura_3' },
            { name: 'Mirror Aura', text: 'Occasionally spawns phantom attacks at one-third damage.', assetKey: 'boost_aura_4' },
            { name: 'Chaos Aura', text: 'Each shot has a 1 in 5 chance to trigger a random effect like freeze, burn, slow, split, or lifesteal.', assetKey: 'boost_aura_5' }
        ]
    }
];

const CHEAT_CODE_HASHES = {
    unlockBuilds: 'ffc2e1819d3f8ae929163dd79e162b54d8d3edd26411941ca12c92cd4c06ae55',
    unlockBoostBay: '8629c2165fcea3b4be00eae89e37bb76b00563eb55793117fc3a8e629977ddc2',
    resetLeaderboard: '0fadc8fc5bad0ac8f42b16aeb31a957373ff9cd4a9ad82041b793b514e8e1c5f'
};

async function hashCheatCode(value) {
    const normalized = String(value || '').trim().toUpperCase();
    const bytes = new TextEncoder().encode(normalized);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function applyCheatCode(value) {
    const hash = await hashCheatCode(value);
    if (hash === CHEAT_CODE_HASHES.unlockBuilds) {
        DRINK_OPTIONS.forEach(option => { GameState.unlockedDrinks[option.id] = true; });
        GUN_OPTIONS.forEach(option => { GameState.unlockedGuns[option.id] = true; });
        SaveManager.save();
        return { message: 'All characters and weapons unlocked.' };
    }
    if (hash === CHEAT_CODE_HASHES.unlockBoostBay) {
        GameState.boostBayInventory = GameState.boostBayInventory || {};
        BOOST_BAY_DATA.forEach(category => {
            GameState.boostBayInventory[category.id] = GameState.boostBayInventory[category.id] || {};
            category.items.forEach(item => {
                GameState.boostBayInventory[category.id][item.name] = Math.max(1, GameState.boostBayInventory[category.id][item.name] || 0);
            });
        });
        SaveManager.save();
        return { message: 'All Boost Bay prizes unlocked.' };
    }
    if (hash === CHEAT_CODE_HASHES.resetLeaderboard) {
        const result = await window.BobaAuth?.resetLeaderboard?.(String(value || '').trim());
        return { message: result?.remote ? 'Leaderboard reset.' : 'Local leaderboard reset. Remote reset unavailable.' };
    }
    throw new Error('Invalid cheat code.');
}

window.BobaCheats = { applyCheatCode };

function getUpgradeVisualTheme(upgradeOrBranch) {
    const branch = typeof upgradeOrBranch === 'string' ? upgradeOrBranch : upgradeOrBranch?.branch;
    return BRANCH_VISUALS[branch] || BRANCH_VISUALS.boost;
}

function getUpgradePickCount(id) {
    return GameState.selectedUpgrades.filter(upgradeId => upgradeId === id).length;
}

function hasUpgrade(id) {
    return GameState.selectedUpgrades.includes(id);
}

function meetsUpgradeRequirements(upgrade) {
    return !upgrade.requires || upgrade.requires.every(id => hasUpgrade(id));
}

function buildWeightedUpgradeChoices() {
    const weightedPool = [];

    UPGRADES.forEach(upgrade => {
        if (hasUpgrade(upgrade.id)) return;
        if (!meetsUpgradeRequirements(upgrade)) return;

        const weight = Math.max(1, 7 - upgrade.tier);

        for (let i = 0; i < weight; i++) {
            weightedPool.push(upgrade);
        }
    });

    const chosen = [];
    const usedIds = new Set();
    while (chosen.length < 3 && weightedPool.length > 0) {
        const pick = weightedPool[Phaser.Math.Between(0, weightedPool.length - 1)];
        if (!usedIds.has(pick.id)) {
            chosen.push(pick);
            usedIds.add(pick.id);
        }
        for (let i = weightedPool.length - 1; i >= 0; i--) {
            if (weightedPool[i].id === pick.id) {
                weightedPool.splice(i, 1);
            }
        }
    }

    return chosen;
}

function buildSpecialUpgradeChoices() {
    if (!SPECIAL_DRAFT_ENABLED) return [];
    const pool = SPECIAL_UPGRADES.filter(upgrade => !hasUpgrade(upgrade.id));
    const chosen = [];
    while (chosen.length < 3 && pool.length > 0) {
        const index = Phaser.Math.Between(0, pool.length - 1);
        chosen.push(pool.splice(index, 1)[0]);
    }
    return chosen;
}

function calcIdleMachineTPS() {
    let tps = 0;
    IDLE_MACHINE_TABLE.forEach(machine => {
        const level = GameState.idleMachines?.[machine.id] || 0;
        tps += getIdleMachineOutput(machine) * level;
    });
    return tps;
}

function getRagePerKill(scene) {
    const megaPressBonus = 1 + (getUnlockedIdleMutationLevel('megaPress') * 0.01);
    const menuRageBonus = 1 + (scene?.permaRageBonusPercent || 0);
    if (GameState.wave === 1) {
        return Math.max(1, Math.floor((10 + ((scene?.permaEarlyWaveRageBonus || 0))) * megaPressBonus * menuRageBonus));
    }
    const earlyWaveBonus = GameState.wave <= 3 ? (scene?.permaEarlyWaveRageBonus || 0) : 0;
    return Math.max(1, Math.floor((1 + Math.floor((GameState.wave - 1) / 2) + earlyWaveBonus) * megaPressBonus * menuRageBonus));
}

function getTcPerKill() {
    return 1 + Math.floor((GameState.wave - 1) / 3);
}

function getEnemyWaveScale(wave, growth = 0.13) {
    return Math.pow(1 + growth, Math.max(0, wave - 1));
}

function getEnemyMaxHpForWave(wave) {
    const safeWave = Math.max(1, wave);
    return Math.floor(ENEMY_BASE_HEALTH * getEnemyWaveScale(safeWave, 0.14) + ((safeWave - 1) * 3));
}

function getXpPerKill(scene) {
    return Math.max(1, Math.floor(20 * (1 + (scene?.permaXpBonusPercent || 0))));
}

function getIdleMachineCost(machine) {
    const level = GameState.idleMachines?.[machine.id] || 0;
    return Math.floor(machine.baseCost * Math.pow(machine.costScale, level));
}

function getIdleTech(id) {
    return IDLE_FACTORY_TECH.find(tech => tech.id === id);
}

function getIdleTechLevel(id) {
    return GameState.idleFactoryTech?.[id] || 0;
}

function getQuantumCostReduction() {
    return Math.min(0.75, getUnlockedIdleMutationLevel('quantumGen') * 0.001);
}

function getUnlockedIdleMutationLevel(machineId) {
    const level = GameState.idleMachines?.[machineId] || 0;
    return level >= IDLE_MACHINE_MUTATION_UNLOCK_LEVEL ? level : 0;
}

function isIdleMutationUnlocked(machineId) {
    return getUnlockedIdleMutationLevel(machineId) > 0;
}

function getIdleTechCost(tech) {
    const level = getIdleTechLevel(tech.id);
    const rawCost = tech.baseCost * Math.pow(tech.costScale, level);
    return Math.max(1, Math.floor(rawCost * (1 - getQuantumCostReduction())));
}

function getIdleMachineOutput(machine) {
    let output = machine.tps;
    output *= 1 + (GameState.evolutionBoost || 0);

    if (machine.id === 'ballRoller') {
        output *= 1 + (getIdleTechLevel('speedLine') * 0.10);
    } else if (machine.id === 'ballMaker') {
        output *= 1 + (getIdleTechLevel('moreLabors') * 0.10);
    } else if (machine.id === 'megaPress') {
        output *= 1 + (getIdleTechLevel('hugePress') * 0.10);
    } else if (machine.id === 'quantumGen') {
        output *= 1 + (getIdleTechLevel('tapiocaAtomizer') * 0.20);
    }

    output *= Math.pow(1.5, getIdleTechLevel('factoryUpgrade'));
    return output;
}

function calcEvolutionPoints() {
    let points = 0;
    IDLE_MACHINE_TABLE.forEach(machine => {
        points += (GameState.idleMachines?.[machine.id] || 0) * machine.evolutionPts;
    });
    IDLE_FACTORY_TECH.forEach(tech => {
        points += getIdleTechLevel(tech.id) * tech.evolutionPts;
    });
    return points;
}

function getEvolutionPercentGain() {
    return calcEvolutionPoints() / 1000;
}

function getRunUpgradeCost(upgrade) {
    const picks = getUpgradePickCount(upgrade.id);
    const baseCost = upgrade.requires ? 5 + (picks * 2) : 3 + picks;
    return Math.max(1, Math.floor(baseCost * (1 - getQuantumCostReduction())));
}

function getPermaUpgrade(id) {
    return PERMA_UPGRADES.find(upgrade => upgrade.id === id);
}

function getPermaUpgradeLevel(id) {
    if (isTemporaryPerRunUpgrade(id)) {
        return GameState.runBoosts?.[id] || 0;
    }
    return GameState.factoryUpgrades[id] || 0;
}

function getPermaUpgradeCost(upgrade) {
    const level = getPermaUpgradeLevel(upgrade.id);
    const baseCost = upgrade.baseCost || 0;
    const costScale = isTemporaryPerRunUpgrade(upgrade.id) ? 1 : (upgrade.costScale || 1);
    const discount = 1 - getQuantumCostReduction();
    return Math.max(1, Math.floor(baseCost * Math.pow(costScale, level) * discount));
}

function meetsPermaRequirements(upgrade) {
    return !upgrade.requires || upgrade.requires.every(id => getPermaUpgradeLevel(id) > 0);
}

function canBuyPermaUpgrade(upgrade) {
    return getPermaUpgradeLevel(upgrade.id) < upgrade.maxLevel
        && meetsPermaRequirements(upgrade)
        && GameState.tapioca >= getPermaUpgradeCost(upgrade);
}

function getReadableUpgradeStatus(upgrade) {
    return `Lvl ${getPermaUpgradeLevel(upgrade.id)}`;
}

function resetRunOnlyProgress() {
    GameState.reset();
    GameState.runBoosts = {};
}

function resetCanvasInput(scene) {
    const canvas = scene.game?.canvas;
    if (!canvas) return;
    canvas.style.pointerEvents = '';
    canvas.style.cursor = '';
}

function getReadableFontSize(fontSize) {
    const size = Number.parseFloat(String(fontSize || ''));
    if (!Number.isFinite(size)) return fontSize;
    if (size <= 8) return '10px';
    if (size <= 10) return '11px';
    if (size <= 12) return `${size + 1}px`;
    return fontSize;
}

function installReadableText(scene) {
    if (!scene?.add?.text || scene.__bobaReadableTextInstalled) return;
    scene.__bobaReadableTextInstalled = true;
    const originalText = scene.add.text.bind(scene.add);
    scene.add.text = (x, y, text, style = {}) => {
        const sourceStyle = style && typeof style === 'object' ? style : {};
        const nextStyle = {
            fontFamily: sourceStyle.fontFamily || 'Arial Black',
            ...sourceStyle
        };
        nextStyle.fontSize = getReadableFontSize(nextStyle.fontSize);
        if (nextStyle.stroke === undefined && nextStyle.strokeThickness === undefined) {
            nextStyle.stroke = '#06101a';
            const size = Number.parseFloat(String(nextStyle.fontSize || '12'));
            nextStyle.strokeThickness = size >= 24 ? 6 : size >= 16 ? 4 : 3;
        }
        const node = originalText(x, y, text, nextStyle);
        node.setResolution?.(2);
        if (!sourceStyle.shadow) {
            node.setShadow?.(1, 2, 'rgba(0,0,0,0.62)', 0, true, true);
        }
        return node;
    };
}

const RUN_SCENE_KEYS = ['GameScene', 'PauseScene', 'UpgradeScene', 'FactoryScene', 'GameOverScene'];

function resetRunUiState(scene) {
    installReadableText(scene);
    globalThis.__bobaSceneTransitioning = false;
    resetCanvasInput(scene);
    GameState.paused = false;
    GameState.upgradeSceneActive = false;
    if (scene.input) {
        scene.input.enabled = true;
    }
    if (scene.input?.manager) {
        scene.input.manager.enabled = true;
    }
}

function resumeGameSceneFromOverlay(scene) {
    const gameScene = scene.scene.get('GameScene');
    resetCanvasInput(scene);
    GameState.paused = false;
    GameState.upgradeSceneActive = false;

    if (gameScene) {
        if (gameScene.input) {
            gameScene.input.enabled = true;
        }
        if (gameScene.physics?.world) {
            gameScene.physics.resume();
        }
        if (typeof gameScene.syncAimInputMode === 'function') {
            gameScene.syncAimInputMode();
        }
        if (typeof gameScene.updateUI === 'function') {
            gameScene.updateUI();
        }
    }

    scene.scene.resume('GameScene');
}

function requestGameSceneSwitchFromOverlay(scene, targetKey, resetRun = true) {
    globalThis.__bobaSceneTransitioning = false;
    forceSceneTransition(scene, targetKey, resetRun);
}

function forceSceneTransition(scene, targetKey, resetRun = true) {
    const sceneManager = scene.game?.scene || scene.scene?.manager;
    if (!sceneManager || globalThis.__bobaSceneTransitioning) return;

    globalThis.__bobaSceneTransitioning = true;
    resetCanvasInput(scene);
    GameState.paused = false;
    GameState.upgradeSceneActive = false;

    if (scene.input?.manager) {
        scene.input.manager.enabled = true;
    }
    if (resetRun) {
        GameState.reset();
    }
    SaveManager.save();

    globalThis.setTimeout(() => {
        try {
            const menuSideScenes = ['ControlsScene', 'IdleFactoryScene', 'PermaUpgradeScene', 'LeaderboardScene', 'MultiplayerScene'];
            const scenesToStop = new Set([...RUN_SCENE_KEYS, ...menuSideScenes]);
            if (targetKey === 'MenuScene') {
                scenesToStop.add('MenuScene');
            }
            if (targetKey === 'GameScene') {
                scenesToStop.add('GameScene');
            }

            scenesToStop.forEach(sceneKey => {
                if (sceneKey !== targetKey || targetKey === 'MenuScene' || targetKey === 'GameScene') {
                    sceneManager.stop(sceneKey);
                }
            });
            sceneManager.start(targetKey);
        } finally {
            globalThis.__bobaSceneTransitioning = false;
        }
    }, 0);
}

function hardSwitchScene(scene, targetKey) {
    if (!scene || scene.cleanSceneStartPending) return;
    scene.cleanSceneStartPending = true;
    const currentKey = scene.sys?.settings?.key;
    resetRunUiState(scene);

    const scenePlugin = scene.scene;
    if (!scenePlugin) return;

    RUN_SCENE_KEYS.forEach(sceneKey => {
        if (sceneKey !== targetKey && sceneKey !== currentKey) {
            scenePlugin.stop(sceneKey);
        }
    });
    if (targetKey === 'GameScene' && currentKey !== 'GameScene') {
        scenePlugin.stop('GameScene');
    }

    if (targetKey === 'MenuScene') {
        if (currentKey !== 'ControlsScene') scenePlugin.stop('ControlsScene');
        if (currentKey !== 'IdleFactoryScene') scenePlugin.stop('IdleFactoryScene');
        if (currentKey !== 'PermaUpgradeScene') scenePlugin.stop('PermaUpgradeScene');
        if (currentKey !== 'LeaderboardScene') scenePlugin.stop('LeaderboardScene');
        if (currentKey !== 'MultiplayerScene') scenePlugin.stop('MultiplayerScene');
    }

    scenePlugin.start(targetKey);
    scene.cleanSceneStartPending = false;
}

function startFreshRunFromMenu(scene, keepMultiplayer = false) {
    if (!keepMultiplayer) {
        clearMultiplayerSession();
    }
    sanitizeBuildState();
    const locked = getSelectedBuildLock();
    if (locked) {
        if (typeof scene.showBuildLockedMessage === 'function') {
            scene.showBuildLockedMessage(locked);
        }
        return;
    }
    const selectedDrink = GameState.selectedDrink;
    const selectedGun = GameState.selectedGun;
    GameState.reset();
    GameState.selectedDrink = selectedDrink;
    GameState.selectedGun = selectedGun;
    GameState.selectedCharacter = Math.max(0, DRINK_OPTIONS.findIndex(option => option.id === GameState.selectedDrink));
    hardSwitchScene(scene, 'GameScene');
}

function startFreshRunWithMultiplayer(scene, session) {
    globalThis.BobaMultiplayerSession = session || null;
    startFreshRunFromMenu(scene, true);
}

function clearMultiplayerSession() {
    globalThis.BobaMultiplayerSession = null;
}

function drawSceneBackdrop(scene, accentColor = 0x2b3357) {
    installReadableText(scene);
    scene.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x07070c);
    if (scene.textures.exists('menu_background')) {
        const bg = scene.add.image(GAME_CENTER_X, GAME_CENTER_Y, 'menu_background').setDepth(0);
        const source = scene.textures.get('menu_background').getSourceImage();
        const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
        bg.setScale(scale);
        scene.tweens.add({
            targets: bg,
            scale: scale * 1.018,
            duration: 8500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    scene.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x0b1624, 0.24).setDepth(0.1);
    scene.add.ellipse(230, 96, 420, 210, accentColor, 0.16).setDepth(0.2);
    scene.add.ellipse(GAME_WIDTH - 160, GAME_HEIGHT - 84, 430, 250, 0xffd59b, 0.12).setDepth(0.2);
    const grid = scene.add.graphics();
    grid.setDepth(0.3);
    grid.lineStyle(1, 0x24304c, 0.22);
    for (let x = 0; x < GAME_WIDTH; x += 40) {
        grid.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += 40) {
        grid.lineBetween(0, y, GAME_WIDTH, y);
    }
}

function createPanel(scene, x, y, width, height, fill = BOBA_THEME.glass, stroke = BOBA_THEME.aqua, alpha = 0.96) {
    const panelAlpha = alpha >= 0.9 ? 0.76 : alpha;
    scene.add.rectangle(x + 5, y + 7, width, height, 0x000000, 0.20);
    scene.add.rectangle(x, y, width + 8, height + 8, stroke, 0.13);
    const panel = scene.add.rectangle(x, y, width, height, fill, panelAlpha);
    panel.setStrokeStyle(2, stroke, 0.95);
    scene.add.rectangle(x, y - height / 2 + 7, width - 18, 2, stroke, 0.6);
    scene.add.rectangle(x, y + height / 2 - 7, width - 18, 2, stroke, 0.28);
    const cornerSize = 9;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        scene.add.rectangle(x + sx * (width / 2 - cornerSize), y + sy * (height / 2 - cornerSize), cornerSize, cornerSize, stroke, 0.86);
    });
    return panel;
}

function createNeonPanel(scene, x, y, width, height, theme = BRANCH_VISUALS.boost, alpha = 0.94) {
    scene.add.rectangle(x + 6, y + 8, width, height, 0x000000, 0.36);
    scene.add.rectangle(x, y, width + 14, height + 14, theme.accent, 0.09);
    scene.add.rectangle(x, y, width + 6, height + 6, theme.glow, 0.52);
    const panel = createPanel(scene, x, y, width, height, BOBA_THEME.glass, theme.accent, alpha);
    scene.add.rectangle(x, y - (height / 2) + 18, width - 34, 1, BOBA_THEME.white, 0.22);
    scene.add.rectangle(x - width / 2 + 12, y, 2, height - 32, theme.accent, 0.28);
    return panel;
}

function addFlavorBadge(scene, x, y, text, theme, width = 116) {
    const badge = scene.add.rectangle(x, y, width, 22, theme.glow, 0.95).setStrokeStyle(2, theme.accent, 0.9);
    scene.add.rectangle(x, y - 8, width - 14, 1, BOBA_THEME.white, 0.34);
    const label = scene.add.text(x, y, text, {
        fontSize: '10px',
        fill: '#fff7e6',
        fontFamily: 'Arial Black',
        align: 'center'
    }).setOrigin(0.5);
    return { badge, label };
}

function createPermanentStoreCard(scene, x, y, upgrade, width, height) {
    const visual = PERMA_STORE_VISUALS[upgrade.id] || {
        theme: isTemporaryPerRunUpgrade(upgrade.id) ? 'runboost' : 'boost',
        tag: isTemporaryPerRunUpgrade(upgrade.id) ? 'RUN BOOST' : 'BOOST',
        icon: upgrade.icon,
        main: upgrade.effectText,
        sub: 'per level'
    };
    const theme = getUpgradeVisualTheme(visual.theme);
    const container = scene.add.container(x, y);
    const g = scene.add.graphics();
    const left = -width / 2;
    const top = -height / 2;
    const useCardArt = visual.assetKey && scene.textures.exists(visual.assetKey);

    if (useCardArt) {
        const cardArt = scene.add.image(0, 0, visual.assetKey)
            .setDisplaySize(width, height);
        const level = scene.add.text(0, top + height - 15, '', {
            fontSize: '10px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        container.add([cardArt, level]);
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });
        container.levelText = level;
        return container;
    }

    g.fillStyle(0x07090f, 0.98);
    g.fillRoundedRect(left, top, width, height, 6);
    g.lineStyle(3, theme.accent, 1);
    g.strokeRoundedRect(left + 1, top + 1, width - 2, height - 2, 6);
    g.fillStyle(theme.glow, 0.96);
    g.fillRoundedRect(left + 8, top + 8, width - 16, 28, 4);
    g.lineStyle(1, BOBA_THEME.caramel, 0.72);
    g.strokeRoundedRect(left + 8, top + 8, width - 16, 28, 4);
    g.fillStyle(theme.accent, 0.16);
    g.fillCircle(0, top + 92, 42);
    g.lineStyle(2, theme.accent, 0.62);
    g.strokeCircle(0, top + 92, 42);
    g.fillStyle(BOBA_THEME.glassDeep, 0.98);
    g.fillRoundedRect(left + 12, top + 142, width - 24, 32, 5);
    g.lineStyle(1, theme.accent, 0.42);
    g.strokeRoundedRect(left + 12, top + 142, width - 24, 32, 5);

    const tag = scene.add.text(0, top + 22, visual.tag, {
        fontSize: '12px',
        fill: '#ffe7b3',
        fontFamily: 'Arial Black',
        align: 'center'
    }).setOrigin(0.5);
    const name = scene.add.text(0, top + 54, upgrade.name, {
        fontSize: upgrade.name.length > 13 ? '13px' : '15px',
        fill: '#fff7e6',
        fontFamily: 'Arial Black',
        align: 'center',
        wordWrap: { width: width - 18, useAdvancedWrap: true }
    }).setOrigin(0.5);
    const icon = scene.add.text(0, top + 92, visual.icon, {
        fontSize: visual.icon.length > 3 ? '20px' : '27px',
        fill: '#fff7e6',
        fontFamily: 'Arial Black',
        align: 'center'
    }).setOrigin(0.5);
    const main = scene.add.text(0, top + 128, visual.main, {
        fontSize: '24px',
        fill: '#f6b84b',
        fontFamily: 'Arial Black',
        align: 'center'
    }).setOrigin(0.5);
    const sub = scene.add.text(0, top + 158, visual.sub, {
        fontSize: '11px',
        fill: '#fff7e6',
        fontFamily: 'Arial Black',
        align: 'center',
        wordWrap: { width: width - 26, useAdvancedWrap: true }
    }).setOrigin(0.5);
    const level = scene.add.text(0, top + height - 20, '', {
        fontSize: '10px',
        fill: '#b8afa3',
        fontFamily: 'Arial Black',
        align: 'center'
    }).setOrigin(0.5);

    container.add([g, tag, name, icon, main, sub, level]);
    container.setSize(width, height);
    container.setInteractive({ useHandCursor: true });
    container.levelText = level;
    return container;
}

function getImageSource(path) {
    if (globalThis.BOBA_EMBEDDED_ASSETS?.[path]) {
        return globalThis.BOBA_EMBEDDED_ASSETS[path];
    }
    const movedAssetFallbacks = {
        'assets/Player/Lychee Player.png': 'assets/Lychee Player.png',
        'assets/Player/Lychee Shotgun.png': 'assets/Lychee Shotgun.png',
        'assets/Player/Lychee Projectile.png': 'assets/Lychee Projectile.png'
    };
    const fallbackPath = movedAssetFallbacks[path];
    if (fallbackPath && globalThis.BOBA_EMBEDDED_ASSETS?.[fallbackPath]) {
        return globalThis.BOBA_EMBEDDED_ASSETS[fallbackPath];
    }
    return path;
}

function hasEmbeddedAssets() {
    return !!globalThis.BOBA_EMBEDDED_ASSETS;
}

function setBootStatus(message) {
    const bootStatus = document.getElementById('boot-status');
    if (bootStatus) {
        bootStatus.textContent = message;
    }
}

const BOOT_IMAGE_ASSETS = [
    { key: 'menu_background', path: 'assets/Background.png' },
    { key: 'battle_background', path: 'assets/battle background.png' },
    { key: 'player_boba', path: 'assets/Player/Player/player-boba.png' },
    { key: 'boba_gun', path: 'assets/Player/Gun/boba-gun.png' },
    { key: 'projectile_boba', path: 'assets/projectile-boba.png' },
    { key: 'strawberry_player', path: 'assets/Player/Player/Strawberry Player.png' },
    { key: 'strawberry_gun', path: 'assets/Player/Gun/Strawberry Gun.png' },
    { key: 'strawberry_projectile', path: 'assets/Player/Bullet/Strawberry projectile.png' },
    { key: 'matcha_player', path: 'assets/Player/Player/Matcha Player.png' },
    { key: 'matcha_gun', path: 'assets/Player/Gun/Matcha Gun.png' },
    { key: 'matcha_projectile', path: 'assets/Player/Bullet/Matcha Projectile.png' },
    { key: 'lychee_player', path: 'assets/Player/Player/Lychee Player.png' },
    { key: 'lychee_shotgun', path: 'assets/Player/Gun/Lychee Shotgun.png' },
    { key: 'lychee_projectile', path: 'assets/Player/Bullet/Lychee Projectile.png' },
    { key: 'tiger_player', path: 'assets/Player/Player/tiger-player.png' },
    { key: 'tiger_gun', path: 'assets/Player/Gun/Tiger-gun.png' },
    { key: 'tiger_projectile', path: 'assets/Player/Bullet/Tiger-projectile.png' },
    { key: 'enemy_run_1', path: 'assets/Enemy/run-1.png' },
    { key: 'enemy_run_2', path: 'assets/Enemy/run-2.png' },
    { key: 'enemy_attack_1', path: 'assets/Enemy/attack-1.png' },
    { key: 'thrower_run_1', path: 'assets/ThrowerAssets/Throwerrun1.png' },
    { key: 'thrower_run_2', path: 'assets/ThrowerAssets/throwerrun2.png' },
    { key: 'thrower_throw', path: 'assets/ThrowerAssets/throwerthrow.png' },
    { key: 'thrower_projectile', path: 'assets/ThrowerAssets/projectile.png' },
    { key: 'factory-ingame', path: 'assets/factory-ingame.png' },
    { key: 'upgrade-shot', path: 'assets/Boba_Upgrades/upgrade-shot.png' },
    { key: 'upgrade-speed', path: 'assets/Boba_Upgrades/upgrade-speed.png' },
    { key: 'upgrade-damage', path: 'assets/Boba_Upgrades/upgrade-damage.png' },
    { key: 'upgrade-health', path: 'assets/Boba_Upgrades/upgrade-health.png' },
    { key: 'upgrade-pierce', path: 'assets/Boba_Upgrades/upgrade-pierce.png' },
    { key: 'upgrade-bounce', path: 'assets/Boba_Upgrades/upgrade-bounce.png' },
    { key: 'perma_damage_1', path: 'assets/Perma and Temp Upgrades/Damage 1% permanant.png' },
    { key: 'temp_damage_5', path: 'assets/Perma and Temp Upgrades/Damage 5% Temporary.png' },
    { key: 'perma_health_1', path: 'assets/Perma and Temp Upgrades/Health 1% Permanant.png' },
    { key: 'perma_reload_1', path: 'assets/Perma and Temp Upgrades/Reload Speed 1% permanant.png' },
    { key: 'perma_speed_1', path: 'assets/Perma and Temp Upgrades/Speed 1% Permanant.png' },
    { key: 'temp_rage_2', path: 'assets/Perma and Temp Upgrades/Rage.png' },
    { key: 'temp_xp_5', path: 'assets/Perma and Temp Upgrades/XP.png' },
    { key: 'boost_pet_0', path: 'assets/Pet/tile000.png' },
    { key: 'boost_pet_1', path: 'assets/Pet/tile001.png' },
    { key: 'boost_pet_2', path: 'assets/Pet/tile002.png' },
    { key: 'boost_pet_3', path: 'assets/Pet/tile004.png' },
    { key: 'boost_pet_4', path: 'assets/Pet/tile005.png' },
    { key: 'boost_pet_5', path: 'assets/Pet/tile006.png' },
    { key: 'boost_charm_0', path: 'assets/Charms/tile000.png' },
    { key: 'boost_charm_1', path: 'assets/Charms/tile001.png' },
    { key: 'boost_charm_2', path: 'assets/Charms/tile002.png' },
    { key: 'boost_charm_3', path: 'assets/Charms/tile004.png' },
    { key: 'boost_charm_4', path: 'assets/Charms/tile005.png' },
    { key: 'boost_charm_5', path: 'assets/Charms/tile006.png' },
    { key: 'boost_aura_0', path: 'assets/Aura/tile000.png' },
    { key: 'boost_aura_1', path: 'assets/Aura/tile001.png' },
    { key: 'boost_aura_2', path: 'assets/Aura/tile002.png' },
    { key: 'boost_aura_3', path: 'assets/Aura/tile004.png' },
    { key: 'boost_aura_4', path: 'assets/Aura/tile005.png' },
    { key: 'boost_aura_5', path: 'assets/Aura/tile006.png' }
];

// ============================================
// BOOT SCENE
// ============================================
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        if (hasEmbeddedAssets()) return;

        // Load all shared assets here — Phaser waits for this to complete before calling create()
        this.load.on('loaderror', file => {
            setBootStatus(`FAILED TO LOAD ASSET: ${file?.src || file?.url || 'UNKNOWN'}`);
        });
        BOOT_IMAGE_ASSETS.forEach(asset => this.load.image(asset.key, asset.path));
    }

    create() {
        if (hasEmbeddedAssets()) {
            this.loadEmbeddedImages()
                .then(() => this.finishBoot())
                .catch(error => {
                    console.error(error);
                    setBootStatus(`ASSET ERROR: ${error.message || error}`);
                });
            return;
        }

        this.finishBoot();
    }

    async loadEmbeddedImages() {
        setBootStatus(`DECODING EMBEDDED ASSETS 0/${BOOT_IMAGE_ASSETS.length}`);

        for (let i = 0; i < BOOT_IMAGE_ASSETS.length; i++) {
            const asset = BOOT_IMAGE_ASSETS[i];
            if (this.textures.exists(asset.key)) {
                setBootStatus(`DECODING EMBEDDED ASSETS ${i + 1}/${BOOT_IMAGE_ASSETS.length}`);
                continue;
            }

            await new Promise((resolve, reject) => {
                const source = getImageSource(asset.path);
                if (!source) {
                    reject(new Error(`Missing asset ${asset.path}`));
                    return;
                }

                const image = new Image();
                image.onload = () => {
                    if (!this.textures.exists(asset.key)) {
                        this.textures.addImage(asset.key, image);
                    }
                    setBootStatus(`DECODING EMBEDDED ASSETS ${i + 1}/${BOOT_IMAGE_ASSETS.length}`);
                    resolve();
                };
                image.onerror = () => reject(new Error(`Could not decode embedded asset ${asset.path}`));
                image.src = source;
            });
        }
    }

    finishBoot() {
        // All file-based images are ready, now generate procedural textures
        this.createTextures();
        this.createLycheeUiTextures();
        this.anims.create({
            key: 'enemy_run',
            frames: [
                { key: 'enemy_run_1' },
                { key: 'enemy_run_2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_attack',
            frames: [
                { key: 'enemy_attack_1' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'thrower_run',
            frames: [
                { key: 'thrower_run_1' },
                { key: 'thrower_run_2' }
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'thrower_attack',
            frames: [
                { key: 'thrower_throw' }
            ],
            frameRate: 8,
            repeat: 0
        });
        SaveManager.load();
        SaveManager.save();
        document.getElementById('boot-status')?.remove();
        const bootIntent = sessionStorage.getItem('boba_boot_intent');
        sessionStorage.removeItem('boba_boot_intent');
        if (bootIntent === 'play-again') {
            GameState.reset();
            SaveManager.save();
            this.scene.start('GameScene');
        } else {
            this.scene.start('MenuScene');
        }
    }

    createLycheeUiTextures() {
        this.createCleanImageTexture('lychee_player', 'lychee_player_ui', {
            crop: { x: 520, y: 240, width: 500, height: 520 },
            removeMode: 'black'
        });
        this.createCleanImageTexture('lychee_shotgun', 'lychee_shotgun_ui', {
            crop: { x: 230, y: 70, width: 760, height: 300 },
            removeMode: 'black'
        });
        this.createCleanImageTexture('lychee_projectile', 'lychee_projectile_ui', {
            crop: { x: 130, y: 320, width: 850, height: 470 },
            removeMode: 'neutral'
        });
    }

    createCleanImageTexture(sourceKey, targetKey, options = {}) {
        if (this.textures.exists(targetKey) || !this.textures.exists(sourceKey)) return;
        const source = this.textures.get(sourceKey).getSourceImage();
        if (!source) return;
        const crop = options.crop || { x: 0, y: 0, width: source.width, height: source.height };
        const texture = this.textures.createCanvas(targetKey, crop.width, crop.height);
        const context = texture.getContext();
        context.clearRect(0, 0, crop.width, crop.height);
        context.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

        const imageData = context.getImageData(0, 0, crop.width, crop.height);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const isBlackBg = options.removeMode === 'black' && max < 18;
            const isNeutralBg = options.removeMode === 'neutral' && (max - min) < 36 && r < 205 && g < 205 && b < 205;
            if (isBlackBg || isNeutralBg) {
                pixels[i + 3] = 0;
            }
        }
        context.putImageData(imageData, 0, 0);
        texture.refresh();
    }

    createFileModeFallbackImages() {
        const makeTexture = (key, width, height, draw) => {
            if (this.textures.exists(key)) return;
            const g = this.add.graphics();
            draw(g);
            g.generateTexture(key, width, height);
            g.destroy();
        };

        makeTexture('player_boba', 128, 160, g => {
            g.fillStyle(0x6d3f1d, 1);
            g.fillRoundedRect(22, 38, 84, 102, 12);
            g.fillStyle(0xf4c176, 1);
            g.fillRoundedRect(28, 28, 72, 82, 10);
            g.lineStyle(8, 0xd9edf1, 1);
            g.strokeRoundedRect(24, 28, 80, 110, 10);
            g.fillStyle(0xdff5f8, 1);
            g.fillRect(18, 28, 92, 14);
            g.fillStyle(0x4ea83c, 1);
            g.fillRect(70, 0, 14, 34);
            g.fillStyle(0x111111, 1);
            g.fillCircle(50, 78, 6);
            g.fillCircle(80, 78, 6);
            g.fillCircle(46, 114, 9);
            g.fillCircle(76, 116, 9);
            g.fillCircle(66, 130, 8);
        });

        makeTexture('boba_gun', 420, 160, g => {
            g.fillStyle(0x6b452f, 1);
            g.fillRoundedRect(120, 62, 210, 34, 10);
            g.fillStyle(0xf2d4a7, 1);
            g.fillRoundedRect(88, 52, 88, 52, 12);
            g.fillStyle(0x2d211b, 1);
            g.fillRoundedRect(298, 54, 88, 50, 8);
            g.fillStyle(0xff9cb5, 1);
            g.fillRect(352, 58, 34, 42);
            g.fillStyle(0xd7e6ef, 1);
            g.fillRect(332, 66, 30, 26);
            g.fillStyle(0x4b7d3d, 1);
            g.fillRect(86, 96, 54, 36);
        });

        makeTexture('projectile_boba', 32, 32, g => {
            g.fillStyle(0x1d1010, 1);
            g.fillCircle(16, 16, 12);
            g.fillStyle(0x5b2f10, 1);
            g.fillCircle(12, 11, 4);
        });

        makeTexture('enemy_run_1', 128, 128, g => {
            g.fillStyle(0xa44736, 1);
            g.fillCircle(64, 58, 34);
            g.fillStyle(0x2b1111, 1);
            g.fillCircle(52, 54, 5);
            g.fillCircle(76, 54, 5);
            g.lineStyle(5, 0x2b1111, 1);
            g.lineBetween(46, 84, 34, 108);
            g.lineBetween(82, 84, 96, 108);
        });

        makeTexture('enemy_run_2', 128, 128, g => {
            g.fillStyle(0xbd5a43, 1);
            g.fillCircle(64, 60, 34);
            g.fillStyle(0x2b1111, 1);
            g.fillCircle(52, 56, 5);
            g.fillCircle(76, 56, 5);
            g.lineStyle(5, 0x2b1111, 1);
            g.lineBetween(48, 84, 44, 110);
            g.lineBetween(80, 84, 84, 110);
        });

        makeTexture('enemy_attack_1', 128, 128, g => {
            g.fillStyle(0xdc6a4d, 1);
            g.fillCircle(64, 58, 36);
            g.fillStyle(0x2b1111, 1);
            g.fillCircle(50, 52, 6);
            g.fillCircle(78, 52, 6);
            g.fillRect(48, 76, 32, 8);
        });

        makeTexture('factory-ingame', 420, 240, g => {
            g.fillStyle(0x173621, 1);
            g.fillRect(70, 92, 260, 82);
            g.fillStyle(0xf3d58a, 1);
            g.fillRect(125, 70, 160, 54);
            g.lineStyle(4, 0x3b6f35, 1);
            g.strokeRect(125, 70, 160, 54);
            g.fillStyle(0x1d1d1d, 1);
            g.fillRect(64, 46, 20, 128);
            g.fillRect(96, 24, 18, 150);
            g.fillStyle(0xd8d0bd, 1);
            g.fillRect(44, 112, 40, 62);
            g.fillRect(92, 104, 38, 70);
            g.fillStyle(0x77b65a, 1);
            g.fillRect(134, 88, 140, 10);
            g.fillStyle(0x2e2017, 1);
            g.fillRect(156, 128, 36, 46);
            g.fillRect(214, 132, 64, 24);
            g.fillStyle(0xffffff, 0.8);
            g.fillCircle(102, 18, 16);
            g.fillCircle(124, 12, 11);
            g.fillCircle(142, 8, 8);
        });

        const upgradeColors = {
            'upgrade-shot': 0x7ed2ff,
            'upgrade-speed': 0x7dffa0,
            'upgrade-damage': 0xff9f80,
            'upgrade-health': 0xff7d9d,
            'upgrade-pierce': 0xe6d47a,
            'upgrade-bounce': 0xb08cff
        };
        Object.entries(upgradeColors).forEach(([key, color]) => {
            makeTexture(key, 180, 120, g => {
                g.fillStyle(0x1a2233, 1);
                g.fillRoundedRect(0, 0, 180, 120, 12);
                g.lineStyle(5, color, 1);
                g.strokeRoundedRect(4, 4, 172, 112, 10);
                g.fillStyle(color, 0.32);
                g.fillCircle(90, 60, 34);
                g.fillStyle(0xfff4da, 1);
                g.fillCircle(90, 60, 14);
            });
        });
    }

    createTextures() {
        // Enemy health bar
        const enemyHealthG = this.add.graphics();
        enemyHealthG.fillStyle(BOBA_THEME.glassDeep);
        enemyHealthG.fillRect(0, 0, 30, 4);
        enemyHealthG.generateTexture('enemy_health_bg', 30, 4);
        enemyHealthG.fillStyle(BOBA_THEME.danger);
        enemyHealthG.fillRect(0, 0, 30, 4);
        enemyHealthG.generateTexture('enemy_health_fill', 30, 4);
        enemyHealthG.destroy();

        // Health bar segments
        const healthG = this.add.graphics();
        healthG.fillStyle(0x050914, 1);
        healthG.fillRoundedRect(0, 0, 200, 20, 5);
        healthG.lineStyle(2, BOBA_THEME.danger, 0.75);
        healthG.strokeRoundedRect(1, 1, 198, 18, 5);
        healthG.fillStyle(0xffffff, 0.12);
        healthG.fillRect(8, 4, 184, 3);
        healthG.generateTexture('health_bg', 200, 20);
        healthG.clear();
        healthG.fillStyle(BOBA_THEME.danger);
        healthG.fillRoundedRect(0, 0, 200, 20, 5);
        healthG.fillStyle(0xffffff, 0.22);
        healthG.fillRect(8, 4, 184, 3);
        healthG.generateTexture('health_fill', 200, 20);
        healthG.destroy();

        // XP bar
        const xpG = this.add.graphics();
        xpG.fillStyle(0x050914, 1);
        xpG.fillRoundedRect(0, 0, 200, 12, 4);
        xpG.lineStyle(1, BOBA_THEME.aqua, 0.72);
        xpG.strokeRoundedRect(1, 1, 198, 10, 4);
        xpG.generateTexture('xp_bg', 200, 12);
        xpG.clear();
        xpG.fillStyle(BOBA_THEME.aqua);
        xpG.fillRoundedRect(0, 0, 200, 12, 4);
        xpG.fillStyle(0xffffff, 0.26);
        xpG.fillRect(7, 2, 186, 2);
        xpG.generateTexture('xp_fill', 200, 12);
        xpG.destroy();

        const xpOrbG = this.add.graphics();
        xpOrbG.fillStyle(0x73d7ff, 0.35);
        xpOrbG.fillCircle(12, 12, 12);
        xpOrbG.fillStyle(0x7efcff, 1);
        xpOrbG.fillCircle(12, 12, 7);
        xpOrbG.fillStyle(0xffffff, 0.9);
        xpOrbG.fillCircle(9, 8, 3);
        xpOrbG.generateTexture('xp_pickup', 24, 24);
        xpOrbG.destroy();

        const healOrbG = this.add.graphics();
        healOrbG.fillStyle(0x70ff9e, 0.30);
        healOrbG.fillCircle(12, 12, 12);
        healOrbG.fillStyle(0x7cff8a, 1);
        healOrbG.fillCircle(12, 12, 7);
        healOrbG.fillStyle(0xffffff, 0.95);
        healOrbG.fillRect(10, 6, 4, 12);
        healOrbG.fillRect(6, 10, 12, 4);
        healOrbG.generateTexture('heal_pickup', 24, 24);
        healOrbG.destroy();

        // UI elements
        const btnG = this.add.graphics();
        btnG.fillStyle(BOBA_THEME.glass);
        btnG.fillRoundedRect(0, 0, 200, 50, 8);
        btnG.lineStyle(2, BOBA_THEME.caramel, 0.9);
        btnG.strokeRoundedRect(1, 1, 198, 48, 8);
        btnG.generateTexture('btn', 200, 50);
        btnG.clear();
        btnG.fillStyle(0x241923);
        btnG.fillRoundedRect(0, 0, 200, 50, 8);
        btnG.lineStyle(3, BOBA_THEME.aqua, 1);
        btnG.strokeRoundedRect(1, 1, 198, 48, 8);
        btnG.generateTexture('btn_hover', 200, 50);
        btnG.destroy();

        // Upgrade card
        const cardG = this.add.graphics();
        cardG.fillStyle(0x2a2a2a);
        cardG.fillRoundedRect(0, 0, 150, 180, 12);
        cardG.lineStyle(2, 0x555555);
        cardG.strokeRoundedRect(0, 0, 150, 180, 12);
        cardG.generateTexture('upgrade_card', 150, 180);
        cardG.destroy();

        const cardSelG = this.add.graphics();
        cardSelG.fillStyle(0x3a3a1a);
        cardSelG.fillRoundedRect(0, 0, 150, 180, 12);
        cardSelG.lineStyle(3, 0xffd700);
        cardSelG.strokeRoundedRect(0, 0, 150, 180, 12);
        cardSelG.generateTexture('upgrade_card_sel', 150, 180);
        cardSelG.destroy();





    }
}

// ============================================
// MENU SCENE
// ============================================
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        resetRunUiState(this);
        SaveManager.load();

        this.createMenuBackdrop();

        const titleShadow = this.add.text(GAME_CENTER_X + 5, 82 + 6, 'BOBA', {
            fontSize: '76px', fill: '#151016', fontFamily: 'Arial Black',
            stroke: '#151016', strokeThickness: 10
        }).setOrigin(0.5);
        const title = this.add.text(GAME_CENTER_X, 82, 'BOBA', {
            fontSize: '76px', fill: '#fff4d6', fontFamily: 'Arial Black',
            stroke: '#5a2d1d', strokeThickness: 7
        }).setOrigin(0.5);
        const subtitle = this.add.text(GAME_CENTER_X, 146, 'ROGUELIKE', {
            fontSize: '54px', fill: '#83f28f', fontFamily: 'Arial Black',
            stroke: '#102b1c', strokeThickness: 7
        }).setOrigin(0.5);
        this.tweens.add({
            targets: [titleShadow, title, subtitle],
            y: '+=5',
            duration: 2100,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.createMenuStatStrip(GAME_WIDTH - 164, 86);
        this.createMenuActionRail(96, 548);

        this.add.ellipse(GAME_CENTER_X, 618, 280, 58, 0x000000, 0.36).setDepth(1);
        this.add.ellipse(GAME_CENTER_X, 590, 360, 160, BOBA_THEME.caramel, 0.13).setDepth(1);
        this.buildNameText = this.add.text(GAME_CENTER_X, 242, '', {
            fontSize: '18px',
            fill: '#fff4d6',
            align: 'center',
            fontFamily: 'Arial Black',
            stroke: '#17111f',
            strokeThickness: 5,
            wordWrap: { width: 500 }
        }).setOrigin(0.5).setDepth(4);
        this.buildCharacterPreview = this.add.image(GAME_CENTER_X - 72, 458, 'player_boba').setDepth(3);
        this.buildGunPreview = this.add.image(GAME_CENTER_X + 116, 430, 'boba_gun').setDepth(3);
        this.tweens.add({
            targets: [this.buildCharacterPreview, this.buildGunPreview],
            y: '+=10',
            duration: 1350,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.runHintText = this.add.text(GAME_CENTER_X, 690, '', {
            fontSize: '12px',
            fill: '#fff4d6',
            align: 'center',
            fontFamily: 'Courier New',
            stroke: '#000000',
            strokeThickness: 4,
            wordWrap: { width: 520 }
        }).setOrigin(0.5).setDepth(4);

        this.saveTimer = this.time.addEvent({
            delay: 30000,
            callback: () => SaveManager.save(),
            loop: true
        });

        this.idleProductionTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const gain = calcIdleMachineTPS();
                if (gain <= 0) return;
                GameState.tapioca += gain;
                GameState.totalTapioca += gain;
                this.updateDisplays();
            },
            loop: true
        });

        this.events.on('resume', () => this.updateDisplays());
        this.updateDisplays();
    }

    createMenuBackdrop() {
        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x08070b);
        if (this.textures.exists('menu_background')) {
            const bg = this.add.image(GAME_CENTER_X, GAME_CENTER_Y, 'menu_background').setDepth(0);
            const source = this.textures.get('menu_background').getSourceImage();
            const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
            bg.setScale(scale);
            this.tweens.add({
                targets: bg,
                scale: scale * 1.025,
                duration: 9000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x05060a, 0.26).setDepth(0.2);
        this.add.rectangle(GAME_CENTER_X, 88, GAME_WIDTH, 176, 0x000000, 0.22).setDepth(0.3);
        this.add.ellipse(GAME_CENTER_X, 530, 520, 260, 0xffe1a1, 0.16).setDepth(0.4);
        this.add.rectangle(26, GAME_CENTER_Y, 52, GAME_HEIGHT, 0x000000, 0.28).setDepth(0.4);
        this.add.rectangle(GAME_WIDTH - 26, GAME_CENTER_Y, 52, GAME_HEIGHT, 0x000000, 0.28).setDepth(0.4);
    }

    createMenuStatStrip(x, y) {
        this.add.rectangle(x, y, 260, 86, 0x000000, 0.34).setDepth(5);
        this.tapiocaText = this.add.text(x - 112, y - 24, '', { fontSize: '13px', fill: '#fff4d6', fontFamily: 'Arial Black', stroke: '#000', strokeThickness: 4 }).setOrigin(0, 0.5).setDepth(6);
        this.rageBankText = this.add.text(x - 112, y, '', { fontSize: '13px', fill: '#fff4d6', fontFamily: 'Arial Black', stroke: '#000', strokeThickness: 4 }).setOrigin(0, 0.5).setDepth(6);
        this.killText = this.add.text(x - 112, y + 24, '', { fontSize: '13px', fill: '#fff4d6', fontFamily: 'Arial Black', stroke: '#000', strokeThickness: 4 }).setOrigin(0, 0.5).setDepth(6);
    }

    createMenuActionRail(x, y) {
        const actions = [
            { text: 'Start', y: y - 112, cb: () => startFreshRunFromMenu(this), accent: 0xfff4d6 },
            { text: 'Build', y: y - 70, cb: () => this.scene.start('BuildSelectScene'), accent: 0xffd86f },
            { text: 'Multiplayer', y: y - 28, cb: () => this.scene.start('MultiplayerScene'), accent: 0x7cff8a },
            { text: 'Upgrades', y: y + 14, cb: () => this.scene.start('PermaUpgradeScene'), accent: 0x7ed2ff },
            { text: 'Leaderboard', y: y + 56, cb: () => this.scene.start('LeaderboardScene'), accent: 0xc99af7 },
            { text: 'Factory', y: y + 98, cb: () => this.scene.start('IdleFactoryScene'), accent: 0xf0b14b },
            { text: 'Settings', y: y + 140, cb: () => this.scene.launch('ControlsScene'), accent: 0xff6fb0 }
        ];
        actions.forEach(action => this.makeMenuTextButton(x, action.y, action.text, action.cb, action.accent));
    }

    makeMenuTextButton(x, y, text, callback, accent = 0xfff4d6) {
        const bg = this.add.rectangle(x, y, 136, 30, 0x000000, 0.58)
            .setOrigin(0, 0.5)
            .setDepth(5)
            .setInteractive({ useHandCursor: true });
        const label = this.add.text(x + 12, y, text, {
            fontSize: '18px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0, 0.5).setDepth(6);
        const marker = this.add.rectangle(x, y, 4, 22, accent, 0).setOrigin(0, 0.5).setDepth(6);
        const hover = () => {
            bg.setFillStyle(0xfff4d6, 0.92);
            label.setColor('#141016').setStroke('#fff4d6', 0);
            marker.setAlpha(1);
            this.tweens.add({ targets: [bg, label, marker], x: '+=8', duration: 80, ease: 'Sine.easeOut' });
        };
        const out = () => {
            bg.setFillStyle(0x000000, 0.58);
            label.setColor('#fff4d6').setStroke('#000000', 4);
            marker.setAlpha(0);
            this.tweens.add({ targets: bg, x, duration: 80, ease: 'Sine.easeOut' });
            this.tweens.add({ targets: label, x: x + 12, duration: 80, ease: 'Sine.easeOut' });
            this.tweens.add({ targets: marker, x, duration: 80, ease: 'Sine.easeOut' });
        };
        bg.on('pointerover', hover);
        bg.on('pointerout', out);
        bg.on('pointerdown', callback);
        label.setInteractive({ useHandCursor: true });
        label.on('pointerover', hover);
        label.on('pointerout', out);
        label.on('pointerdown', callback);
        return bg;
    }

    makeTopIconButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 92, 38, 0x132a3b, 0.94)
            .setStrokeStyle(2, BOBA_THEME.aqua, 0.72)
            .setInteractive({ useHandCursor: true });
        const label = this.add.text(x, y, text, { fontSize: '11px', fill: '#e8fbff', fontFamily: 'Arial Black' }).setOrigin(0.5);
        btn.on('pointerover', () => {
            btn.setFillStyle(0x1f4560, 0.98).setStrokeStyle(3, BOBA_THEME.caramel, 0.95);
            label.setScale(1.04);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(0x132a3b, 0.94).setStrokeStyle(2, BOBA_THEME.aqua, 0.72);
            label.setScale(1);
        });
        btn.on('pointerdown', () => {
            this.tweens.add({ targets: [btn, label], scaleX: 0.96, scaleY: 0.96, yoyo: true, duration: 60 });
            callback();
        });
        return btn;
    }

    updateDisplays() {
        this.tapiocaText.setText(`TAPIOCA  ${Math.floor(GameState.tapioca)}`);
        this.rageBankText.setText(`RAGE     ${Math.floor(GameState.rage)}`);
        this.killText.setText(`KILLS    ${GameState.totalEnemiesKilled}`);
        this.updateBuildPreview();
        if (this.volumePercent) {
            this.volumePercent.setText(String(Math.floor(GameState.volume * 100)) + '%');
        }
        if (this.aimModeLabel) {
            this.aimModeLabel.setText(GameState.aimMode === 'manual' ? 'MANUAL' : 'AUTO');
        }
    }

    createBuildSelector() {
        this.drinkWheel = this.makeBuildWheel(600, 396, 'CHARACTER', DRINK_OPTIONS, 'drink');
        this.gunWheel = this.makeBuildWheel(600, 520, 'WEAPON', GUN_OPTIONS, 'gun');
    }

    makeBuildWheel(x, y, label, options, type) {
        this.add.text(x, y - 56, label, {
            fontSize: '12px',
            fill: '#baf4ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        const wheel = {
            type,
            options,
            leftPreview: this.add.image(x - 104, y - 4, options[0].playerTexture || options[0].gunTexture).setAlpha(0.35),
            centerPreview: this.add.image(x, y - 8, options[0].playerTexture || options[0].gunTexture),
            rightPreview: this.add.image(x + 104, y - 4, options[0].playerTexture || options[0].gunTexture).setAlpha(0.35),
            nameText: this.add.text(x, y + 48, '', {
                fontSize: '15px',
                fill: '#fff4d6',
                fontFamily: 'Arial Black',
                align: 'center'
            }).setOrigin(0.5),
            descText: this.add.text(x, y + 68, '', {
                fontSize: '11px',
                fill: '#9fb3d9',
                align: 'center',
                wordWrap: { width: 250 }
            }).setOrigin(0.5),
            lockText: this.add.text(x, y + 88, '', {
                fontSize: '11px',
                fill: '#ffd86f',
                align: 'center',
                fontFamily: 'Arial Black',
                wordWrap: { width: 270 }
            }).setOrigin(0.5)
        };
        wheel.buyBg = this.add.rectangle(x, y + 116, 146, 28, 0x3a2b12, 0.96)
            .setStrokeStyle(2, BOBA_THEME.caramel, 0.95);
        wheel.buyText = this.add.text(x, y + 116, '', {
            fontSize: '11px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.circle(x, y - 8, 62, BOBA_THEME.caramel, 0.10).setStrokeStyle(4, BOBA_THEME.caramel, 0.9);
        this.add.circle(x, y - 8, 50, 0x07121d, 0.9).setStrokeStyle(2, BOBA_THEME.aqua, 0.28);
        this.add.circle(x - 104, y - 4, 38, 0x07121d, 0.76).setStrokeStyle(2, BOBA_THEME.aqua, 0.5);
        this.add.circle(x + 104, y - 4, 38, 0x07121d, 0.76).setStrokeStyle(2, BOBA_THEME.aqua, 0.5);
        wheel.leftPreview.setDepth(2);
        wheel.centerPreview.setDepth(2);
        wheel.rightPreview.setDepth(2);
        wheel.nameText.setDepth(2);
        wheel.descText.setDepth(2);
        wheel.lockText.setDepth(2);
        wheel.buyBg.setDepth(2);
        wheel.buyText.setDepth(2);
        wheel.buyBg.setVisible(false).disableInteractive();
        wheel.buyText.setVisible(false);

        const prev = this.add.text(x - 164, y - 6, '<', {
            fontSize: '32px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        const next = this.add.text(x + 164, y - 6, '>', {
            fontSize: '32px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        [prev, next].forEach(arrow => {
            arrow.on('pointerover', () => arrow.setScale(1.14).setColor('#ffd86f'));
            arrow.on('pointerout', () => arrow.setScale(1).setColor('#fff7e6'));
        });
        prev.on('pointerdown', () => {
            this.tweens.add({ targets: prev, x: prev.x - 5, yoyo: true, duration: 55 });
            this.rotateBuildWheel(type, -1);
        });
        next.on('pointerdown', () => {
            this.tweens.add({ targets: next, x: next.x + 5, yoyo: true, duration: 55 });
            this.rotateBuildWheel(type, 1);
        });
        wheel.buyBg.on('pointerdown', () => this.buySelectedBuildOption(type));

        return wheel;
    }

    buySelectedBuildOption(type) {
        const option = type === 'drink' ? getDrinkOption() : getGunOption();
        if (isBuildOptionUnlocked(type, option.id)) return;
        const cost = getBuildOptionUnlockCost(type, option.id);
        if (GameState.tapioca < cost) {
            this.showBuildLockedMessage?.({ type, option, cost });
            return;
        }
        GameState.tapioca -= cost;
        if (type === 'drink') {
            GameState.unlockedDrinks[option.id] = true;
        } else {
            GameState.unlockedGuns[option.id] = true;
        }
        SaveManager.save();
        this.showBuildLockedMessage?.({ type, option, cost: 0, unlocked: true });
        this.updateDisplays();
    }

    rotateBuildWheel(type, direction) {
        const options = type === 'drink' ? DRINK_OPTIONS : GUN_OPTIONS;
        const currentId = type === 'drink' ? GameState.selectedDrink : GameState.selectedGun;
        const currentIndex = Math.max(0, options.findIndex(option => option.id === currentId));
        const nextIndex = Phaser.Math.Wrap(currentIndex + direction, 0, options.length);
        if (type === 'drink') {
            GameState.selectedDrink = options[nextIndex].id;
        } else {
            GameState.selectedGun = options[nextIndex].id;
        }
        sanitizeBuildState();
        SaveManager.save();
        this.updateDisplays();
    }

    updateWheelPreview(wheel) {
        if (!wheel) return;
        const currentId = wheel.type === 'drink' ? GameState.selectedDrink : GameState.selectedGun;
        const index = Math.max(0, wheel.options.findIndex(option => option.id === currentId));
        const current = wheel.options[index];
        const prev = wheel.options[Phaser.Math.Wrap(index - 1, 0, wheel.options.length)];
        const next = wheel.options[Phaser.Math.Wrap(index + 1, 0, wheel.options.length)];
        const textureProp = wheel.type === 'drink' ? 'playerTexture' : 'gunTexture';
        const scaleProp = wheel.type === 'drink' ? 'playerScale' : 'gunScale';
        const baseScale = wheel.type === 'drink' ? 1.35 : 1.22;
        const applyPreview = (image, option, scale, alpha) => {
            const origin = wheel.type === 'drink'
                ? (option.playerOrigin || { x: 0.5, y: 0.5 })
                : { x: 0.5, y: 0.5 };
            image
                .setTexture(option[textureProp])
                .setOrigin(origin.x, origin.y)
                .setScale(option[scaleProp] * scale)
                .setAlpha(alpha)
                .setFlipX(wheel.type === 'gun' && !!option.gunFacesRight);
        };
        applyPreview(wheel.leftPreview, prev, baseScale, 0.36);
        applyPreview(wheel.centerPreview, current, baseScale + 0.28, 1);
        applyPreview(wheel.rightPreview, next, baseScale, 0.36);
        const locked = !isBuildOptionUnlocked(wheel.type, current.id);
        const cost = getBuildOptionUnlockCost(wheel.type, current.id);
        wheel.centerPreview.setAlpha(locked ? 0.42 : 1);
        wheel.nameText.setText(current.name.toUpperCase());
        wheel.descText.setText(current.desc);
        wheel.lockText.setText(locked ? `LOCKED - ${formatTapiocaCost(cost)}` : '').setVisible(locked);
        wheel.buyText.setText(`BUY ${formatTapiocaCost(cost)}`);
        wheel.buyBg.setVisible(locked);
        wheel.buyText.setVisible(locked);
        if (locked) {
            wheel.buyBg.setInteractive({ useHandCursor: true });
        } else {
            wheel.buyBg.disableInteractive();
        }
    }

    createLeaderboardPanel(x, y) {
        this.add.text(x, y - 168, 'LEADERBOARD', {
            fontSize: '18px',
            fill: '#d9c8ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(x - 116, y - 126, 'PLAYER', { fontSize: '10px', fill: '#9fb3d9', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.add.text(x + 44, y - 126, 'SCORE', { fontSize: '10px', fill: '#9fb3d9', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.add.text(x + 110, y - 126, 'KILLS', { fontSize: '10px', fill: '#9fb3d9', fontFamily: 'Arial Black' }).setOrigin(0.5);

        this.leaderboardRows = [];
        for (let i = 0; i < 8; i++) {
            const rowY = y - 98 + (i * 28);
            this.add.rectangle(x, rowY, 248, 22, i % 2 ? 0x121a28 : 0x0c1320, 0.72);
            this.leaderboardRows.push({
                name: this.add.text(x - 118, rowY, '', { fontSize: '12px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0, 0.5),
                score: this.add.text(x + 44, rowY, '', { fontSize: '12px', fill: '#ffd27a' }).setOrigin(0.5),
                kills: this.add.text(x + 110, rowY, '', { fontSize: '12px', fill: '#7ed2ff' }).setOrigin(0.5)
            });
        }

        this.leaderboardStatus = this.add.text(x, y + 146, '', {
            fontSize: '11px',
            fill: '#9fb3d9',
            align: 'center',
            wordWrap: { width: 250 }
        }).setOrigin(0.5);

        this.makeSmallButton(x, y + 176, 'REFRESH', () => this.refreshLeaderboard());
        this.refreshLeaderboard();
    }

    makeSmallButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 118, 30, 0x231b3b, 0.96)
            .setStrokeStyle(2, BOBA_THEME.taro, 0.9)
            .setInteractive({ useHandCursor: true });
        const label = this.add.text(x, y, text, { fontSize: '11px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0.5);
        btn.on('pointerover', () => {
            btn.setFillStyle(0x3a2b63, 0.98).setStrokeStyle(3, BOBA_THEME.caramel, 1);
            label.setScale(1.04);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(0x231b3b, 0.96).setStrokeStyle(2, BOBA_THEME.taro, 0.9);
            label.setScale(1);
        });
        btn.on('pointerdown', () => {
            this.tweens.add({ targets: [btn, label], scaleX: 0.95, scaleY: 0.95, yoyo: true, duration: 60 });
            callback();
        });
        return btn;
    }

    refreshLeaderboard() {
        if (!this.leaderboardRows) return;
        this.leaderboardStatus.setText('Loading scores...');
        this.leaderboardRows.forEach(row => {
            row.name.setText('');
            row.score.setText('');
            row.kills.setText('');
        });

        if (!window.BobaAuth?.fetchLeaderboard) {
            this.leaderboardStatus.setText('Leaderboard unavailable.');
            return;
        }

        window.BobaAuth.fetchLeaderboard()
            .then(leaders => {
                if (!leaders.length) {
                    this.leaderboardStatus.setText('No runs posted yet.');
                    return;
                }
                leaders.slice(0, this.leaderboardRows.length).forEach((leader, index) => {
                    const row = this.leaderboardRows[index];
                    row.name.setText(`${index + 1}. ${leader.username}`.slice(0, 18));
                    row.score.setText(String(leader.high_score || 0));
                    row.kills.setText(String(leader.total_kills || 0));
                });
                this.leaderboardStatus.setText('High score first. Total kills breaks ties.');
            })
            .catch(error => {
                this.leaderboardStatus.setText('Could not load leaderboard.');
                console.warn('Leaderboard load failed', error);
            });
    }

    updateBuildPreview() {
        if (!this.buildNameText) return;
        const drink = getDrinkOption();
        const gun = getGunOption();
        const locked = getSelectedBuildLock();
        this.updateWheelPreview(this.drinkWheel);
        this.updateWheelPreview(this.gunWheel);
        this.buildNameText.setText(`${drink.name.toUpperCase()} + ${gun.name.toUpperCase()}`);
        this.runHintText?.setText(
            locked
                ? `${locked.option.name} locked - ${formatTapiocaCost(locked.cost)}`
                : (getBuildSynergyText(drink, gun) || 'Open character select to match a boba and weapon for a synergy.')
        );
        if (this.buildCharacterPreview) {
            const drinkOrigin = drink.playerOrigin || { x: 0.5, y: 0.5 };
            this.buildCharacterPreview
                .setTexture(drink.playerTexture)
                .setOrigin(drinkOrigin.x, drinkOrigin.y)
                .setScale(drink.playerScale * 2.85);
        }
        if (this.buildGunPreview) {
            this.buildGunPreview
                .setTexture(gun.gunTexture)
                .setOrigin(0.5)
                .setScale(gun.gunScale * 2.45)
                .setFlipX(!!gun.gunFacesRight);
        }
        if (this.charPreview) {
            const drinkOrigin = drink.playerOrigin || { x: 0.5, y: 0.5 };
            this.charPreview.setTexture(drink.playerTexture).setOrigin(drinkOrigin.x, drinkOrigin.y).setScale(drink.playerScale * 1.72);
        }
    }

    showBuildLockedMessage(locked) {
        if (!this.runHintText || !locked) return;
        const message = locked.unlocked
            ? `${locked.option.name} unlocked.`
            : `${locked.option.name} costs ${formatTapiocaCost(locked.cost)}.`;
        this.runHintText.setText(message);
    }

    makeButton(x, y, text, callback, accent = 0x7ed2ff, fill = 0x122438, width = 170) {
        const btn = this.add.rectangle(x, y, width, 48, fill, 0.98)
            .setStrokeStyle(3, accent, 0.98)
            .setInteractive({ useHandCursor: true });
        this.add.rectangle(x, y - 17, width - 20, 2, 0xffffff, 0.18);
        const label = this.add.text(x, y, text, { fontSize: '15px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0.5);

        btn.on('pointerover', () => {
            btn.setFillStyle(fill + 0x101010, 1).setStrokeStyle(4, BOBA_THEME.caramel, 1);
            label.setScale(1.05);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(fill, 0.98).setStrokeStyle(3, accent, 0.98);
            label.setScale(1);
        });
        btn.on('pointerdown', () => {
            this.tweens.add({ targets: [btn, label], scaleX: 0.95, scaleY: 0.95, yoyo: true, duration: 70 });
            callback();
        });

        return btn;
    }
}

// ============================================
// MULTIPLAYER SCENE
// ============================================
class MultiplayerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MultiplayerScene' });
    }

    create() {
        resetRunUiState(this);
        SaveManager.load();
        MenuScene.prototype.createMenuBackdrop.call(this);
        this.room = null;
        this.playerId = null;
        this.statusText = null;

        this.add.text(GAME_CENTER_X, 84, 'MULTIPLAYER', {
            fontSize: '46px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#102b1c',
            strokeThickness: 7
        }).setOrigin(0.5);

        createNeonPanel(this, GAME_CENTER_X, 374, 700, 450, BRANCH_VISUALS.speed, 0.9);
        this.codeText = this.add.text(GAME_CENTER_X, 220, 'NO ROOM YET', {
            fontSize: '34px',
            fill: '#7cff8a',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.playersText = this.add.text(GAME_CENTER_X, 304, 'Create a room, then send the code to your friend.', {
            fontSize: '18px',
            fill: '#fff4d6',
            align: 'center',
            fontFamily: 'Arial Black',
            wordWrap: { width: 560 }
        }).setOrigin(0.5);
        this.statusText = this.add.text(GAME_CENTER_X, 412, 'Room sync uses the online API. If Render is sleeping, give it a few seconds.', {
            fontSize: '13px',
            fill: '#cfe6ff',
            align: 'center',
            wordWrap: { width: 560 }
        }).setOrigin(0.5);

        MenuScene.prototype.makeButton.call(this, 420, 506, 'CREATE ROOM', () => this.createRoom(), 0x7cff8a, 0x12351e, 190);
        MenuScene.prototype.makeButton.call(this, 640, 506, 'JOIN CODE', () => this.joinRoom(), 0x7ed2ff, 0x102f42, 180);
        MenuScene.prototype.makeButton.call(this, 860, 506, 'START RUN', () => this.startRoomRun(), 0xffd86f, 0x3b2c11, 180);
        MenuScene.prototype.makeButton.call(this, 220, 686, 'BACK', () => this.scene.start('MenuScene'), 0x9fb3d9, 0x222a38, 170);

        this.pollTimer = this.time.addEvent({
            delay: 1200,
            callback: () => this.pollRoom(),
            loop: true
        });
        this.events.once('shutdown', () => {
            this.pollTimer?.remove(false);
        });
    }

    async createRoom() {
        this.setStatus('Creating room...');
        try {
            const data = await window.BobaAuth.createMultiplayerRoom();
            this.room = data.room;
            this.playerId = data.playerId;
            this.refreshRoomDisplay();
            this.setStatus('Room ready. Share the code, then press START RUN when both players are here.');
        } catch (error) {
            this.setStatus(error.message || 'Could not create room.', false);
        }
    }

    async joinRoom() {
        const code = window.prompt('Enter room code:');
        if (!code) return;
        this.setStatus('Joining room...');
        try {
            const data = await window.BobaAuth.joinMultiplayerRoom(code);
            this.room = data.room;
            this.playerId = data.playerId;
            this.refreshRoomDisplay();
            this.setStatus('Joined. Press START RUN when ready.');
        } catch (error) {
            this.setStatus(error.message || 'Could not join room.', false);
        }
    }

    async pollRoom() {
        if (!this.room?.code) return;
        try {
            const data = await window.BobaAuth.fetchMultiplayerRoom(this.room.code);
            this.room = data.room;
            this.refreshRoomDisplay();
        } catch (error) {
            this.setStatus('Room poll failed. The room may have expired.', false);
        }
    }

    refreshRoomDisplay() {
        if (!this.room) {
            this.codeText.setText('NO ROOM YET');
            return;
        }
        this.codeText.setText(`ROOM ${this.room.code}`);
        const players = this.room.players || [];
        this.playersText.setText(players.map((player, index) => `${index + 1}. ${player.name || 'Player'}`).join('\n') || 'Waiting for players...');
    }

    setStatus(message, good = true) {
        this.statusText?.setText(message || '');
        this.statusText?.setColor(good ? '#cfe6ff' : '#ff9d9d');
    }

    startRoomRun() {
        if (!this.room?.code || !this.playerId) {
            this.setStatus('Create or join a room first.', false);
            return;
        }
        startFreshRunWithMultiplayer(this, {
            code: this.room.code,
            playerId: this.playerId,
            username: window.BobaAuth?.getUsername?.() || 'Player'
        });
    }
}

// ============================================
// BUILD SELECT SCENE
// ============================================
class BuildSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BuildSelectScene' });
    }

    create() {
        resetRunUiState(this);
        SaveManager.load();
        MenuScene.prototype.createMenuBackdrop.call(this);

        this.add.text(GAME_CENTER_X, 58, 'CHARACTER SELECT', {
            fontSize: '42px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#7a4f15',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 98, 'Pick any boba body and any weapon. Mix builds to find weird combos.', {
            fontSize: '13px',
            fill: '#baf4ff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        createNeonPanel(this, 202, 418, 250, 470, BRANCH_VISUALS.health, 0.93);
        createNeonPanel(this, 600, 418, 470, 470, BRANCH_VISUALS.speed, 0.94);
        createNeonPanel(this, 998, 418, 250, 470, BRANCH_VISUALS.pierce, 0.93);

        this.add.text(202, 206, 'PREVIEW', {
            fontSize: '18px',
            fill: '#74c174',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.previewCharacter = this.add.image(154, 344, 'player_boba').setDepth(2);
        this.previewGun = this.add.image(250, 344, 'boba_gun').setDepth(2);
        this.add.rectangle(202, 344, 190, 190, 0x06140f, 0.75).setStrokeStyle(2, BOBA_THEME.matcha, 0.42);
        this.statsText = this.add.text(202, 510, '', {
            fontSize: '13px',
            fill: '#d9ffee',
            align: 'center',
            lineSpacing: 8,
            wordWrap: { width: 210 }
        }).setOrigin(0.5);

        this.add.text(600, 178, 'BUILD WHEELS', {
            fontSize: '18px',
            fill: '#ffe7aa',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.buildNameText = this.add.text(600, 216, '', {
            fontSize: '16px',
            fill: '#fff4d6',
            align: 'center',
            fontFamily: 'Arial Black',
            wordWrap: { width: 410 }
        }).setOrigin(0.5);
        this.drinkWheel = this.makeBuildWheel(600, 336, 'CHARACTER', DRINK_OPTIONS, 'drink');
        this.gunWheel = this.makeBuildWheel(600, 552, 'WEAPON', GUN_OPTIONS, 'gun');

        this.boostTitleText = this.add.text(998, 206, 'BOOST LOADOUT', {
            fontSize: '18px',
            fill: '#d9c8ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.boostLoadoutSlots = {};
        this.createBoostLoadoutMenu(998, 264, 'PET', 'pets');
        this.createBoostLoadoutMenu(998, 366, 'CHARM', 'charms');
        this.createBoostLoadoutMenu(998, 468, 'AURA', 'auras');

        this.synergyTitleText = this.add.text(998, 552, 'BUILD INFO', {
            fontSize: '14px',
            fill: '#d9c8ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.runHintText = this.add.text(998, 582, '', {
            fontSize: '10px',
            fill: '#d8e8ff',
            align: 'center',
            lineSpacing: 3,
            wordWrap: { width: 210 }
        }).setOrigin(0.5);
        this.abilityText = this.add.text(998, 628, '', {
            fontSize: '10px',
            fill: '#ffd86f',
            align: 'center',
            lineSpacing: 3,
            wordWrap: { width: 210 }
        }).setOrigin(0.5);

        this.makeButton(430, 724, 'BACK', () => this.scene.start('MenuScene'), 0x9fb3d9, 0x222a38, 170);
        this.makeButton(600, 724, 'START GAME', () => startFreshRunFromMenu(this), 0x66c878, 0x153a20, 180);
        this.makeButton(790, 724, 'UPGRADES', () => this.scene.start('PermaUpgradeScene'), 0x5db8e8, 0x102f42, 170);

        this.updateDisplays();
    }

    makeButton(x, y, text, callback, accent, fill, width) {
        return MenuScene.prototype.makeButton.call(this, x, y, text, callback, accent, fill, width);
    }

    makeBuildWheel(x, y, label, options, type) {
        return MenuScene.prototype.makeBuildWheel.call(this, x, y, label, options, type);
    }

    rotateBuildWheel(type, direction) {
        return MenuScene.prototype.rotateBuildWheel.call(this, type, direction);
    }

    updateWheelPreview(wheel) {
        return MenuScene.prototype.updateWheelPreview.call(this, wheel);
    }

    buySelectedBuildOption(type) {
        return MenuScene.prototype.buySelectedBuildOption.call(this, type);
    }

    createBoostLoadoutMenu(x, y, label, categoryId) {
        const category = BOOST_BAY_DATA.find(item => item.id === categoryId) || BOOST_BAY_DATA[0];
        this.add.rectangle(x, y, 218, 88, 0x07121d, 0.46).setStrokeStyle(2, category.color, 0.42);
        this.add.text(x - 94, y - 28, label, {
            fontSize: '10px',
            fill: '#ffd86f',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        const iconFrame = this.add.circle(x - 66, y + 6, 34, category.color, 0.10).setStrokeStyle(2, category.color, 0.82);
        const iconImage = this.add.image(x - 66, y + 6, 'boost_pet_0').setScale(0.28).setVisible(false);
        const iconText = this.add.text(x - 66, y + 6, '', {
            fontSize: '18px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 3
        }).setOrigin(0.5);
        const nameText = this.add.text(x - 22, y - 8, '', {
            fontSize: '10px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            wordWrap: { width: 132 }
        }).setOrigin(0, 0.5);
        const descText = this.add.text(x - 22, y + 18, '', {
            fontSize: '8px',
            fill: '#cfe6ff',
            wordWrap: { width: 132 }
        }).setOrigin(0, 0.5);
        const prev = this.add.text(x - 104, y + 6, '<', {
            fontSize: '22px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        const next = this.add.text(x + 104, y + 6, '>', {
            fontSize: '22px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        [prev, next].forEach(arrow => {
            arrow.on('pointerover', () => arrow.setScale(1.14).setColor('#ffd86f'));
            arrow.on('pointerout', () => arrow.setScale(1).setColor('#fff7e6'));
        });
        prev.on('pointerdown', () => this.rotateBoostLoadout(categoryId, -1));
        next.on('pointerdown', () => this.rotateBoostLoadout(categoryId, 1));
        this.boostLoadoutSlots[categoryId] = { categoryId, iconFrame, iconImage, iconText, nameText, descText };
    }

    rotateBoostLoadout(categoryId, direction) {
        const options = getBoostBayLoadoutOptions(categoryId);
        const stateKey = getLoadoutStateKey(categoryId);
        const currentIndex = Math.max(0, options.findIndex(option => option.id === GameState[stateKey]));
        GameState[stateKey] = options[Phaser.Math.Wrap(currentIndex + direction, 0, options.length)].id;
        sanitizeBoostBayLoadoutState();
        SaveManager.save();
        this.updateDisplays();
    }

    showBuildLockedMessage(locked) {
        if (!this.abilityText || !locked) return;
        const message = locked.unlocked
            ? `${locked.option.name.toUpperCase()} UNLOCKED`
            : `${locked.option.name.toUpperCase()}\n${formatTapiocaCost(locked.cost)} REQUIRED`;
        this.abilityText.setText(message);
    }

    updateDisplays() {
        this.updateBuildPreview();
    }

    updateBuildPreview() {
        const drink = getDrinkOption();
        const gun = getGunOption();
        const characterIndex = Math.max(0, DRINK_OPTIONS.findIndex(option => option.id === drink.id));
        const char = CHARACTERS[characterIndex] || CHARACTERS[0];

        this.updateWheelPreview(this.drinkWheel);
        this.updateWheelPreview(this.gunWheel);
        this.updateBoostLoadoutMenus();
        this.buildNameText.setText(`${drink.name.toUpperCase()} + ${gun.name.toUpperCase()}`);
        const locked = getSelectedBuildLock();
        const synergy = getBuildSynergyText(drink, gun);
        this.synergyTitleText?.setVisible(!!synergy);
        this.runHintText
            .setVisible(!!synergy)
            .setText(synergy);
        this.abilityText.setText(locked
            ? `${locked.option.name.toUpperCase()}\nLOCKED - ${formatTapiocaCost(locked.cost)}`
            : `SPACE ABILITY\n${drink.desc}`);
        this.statsText.setText(`SPEED ${char.speed}\nDAMAGE ${char.damage}\nFIRE RATE ${char.fireRate}ms\n${char.desc}`);

        const drinkOrigin = drink.playerOrigin || { x: 0.5, y: 0.5 };
        this.previewCharacter
            .setTexture(drink.playerTexture)
            .setOrigin(drinkOrigin.x, drinkOrigin.y)
            .setScale(drink.playerScale * 2.35);
        this.previewGun
            .setTexture(gun.gunTexture)
            .setOrigin(0.5)
            .setScale(gun.gunScale * 2.25)
            .setFlipX(!!gun.gunFacesRight);
    }

    updateBoostLoadoutMenus() {
        Object.values(this.boostLoadoutSlots || {}).forEach(slot => {
            const stateKey = getLoadoutStateKey(slot.categoryId);
            const option = getBoostBayLoadoutOption(slot.categoryId, GameState[stateKey]);
            const unlocked = isBoostBayLoadoutUnlocked(slot.categoryId, option.id);
            const hasImage = !!option.assetKey && this.textures.exists(option.assetKey);
            slot.iconFrame.setAlpha(unlocked ? 1 : 0.42);
            slot.iconImage.setVisible(hasImage).setTexture(hasImage ? option.assetKey : slot.iconImage.texture.key).setAlpha(unlocked ? 1 : 0.32);
            slot.iconText.setVisible(!hasImage).setText(option.icon).setColor(unlocked ? '#fff4d6' : '#7f8aa1');
            slot.nameText.setText(unlocked ? option.name.toUpperCase() : `${option.name.toUpperCase()} LOCKED`);
            slot.descText.setText(unlocked ? option.text : 'Unlock from this Boost Bay wheel.');
        });
    }
}

// ============================================
// IDLE FACTORY SCENE
// ============================================
class IdleFactoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IdleFactoryScene' });
    }

    create() {
        drawSceneBackdrop(this, 0x3d6b6d);
        createPanel(this, 500, 350, 900, 650, 0x10141f, 0x4b7878, 0.96);

        this.add.text(500, 54, 'IDLE FACTORY', {
            fontSize: '32px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(500, 92, 'Earn rage during runs. Spend it here on factory pieces, generate tapioca, then evolve the line for a permanent boost.', {
            fontSize: '14px',
            fill: '#9fe0d3',
            align: 'center',
            wordWrap: { width: 780 }
        }).setOrigin(0.5);

        createPanel(this, 270, 156, 390, 92, 0x152225, 0x4b7878, 0.96);
        createPanel(this, 720, 156, 430, 92, 0x152225, 0x4b7878, 0.96);

        this.tapiocaText = this.add.text(270, 132, '', {
            fontSize: '18px',
            fill: '#7ed2ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.rageText = this.add.text(270, 158, '', {
            fontSize: '15px',
            fill: '#ff9f80',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.outputText = this.add.text(270, 184, '', {
            fontSize: '14px',
            fill: '#ffe4a3'
        }).setOrigin(0.5);
        this.infoText = this.add.text(720, 156, '', {
            fontSize: '14px',
            fill: '#cfe6ff',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        createPanel(this, 300, 400, 410, 380, 0x121827, 0x3f4a68, 0.95);
        createPanel(this, 720, 360, 410, 300, 0x121827, 0x3f4a68, 0.95);
        createPanel(this, 720, 570, 410, 96, 0x201720, 0x7e5a66, 0.95);

        this.add.text(300, 228, 'MACHINES', {
            fontSize: '20px',
            fill: '#ffd27a',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(720, 228, 'UPGRADES', {
            fontSize: '20px',
            fill: '#ffd27a',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.machineCardRoots = [];
        this.techCardRoots = [];
        this.buildIdleMachineCards();
        this.buildIdleTechCards();
        this.buildEvolutionPanel();

        const backBtn = this.add.image(500, 650, 'btn').setInteractive({ useHandCursor: true }).setScale(0.86);
        this.add.text(500, 650, 'BACK TO MENU', { fontSize: '17px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0.5);
        backBtn.on('pointerover', () => backBtn.setTexture('btn_hover'));
        backBtn.on('pointerout', () => backBtn.setTexture('btn'));
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));

        this.productionTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const gain = calcIdleMachineTPS();
                if (gain <= 0) return;
                GameState.tapioca += gain;
                GameState.totalTapioca += gain;
                this.refreshIdleFactory();
            },
            loop: true
        });

        this.saveTimer = this.time.addEvent({
            delay: 30000,
            callback: () => SaveManager.save(),
            loop: true
        });

        this.refreshIdleFactory();
    }

    buildIdleMachineCards() {
        IDLE_MACHINE_TABLE.forEach((machine, index) => {
            const row = index;
            const x = 300;
            const y = 276 + (row * 78);
            this.createIdleMachineCard(x, y, machine);
        });
    }

    createIdleMachineCard(x, y, machine) {
        const level = GameState.idleMachines[machine.id] || 0;
        const cost = getIdleMachineCost(machine);
        const canAfford = GameState.rage >= cost;
        const output = getIdleMachineOutput(machine);
        const mutationUnlocked = isIdleMutationUnlocked(machine.id);
        const mutationLabel = mutationUnlocked
            ? `MUTATION ON: ${machine.mutationText}`
            : `MUTATION AT ${IDLE_MACHINE_MUTATION_UNLOCK_LEVEL}: ${machine.mutationText}`;

        const card = this.add.rectangle(x, y, 360, 64, 0x162b2d).setStrokeStyle(2, canAfford ? 0xffd700 : 0x4b7878);
        card.setInteractive({ useHandCursor: canAfford });
        if (canAfford) {
            card.on('pointerdown', () => this.buyIdleMachine(machine));
        }
        this.machineCardRoots.push(card);

        this.machineCardRoots.push(this.add.text(x - 156, y, machine.icon, { fontSize: '18px', fill: '#fff4d6', fontFamily: 'Arial Black' }).setOrigin(0.5));
        this.machineCardRoots.push(this.add.text(x - 124, y - 16, machine.name, { fontSize: '13px', fill: '#fff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5));
        this.machineCardRoots.push(this.add.text(x - 124, y + 5, `${machine.desc} | ${mutationLabel}`, {
            fontSize: '10px',
            fill: mutationUnlocked ? '#7cff8a' : '#a8d0cc',
            wordWrap: { width: 225 }
        }).setOrigin(0, 0.5));
        this.machineCardRoots.push(this.add.text(x + 138, y - 12, `Lvl ${level}`, { fontSize: '12px', fill: '#7ad8ff' }).setOrigin(0.5));
        this.machineCardRoots.push(this.add.text(x + 138, y + 6, `${output.toFixed(1)}/s`, { fontSize: '12px', fill: '#ffe4a3' }).setOrigin(0.5));
        this.machineCardRoots.push(this.add.text(x + 138, y + 24, `${cost} R`, { fontSize: '12px', fill: canAfford ? '#ffb3b3' : '#666' }).setOrigin(0.5));
    }

    buildIdleTechCards() {
        IDLE_FACTORY_TECH.forEach((tech, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = 620 + (col * 200);
            const y = 284 + (row * 82);
            this.createIdleTechCard(x, y, tech);
        });
    }

    createIdleTechCard(x, y, tech) {
        const level = getIdleTechLevel(tech.id);
        const cost = getIdleTechCost(tech);
        const canAfford = GameState.rage >= cost;

        const card = this.add.rectangle(x, y, 176, 66, 0x1a2233).setStrokeStyle(2, canAfford ? 0xffd700 : 0x455270);
        card.setInteractive({ useHandCursor: canAfford });
        if (canAfford) {
            card.on('pointerdown', () => this.buyIdleTech(tech));
        }
        this.techCardRoots.push(card);
        this.techCardRoots.push(this.add.text(x - 70, y - 14, tech.name, { fontSize: '11px', fill: '#fff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5));
        this.techCardRoots.push(this.add.text(x - 70, y + 5, tech.effectText, { fontSize: '9px', fill: '#c7d7f6', wordWrap: { width: 108 } }).setOrigin(0, 0.5));
        this.techCardRoots.push(this.add.text(x + 54, y - 11, `Lvl ${level}`, { fontSize: '11px', fill: '#ffd27a' }).setOrigin(0.5));
        this.techCardRoots.push(this.add.text(x + 54, y + 10, `${cost} R`, { fontSize: '11px', fill: canAfford ? '#ffb3b3' : '#666' }).setOrigin(0.5));
    }

    buyIdleMachine(machine) {
        const cost = getIdleMachineCost(machine);
        if (GameState.rage < cost) return;
        GameState.rage -= cost;
        GameState.idleMachines[machine.id] = (GameState.idleMachines[machine.id] || 0) + 1;
        SaveManager.save();
        this.scene.restart();
    }

    buyIdleTech(tech) {
        const cost = getIdleTechCost(tech);
        if (GameState.rage < cost) return;
        GameState.rage -= cost;
        GameState.idleFactoryTech[tech.id] = getIdleTechLevel(tech.id) + 1;
        SaveManager.save();
        this.scene.restart();
    }

    buildEvolutionPanel() {
        const boostGain = getEvolutionPercentGain();
        const canEvolve = boostGain > 0 && GameState.tapioca >= 1000;

        const evolveCard = this.add.rectangle(720, 570, 380, 70, 0x2c1b22).setStrokeStyle(2, canEvolve ? 0xffd700 : 0x6c4d58);
        evolveCard.setInteractive({ useHandCursor: canEvolve });
        if (canEvolve) {
            evolveCard.on('pointerdown', () => this.evolveFactory());
        }

        const nextBoost = ((GameState.evolutionBoost || 0) + boostGain) * 100;
        this.add.text(548, 552, `EVOLVE`, { fontSize: '16px', fill: '#fff4d6', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.add.text(548, 581, `Sacrifice machines/upgrades. Costs 1000 tapioca.\nGain +${(boostGain * 100).toFixed(1)}% output.`, {
            fontSize: '10px',
            fill: '#d9b9c8',
            lineSpacing: 3
        }).setOrigin(0, 0.5);
        this.add.text(870, 558, `${calcEvolutionPoints()} pts`, { fontSize: '13px', fill: '#ffe4a3' }).setOrigin(0.5);
        this.add.text(870, 586, `Total ${nextBoost.toFixed(1)}%`, { fontSize: '11px', fill: '#9fe0d3' }).setOrigin(0.5);
    }

    evolveFactory() {
        const boostGain = getEvolutionPercentGain();
        if (boostGain <= 0 || GameState.tapioca < 1000) return;
        GameState.tapioca -= 1000;
        GameState.evolutionBoost = (GameState.evolutionBoost || 0) + boostGain;
        GameState.idleMachines = {};
        GameState.idleFactoryTech = {};
        SaveManager.save();
        this.scene.restart();
    }

    refreshIdleFactory() {
        this.tapiocaText.setText(`TAPIOCA ${Math.floor(GameState.tapioca)}`);
        this.rageText.setText(`RAGE BANK ${Math.floor(GameState.rage)}`);
        this.outputText.setText(`PASSIVE OUTPUT +${calcIdleMachineTPS().toFixed(1)} TAPIOCA / SEC`);
        this.infoText.setText(`Evolution boost ${(GameState.evolutionBoost * 100).toFixed(1)}%\nQuantum discount ${(getQuantumCostReduction() * 100).toFixed(1)}%\nEvolution formula: 1000 pts = 1% output`);
    }
}

// ============================================
// PERMA UPGRADE SCENE
// ============================================
class PermaUpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PermaUpgradeScene' });
    }

    create(data = {}) {
        SaveManager.load();
        drawSceneBackdrop(this, 0x476b86);
        this.activeUpgradeTab = data.tab === 'boosts' ? 'boosts' : 'upgrades';

        this.add.text(GAME_CENTER_X, 48, 'MAIN MENU UPGRADES', {
            fontSize: '34px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.summaryText = this.add.text(GAME_CENTER_X, 88, '', {
            fontSize: '15px',
            fill: '#cfe6ff',
            align: 'center'
        }).setOrigin(0.5);

        this.shopCards = [];
        if (this.activeUpgradeTab === 'boosts') {
            this.createFutureBoostBay(GAME_CENTER_X, 386, true);
        } else {
            this.createUpgradeCardRows();
        }

        this.detailText = this.add.text(GAME_CENTER_X, 690, '', {
            fontSize: '14px',
            fill: '#ffe7b3',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);

        this.makeActionButton(220, 740, 'BACK', () => this.scene.start('MenuScene'));
        this.makeActionButton(780, 740, 'START RUN', () => {
            GameState.reset();
            this.scene.start('GameScene');
        });
        this.createUpgradeTabs();

        this.updateUpgradeShop();
    }

    createUpgradeTabs() {
        [
            { id: 'upgrades', label: 'UPGRADES', x: GAME_CENTER_X - 112, color: 0x7ed2ff },
            { id: 'boosts', label: 'BOOST BAY', x: GAME_CENTER_X + 112, color: 0xf0b14b }
        ].forEach(tab => {
            const selected = this.activeUpgradeTab === tab.id;
            const btn = this.add.rectangle(tab.x, 128, 198, 38, selected ? tab.color : 0x07121d, selected ? 0.30 : 0.78)
                .setStrokeStyle(selected ? 3 : 2, tab.color, selected ? 1 : 0.78)
                .setInteractive({ useHandCursor: !selected });
            this.add.text(tab.x, 128, tab.label, {
                fontSize: '13px',
                fill: '#fff4d6',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            btn.on('pointerover', () => {
                if (!selected) btn.setFillStyle(tab.color, 0.20);
            });
            btn.on('pointerout', () => {
                if (!selected) btn.setFillStyle(0x07121d, 0.78);
            });
            btn.on('pointerdown', () => {
                if (!selected && !this.boostBayWheelSpinning) this.scene.restart({ tab: tab.id });
            });
        });
    }

    createUpgradeCardRows() {
        [
            { branch: 'Small Boosts', y: 270 },
            { branch: 'Per-Run Boosts', y: 528 }
        ].forEach(row => {
            const rowUpgrades = PERMA_UPGRADES.filter(upgrade => upgrade.branch === row.branch);
            const compact = rowUpgrades.length >= 5;
            const spacing = compact ? 188 : 220;
            const startX = GAME_CENTER_X - ((rowUpgrades.length - 1) * spacing / 2);
            rowUpgrades.forEach((upgrade, index) => {
                this.shopCards.push(this.createMainMenuUpgradeCard(startX + (index * spacing), row.y, upgrade, compact));
            });
        });
    }

    createFutureBoostBay(x, y, large = false) {
        this.boostBayCategory = this.boostBayCategory || BOOST_BAY_DATA[0].id;
        this.boostBayWheelSpinning = false;
        const layout = large
            ? {
                panelW: 780, panelH: 540, titleOffset: -236, titleSize: '34px',
                promptOffset: -198, promptSize: '13px', tabStart: -160, tabStep: 160,
                tabW: 136, tabH: 42, tabOffset: -154, tabFont: '14px',
                subtitleOffset: -108, subtitleFont: '15px', subtitleWidth: 600,
                wheelOffset: 58, radius: 178, markerRadius: 118, markerScale: 0.42,
                markerFont: '26px', hubRadius: 32, pointerOffset: -144,
                inventoryOffset: 232, inventoryFont: '13px', inventoryWidth: 620,
                spinOffset: 270, spinW: 240, spinH: 44, spinFont: '16px'
            }
            : {
                panelW: 270, panelH: 338, titleOffset: -146, titleSize: '18px',
                promptOffset: -122, promptSize: '10px', tabStart: -84, tabStep: 84,
                tabW: 74, tabH: 30, tabOffset: -88, tabFont: '9px',
                subtitleOffset: -54, subtitleFont: '10px', subtitleWidth: 210,
                wheelOffset: 32, radius: 84, markerRadius: 56, markerScale: 0.20,
                markerFont: '14px', hubRadius: 19, pointerOffset: -66,
                inventoryOffset: 132, inventoryFont: '8px', inventoryWidth: 218,
                spinOffset: 160, spinW: 172, spinH: 28, spinFont: '10px'
            };
        createNeonPanel(this, x, y, layout.panelW, layout.panelH, BRANCH_VISUALS.special, 0.82);
        this.add.text(x, y + layout.titleOffset, 'BOOST BAY', {
            fontSize: layout.titleSize,
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#143c44',
            strokeThickness: large ? 6 : 3
        }).setOrigin(0.5);
        this.add.text(x, y + layout.promptOffset, 'PICK A FUTURE BOOST FAMILY', {
            fontSize: layout.promptSize,
            fill: '#7ee0ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.boostBayTabs = [];
        BOOST_BAY_DATA.forEach((slot, index) => {
            const tabX = x + layout.tabStart + (index * layout.tabStep);
            const tab = this.add.rectangle(tabX, y + layout.tabOffset, layout.tabW, layout.tabH, 0x07121d, 0.78)
                .setStrokeStyle(2, slot.color, 0.84)
                .setInteractive({ useHandCursor: true });
            const label = this.add.text(tabX, y + layout.tabOffset, slot.title, {
                fontSize: layout.tabFont,
                fill: '#fff4d6',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            tab.on('pointerover', () => tab.setFillStyle(slot.color, 0.24));
            tab.on('pointerout', () => this.refreshBoostBayTabs());
            tab.on('pointerdown', () => {
                if (this.boostBayWheelSpinning) return;
                this.boostBayCategory = slot.id;
                this.renderBoostBayPreview(x, y, layout);
            });
            this.boostBayTabs.push({ tab, label, slot });
        });
        this.boostBayPreviewRoot = this.add.container(0, 0);
        this.renderBoostBayPreview(x, y, layout);
    }

    refreshBoostBayTabs() {
        this.boostBayTabs?.forEach(node => {
            const selected = node.slot.id === this.boostBayCategory;
            node.tab.setFillStyle(selected ? node.slot.color : 0x07121d, selected ? 0.30 : 0.78);
            node.tab.setStrokeStyle(selected ? 3 : 2, node.slot.color, selected ? 1 : 0.84);
        });
    }

    renderBoostBayPreview(x, y, layout) {
        this.boostBayPreviewRoot?.removeAll(true);
        this.refreshBoostBayTabs();
        const category = BOOST_BAY_DATA.find(slot => slot.id === this.boostBayCategory) || BOOST_BAY_DATA[0];
        const nodes = [];
        nodes.push(this.add.text(x, y + layout.subtitleOffset, category.subtitle.toUpperCase(), {
            fontSize: layout.subtitleFont,
            fill: '#ffd86f',
            align: 'center',
            fontFamily: 'Arial Black',
            wordWrap: { width: layout.subtitleWidth }
        }).setOrigin(0.5));

        const wheel = this.add.container(x, y + layout.wheelOffset);
        const wheelGraphics = this.add.graphics();
        const radius = layout.radius;
        const sliceAngle = (Math.PI * 2) / category.items.length;
        category.items.forEach((item, index) => {
            const start = -Math.PI / 2 + (index * sliceAngle);
            const end = start + sliceAngle;
            const mid = start + sliceAngle / 2;
            const x1 = Math.cos(start) * radius;
            const y1 = Math.sin(start) * radius;
            const x2 = Math.cos(end) * radius;
            const y2 = Math.sin(end) * radius;
            wheelGraphics.fillStyle(index % 2 === 0 ? category.color : 0xffffff, index % 2 === 0 ? 0.34 : 0.12);
            wheelGraphics.fillTriangle(0, 0, x1, y1, x2, y2);
            wheelGraphics.lineStyle(1, 0xfff4d6, 0.36);
            wheelGraphics.strokeTriangle(0, 0, x1, y1, x2, y2);
            const markerX = Math.cos(mid) * layout.markerRadius;
            const markerY = Math.sin(mid) * layout.markerRadius;
            if (item.assetKey && this.textures.exists(item.assetKey)) {
                const sprite = this.add.image(markerX, markerY, item.assetKey).setScale(layout.markerScale);
                wheel.add(sprite);
            } else {
                const label = this.add.text(markerX, markerY, `${index + 1}`, {
                    fontSize: layout.markerFont,
                    fill: '#fff4d6',
                    fontFamily: 'Arial Black',
                    stroke: '#06101a',
                    strokeThickness: 3
                }).setOrigin(0.5);
                wheel.add(label);
            }
        });
        wheel.addAt(wheelGraphics, 0);
        const hub = this.add.circle(0, 0, layout.hubRadius, 0x07121d, 0.92).setStrokeStyle(2, category.color, 0.95);
        wheel.add(hub);
        const pointer = this.add.triangle(x, y + layout.pointerOffset, 0, 0, -16, -28, 16, -28, 0xfff4d6, 0.96)
            .setStrokeStyle(2, category.color, 0.9);
        nodes.push(wheel, pointer);

        const inventoryText = this.add.text(x, y + layout.inventoryOffset, this.getBoostBayInventoryLine(category), {
            fontSize: layout.inventoryFont,
            fill: '#cfe6ff',
            align: 'center',
            wordWrap: { width: layout.inventoryWidth }
        }).setOrigin(0.5);
        const canSpin = GameState.tapioca >= BOOST_BAY_SPIN_COST && !this.boostBayWheelSpinning;
        const spinButton = this.add.rectangle(x, y + layout.spinOffset, layout.spinW, layout.spinH, canSpin ? category.color : 0x17212e, canSpin ? 0.28 : 0.78)
            .setStrokeStyle(2, canSpin ? category.color : 0x48566c, canSpin ? 0.95 : 0.7)
            .setInteractive({ useHandCursor: canSpin });
        const spinText = this.add.text(x, y + layout.spinOffset, `SPIN ${formatTapiocaCost(BOOST_BAY_SPIN_COST)}`, {
            fontSize: layout.spinFont,
            fill: canSpin ? '#fff4d6' : '#8ea0b8',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        spinButton.on('pointerover', () => {
            if (!canSpin) return;
            spinButton.setFillStyle(category.color, 0.42);
        });
        spinButton.on('pointerout', () => {
            if (!canSpin) return;
            spinButton.setFillStyle(category.color, 0.28);
        });
        spinButton.on('pointerdown', () => this.spinBoostBayWheel(category, wheel, x, y, layout));
        nodes.push(inventoryText, spinButton, spinText);
        this.boostBayPreviewRoot.add(nodes);
    }

    getBoostBayOwnedCount(categoryId, itemName) {
        return Math.max(0, GameState.boostBayInventory?.[categoryId]?.[itemName] || 0);
    }

    getBoostBayInventoryLine(category) {
        const owned = category.items
            .filter(item => this.getBoostBayOwnedCount(category.id, item.name) > 0)
            .map(item => `${item.name} x${this.getBoostBayOwnedCount(category.id, item.name)}`);
        return owned.length > 0 ? owned.slice(0, 2).join('  |  ') : 'No wins yet. Spin to draft one.';
    }

    spinBoostBayWheel(category, wheel, x, y, layout) {
        if (this.boostBayWheelSpinning || GameState.tapioca < BOOST_BAY_SPIN_COST) return;
        this.boostBayWheelSpinning = true;
        GameState.tapioca -= BOOST_BAY_SPIN_COST;
        const resultIndex = Phaser.Math.Between(0, category.items.length - 1);
        const result = category.items[resultIndex];
        const sliceDegrees = 360 / category.items.length;
        const targetDegrees = (360 * 5) - (resultIndex * sliceDegrees) - (sliceDegrees / 2);
        this.detailText.setText(`Spinning ${category.title} wheel...`);
        this.tweens.add({
            targets: wheel,
            angle: targetDegrees,
            duration: 1250,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                GameState.boostBayInventory[category.id] = GameState.boostBayInventory[category.id] || {};
                GameState.boostBayInventory[category.id][result.name] = this.getBoostBayOwnedCount(category.id, result.name) + 1;
                SaveManager.save();
                const ownedCount = this.getBoostBayOwnedCount(category.id, result.name);
                const resultBannerY = y + layout.wheelOffset;
                const resultGlow = this.add.rectangle(x, resultBannerY, 360, 78, category.color, 0.18)
                    .setStrokeStyle(3, category.color, 0.96);
                const resultText = this.add.text(x, resultBannerY - 12, 'YOU WON', {
                    fontSize: '16px',
                    fill: '#ffd86f',
                    fontFamily: 'Arial Black',
                    stroke: '#06101a',
                    strokeThickness: 4
                }).setOrigin(0.5);
                const prizeText = this.add.text(x, resultBannerY + 15, `${result.name.toUpperCase()}  x${ownedCount}`, {
                    fontSize: '18px',
                    fill: '#fff4d6',
                    fontFamily: 'Arial Black',
                    stroke: '#06101a',
                    strokeThickness: 4
                }).setOrigin(0.5);
                this.boostBayPreviewRoot.add([resultGlow, resultText, prizeText]);
                this.detailText.setText(`${category.title} landed on ${result.name}! Owned ${ownedCount}.`);
                this.time.delayedCall(1500, () => {
                    this.boostBayWheelSpinning = false;
                    this.updateUpgradeShop();
                    this.detailText.setText(`${category.title} landed on ${result.name}! Owned ${ownedCount}.`);
                    this.renderBoostBayPreview(x, y, layout);
                });
            }
        });
    }

    createMainMenuUpgradeCard(x, y, upgrade, compact = false) {
        const cardWidth = compact ? 142 : 156;
        const cardHeight = compact ? 190 : 178;
        const card = createPermanentStoreCard(this, x, y, upgrade, cardWidth, cardHeight);
        card.setInteractive({ useHandCursor: true });
        const priceTagY = y + (cardHeight / 2) + 24;
        const priceTag = this.add.text(x, priceTagY, '', {
            fontSize: '14px',
            fill: '#ffe7b3',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
        const select = () => this.buyPermaUpgrade(upgrade.id);
        card.on('pointerdown', select);
        card.on('pointerover', () => {
            const level = getPermaUpgradeLevel(upgrade.id);
            const isMaxed = level >= upgrade.maxLevel;
            const cost = getPermaUpgradeCost(upgrade);
            priceTag.setText(isMaxed ? 'MAXED' : `${cost} TP`).setVisible(true);
            card.setScale(1.055);
            card.setAlpha(1);
            this.showUpgradeDetails(upgrade);
        });
        card.on('pointerout', () => {
            priceTag.setVisible(false);
            card.setScale(1);
            this.hideUpgradeDetails();
        });
        return { card, priceTag, upgrade, compact, cardWidth, cardHeight };
    }

    drawTreeConnections() {
        this.treeGraphics.clear();
        this.treeGraphics.lineStyle(3, 0x31415f, 0.9);
        this.treeGraphics.lineBetween(170, 240, 170, 480);
        this.treeGraphics.lineBetween(400, 280, 400, 400);
        this.treeGraphics.lineBetween(630, 280, 630, 400);
        this.treeGraphics.lineBetween(170, 240, 400, 280);
        this.treeGraphics.lineBetween(170, 320, 170, 400);
    }

    updateUpgradeShop() {
        const hint = this.activeUpgradeTab === 'boosts'
            ? 'Choose a boost family, then spin for unlocks used on the Build loadout screen'
            : 'Hover a card to see price   |   Click to buy one level';
        this.summaryText.setText(`TAPIOCA ${Math.floor(GameState.tapioca)}   |   ${hint}`);
        this.shopCards.forEach(node => {
            const level = getPermaUpgradeLevel(node.upgrade.id);
            const canBuy = canBuyPermaUpgrade(node.upgrade);
            const isMaxed = level >= node.upgrade.maxLevel;
            node.card.levelText?.setText(`${isTemporaryPerRunUpgrade(node.upgrade.id) ? 'Queued' : 'Owned'} ${level}`);
            if (isMaxed) {
                node.card.clearTint?.();
                node.card.setAlpha(0.86);
                node.priceTag.setColor('#aef1c0');
            } else if (canBuy) {
                node.card.clearTint?.();
                node.card.setAlpha(0.98);
                node.priceTag.setColor('#ffe4a3');
            } else {
                node.card.clearTint?.();
                node.card.setAlpha(0.5);
                node.priceTag.setColor('#ff8e8e');
            }
        });
        this.hideUpgradeDetails();
    }

    showUpgradeDetails(upgrade) {
        const requires = upgrade.requires && upgrade.requires.length > 0
            ? 'Requires: ' + upgrade.requires.map(id => getPermaUpgrade(id)?.name || id).join(', ')
            : 'No prerequisite';
        const cost = getPermaUpgradeCost(upgrade);
        const duration = isTemporaryPerRunUpgrade(upgrade.id) ? 'next run only' : 'permanent';
        const level = getPermaUpgradeLevel(upgrade.id);
        this.detailText.setText(`${upgrade.name}: ${duration} ${upgrade.desc}   |   Owned ${level}   |   Next ${cost} TP   |   ${requires}`);
    }

    hideUpgradeDetails() {
        this.detailText.setText('');
    }

    buyPermaUpgrade(id) {
        const upgrade = getPermaUpgrade(id);
        if (!upgrade || !canBuyPermaUpgrade(upgrade)) return;
        GameState.tapioca -= getPermaUpgradeCost(upgrade);
        if (isTemporaryPerRunUpgrade(id)) {
            GameState.runBoosts[id] = getPermaUpgradeLevel(id) + 1;
        } else {
            GameState.factoryUpgrades[id] = getPermaUpgradeLevel(id) + 1;
        }
        SaveManager.save();
        this.updateUpgradeShop();
    }

    makeActionButton(x, y, text, callback) {
        const btn = this.add.image(x, y, 'btn').setInteractive({ useHandCursor: true }).setScale(0.82);
        this.add.text(x, y, text, { fontSize: '16px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setTexture('btn_hover'));
        btn.on('pointerout', () => btn.setTexture('btn'));
        btn.on('pointerdown', callback);
    }
}

// ============================================
// LEADERBOARD SCENE
// ============================================
class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    create() {
        drawSceneBackdrop(this, 0x59418a);
        createNeonPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 640, 560, BRANCH_VISUALS.pierce, 0.9);
        this.add.text(GAME_CENTER_X, 112, 'LEADERBOARD', {
            fontSize: '42px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#17111f',
            strokeThickness: 6
        }).setOrigin(0.5);
        this.createLeaderboardPanel(GAME_CENTER_X, 386);
        this.makeActionButton(220, 740, 'BACK', () => this.scene.start('MenuScene'));
    }

    createLeaderboardPanel(x, y) {
        return MenuScene.prototype.createLeaderboardPanel.call(this, x, y);
    }

    makeSmallButton(x, y, text, callback) {
        return MenuScene.prototype.makeSmallButton.call(this, x, y, text, callback);
    }

    refreshLeaderboard() {
        return MenuScene.prototype.refreshLeaderboard.call(this);
    }

    makeActionButton(x, y, text, callback) {
        return PermaUpgradeScene.prototype.makeActionButton.call(this, x, y, text, callback);
    }
}

// ============================================
// SETTINGS SCENE (Overlay)
// ============================================
class ControlsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlsScene' });
    }

    create() {
        window.BobaAuth?.setProfileToolsVisible?.(true);
        this.events.once('shutdown', () => window.BobaAuth?.setProfileToolsVisible?.(false));

        drawSceneBackdrop(this, 0x62408e);
        createPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 780, 560, 0x111827, 0x8d6bd8, 0.96);
        createNeonPanel(this, 370, 360, 330, 300, BRANCH_VISUALS.speed, 0.9);
        createNeonPanel(this, 780, 360, 330, 300, BRANCH_VISUALS.taro || BRANCH_VISUALS.pierce, 0.9);

        this.add.text(GAME_CENTER_X, 116, 'SETTINGS', {
            fontSize: '40px', fill: '#fff4d6', fontFamily: 'Arial Black',
            stroke: '#3b2457', strokeThickness: 4
        }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 156, 'PROFILE TOOLS ARE BELOW THIS PANEL.', {
            fontSize: '11px', fill: '#b8eaff', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        const controls = [
            'WASD - Move',
            GameState.aimMode === 'manual' ? 'MANUAL AIM - HOLD/CLICK TO FIRE' : 'AUTO AIM - TRACKS ENEMIES',
            'AUTO-FIRE',
            'SPACE - Ability',
            'ESC - Pause'
        ];

        this.add.text(370, 238, 'CONTROLS', {
            fontSize: '20px', fill: '#fff4d6', fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        controls.forEach((line, i) => {
            this.add.text(224, 286 + i * 36, line, {
                fontSize: '15px',
                fill: i === 1 ? '#ffd86f' : '#d5e4ff',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
        });

        this.add.text(780, 238, 'GAME FEEL', {
            fontSize: '20px', fill: '#fff4d6', fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(632, 296, 'VOLUME', { fontSize: '14px', fill: '#c2c2b8', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.volumeSlider = this.add.rectangle(730, 296, 230, 10, 0x293449).setOrigin(0, 0.5).setStrokeStyle(1, BOBA_THEME.aqua, 0.4);
        this.volumeFill = this.add.rectangle(730, 296, GameState.volume * 230, 10, 0x5bbcff).setOrigin(0, 0.5);
        this.volumePercent = this.add.text(986, 296, '', { fontSize: '14px', fill: '#d5e4ff' }).setOrigin(0.5);
        this.volumeHit = this.add.rectangle(845, 296, 250, 34, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
        this.volumeHit.on('pointerdown', pointer => this.setVolumeFromPointer(pointer));
        this.volumeHit.on('pointermove', pointer => {
            if (pointer.isDown) this.setVolumeFromPointer(pointer);
        });

        this.add.text(632, 364, 'AIM MODE', { fontSize: '14px', fill: '#c2c2b8', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.aimModeBtn = this.add.rectangle(854, 364, 180, 42, 0x0d324a, 0.96)
            .setStrokeStyle(2, 0x4fa3da)
            .setInteractive({ useHandCursor: true });
        this.aimModeLabel = this.add.text(854, 364, '', { fontSize: '15px', fill: '#9fd7ff', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.aimModeBtn.on('pointerover', () => this.aimModeBtn.setFillStyle(0x164b6c, 0.96));
        this.aimModeBtn.on('pointerout', () => this.aimModeBtn.setFillStyle(0x0d324a, 0.96));
        this.aimModeBtn.on('pointerdown', () => {
            GameState.aimMode = GameState.aimMode === 'manual' ? 'auto' : 'manual';
            SaveManager.save();
            this.refreshSettings();
        });

        this.add.text(780, 446, 'Leaderboard name and save import/export live in the profile box below.', {
            fontSize: '12px',
            fill: '#d9c8ff',
            align: 'center',
            wordWrap: { width: 286 },
            lineSpacing: 5
        }).setOrigin(0.5);

        const closeBtn = this.add.image(GAME_CENTER_X, 620, 'btn').setInteractive({ useHandCursor: true });
        const closeLabel = this.add.text(GAME_CENTER_X, 620, 'CLOSE', { fontSize: '18px', fill: '#fff', fontFamily: 'Arial Black' }).setOrigin(0.5);

        closeBtn.on('pointerover', () => closeBtn.setTexture('btn_hover'));
        closeBtn.on('pointerout', () => closeBtn.setTexture('btn'));
        closeBtn.on('pointerdown', () => this.scene.stop());
        closeLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.stop());

        this.input.keyboard.once('keydown-ESC', () => this.scene.stop());
        this.refreshSettings();
    }

    setVolumeFromPointer(pointer) {
        const vol = Phaser.Math.Clamp((pointer.x - 730) / 230, 0, 1);
        GameState.volume = vol;
        SaveManager.save();
        this.refreshSettings();
        this.events.emit('volumechange', vol);
    }

    refreshSettings() {
        if (this.volumeFill) {
            this.volumeFill.width = GameState.volume * 230;
        }
        this.volumePercent?.setText(String(Math.floor(GameState.volume * 100)) + '%');
        this.aimModeLabel?.setText(GameState.aimMode === 'manual' ? 'MANUAL' : 'AUTO');
    }
}

// ============================================
// PAUSE SCENE (Overlay)
// ============================================
class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        resetCanvasInput(this);
        GameState.paused = true;
        GameState.upgradeSceneActive = false;
        const restoreInput = () => {
            resumeGameSceneFromOverlay(this);
        };
        const prepareExit = () => {
            resetCanvasInput(this);
            GameState.paused = false;
            GameState.upgradeSceneActive = false;
        };

        drawSceneBackdrop(this, 0x4d5b86);
        createPanel(this, 500, 350, 900, 620, 0x131a2a, 0x536784, 0.96);
        createPanel(this, 210, 350, 250, 500, 0x111827, 0x536784, 0.95);
        createPanel(this, 630, 350, 570, 500, 0x111827, 0x536784, 0.95);

        this.add.text(210, 160, 'PAUSED', {
            fontSize: '48px', fill: '#fff4d6', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        const buttons = [
            { text: 'RESUME', y: 275, cb: () => {
                restoreInput();
                this.scene.stop('PauseScene');
            }},
            { text: 'RESTART', y: 355, cb: () => {
                prepareExit();
                requestGameSceneSwitchFromOverlay(this, 'GameScene', true);
            }},
            { text: 'QUIT TO MENU', y: 435, cb: () => {
                prepareExit();
                SaveManager.save();
                requestGameSceneSwitchFromOverlay(this, 'MenuScene', true);
            }}
        ];

        buttons.forEach(b => {
            const btn = this.add.image(210, b.y, 'btn').setInteractive({ useHandCursor: true }).setScale(0.92);
            const label = this.add.text(210, b.y, b.text, { fontSize: '19px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });
            btn.on('pointerover', () => btn.setTexture('btn_hover'));
            btn.on('pointerout', () => btn.setTexture('btn'));
            btn.on('pointerdown', b.cb);
            label.on('pointerdown', b.cb);
        });

        this.createPauseUpgradeTree();

        this.input.keyboard.on('keydown-ESC', () => {
            restoreInput();
            this.scene.stop('PauseScene');
        });
    }

    createPauseUpgradeTree() {
        this.add.text(630, 130, 'RUN UPGRADE TREE', {
            fontSize: '30px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(630, 166, 'Gold tiers are owned this run. Dim tiers are still locked or unpicked.', {
            fontSize: '13px',
            fill: '#9fb3d9',
            align: 'center'
        }).setOrigin(0.5);
        this.upgradeTreeTooltip = this.add.text(630, 638, '', {
            fontSize: '13px',
            fill: '#fff4d6',
            align: 'center',
            fontFamily: 'Arial',
            wordWrap: { width: 500 }
        }).setOrigin(0.5).setDepth(30).setVisible(false);

        const branches = ['shot', 'speed', 'attack', 'damage', 'health', 'pierce', 'bounce'];
        const labels = {
            shot: 'Shots',
            speed: 'Speed',
            attack: 'Attack',
            damage: 'Damage',
            health: 'Health',
            pierce: 'Pierce',
            bounce: 'Bounce'
        };

        branches.forEach((branch, branchIndex) => {
            const branchUpgrades = UPGRADES
                .filter(upgrade => upgrade.branch === branch)
                .sort((a, b) => a.tier - b.tier);
            const y = 212 + (branchIndex * 58);
            const owned = branchUpgrades.filter(upgrade => hasUpgrade(upgrade.id));
            const highestOwned = owned[owned.length - 1];

            this.add.text(386, y, labels[branch], {
                fontSize: '16px',
                fill: '#ffe7aa',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);

            branchUpgrades.forEach((upgrade, tierIndex) => {
                const x = 520 + (tierIndex * 58);
                const ownedTier = hasUpgrade(upgrade.id);
                const unlocked = meetsUpgradeRequirements(upgrade);
                const fill = ownedTier ? 0x69531b : unlocked ? 0x27334d : 0x171c2b;
                const stroke = ownedTier ? 0xffd700 : unlocked ? 0x6f819f : 0x353f55;
                const tierBox = this.add.rectangle(x, y, 46, 38, fill, 0.98)
                    .setStrokeStyle(2, stroke)
                    .setInteractive({ useHandCursor: true });
                const tierText = this.add.text(x, y - 5, `T${upgrade.tier}`, {
                    fontSize: '11px',
                    fill: ownedTier ? '#fff4c4' : '#8fa1bd',
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                const iconText = this.add.text(x, y + 10, upgrade.icon, {
                    fontSize: upgrade.icon.length > 3 ? '8px' : '11px',
                    fill: ownedTier ? '#ffd700' : '#8fa1bd',
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });
                [tierBox, tierText, iconText].forEach(item => {
                    item.on('pointerover', () => {
                        tierBox.setStrokeStyle(3, ownedTier ? 0xfff0a8 : 0x9bd2ff);
                        this.showUpgradeTreeTooltip(upgrade, ownedTier, unlocked);
                    });
                    item.on('pointerout', () => {
                        tierBox.setStrokeStyle(2, stroke);
                        this.upgradeTreeTooltip.setVisible(false);
                    });
                });
            });

            this.add.text(780, y, highestOwned ? highestOwned.name : 'None', {
                fontSize: '12px',
                fill: highestOwned ? '#ffd27a' : '#6f7d95',
                wordWrap: { width: 130 }
            }).setOrigin(0, 0.5);
        });
    }

    showUpgradeTreeTooltip(upgrade, ownedTier, unlocked) {
        const status = ownedTier ? 'Owned' : unlocked ? 'Available in draft' : 'Locked';
        this.upgradeTreeTooltip
            .setText(`${upgrade.name} (${status})\n${upgrade.desc}`)
            .setVisible(true);
    }
}

// ============================================
// GAME SCENE
// ============================================
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        resetRunUiState(this);
        if (this.physics?.world) {
            this.physics.resume();
        }
        const selectedIndex = Number.isInteger(GameState.selectedCharacter) && GameState.selectedCharacter >= 0 && GameState.selectedCharacter < CHARACTERS.length
            ? GameState.selectedCharacter
            : 0;
        GameState.selectedCharacter = selectedIndex;
        const char = CHARACTERS[selectedIndex];
        this.playerSpeed = char.speed;
        this.basePlayerSpeed = char.speed;
        this.playerDamage = char.damage;
        this.basePlayerDamage = char.damage;
        this.playerFireRate = char.fireRate;
        this.weaponProfile = getSelectedBuildProfile();
        this.playerTextureKey = this.weaponProfile.playerTexture;
        this.gunTextureKey = this.weaponProfile.gunTexture;
        this.projectileTextureKey = this.weaponProfile.projectileTexture;
        this.buildAbilityType = this.weaponProfile.abilityType || 'classicDash';
        this.weaponType = this.weaponProfile.weaponType || 'classic';
        this.playerSpeed *= 1 + (getUnlockedIdleMutationLevel('ballRoller') * 0.01);
        this.multiShot = char.multiShot || 1;
        this.maxBounces = char.maxBounces || 0;
        this.projectilePierce = this.weaponProfile.pierce || 0;
        this.projectileSpeed = this.weaponProfile.projectileSpeed || 500;
        this.projectileScale = this.weaponProfile.projectileScale || 0.18;
        this.projectileLifespan = this.weaponProfile.projectileLifespan || 2400;
        this.playerDamage *= this.weaponProfile.damageMultiplier || 1;
        this.basePlayerDamage *= this.weaponProfile.damageMultiplier || 1;
        this.playerFireRate /= this.weaponProfile.fireRateMultiplier || 1;
        this.multiShot = this.weaponProfile.projectileCount || this.multiShot;
        this.playerDamage *= 1 + (getUnlockedIdleMutationLevel('ballMaker') * 0.005);
        this.pierceDamageScale = 0;
        this.bounceDamageScale = 0;
        this.wallSplitCount = 0;
        this.wallFullDamageSplits = 0;
        this.splitOnKill = false;
        this.growingBoba = false;
        this.lastAmmoDoubleCount = 0;
        this.ammoDamageRamp = false;
        this.xpSpeedBoostEnabled = false;
        this.xpSpeedBoostUntil = 0;
        this.infiniteLoopCore = false;
        this.pulseWaveGenerator = false;
        this.randomizedSpreadCore = false;
        this.bounceCascadeEngine = false;
        this.orbPetEnabled = false;
        this.orbPet = null;
        this.damageReductionPercent = 0;
        this.periodicFullBlock = false;
        this.nextFullBlockAt = 0;
        this.enemyIdCounter = 0;
        this.damageNumberCounter = 0;
        this.lastFireTime = -Infinity;
        this.permaStartingRageBonus = 0;
        this.permaMaxAmmoBonus = 0;
        this.permaEarlyWaveRageBonus = 0;
        this.permaRageBonusPercent = 0;
        this.permaXpBonusPercent = 0;
        this.permaReloadSpeedBonus = 0;
        this.playerDown = false;
        this.runEnded = false;
        this.deathTransitionPending = false;
        this.switchingScene = false;
        this.waveTransitioning = false;
        this.playerInvincibleUntil = 0;
        this.dashCharges = 2;
        this.maxDashCharges = 2;
        this.dashRechargeDelay = 3000;
        this.nextDashRechargeAt = 0;
        this.isDashing = false;
        this.dashDamageReduction = 0;
        this.dashUntil = 0;
        this.lastMoveDir = { x: 0, y: -1 };
        this.abilityCooldownMs = 5200;
        if (this.buildAbilityType === 'zenGarden') {
            this.abilityCooldownMs = 10400;
        } else if (this.buildAbilityType === 'tigerFocus') {
            this.abilityCooldownMs = 10000;
        }
        this.nextAbilityAt = 0;
        this.abilityActiveUntil = 0;
        this.tigerDamageBoostUntil = 0;
        this.fireRateBoostUntil = 0;
        this.fireRateBoostMultiplier = 1;
        this.speedBoostUntil = 0;
        this.speedBoostMultiplier = 1;
        this.infiniteAmmoUntil = 0;
        this.accuracyBoostUntil = 0;
        this.matchaOrbDurationBoostUntil = 0;
        this.damageZones = [];
        this.shotVolleyId = 0;
        this.lycheeVolleyHits = new Map();
        this.matchaPoisonDamageScale = 0.28;
        this.matchaLifestealScale = 0.15;

        this.hasFreeze = false;
        this.hasExplode = false;
        this.hasShield = false;
        this.vampireHeal = 0;
        this.critChance = 0;
        this.damageReduction = 0;
        this.shieldActive = false;
        this.shieldCooldown = 15000;
        this.freezeChance = 0;

        PERMA_UPGRADES.forEach(upgrade => {
            const level = getPermaUpgradeLevel(upgrade.id);
            for (let i = 0; i < level; i++) {
                upgrade.apply(this);
            }
        });
        if (Object.keys(GameState.runBoosts || {}).length > 0) {
            GameState.runBoosts = {};
            SaveManager.save();
        }

        GameState.rage += this.permaStartingRageBonus;
        GameState.health = GameState.maxHealth;
        GameState.tc = 0;

        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.createBattleBackdrop();

        this.createPlayer();
        this.createEquippedPet();
        this.createHud();
        this.setupMultiplayerRun();

        this.enemies = this.physics.add.group();
        this.bobas = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();
        this.xpPickups = this.physics.add.group();
        this.healingPickups = this.physics.add.group();
        this.physics.add.overlap(this.player, this.xpPickups, this.collectXpPickup, null, this);
        this.physics.add.overlap(this.player, this.healingPickups, this.collectHealingPickup, null, this);
        this.physics.add.overlap(this.player, this.enemyProjectiles, this.hitPlayerWithEnemyProjectile, null, this);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.configureWave();
        this.enemySpawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.saveTimer = this.time.addEvent({
            delay: 30000,
            callback: () => SaveManager.save(),
            loop: true
        });

        this.runIdleProductionTimer = this.time.addEvent({
            delay: IDLE_RUN_TAPIOCA_TICK_MS,
            callback: this.tickRunIdleProduction,
            callbackScope: this,
            loop: true
        });

        this.physics.world.on('worldbounds', this.handleBobaWorldBounds, this);

        this.input.keyboard.on('keydown-ESC', () => {
            if (!GameState.paused) {
                this.setCombatMouseLocked(false);
                GameState.paused = true;
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });

        this.manualFireHeld = false;
        this.input.on('pointerdown', this.beginManualFire, this);
        this.input.on('pointerup', this.endManualFire, this);
        this.input.on('pointerupoutside', this.endManualFire, this);

        this.events.on('resume', () => {
            GameState.paused = false;
            this.syncAimInputMode();
            this.physics.resume();
            this.updateUI();
        });

        this.events.once('shutdown', () => {
            this.setCombatMouseLocked(false);
            this.input.off('pointerdown', this.beginManualFire, this);
            this.input.off('pointerup', this.endManualFire, this);
            this.input.off('pointerupoutside', this.endManualFire, this);
            this.multiplayerPollTimer?.remove(false);
            this.multiplayerPollTimer = null;
            this.physics.world.off('worldbounds', this.handleBobaWorldBounds, this);
        });

        this.syncAimInputMode();
        this.updateUI();
    }

    createBattleBackdrop() {
        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x07111f);
        if (this.textures.exists('battle_background')) {
            const bg = this.add.image(GAME_CENTER_X, GAME_CENTER_Y, 'battle_background').setDepth(0);
            const source = this.textures.get('battle_background').getSourceImage();
            const scale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
            bg.setScale(scale);
        } else {
            this.add.circle(160, 90, 230, BOBA_THEME.aqua, 0.055);
            this.add.circle(1040, 720, 300, BOBA_THEME.lychee, 0.045);

            const grid = this.add.graphics();
            grid.lineStyle(1, BOBA_THEME.aqua, 0.16);
            for (let x = 0; x < GAME_WIDTH; x += 40) {
                grid.lineBetween(x, 0, x, GAME_HEIGHT);
            }
            for (let y = 0; y < GAME_HEIGHT; y += 40) {
                grid.lineBetween(0, y, GAME_WIDTH, y);
            }
        }
    }

    createPlayer() {
        this.player = this.physics.add.sprite(GAME_CENTER_X, GAME_HEIGHT - 180, this.playerTextureKey || 'player_boba');
        const playerOrigin = this.weaponProfile?.playerOrigin || { x: 0.5, y: 0.5 };
        this.player.setOrigin(playerOrigin.x, playerOrigin.y);
        this.player.setScale(this.weaponProfile?.playerScale || 0.14);
        this.player.setCollideWorldBounds(true);
        this.gunPivotOffset = { x: 0, y: -12 };
        this.gunMuzzleDistance = 43;
        this.currentAimAngle = -Math.PI / 2;
        this.currentGunMuzzle = { x: this.player.x, y: this.player.y - 55 };
        this.gunSprite = this.add.image(this.player.x, this.player.y, this.gunTextureKey || 'boba_gun');
        this.gunSprite.setOrigin(0.78, 0.5);
        this.gunSprite.setScale(this.weaponProfile?.gunScale || 0.055);
        this.gunSprite.setDepth(3);

        this.maxBobaCount = 5 + this.permaMaxAmmoBonus;
        if (this.weaponType === 'strawberryShotgun') {
            this.maxBobaCount = 1;
        }
        this.bobaCount = this.maxBobaCount;
        this.isReloading = false;
        this.reloadToken = 0;
        this.reloadDuration = Math.max(250, Math.floor(1000 / (1 + this.permaReloadSpeedBonus)));
        this.reloadDuration *= this.weaponProfile?.reloadDurationMultiplier || 1;
        if (this.weaponType === 'tigerBlade') {
            this.reloadDuration *= 2;
        }
        this.reloadDuration = Math.floor(this.reloadDuration);
    }

    createHud() {
        this.add.rectangle(250, 44, 310, 62, 0x07121d, 0.58)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xff6f9f, 0.48)
            .setDepth(4);
        this.add.rectangle(144, 104, 250, 62, 0x07121d, 0.50)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0xffd86f, 0.42)
            .setDepth(4);
        this.add.rectangle(GAME_WIDTH - 102, 62, 176, 96, 0x07121d, 0.56)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x38d9ff, 0.58)
            .setDepth(4);

        this.bobaCountText = this.add.text(28, 86, '', { fontSize: '13px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.reloadText = this.add.text(144, 86, 'RELOADING...', { fontSize: '10px', fill: '#f6b84b', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.reloadText.setVisible(false);
        this.playerStateText = this.add.text(28, 108, '', { fontSize: '10px', fill: '#ffe7b3', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.rageText = this.add.text(112, 108, '', { fontSize: '10px', fill: '#ff7d9d', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.tcText = this.add.text(190, 108, '', { fontSize: '10px', fill: '#38d9ff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.outputText = this.add.text(28, 126, '', { fontSize: '10px', fill: '#f6b84b', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.dashText = this.add.text(188, 126, '', { fontSize: '10px', fill: '#7cff8a', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.abilityBarBg = this.add.rectangle(28, 142, 196, 6, 0x1f2b3d, 0.92).setOrigin(0, 0.5).setStrokeStyle(1, 0x7ed2ff, 0.5);
        this.abilityBarFill = this.add.rectangle(28, 142, 196, 6, 0x7cff8a, 0.95).setOrigin(0, 0.5);

        this.healthBarBg = this.add.image(126, 28, 'health_bg').setOrigin(0, 0.5);
        this.healthBarFill = this.add.image(126, 28, 'health_fill').setOrigin(0, 0.5);
        this.healthBarBg.setDisplaySize(260, 16);
        this.healthBarFill.displayHeight = 16;
        this.healthBarFill.displayWidth = 260;
        this.healthText = this.add.text(132, 28, '', { fontSize: '12px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);

        this.xpBarBg = this.add.image(126, 55, 'xp_bg').setOrigin(0, 0.5);
        this.xpBarFill = this.add.image(126, 55, 'xp_fill').setOrigin(0, 0.5);
        this.xpBarBg.setDisplaySize(260, 12);
        this.xpBarFill.displayHeight = 12;
        this.xpBarFill.displayWidth = 0;
        this.xpText = this.add.text(132, 55, '', { fontSize: '10px', fill: '#090b12', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);

        this.waveText = this.add.text(GAME_WIDTH - 102, 31, 'WAVE 1', { fontSize: '18px', fill: '#ffe7b3', fontFamily: 'Arial Black' }).setOrigin(0.5, 0.5).setDepth(5);
        this.scoreText = this.add.text(GAME_WIDTH - 102, 56, 'SCORE: 0', { fontSize: '12px', fill: '#d5e4ff', fontFamily: 'Arial Black' }).setOrigin(0.5, 0.5).setDepth(5);
        this.levelText = this.add.text(GAME_WIDTH - 102, 78, 'LVL 1', { fontSize: '13px', fill: '#38d9ff', fontFamily: 'Arial Black' }).setOrigin(0.5, 0.5).setDepth(5);
        this.factoryStatusText = this.add.text(GAME_WIDTH - 102, 101, '', { fontSize: '11px', fill: '#f6b84b', align: 'center', fontFamily: 'Arial Black' }).setOrigin(0.5, 0.5);
        this.playerDownBanner = this.add.text(GAME_CENTER_X, GAME_HEIGHT - 40, 'PLAYER DOWN', {
            fontSize: '18px',
            fill: '#ffd27a',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(6).setVisible(false);

        [
            this.bobaCountText, this.reloadText, this.playerStateText, this.rageText, this.tcText,
            this.outputText, this.dashText, this.abilityBarBg, this.abilityBarFill, this.healthBarBg, this.healthBarFill, this.healthText,
            this.xpBarBg, this.xpBarFill, this.xpText, this.waveText, this.scoreText,
            this.levelText, this.factoryStatusText
        ].forEach(node => node?.setDepth?.(5));

        this.updateBobaDisplay();
    }

    setupMultiplayerRun() {
        this.multiplayerSession = globalThis.BobaMultiplayerSession || null;
        this.remotePlayer = null;
        this.remotePlayerName = null;
        this.remotePlayerStatus = null;
        this.lastMultiplayerStateAt = 0;
        if (!this.multiplayerSession?.code || !this.multiplayerSession?.playerId) return;

        this.remotePlayer = this.add.image(this.player.x + 70, this.player.y, this.playerTextureKey || 'player_boba')
            .setOrigin(this.weaponProfile?.playerOrigin?.x || 0.5, this.weaponProfile?.playerOrigin?.y || 0.5)
            .setScale((this.weaponProfile?.playerScale || 0.14) * 0.95)
            .setAlpha(0.68)
            .setTint(0x7ed2ff)
            .setDepth(3.2)
            .setVisible(false);
        this.remotePlayerName = this.add.text(this.player.x + 70, this.player.y - 46, 'FRIEND', {
            fontSize: '10px',
            fill: '#7ed2ff',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(5).setVisible(false);
        this.remotePlayerStatus = this.add.text(GAME_CENTER_X, 26, `ROOM ${this.multiplayerSession.code}`, {
            fontSize: '12px',
            fill: '#7cff8a',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(6);

        this.multiplayerPollTimer = this.time.addEvent({
            delay: 850,
            callback: () => this.pollMultiplayerRoom(),
            loop: true
        });
        this.sendMultiplayerState();
        this.pollMultiplayerRoom();
    }

    updateMultiplayerRun(time = 0) {
        if (!this.multiplayerSession?.code || !this.player?.active) return;
        if (time >= (this.lastMultiplayerStateAt || 0) + 180) {
            this.lastMultiplayerStateAt = time;
            this.sendMultiplayerState();
        }
    }

    sendMultiplayerState() {
        if (!this.multiplayerSession?.code || !this.player?.active || !window.BobaAuth?.sendMultiplayerState) return;
        const state = {
            x: this.player.x,
            y: this.player.y,
            health: GameState.health,
            maxHealth: GameState.maxHealth,
            wave: GameState.wave,
            score: GameState.score,
            level: GameState.level,
            down: this.playerDown || this.runEnded,
            build: `${getDrinkOption().name} + ${getGunOption().name}`
        };
        window.BobaAuth.sendMultiplayerState(this.multiplayerSession.code, this.multiplayerSession.playerId, state)
            .then(data => this.applyMultiplayerRoom(data.room))
            .catch(() => {
                this.remotePlayerStatus?.setText(`ROOM ${this.multiplayerSession.code} - SYNC LOST`).setColor('#ff9d9d');
            });
    }

    pollMultiplayerRoom() {
        if (!this.multiplayerSession?.code || !window.BobaAuth?.fetchMultiplayerRoom) return;
        window.BobaAuth.fetchMultiplayerRoom(this.multiplayerSession.code)
            .then(data => this.applyMultiplayerRoom(data.room))
            .catch(() => {
                this.remotePlayerStatus?.setText(`ROOM ${this.multiplayerSession.code} - WAITING`).setColor('#ffd27a');
            });
    }

    applyMultiplayerRoom(room) {
        if (!room || !this.multiplayerSession?.playerId) return;
        const friend = (room.players || []).find(player => player.id !== this.multiplayerSession.playerId && player.state);
        this.remotePlayerStatus?.setText(`ROOM ${room.code} - ${(room.players || []).length}/2`).setColor('#7cff8a');
        if (!friend?.state || !this.remotePlayer) {
            this.remotePlayer?.setVisible(false);
            this.remotePlayerName?.setVisible(false);
            return;
        }
        this.remotePlayer.setVisible(true);
        this.remotePlayerName?.setVisible(true);
        this.tweens.add({
            targets: this.remotePlayer,
            x: friend.state.x,
            y: friend.state.y,
            duration: 160,
            ease: 'Linear'
        });
        this.remotePlayer.setAlpha(friend.state.down ? 0.28 : 0.68);
        this.remotePlayerName
            ?.setText(`${friend.name || 'FRIEND'}  W${friend.state.wave}  L${friend.state.level}`)
            .setPosition(friend.state.x, friend.state.y - 46);
    }

    configureWave() {
        const waveScale = getEnemyWaveScale(GameState.wave, 0.12);
        const postWaveFivePressure = GameState.wave > 5 ? 1 + Math.min(1.6, (GameState.wave - 5) * 0.14) : 1;
        this.enemiesPerWave = Math.floor((9 + (GameState.wave * 2.2) + (waveScale * 4)) * postWaveFivePressure);
        this.enemiesSpawnedThisWave = 0;
        this.enemiesKilledThisWave = 0;
        this.maxActiveEnemies = Math.min(95, Math.floor((7 + (GameState.wave * 1.35) + (waveScale * 2.4)) * postWaveFivePressure));
        const waveSpawnDelay = Math.floor(950 / getEnemyWaveScale(GameState.wave, 0.16));
        const pressureDelay = Math.floor(waveSpawnDelay / postWaveFivePressure);
        this.spawnDelay = GameState.wave >= 10 ? Math.max(35, Math.floor(pressureDelay / 2)) : Math.max(GameState.wave > 5 ? 55 : 90, pressureDelay);
        if (this.enemySpawnTimer) {
            this.enemySpawnTimer.delay = this.spawnDelay;
            this.enemySpawnTimer.paused = false;
        }
    }

    update(time) {
        if (GameState.paused || this.runEnded) return;

        this.updatePlayerMovement();
        this.updateDash(time);
        this.updatePlayerVisuals();
        this.updateEnemyHealthBars();
        this.updateFactoryVisual(time);
        this.updateXpPickups();
        this.updateHealingPickups();
        this.updateOrbPet();
        this.updateEquippedPet(time);
        this.updateMultiplayerRun(time);
        this.validateProjectiles();
        this.validateEnemyProjectiles();

        if (!this.playerDown && this.bobaCount <= 0 && !this.isReloading) {
            this.reloadBoba();
        }

        if (!this.playerDown && GameState.aimMode === 'manual') {
            this.updateManualFire(time);
        } else if (!this.playerDown && time >= this.lastFireTime + this.getEffectiveFireRate()) {
            const aimPoint = this.getCurrentAimPoint();
            if (aimPoint && this.shootBoba(aimPoint)) {
                this.lastFireTime = time;
            }
        }

        const projectiles = [...this.bobas.children.entries];
        const enemies = [...this.enemies.children.entries];
        this.updateBuildAbilityZones(time, enemies);
        this.updateMatchaPoison(time, enemies);
        projectiles.forEach(boba => {
            if (!boba.active) return;
            this.updateBobaGrowth(boba);
            this.updateLingeringOrbDamage(boba, enemies, time);
            enemies.forEach(enemy => {
                if (!enemy.active || !boba.active) return;
                const dist = Phaser.Math.Distance.Between(boba.x, boba.y, enemy.x, enemy.y);
                if (dist < 40) {
                    this.hitEnemy(boba, enemy);
                }
            });
        });

        this.updateEnemies(time);
        this.updateAbilityCooldownHud();
    }

    validateProjectiles() {
        this.bobas.children.entries.forEach(boba => {
            if (!boba.active) return;
            if (!['gun', 'wall-split', 'kill-split'].includes(boba.source)) {
                boba.destroy();
                return;
            }
            if (boba.source === 'wall-split' && this.wallSplitCount <= 0) {
                boba.destroy();
                return;
            }
            if (boba.source === 'kill-split' && !this.splitOnKill) {
                boba.destroy();
            }
        });
    }

    validateEnemyProjectiles() {
        this.enemyProjectiles?.children.entries.forEach(projectile => {
            if (!projectile.active) return;
            if (projectile.x < -80 || projectile.x > GAME_WIDTH + 80 || projectile.y < -80 || projectile.y > GAME_HEIGHT + 80) {
                projectile.destroy();
            }
        });
    }

    updatePlayerMovement() {
        if (this.playerDown) {
            this.player.body.setVelocity(0);
            return;
        }
        if (this.isDashing) return;

        let vx = 0;
        let vy = 0;
        if (this.cursors.left.isDown) vx = -1;
        else if (this.cursors.right.isDown) vx = 1;
        if (this.cursors.up.isDown) vy = -1;
        else if (this.cursors.down.isDown) vy = 1;

        if (vx !== 0 || vy !== 0) {
            const len = Math.sqrt((vx * vx) + (vy * vy));
            const speed = this.getEffectivePlayerSpeed();
            const dirX = vx / len;
            const dirY = vy / len;
            this.lastMoveDir = { x: dirX, y: dirY };
            this.player.body.setVelocity(dirX * speed, dirY * speed);
        } else {
            this.player.body.setVelocity(0);
        }
    }

    updateDash(time) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.dash)) {
            this.tryBuildAbility(time);
        }
        if (this.isDashing && time >= this.dashUntil) {
            this.isDashing = false;
            this.dashDamageReduction = 0;
            this.player.clearTint();
        }
        if (this.dashCharges < this.maxDashCharges && time >= this.nextDashRechargeAt) {
            this.dashCharges++;
            this.nextDashRechargeAt = this.dashCharges < this.maxDashCharges ? time + this.dashRechargeDelay : 0;
            this.updateUI();
        }
    }

    tryDash(time) {
        if (this.playerDown || this.runEnded || this.dashCharges <= 0) return;
        this.dashCharges--;

        const dir = this.getDashDirection();
        this.isDashing = true;
        this.dashDamageReduction = 0.5;
        this.dashUntil = time + 210;
        if (this.dashCharges < this.maxDashCharges && this.nextDashRechargeAt <= 0) {
            this.nextDashRechargeAt = this.dashUntil + this.dashRechargeDelay;
        }
        this.player.body.setVelocity(dir.x * 760, dir.y * 760);
        this.player.setTint(0x9dfff2);
        if (this.buildAbilityType === 'classicDash') {
            this.reloadAmmoFromAbility();
            this.createAbilityScreenTinge(0x7efcff, 360, 0.18);
            this.createAbilityParticles(0x7efcff, 360, 70, 6);
        }
        this.playDashRoll(dir);
        this.createDashEffect(dir);
        this.applyDashKnockback(dir);
        this.updateUI();
    }

    tryBuildAbility(time) {
        if (this.playerDown || this.runEnded || time < this.nextAbilityAt) return;
        if (this.buildAbilityType === 'classicDash') {
            this.tryDash(time);
            return;
        }
        this.abilityActiveUntil = time + BUILD_ABILITY_DURATION_MS;
        this.nextAbilityAt = this.abilityActiveUntil + this.abilityCooldownMs;

        if (this.buildAbilityType === 'sugarRush') {
            this.infiniteAmmoUntil = this.abilityActiveUntil;
            this.fireRateBoostUntil = this.abilityActiveUntil;
            this.fireRateBoostMultiplier = 1.85;
            this.bobaCount = this.maxBobaCount;
            this.isReloading = false;
            this.reloadText?.setVisible(false);
            this.createAbilityPulse(0xff6f9f, 96);
            this.createAbilityScreenTinge(0xff6f9f, BUILD_ABILITY_DURATION_MS, 0.12);
            this.createAbilityParticles(0xff6f9f, BUILD_ABILITY_DURATION_MS, 86, 8);
        } else if (this.buildAbilityType === 'zenGarden') {
            this.createTimedDamageZone(this.player.x, this.player.y, 120, 0x83f28f, 0.12, this.abilityActiveUntil, {
                followPlayer: true,
                healPerTick: 2,
                slow: 0.45
            });
            this.matchaOrbDurationBoostUntil = time + 7000;
            this.createAbilityPulse(0x83f28f, 128);
            this.createAbilityScreenTinge(0x83f28f, BUILD_ABILITY_DURATION_MS, 0.10);
            this.createAbilityParticles(0x83f28f, BUILD_ABILITY_DURATION_MS, 110, 9);
        } else if (this.buildAbilityType === 'crystalFocus') {
            this.accuracyBoostUntil = this.abilityActiveUntil;
            this.fireRateBoostUntil = this.abilityActiveUntil;
            this.fireRateBoostMultiplier = 1.25;
            this.enemies.children.entries.forEach(enemy => {
                if (!enemy.active) return;
                enemy.nextAttackAt = Math.max(enemy.nextAttackAt || 0, time + 700);
                enemy.body.velocity.scale(0.22);
                enemy.setTint(0xb7f7ff);
            });
            this.time.delayedCall(BUILD_ABILITY_DURATION_MS, () => {
                this.enemies?.children.entries.forEach(enemy => { if (enemy.active) enemy.clearTint(); });
            });
            this.createAbilityPulse(0x8ee8ff, 112);
            this.createAbilityScreenTinge(0x8ee8ff, BUILD_ABILITY_DURATION_MS, 0.13);
            this.createAbilityParticles(0x8ee8ff, BUILD_ABILITY_DURATION_MS, 94, 7);
        } else if (this.buildAbilityType === 'tigerFocus') {
            this.tigerDamageBoostUntil = this.abilityActiveUntil;
            this.player.setTint(0xffd36a);
            this.time.delayedCall(BUILD_ABILITY_DURATION_MS, () => {
                if (!this.playerDown && this.player?.active) {
                    this.player.clearTint();
                }
            });
            this.createAbilityPulse(0xffb14f, 132);
            this.createAbilityScreenTinge(0xffb14f, BUILD_ABILITY_DURATION_MS, 0.12);
            this.createAbilityParticles(0xffb14f, BUILD_ABILITY_DURATION_MS, 96, 9);
        }
        this.updateUI();
    }

    performTigerBladeFlurry() {
        const slashDamage = this.playerDamage * 2;
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 65, () => {
                if (this.playerDown || this.runEnded) return;
                const aimPoint = this.getCurrentAimPoint() || this.getVisualAimPoint();
                const pivot = this.getGunPivot();
                const angle = Phaser.Math.Angle.Between(pivot.x, pivot.y, aimPoint.x, aimPoint.y);
                this.createTigerSlash(angle, slashDamage, true, 118);
            });
        }
    }

    createAbilityPulse(color, radius) {
        const pulse = this.add.circle(this.player.x, this.player.y, radius, color, 0.18)
            .setStrokeStyle(3, color, 0.65)
            .setDepth(2);
        this.tweens.add({
            targets: pulse,
            alpha: 0,
            scale: 1.8,
            duration: 420,
            ease: 'Sine.easeOut',
            onComplete: () => pulse.destroy()
        });
    }

    createAbilityScreenTinge(color, duration = 420, alpha = 0.12) {
        const overlay = this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, color, alpha)
            .setDepth(3.5)
            .setBlendMode(Phaser.BlendModes.ADD);

        this.time.delayedCall(duration, () => {
            if (!overlay.active) return;
            this.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 260,
                ease: 'Sine.easeOut',
                onComplete: () => overlay.destroy()
            });
        });
    }

    createAbilityParticles(color, duration = 420, radius = 84, burstCount = 7) {
        const endAt = this.time.now + duration;
        const spawnBurst = () => {
            if (this.playerDown || this.runEnded || !this.player?.active || this.time.now > endAt) return;
            for (let i = 0; i < burstCount; i++) {
                this.spawnAbilityParticle(color, radius);
            }
        };

        spawnBurst();
        const timer = this.time.addEvent({
            delay: 115,
            loop: true,
            callback: () => {
                if (this.time.now > endAt || this.playerDown || this.runEnded || !this.player?.active) {
                    timer.remove(false);
                    return;
                }
                spawnBurst();
            }
        });
    }

    spawnAbilityParticle(color, radius) {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const startRadius = Phaser.Math.Between(12, Math.max(16, radius * 0.42));
        const endRadius = Phaser.Math.Between(Math.floor(radius * 0.55), radius);
        const startX = this.player.x + Math.cos(angle) * startRadius;
        const startY = this.player.y + Math.sin(angle) * startRadius;
        const particle = this.add.circle(startX, startY, Phaser.Math.Between(2, 5), color, 0.72)
            .setDepth(3.7)
            .setBlendMode(Phaser.BlendModes.ADD);

        this.tweens.add({
            targets: particle,
            x: this.player.x + Math.cos(angle) * endRadius,
            y: this.player.y + Math.sin(angle) * endRadius,
            alpha: 0,
            scale: Phaser.Math.FloatBetween(1.4, 2.4),
            duration: Phaser.Math.Between(320, 560),
            ease: 'Sine.easeOut',
            onComplete: () => particle.destroy()
        });
    }

    reloadAmmoFromAbility() {
        this.reloadToken++;
        this.bobaCount = this.maxBobaCount;
        this.isReloading = false;
        this.reloadText?.setVisible(false);
        this.updateBobaDisplay();
    }

    getDashDirection() {
        let dx = 0;
        let dy = 0;
        if (this.cursors.left.isDown) dx -= 1;
        if (this.cursors.right.isDown) dx += 1;
        if (this.cursors.up.isDown) dy -= 1;
        if (this.cursors.down.isDown) dy += 1;
        if (dx === 0 && dy === 0) {
            dx = this.lastMoveDir.x;
            dy = this.lastMoveDir.y;
        }
        const len = Math.max(0.001, Math.sqrt((dx * dx) + (dy * dy)));
        return { x: dx / len, y: dy / len };
    }

    createDashEffect(dir) {
        const trail = this.add.rectangle(this.player.x - dir.x * 34, this.player.y - dir.y * 34, 92, 20, 0x7efcff, 0.45)
            .setRotation(Math.atan2(dir.y, dir.x))
            .setDepth(2);
        const ring = this.add.circle(this.player.x, this.player.y, 30, 0x9dfff2, 0.24)
            .setStrokeStyle(3, 0x9dfff2, 0.9)
            .setDepth(2);
        this.tweens.add({
            targets: trail,
            alpha: 0,
            scaleX: 1.8,
            duration: 220,
            ease: 'Sine.easeOut',
            onComplete: () => trail.destroy()
        });
        this.tweens.add({
            targets: ring,
            alpha: 0,
            scale: 2.1,
            duration: 260,
            ease: 'Sine.easeOut',
            onComplete: () => ring.destroy()
        });
    }

    playDashRoll(dir) {
        this.tweens.killTweensOf(this.player);
        const spinDirection = dir.x < 0 ? -1 : 1;
        const baseScale = this.weaponProfile?.playerScale || 0.14;
        this.tweens.add({
            targets: this.player,
            angle: this.player.angle + (360 * spinDirection),
            scaleX: baseScale * 1.12,
            scaleY: baseScale * 0.88,
            duration: 210,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (!this.player?.active) return;
                this.tweens.add({
                    targets: this.player,
                    angle: 0,
                    scaleX: baseScale,
                    scaleY: baseScale,
                    duration: 90,
                    ease: 'Back.easeOut'
                });
            }
        });
    }

    applyDashKnockback(dir) {
        let dashedThroughEnemy = false;
        this.enemies?.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist > 120) return;
            dashedThroughEnemy = true;
            const away = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            enemy.body.setVelocity(Math.cos(away) * 460 + dir.x * 180, Math.sin(away) * 460 + dir.y * 180);
            enemy.nextAttackAt = Math.max(enemy.nextAttackAt || 0, this.time.now + 450);
            enemy.hp -= this.playerDamage * 0.85;
            this.showDamageNumber(enemy.x, enemy.y, this.playerDamage * 0.85, '#9dfff2');
            if (enemy.hp <= 0) {
                this.killEnemyFromAbility(enemy);
            }
        });
        if (dashedThroughEnemy && this.buildAbilityType === 'classicDash') {
            this.reloadAmmoFromAbility();
            this.fireRateBoostUntil = this.time.now + 1800;
            this.fireRateBoostMultiplier = 1.65;
        }
    }

    createTimedDamageZone(x, y, radius, color, alpha, expiresAt, options = {}) {
        const zone = {
            x, y, radius, expiresAt,
            followPlayer: !!options.followPlayer,
            damagePerTick: options.damagePerTick || 0,
            healPerTick: options.healPerTick || 0,
            slow: options.slow || 0,
            nextTickAt: this.time.now,
            graphic: this.add.circle(x, y, radius, color, alpha)
                .setStrokeStyle(2, color, 0.5)
                .setDepth(1)
        };
        this.damageZones.push(zone);
        return zone;
    }

    updateBuildAbilityZones(time, enemies = []) {
        this.damageZones = this.damageZones.filter(zone => {
            if (time >= zone.expiresAt) {
                zone.graphic?.destroy();
                return false;
            }
            if (zone.followPlayer) {
                zone.x = this.player.x;
                zone.y = this.player.y;
                zone.graphic.setPosition(zone.x, zone.y);
            }
            if (time < zone.nextTickAt) return true;
            zone.nextTickAt = time + 450;
            if (zone.healPerTick > 0 && !this.playerDown) {
                GameState.health = Math.min(GameState.maxHealth, GameState.health + zone.healPerTick);
            }
            enemies.forEach(enemy => {
                if (!enemy.active) return;
                const dist = Phaser.Math.Distance.Between(zone.x, zone.y, enemy.x, enemy.y);
                if (dist > zone.radius) return;
                if (zone.slow > 0) {
                    enemy.body.velocity.scale(zone.slow);
                    enemy.nextAttackAt = Math.max(enemy.nextAttackAt || 0, time + 280);
                }
                if (zone.damagePerTick > 0) {
                    enemy.hp -= zone.damagePerTick;
                    this.showDamageNumber(enemy.x, enemy.y, zone.damagePerTick, '#ffb14f');
                    if (enemy.hp <= 0) {
                        this.killEnemyFromAbility(enemy);
                    }
                }
            });
            return true;
        });
    }

    updateLingeringOrbDamage(boba, enemies, time) {
        if (boba.weaponType !== 'matchaOrb' || time < (boba.nextZoneTickAt || 0)) return;
        boba.nextZoneTickAt = time + 520;
        enemies.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(boba.x, boba.y, enemy.x, enemy.y);
            if (dist > 64) return;
            const damage = (boba.baseDamage || this.playerDamage) * 0.32;
            enemy.hp -= damage;
            enemy.body.velocity.scale(0.72);
            this.showDamageNumber(enemy.x, enemy.y, damage, '#83f28f');
            this.applyMatchaPoison(enemy, boba.baseDamage || this.playerDamage);
            this.healFromMatchaDamage(damage);
            if (enemy.hp <= 0) {
                this.killEnemyFromAbility(enemy);
            }
        });
    }

    applyMatchaPoison(enemy, baseDamage = this.playerDamage) {
        if (!enemy?.active) return;
        enemy.matchaPoisonUntil = Math.max(enemy.matchaPoisonUntil || 0, this.time.now + 2400);
        enemy.matchaPoisonDamage = Math.max(enemy.matchaPoisonDamage || 0, baseDamage * this.matchaPoisonDamageScale);
        enemy.matchaPoisonNextTickAt = Math.min(enemy.matchaPoisonNextTickAt || Infinity, this.time.now + 420);
        enemy.setTint(0x83f28f);
    }

    updateMatchaPoison(time, enemies = []) {
        enemies.forEach(enemy => {
            if (!enemy.active || !enemy.matchaPoisonUntil) return;
            if (time >= enemy.matchaPoisonUntil) {
                enemy.matchaPoisonUntil = 0;
                enemy.matchaPoisonDamage = 0;
                enemy.clearTint();
                return;
            }
            if (time < (enemy.matchaPoisonNextTickAt || 0)) return;
            enemy.matchaPoisonNextTickAt = time + 520;
            const damage = enemy.matchaPoisonDamage || this.playerDamage * this.matchaPoisonDamageScale;
            this.damageEnemyFromAbility(enemy, damage, '#83f28f');
            this.healFromMatchaDamage(damage);
        });
    }

    healFromMatchaDamage(damage) {
        if (this.playerDown || GameState.health >= GameState.maxHealth) return;
        const heal = Math.max(1, damage * this.matchaLifestealScale);
        GameState.health = Math.min(GameState.maxHealth, GameState.health + heal);
    }

    getEffectivePlayerSpeed() {
        let speed = this.playerSpeed;
        if (this.xpSpeedBoostEnabled && this.time.now < this.xpSpeedBoostUntil) speed *= 2;
        if (this.time.now < this.speedBoostUntil) speed *= this.speedBoostMultiplier;
        return speed;
    }

    getEffectiveFireRate() {
        const boost = this.time.now < this.fireRateBoostUntil ? this.fireRateBoostMultiplier : 1;
        return Math.max(45, this.playerFireRate / boost);
    }

    applySpeedDamageBonus() {
        const speedBonus = Math.max(0, (this.playerSpeed / this.basePlayerSpeed) - 1);
        this.playerDamage *= 1 + (speedBonus * 0.1);
    }

    applyAttackSpeedBoost(percent) {
        this.playerFireRate = Math.max(60, this.playerFireRate / (1 + percent));
    }

    getAmmoDamageMultiplier() {
        if (this.ammoDamageRamp) {
            const shotsFiredFromClip = Math.max(0, this.maxBobaCount - this.bobaCount);
            return Math.pow(2, shotsFiredFromClip);
        }
        return this.bobaCount <= (this.lastAmmoDoubleCount || 0) ? 2 : 1;
    }

    triggerXpPickupBoost() {
        if (!this.xpSpeedBoostEnabled) return;
        this.xpSpeedBoostUntil = this.time.now + 3000;
    }

    spawnXpPickup(x, y, amount = getXpPerKill(this)) {
        if (!this.xpPickups) return;
        const pickup = this.physics.add.image(x, y, 'xp_pickup');
        pickup.xpAmount = amount;
        pickup.setDepth(2);
        pickup.setScale(1);
        pickup.body.setCircle(8, 4, 4);
        pickup.body.setAllowGravity(false);
        pickup.body.setVelocity(Phaser.Math.Between(-45, 45), Phaser.Math.Between(-55, 25));
        pickup.body.setDrag(120, 120);
        this.xpPickups.add(pickup);
        this.tweens.add({
            targets: pickup,
            scale: 1.18,
            yoyo: true,
            repeat: -1,
            duration: 450
        });
    }

    updateXpPickups() {
        if (!this.xpPickups || !this.player?.active) return;
        this.xpPickups.children.entries.forEach(pickup => {
            if (!pickup.active) return;
            const dist = Phaser.Math.Distance.Between(pickup.x, pickup.y, this.player.x, this.player.y);
            if (dist < XP_ORB_MAGNET_RANGE) {
                const pull = Math.max(0, (XP_ORB_MAGNET_RANGE - dist) / XP_ORB_MAGNET_RANGE);
                const speed = Math.max(
                    this.getEffectivePlayerSpeed() + XP_ORB_PLAYER_SPEED_BONUS,
                    Phaser.Math.Linear(XP_ORB_MIN_SPEED, XP_ORB_MAX_SPEED, pull)
                );
                this.physics.moveToObject(pickup, this.player, speed);
            }
        });
    }

    collectXpPickup(player, pickup) {
        if (!pickup.active) return;
        const amount = pickup.xpAmount || getXpPerKill(this);
        pickup.destroy();
        GameState.addXP(amount);
        this.triggerXpPickupBoost();
        this.showDamageNumber(player.x, player.y - 34, `+${amount} XP`, '#7ed2ff');
        this.updateUI();
        this.maybeLaunchLevelUpgrade();
    }

    spawnHealingPickup(x, y) {
        if (!this.healingPickups) return;
        const pickup = this.physics.add.image(x, y, 'heal_pickup');
        pickup.healAmount = HEALING_ORB_HEAL_AMOUNT;
        pickup.setDepth(2);
        pickup.setScale(1);
        pickup.body.setCircle(8, 4, 4);
        pickup.body.setAllowGravity(false);
        pickup.body.setVelocity(Phaser.Math.Between(-35, 35), Phaser.Math.Between(-45, 20));
        pickup.body.setDrag(120, 120);
        this.healingPickups.add(pickup);
        this.tweens.add({
            targets: pickup,
            scale: 1.16,
            yoyo: true,
            repeat: -1,
            duration: 420
        });
    }

    updateHealingPickups() {
        if (!this.healingPickups || !this.player?.active) return;
        this.healingPickups.children.entries.forEach(pickup => {
            if (!pickup.active) return;
            const dist = Phaser.Math.Distance.Between(pickup.x, pickup.y, this.player.x, this.player.y);
            if (dist < XP_ORB_MAGNET_RANGE) {
                const pull = Math.max(0, (XP_ORB_MAGNET_RANGE - dist) / XP_ORB_MAGNET_RANGE);
                const speed = Math.max(
                    this.getEffectivePlayerSpeed() + XP_ORB_PLAYER_SPEED_BONUS,
                    Phaser.Math.Linear(XP_ORB_MIN_SPEED, XP_ORB_MAX_SPEED, pull)
                );
                this.physics.moveToObject(pickup, this.player, speed);
            }
        });
    }

    createOrbPet() {
        if (this.orbPet?.active || !this.player?.active) return;
        this.orbPet = this.add.image(this.player.x - 34, this.player.y + 24, 'projectile_boba')
            .setScale(0.13)
            .setTint(0x7ed2ff)
            .setDepth(4);
    }

    updateOrbPet() {
        if (!this.orbPetEnabled || !this.player?.active) return;
        if (!this.orbPet?.active) {
            this.createOrbPet();
            return;
        }
        const pickups = [
            ...(this.xpPickups?.children.entries || []).map(pickup => ({ pickup, type: 'xp' })),
            ...(this.healingPickups?.children.entries || []).map(pickup => ({ pickup, type: 'heal' }))
        ].filter(entry => entry.pickup.active);
        let target = null;
        let nearestDist = Infinity;
        pickups.forEach(entry => {
            const dist = Phaser.Math.Distance.Between(this.orbPet.x, this.orbPet.y, entry.pickup.x, entry.pickup.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                target = entry;
            }
        });
        const follow = target && nearestDist < 360
            ? target.pickup
            : { x: this.player.x - 42, y: this.player.y + 28 };
        const angle = Phaser.Math.Angle.Between(this.orbPet.x, this.orbPet.y, follow.x, follow.y);
        const speed = target ? 12 : 7;
        this.orbPet.x += Math.cos(angle) * Math.min(speed, Phaser.Math.Distance.Between(this.orbPet.x, this.orbPet.y, follow.x, follow.y));
        this.orbPet.y += Math.sin(angle) * Math.min(speed, Phaser.Math.Distance.Between(this.orbPet.x, this.orbPet.y, follow.x, follow.y));
        this.orbPet.rotation += 0.08;
        if (target && Phaser.Math.Distance.Between(this.orbPet.x, this.orbPet.y, target.pickup.x, target.pickup.y) < 22) {
            if (target.type === 'xp') {
                this.collectXpPickup(this.player, target.pickup);
            } else {
                this.collectHealingPickup(this.player, target.pickup);
            }
        }
    }

    createEquippedPet() {
        const pet = getBoostBayLoadoutOption('pets', GameState.selectedPet || 'none');
        if (!pet || pet.id === 'none' || !pet.assetKey || !isBoostBayLoadoutUnlocked('pets', pet.id) || !this.textures.exists(pet.assetKey)) {
            this.equippedPet = null;
            this.equippedPetGlow = null;
            return;
        }

        this.equippedPetOption = pet;
        this.equippedPetGlow = this.add.circle(this.player.x - 48, this.player.y + 30, 21, BOBA_THEME.matcha, 0.18)
            .setStrokeStyle(2, BOBA_THEME.matcha, 0.6)
            .setDepth(3.8);
        this.equippedPet = this.add.image(this.player.x - 48, this.player.y + 24, pet.assetKey)
            .setScale(0.22)
            .setDepth(4.1);
        this.equippedPetLabel = this.add.text(this.player.x - 48, this.player.y + 55, pet.name.split(' ')[0].toUpperCase(), {
            fontSize: '8px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(4.2);
        this.equippedPet.nextActionAt = 0;
        this.equippedPet.homeAngle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    }

    updateEquippedPet(time = 0) {
        if (!this.equippedPet?.active || !this.player?.active) return;
        const bob = Math.sin(time / 180) * 6;
        const targetEnemy = this.findNearestEnemy(this.equippedPet.x, this.equippedPet.y, 520);
        const targetPickup = this.equippedPetOption?.name === 'Boba Magnet Crab'
            ? this.findNearestPetPickup(720)
            : null;
        let targetX = this.player.x - 48 + Math.cos((time / 900) + this.equippedPet.homeAngle) * 18;
        let targetY = this.player.y + 26 + bob + Math.sin((time / 900) + this.equippedPet.homeAngle) * 12;
        if (targetPickup) {
            targetX = targetPickup.pickup.x;
            targetY = targetPickup.pickup.y + bob;
        } else if (targetEnemy && this.equippedPetOption?.name !== 'Boba Magnet Crab') {
            const orbit = Phaser.Math.Angle.Between(targetEnemy.x, targetEnemy.y, this.player.x, this.player.y);
            targetX = targetEnemy.x + Math.cos(orbit) * 76;
            targetY = targetEnemy.y + Math.sin(orbit) * 76 + bob;
        }
        const dist = Phaser.Math.Distance.Between(this.equippedPet.x, this.equippedPet.y, targetX, targetY);
        const step = Math.min(dist, targetPickup ? 13 : targetEnemy ? 9 : 6.5);
        if (dist > 0.5) {
            const angle = Phaser.Math.Angle.Between(this.equippedPet.x, this.equippedPet.y, targetX, targetY);
            this.equippedPet.x += Math.cos(angle) * step;
            this.equippedPet.y += Math.sin(angle) * step;
        }
        this.equippedPet.setFlipX(this.equippedPet.x > this.player.x);
        this.equippedPetGlow?.setPosition(this.equippedPet.x, this.equippedPet.y + 7);
        this.equippedPetGlow?.setAlpha(0.16 + (Math.sin(time / 220) + 1) * 0.04);
        this.equippedPetLabel?.setPosition(this.equippedPet.x, this.equippedPet.y + 31);
        this.updateEquippedPetAction(time);
    }

    updateEquippedPetAction(time = 0) {
        if (!this.equippedPet?.active || time < (this.equippedPet.nextActionAt || 0)) return;
        const petName = this.equippedPetOption?.name || '';
        if (petName === 'Boba Magnet Crab') {
            this.performMagnetCrabAction();
            this.equippedPet.nextActionAt = time + 260;
            return;
        }

        const enemy = this.findNearestEnemy(this.equippedPet.x, this.equippedPet.y, petName === 'Lychee Drone' ? 720 : 460);
        if (!enemy) {
            this.equippedPet.nextActionAt = time + 450;
            return;
        }

        if (petName === 'Tapioca Slime') {
            this.performTapiocaSlimeAction(enemy);
            this.equippedPet.nextActionAt = time + 3600;
        } else if (petName === 'Lychee Drone') {
            this.performLycheeDroneAction(enemy);
            this.equippedPet.nextActionAt = time + 1450;
        } else if (petName === 'Matcha Spirit') {
            this.performMatchaSpiritAction(enemy);
            this.equippedPet.nextActionAt = time + 3100;
        } else if (petName === 'Tiger Cub') {
            this.performTigerCubAction(enemy);
            this.equippedPet.nextActionAt = time + 2200;
        } else if (petName === 'Sugar Ghost') {
            this.performSugarGhostAction(enemy);
            this.equippedPet.nextActionAt = time + 3000;
        }
    }

    pulseEquippedPet(color = 0xffffff) {
        if (!this.equippedPet?.active) return;
        this.equippedPet.setTint(color);
        this.tweens.add({
            targets: this.equippedPet,
            scale: 0.29,
            duration: 90,
            yoyo: true,
            ease: 'Sine.easeOut',
            onComplete: () => {
                if (this.equippedPet?.active) {
                    this.equippedPet.clearTint();
                    this.equippedPet.setScale(0.22);
                }
            }
        });
    }

    showPetActionText(text, color = '#fff4d6') {
        if (!this.equippedPet?.active) return;
        const label = this.add.text(this.equippedPet.x, this.equippedPet.y - 34, text, {
            fontSize: '11px',
            fill: color,
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(8);
        this.tweens.add({
            targets: label,
            y: label.y - 28,
            alpha: 0,
            duration: 520,
            ease: 'Sine.easeOut',
            onComplete: () => label.destroy()
        });
    }

    performTapiocaSlimeAction(enemy) {
        this.pulseEquippedPet(0x7cff8a);
        this.showPetActionText('SPLAT', '#7cff8a');
        const blast = this.add.circle(enemy.x, enemy.y, 24, 0x7cff8a, 0.18)
            .setStrokeStyle(4, 0x7cff8a, 0.76)
            .setDepth(3);
        this.tweens.add({
            targets: blast,
            radius: 92,
            alpha: 0,
            duration: 360,
            ease: 'Sine.easeOut',
            onComplete: () => blast.destroy()
        });
        this.enemies.children.entries.forEach(target => {
            if (!target.active) return;
            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, target.x, target.y) > 92) return;
            target.body.velocity.scale(0.35);
            target.setTint(0x7cff8a);
            this.time.delayedCall(420, () => { if (target.active) target.clearTint(); });
            this.damageEnemyFromAbility(target, 50, '#7cff8a');
        });
    }

    performLycheeDroneAction(enemy) {
        this.pulseEquippedPet(0xff7dcb);
        this.showPetActionText('PEW', '#ff9ddd');
        const angle = Phaser.Math.Angle.Between(this.equippedPet.x, this.equippedPet.y, enemy.x, enemy.y);
        const shot = this.createPlayerBoba(this.equippedPet.x, this.equippedPet.y, angle, 10, 0, 'pet', this.shotVolleyId++);
        if (!shot) return;
        shot.setTexture(this.projectileTextureKey || 'projectile_boba');
        shot.setScale(0.12);
        shot.setTint(0xff9ddd);
        shot.body.velocity.set(Math.cos(angle) * 520, Math.sin(angle) * 520);
        shot.pierceRemaining = 0;
        shot.weaponType = 'petDrone';
    }

    performMatchaSpiritAction(enemy) {
        this.pulseEquippedPet(0x83f28f);
        this.showPetActionText('BEAM', '#83f28f');
        const beam = this.add.rectangle(
            (this.equippedPet.x + enemy.x) / 2,
            (this.equippedPet.y + enemy.y) / 2,
            Phaser.Math.Distance.Between(this.equippedPet.x, this.equippedPet.y, enemy.x, enemy.y),
            8,
            0x83f28f,
            0.48
        ).setOrigin(0, 0.5).setDepth(3.9);
        beam.setPosition(this.equippedPet.x, this.equippedPet.y);
        beam.setRotation(Phaser.Math.Angle.Between(this.equippedPet.x, this.equippedPet.y, enemy.x, enemy.y));
        this.tweens.add({ targets: beam, alpha: 0, duration: 260, onComplete: () => beam.destroy() });
        this.damageEnemyFromAbility(enemy, 20, '#83f28f');
        this.applyMatchaPoison(enemy, 20);
    }

    performTigerCubAction(enemy) {
        this.pulseEquippedPet(0xffb14f);
        this.showPetActionText('MARK', '#ffcf7a');
        this.tweens.add({
            targets: this.equippedPet,
            x: enemy.x - 34,
            y: enemy.y + 16,
            duration: 120,
            yoyo: true,
            ease: 'Quad.easeOut'
        });
        enemy.petMarkedUntil = this.time.now + 2600;
        enemy.setTint(0xffd36a);
        this.time.delayedCall(2600, () => { if (enemy.active) enemy.clearTint(); });
        this.damageEnemyFromAbility(enemy, 16, '#ffcf7a');
    }

    performSugarGhostAction(enemy) {
        this.pulseEquippedPet(0xc99af7);
        this.showPetActionText('ECHO', '#d8b8ff');
        const angle = Phaser.Math.Angle.Between(this.equippedPet.x, this.equippedPet.y, enemy.x, enemy.y);
        [-0.16, 0.16].forEach(offset => {
            const shot = this.createPlayerBoba(this.equippedPet.x, this.equippedPet.y, angle + offset, this.playerDamage * 0.55, 0, 'pet', this.shotVolleyId++);
            if (!shot) return;
            shot.setScale(Math.max(0.1, this.projectileScale * 0.72));
            shot.setTint(0xd8b8ff);
            shot.body.velocity.set(Math.cos(angle + offset) * 460, Math.sin(angle + offset) * 460);
            shot.pierceRemaining = 0;
            shot.weaponType = 'petGhost';
        });
    }

    performMagnetCrabAction() {
        const target = this.findNearestPetPickup(720);
        if (!target) return;
        if (Phaser.Math.Distance.Between(this.equippedPet.x, this.equippedPet.y, target.pickup.x, target.pickup.y) < 26) {
            this.pulseEquippedPet(0x7ed2ff);
            this.showPetActionText('FETCH', '#7ed2ff');
            if (target.type === 'xp') {
                this.collectXpPickup(this.player, target.pickup);
            } else {
                this.collectHealingPickup(this.player, target.pickup);
            }
        }
    }

    findNearestPetPickup(maxDistance = Infinity) {
        if (!this.equippedPet?.active) return null;
        const pickups = [
            ...(this.xpPickups?.children.entries || []).map(pickup => ({ pickup, type: 'xp' })),
            ...(this.healingPickups?.children.entries || []).map(pickup => ({ pickup, type: 'heal' }))
        ].filter(entry => entry.pickup.active);
        let target = null;
        let nearestDist = Infinity;
        pickups.forEach(entry => {
            const dist = Phaser.Math.Distance.Between(this.equippedPet.x, this.equippedPet.y, entry.pickup.x, entry.pickup.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                target = entry;
            }
        });
        return nearestDist <= maxDistance ? target : null;
    }

    collectHealingPickup(player, pickup) {
        if (!pickup.active) return;
        const amount = pickup.healAmount || HEALING_ORB_HEAL_AMOUNT;
        pickup.destroy();
        const before = GameState.health;
        GameState.health = Math.min(GameState.maxHealth, GameState.health + amount);
        const healed = Math.ceil(GameState.health - before);
        this.showDamageNumber(player.x, player.y - 52, `+${healed} HP`, '#7cff8a');
        this.updateUI();
    }

    tickRunIdleProduction() {
        if (GameState.paused || this.runEnded) return;
        const gain = calcIdleMachineTPS();
        if (gain <= 0) return;
        GameState.tapioca += gain;
        GameState.totalTapioca += gain;
        GameState.runTapiocaEarned += gain;
        this.updateUI();
    }

    maybeLaunchLevelUpgrade() {
        if (GameState.pendingLevelUps <= 0 || GameState.upgradeSceneActive) return;
        if (!SPECIAL_DRAFT_ENABLED) {
            GameState.pendingSpecialUpgrades = 0;
        }
        if (buildWeightedUpgradeChoices().length === 0 && buildSpecialUpgradeChoices().length === 0) {
            GameState.pendingLevelUps = 0;
            GameState.pendingSpecialUpgrades = 0;
            return;
        }
        this.setCombatMouseLocked(false);
        GameState.paused = true;
        GameState.upgradeSceneActive = true;
        this.scene.pause();
        this.scene.launch('UpgradeScene');
    }

    syncAimInputMode() {
        this.setCombatMouseLocked(GameState.aimMode !== 'manual');
    }

    setCombatMouseLocked(locked) {
        const canvas = this.game?.canvas;
        if (!canvas) return;
        canvas.style.pointerEvents = '';
        canvas.style.cursor = locked ? 'none' : '';
    }

    updatePlayerVisuals() {
        if (this.playerDown) {
            if (this.gunSprite) {
                this.gunSprite.setVisible(false);
            }
            return;
        }

        const aimPoint = this.getVisualAimPoint();
        const pivot = this.getGunPivot();
        const aimAngle = Phaser.Math.Angle.Between(pivot.x, pivot.y, aimPoint.x, aimPoint.y);
        this.currentAimAngle = aimAngle;
        this.currentGunMuzzle = this.getMuzzleFromAim(aimAngle);
        this.gunSprite.setVisible(true);
        this.gunSprite.setPosition(pivot.x, pivot.y);
        if (this.weaponType === 'tigerBlade') {
            const facingLeft = aimPoint.x < pivot.x;
            this.gunSprite.setOrigin(0.78, 0.5);
            this.gunSprite.setFlipX(false);
            this.gunSprite.setFlipY(facingLeft);
            this.gunSprite.setRotation(aimAngle);
            this.player.setRotation(0);
            return;
        }
        const gunFacesRight = !!this.weaponProfile?.gunFacesRight;
        this.gunSprite.setFlipX(false);
        this.gunSprite.setFlipY(gunFacesRight ? aimPoint.x < pivot.x : aimPoint.x > pivot.x);
        this.gunSprite.setRotation(aimAngle + (gunFacesRight ? 0 : Math.PI));
        this.player.setRotation(0);
    }

    getGunPivot() {
        return {
            x: this.player.x + this.gunPivotOffset.x,
            y: this.player.y + this.gunPivotOffset.y
        };
    }

    getMuzzleFromAim(aimAngle, pivot = this.getGunPivot()) {
        return {
            x: pivot.x + Math.cos(aimAngle) * this.gunMuzzleDistance,
            y: pivot.y + Math.sin(aimAngle) * this.gunMuzzleDistance
        };
    }

    getPlayerShotOrigin(aimAngle = this.currentAimAngle) {
        return this.getMuzzleFromAim(aimAngle);
    }

    isFinitePoint(point) {
        return point
            && Number.isFinite(point.x)
            && Number.isFinite(point.y);
    }

    getPointerAimPoint(pointer = this.input.activePointer) {
        if (this.cameras?.main && Number.isFinite(pointer.x) && Number.isFinite(pointer.y)) {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            if (this.isFinitePoint(worldPoint)) return worldPoint;
        }
        const x = Number.isFinite(pointer.x) ? pointer.x : pointer.worldX;
        const y = Number.isFinite(pointer.y) ? pointer.y : pointer.worldY;
        const point = { x, y };
        return this.isFinitePoint(point) ? point : null;
    }

    beginManualFire(pointer) {
        if (GameState.aimMode !== 'manual') return;
        this.manualFireHeld = true;
        this.fireManualClick(pointer || this.input.activePointer, this.time.now);
    }

    endManualFire() {
        this.manualFireHeld = false;
    }

    updateManualFire(time) {
        if (!this.manualFireHeld) return;
        const pointer = this.input.activePointer;
        if (!pointer || !pointer.isDown) {
            this.endManualFire();
            return;
        }
        this.fireManualClick(pointer, time);
    }

    fireManualClick(pointer, time) {
        if (GameState.aimMode !== 'manual') return;
        if (GameState.paused || this.runEnded || this.playerDown) return;
        if (time < this.lastFireTime + this.getEffectiveFireRate()) return;

        const aimPoint = this.getPointerAimPoint(pointer);
        if (aimPoint && this.shootBoba(aimPoint)) {
            this.lastFireTime = time;
        }
    }

    getCurrentAimPoint() {
        if (GameState.aimMode === 'manual') {
            return this.getPointerAimPoint();
        }

        return this.findNearestEnemy(this.player.x, this.player.y);
    }

    getVisualAimPoint() {
        if (GameState.aimMode === 'manual') {
            return this.getPointerAimPoint() || { x: this.player.x, y: this.player.y - 100 };
        }

        return this.findNearestEnemy(this.player.x, this.player.y) || { x: this.player.x, y: this.player.y - 100 };
    }

    updateEnemyHealthBars() {
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.healthBg || !enemy.healthFill) return;
            if (!enemy.active) {
                enemy.healthBg.destroy();
                enemy.healthFill.destroy();
                enemy.healthBg = null;
                enemy.healthFill = null;
                return;
            }
            enemy.healthBg.setPosition(enemy.x, enemy.y - 20);
            enemy.healthFill.setPosition(enemy.x - 15, enemy.y - 20);
            enemy.healthFill.displayWidth = 30 * Math.max(0, enemy.hp / enemy.maxHp);
        });
    }

    updateFactoryVisual(time) {
    }

    updateEnemies(time) {
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;

            let enemySpeed = Math.min(320, Math.floor(92 + (getEnemyWaveScale(GameState.wave, 0.09) * 16) + ((GameState.wave - 1) * 4)));
            if (time < this.accuracyBoostUntil) {
                enemySpeed *= 0.35;
            }
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distanceToPlayer = Math.max(0.001, Math.sqrt((dx * dx) + (dy * dy)));
            const stopRange = this.getEnemyPlayerStopRange();

            if (enemy.enemyType === 'thrower') {
                this.updateThrowerEnemy(enemy, time, distanceToPlayer, enemySpeed);
            } else if (distanceToPlayer > stopRange + 8) {
                this.physics.moveTo(enemy, this.player.x, this.player.y, enemySpeed);
            } else if (distanceToPlayer < stopRange) {
                const pushSpeed = Math.min(enemySpeed, (stopRange - distanceToPlayer) * 12);
                enemy.body.setVelocity((-dx / distanceToPlayer) * pushSpeed, (-dy / distanceToPlayer) * pushSpeed);
            } else {
                enemy.body.setVelocity(0, 0);
            }
            enemy.setFlipX(enemy.x < this.player.x);

            if (this.isEnemyTouchingPlayer(enemy) && time >= (enemy.nextAttackAt || 0)) {
                this.hitPlayer(this.player, enemy, time);
            }
        });
    }

    updateThrowerEnemy(enemy, time, distanceToPlayer, enemySpeed) {
        const targetRange = 260;
        const minRange = 180;
        const throwerSpeed = enemySpeed * 0.72;
        if (distanceToPlayer > targetRange + 28) {
            this.physics.moveTo(enemy, this.player.x, this.player.y, throwerSpeed);
        } else if (distanceToPlayer < minRange) {
            const angleAway = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            enemy.body.setVelocity(Math.cos(angleAway) * throwerSpeed, Math.sin(angleAway) * throwerSpeed);
        } else {
            enemy.body.setVelocity(0, 0);
        }

        if (!this.playerDown && time >= (enemy.nextThrowAt || 0)) {
            this.throwEnemyProjectile(enemy);
            enemy.nextThrowAt = time + 4000;
        }
    }

    getEnemyPlayerStopRange() {
        const playerScaleBonus = Math.max(0, this.player.scaleX - 0.14) * 120;
        return 52 + playerScaleBonus;
    }

    isEnemyTouchingPlayer(enemy) {
        if (!enemy?.active || !this.player?.active) return false;
        const contactRange = this.getEnemyPlayerStopRange() + 6;
        return Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y) < contactRange;
    }

    getEnemyTarget(enemy) {
        return { type: 'player', x: this.player.x, y: this.player.y, range: 38 };
    }

    shootBoba(target) {
        const hasInfiniteAmmo = this.time.now < (this.infiniteAmmoUntil || 0);
        if ((!hasInfiniteAmmo && this.bobaCount <= 0) || this.playerDown) return false;
        if (!this.isFinitePoint(target)) return false;

        const pivot = this.getGunPivot();
        const baseAngle = Phaser.Math.Angle.Between(pivot.x, pivot.y, target.x, target.y);
        if (!Number.isFinite(baseAngle)) return false;

        const muzzle = this.getMuzzleFromAim(baseAngle, pivot);
        if (!this.isFinitePoint(muzzle)) return false;

        this.currentAimAngle = baseAngle;
        this.currentGunMuzzle = muzzle;

        let fired = false;
        const projectileCount = Math.max(1, this.multiShot || 1);
        let spread = this.weaponProfile?.spread || 0.4;
        if (this.time.now < this.accuracyBoostUntil) {
            spread *= 0.35;
        }
        if (this.randomizedSpreadCore) {
            spread *= 1.9;
        }
        const damageBoost = this.time.now < (this.tigerDamageBoostUntil || 0) ? 2 : 1;
        const projectileDamage = this.playerDamage * this.getAmmoDamageMultiplier() * damageBoost;
        const volleyId = ++this.shotVolleyId;

        // Fire shotgun/multishot pearls evenly from the same gun muzzle point.
        if (projectileCount === 1) {
            const shotAngle = this.randomizedSpreadCore
                ? baseAngle + Phaser.Math.FloatBetween(-spread * 0.5, spread * 0.5)
                : baseAngle;
            fired = !!this.createPlayerBoba(muzzle.x, muzzle.y, shotAngle, projectileDamage, 0, 'gun', volleyId);
        } else {
            for (let i = 0; i < projectileCount; i++) {
                const randomSpread = this.randomizedSpreadCore ? Phaser.Math.FloatBetween(-spread * 0.35, spread * 0.35) : 0;
                const spreadAngle = (((i / (projectileCount - 1)) - 0.5) * spread) + randomSpread;
                fired = !!this.createPlayerBoba(muzzle.x, muzzle.y, baseAngle + spreadAngle, projectileDamage, 0, 'gun', volleyId) || fired;
            }
        }

        if (!fired) return false;
        if (this.infiniteLoopCore) {
            this.fireInfiniteLoopShot(baseAngle, projectileDamage, volleyId);
        }
        if (this.pulseWaveGenerator) {
            this.createPulseWave(muzzle.x, muzzle.y, projectileDamage * 0.5);
        }
        if (this.weaponType === 'tigerBlade') {
            this.createTigerSlash(baseAngle, projectileDamage * 0.9, true, 132);
        }
        if (!hasInfiniteAmmo) {
            this.bobaCount--;
        }
        this.updateBobaDisplay();
        return true;
    }

    createTigerSlash(angle, damage, canDamage = true, radius = 92) {
        const pivot = this.getGunPivot();
        const arcWidth = 0.84;
        const facingLeft = Math.cos(angle) < 0;
        const swingStart = angle + (facingLeft ? -0.38 : 0.38);
        const swingEnd = angle + (facingLeft ? 0.42 : -0.42);
        const slash = this.add.image(pivot.x, pivot.y, this.gunTextureKey || 'tiger_gun')
            .setOrigin(0.78, 0.5)
            .setScale((this.weaponProfile?.gunScale || 0.26) * 1.28)
            .setFlipX(true)
            .setFlipY(facingLeft)
            .setRotation(swingStart)
            .setAlpha(0.86)
            .setDepth(4);
        this.tweens.add({
            targets: slash,
            rotation: swingEnd,
            alpha: 0,
            duration: 150,
            ease: 'Sine.easeOut',
            onComplete: () => slash.destroy()
        });

        if (!canDamage) return;
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(pivot.x, pivot.y, enemy.x, enemy.y);
            if (dist > radius + 46) return;
            const enemyAngle = Phaser.Math.Angle.Between(pivot.x, pivot.y, enemy.x, enemy.y);
            const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle));
            if (angleDiff > arcWidth + 0.26) return;
            this.damageEnemyFromAbility(enemy, damage, '#ffd36a');
        });
    }

    damageEnemyFromAbility(enemy, damage, color = '#ffd36a') {
        if (!enemy?.active) return;
        this.showDamageNumber(enemy.x, enemy.y, damage, color);
        enemy.hp -= damage;
        if (enemy.hp <= 0) {
            this.killEnemyFromAbility(enemy);
        }
    }

    fireInfiniteLoopShot(angle, damage, volleyId) {
        this.time.delayedCall(115, () => {
            if (this.playerDown || this.runEnded) return;
            const muzzle = this.getMuzzleFromAim(angle);
            const boba = this.createPlayerBoba(muzzle.x, muzzle.y, angle, damage * 0.5, 0, 'gun', volleyId);
            if (!boba) return;
            boba.setScale(this.projectileScale * 0.5);
            boba.baseScale = this.projectileScale * 0.5;
            boba.body.velocity.scale(0.5);
            boba.setAlpha(0.78);
            boba.setTint(0x9dfff2);
        });
    }

    createPulseWave(x, y, damage) {
        const radius = 118;
        const pulse = this.add.circle(x, y, 24, BOBA_THEME.aqua, 0.16)
            .setStrokeStyle(4, BOBA_THEME.aqua, 0.72)
            .setDepth(3);
        this.tweens.add({
            targets: pulse,
            radius,
            alpha: 0,
            duration: 260,
            ease: 'Sine.easeOut',
            onComplete: () => pulse.destroy()
        });
        this.enemies?.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist > radius) return;
            enemy.body.velocity.scale(0.45);
            enemy.nextAttackAt = Math.max(enemy.nextAttackAt || 0, this.time.now + 320);
            enemy.setTint(0x58ddff);
            this.time.delayedCall(180, () => { if (enemy.active) enemy.clearTint(); });
            this.damageEnemyFromAbility(enemy, damage, '#7ed2ff');
        });
    }

    createPlayerBoba(spawnX, spawnY, angle, damage = this.playerDamage, splitDepth = 0, source = 'gun', volleyId = 0) {
        if (!Number.isFinite(angle)) return null;
        if (source === 'gun' && (!Number.isFinite(spawnX) || !Number.isFinite(spawnY))) {
            const muzzle = this.getPlayerShotOrigin(angle);
            spawnX = muzzle.x;
            spawnY = muzzle.y;
        }
        if (!Number.isFinite(spawnX) || !Number.isFinite(spawnY)) return null;

        const boba = this.physics.add.image(spawnX, spawnY, this.projectileTextureKey || 'projectile_boba');
        this.bobas.add(boba);
        boba.setOrigin(0.5);
        const scale = this.projectileScale;
        boba.setScale(scale);
        boba.setDepth(2);
        const collisionRadius = Math.max(6, Math.round(12 * (scale / 0.18)));
        boba.body.setCircle(collisionRadius);
        boba.refreshBody();
        boba.setPosition(spawnX, spawnY);
        boba.body.reset(spawnX, spawnY);
        boba.setBounce(1);
        boba.bounceCount = 0;
        boba.maxBounces = this.maxBounces;
        boba.wallSplitDepth = splitDepth;
        const shouldBounce = boba.maxBounces > 0 || boba.wallSplitDepth < this.wallSplitCount;
        boba.setCollideWorldBounds(shouldBounce);
        boba.body.onWorldBounds = shouldBounce;
        boba.fullDamageSplitsUsed = 0;
        boba.hasBounced = false;
        boba.canPickup = false;
        boba.owner = 'player';
        boba.source = source;
        boba.weaponType = this.weaponType;
        boba.volleyId = volleyId;
        boba.damage = damage;
        boba.pierceRemaining = this.projectilePierce;
        if (boba.weaponType === 'matchaOrb') {
            boba.pierceRemaining = 1;
        }
        boba.pierceHits = 0;
        boba.hitEnemyIds = new Set();
        boba.spawnX = spawnX;
        boba.spawnY = spawnY;
        boba.baseScale = this.projectileScale;
        boba.baseDamage = damage;
        if (this.critChance > 0 && Math.random() < this.critChance) {
            boba.damage *= 2;
            boba.baseDamage = boba.damage;
            boba.setTint(0xffd166);
        }
        if (source === 'gun') {
            boba.setTint(0xffffff);
            boba.setData('spawnDebug', 'gun');
        } else if (source === 'wall-split') {
            boba.setTint(0x8fd8ff);
            boba.setData('spawnDebug', 'wall');
        } else if (source === 'kill-split') {
            boba.setTint(0xff9bd2);
            boba.setData('spawnDebug', 'kill');
        }
        this.time.delayedCall(500, () => {
            if (boba.active) {
                boba.hasBounced = true;
            }
        });
        const lifespan = source === 'gun'
            ? (this.time.now < this.matchaOrbDurationBoostUntil && this.weaponType === 'matchaOrb' ? this.projectileLifespan * 2 : this.projectileLifespan)
            : 1800;
        this.time.delayedCall(lifespan, () => {
            if (boba.active) {
                boba.destroy();
            }
        });
        boba.body.velocity.set(
            Math.cos(angle) * this.projectileSpeed,
            Math.sin(angle) * this.projectileSpeed
        );
        return boba;
    }

    showDamageNumber(x, y, amount, color = '#fff4d6') {
        this.damageNumberCounter = (this.damageNumberCounter + 1) % 6;
        const offsetX = ((this.damageNumberCounter % 3) - 1) * 16;
        const offsetY = Math.floor(this.damageNumberCounter / 3) * -10;
        const label = typeof amount === 'number' ? String(Math.round(amount)) : String(amount);
        const text = this.add.text(x + offsetX, y - 18 + offsetY, label, {
            fontSize: '18px',
            fill: color,
            fontFamily: 'Arial Black',
            stroke: '#2b130f',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(8);

        this.tweens.add({
            targets: text,
            y: y - 48 + offsetY,
            alpha: 0,
            scale: 1.2,
            duration: 650,
            ease: 'Sine.easeOut',
            onComplete: () => text.destroy()
        });
    }

    updateBobaGrowth(boba) {
        if (!this.growingBoba || boba.owner !== 'player') return;
        const distance = Phaser.Math.Distance.Between(boba.spawnX, boba.spawnY, boba.x, boba.y);
        const scaleMultiplier = 1 + Math.min(1.5, distance / 500);
        const scale = boba.baseScale * scaleMultiplier;
        boba.setScale(scale);
        const collisionRadius = Math.max(6, Math.round(12 * (scale / 0.18)));
        boba.body.setCircle(collisionRadius);
        boba.damage = boba.baseDamage * (1 + (distance * 0.005));
    }

    handleBobaWorldBounds(body) {
        const boba = body.gameObject;
        if (!boba || !boba.active || boba.owner !== 'player') return;

        boba.bounceCount++;
        if (this.bounceDamageScale > 0) {
            boba.damage *= 1 + this.bounceDamageScale;
            boba.baseDamage = boba.damage;
        }

        if (boba.wallSplitDepth < this.wallSplitCount) {
            const angle = Math.atan2(boba.body.velocity.y, boba.body.velocity.x);
            const keepsFullDamage = boba.fullDamageSplitsUsed < this.wallFullDamageSplits;
            const childDamage = keepsFullDamage ? boba.damage : boba.damage * 0.5;
            [-0.35, 0.35].forEach(offset => {
                const child = this.createPlayerBoba(boba.x, boba.y, angle + offset, childDamage, boba.wallSplitDepth + 1, 'wall-split');
                if (!child) return;
                child.fullDamageSplitsUsed = boba.fullDamageSplitsUsed + (keepsFullDamage ? 1 : 0);
                child.pierceRemaining = boba.pierceRemaining;
            });
        }

        if (boba.bounceCount > boba.maxBounces) {
            boba.destroy();
        }
    }

    findNearestEnemy(x, y, maxDistance = Infinity) {
        let nearest = null;
        let nearestDist = Infinity;
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        return nearestDist <= maxDistance ? nearest : null;
    }

    findNearestUnhitEnemy(x, y, hitEnemyIds = new Set(), maxDistance = Infinity) {
        let nearest = null;
        let nearestDist = Infinity;
        this.enemies.children.entries.forEach(enemy => {
            if (!enemy.active) return;
            if (hitEnemyIds?.has(enemy.enemyId)) return;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        });
        return nearestDist <= maxDistance ? nearest : null;
    }

    updateBobaDisplay() {
        if (this.playerDown) {
            this.bobaCountText.setText('DOWN');
            return;
        }

        if (this.time?.now < (this.infiniteAmmoUntil || 0)) {
            this.bobaCountText.setText(`BOBA: INF/${this.maxBobaCount}`);
            return;
        }

        this.bobaCountText.setText(`BOBA: ${this.bobaCount}/${this.maxBobaCount}`);
    }

    reloadBoba() {
        if (this.isReloading || this.playerDown) return;
        this.isReloading = true;
        this.reloadText.setVisible(true);
        const token = ++this.reloadToken;

        this.time.delayedCall(this.reloadDuration, () => {
            if (this.playerDown || token !== this.reloadToken) return;
            this.bobaCount = this.maxBobaCount;
            this.isReloading = false;
            this.reloadText.setVisible(false);
            this.updateBobaDisplay();
        });
    }

    updateAbilityCooldownHud() {
        if (!this.dashText || !this.abilityBarFill) return;
        let abilityFillPct = 1;
        if (this.buildAbilityType === 'classicDash') {
            const dashCooldown = this.dashCharges < this.maxDashCharges && this.nextDashRechargeAt > 0
                ? ` ${Math.max(0, Math.ceil((this.nextDashRechargeAt - this.time.now) / 1000))}s`
                : '';
            this.dashText.setText(`DASH ${this.dashCharges}/${this.maxDashCharges}${dashCooldown}`);
            abilityFillPct = this.dashCharges > 0
                ? 1
                : Phaser.Math.Clamp(1 - ((this.nextDashRechargeAt - this.time.now) / this.dashRechargeDelay), 0, 1);
        } else {
            const abilityActive = this.time.now < (this.abilityActiveUntil || 0);
            const abilityCooldown = abilityActive
                ? ' ACTIVE'
                : this.time.now < this.nextAbilityAt
                ? ` ${Math.max(0, Math.ceil((this.nextAbilityAt - this.time.now) / 1000))}s`
                : ' READY';
            this.dashText.setText(`SPACE${abilityCooldown}`);
            abilityFillPct = abilityActive || this.time.now >= this.nextAbilityAt
                ? 1
                : Phaser.Math.Clamp(1 - ((this.nextAbilityAt - this.time.now) / this.abilityCooldownMs), 0, 1);
        }
        this.abilityBarFill.displayWidth = 196 * abilityFillPct;
        this.abilityBarFill.setFillStyle(abilityFillPct >= 1 ? 0x7cff8a : 0xffd36a, 0.95);
    }

    spawnEnemy() {
        if (this.waveTransitioning || this.enemiesSpawnedThisWave >= this.enemiesPerWave) return;
        const activeEnemies = this.enemies.children.entries.filter(enemy => enemy.active).length;
        if (activeEnemies >= this.maxActiveEnemies) return;

        const side = Phaser.Math.Between(0, 3);
        let x, y;
        switch (side) {
            case 0: x = Phaser.Math.Between(0, GAME_WIDTH); y = -30; break;
            case 1: x = GAME_WIDTH + 30; y = Phaser.Math.Between(0, GAME_HEIGHT); break;
            case 2: x = Phaser.Math.Between(0, GAME_WIDTH); y = GAME_HEIGHT + 30; break;
            case 3: x = -30; y = Phaser.Math.Between(0, GAME_HEIGHT); break;
        }

        const isThrower = GameState.wave >= 5 && (this.enemiesSpawnedThisWave + 1) % 6 === 0;
        const enemy = this.enemies.create(x, y, isThrower ? 'thrower_run_1' : 'enemy_run_1');
        enemy.setOrigin(0.5);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
        enemy.enemyType = isThrower ? 'thrower' : 'melee';
        enemy.play(isThrower ? 'thrower_run' : 'enemy_run');
        enemy.setScale(isThrower ? 0.48 : 0.2);
        enemy.body.setSize(isThrower ? 116 : 72, isThrower ? 96 : 72, true);

        enemy.maxHp = Math.floor(getEnemyMaxHpForWave(GameState.wave) * (isThrower ? 0.75 : 1));
        enemy.hp = enemy.maxHp;
        enemy.nextAttackAt = 0;
        enemy.nextThrowAt = isThrower ? this.time.now + 500 : Infinity;
        enemy.enemyId = ++this.enemyIdCounter;

        // Health bar above enemy
        enemy.healthBg = this.add.image(enemy.x, enemy.y - 20, 'enemy_health_bg');
        enemy.healthBg.setOrigin(0.5);
        enemy.healthFill = this.add.image(enemy.x, enemy.y - 20, 'enemy_health_fill');
        enemy.healthFill.setOrigin(0, 0.5);
        enemy.healthFill.displayWidth = 30;

        enemy.on('destroy', () => {
            if (enemy.healthBg) {
                enemy.healthBg.destroy();
                enemy.healthBg = null;
            }
            if (enemy.healthFill) {
                enemy.healthFill.destroy();
                enemy.healthFill = null;
            }
        });

        this.enemiesSpawnedThisWave++;
    }

    hitEnemy(boba, enemy) {
        if (!boba.active || !enemy.active) return;
        if (boba.hitEnemyIds && boba.hitEnemyIds.has(enemy.enemyId)) return;
        if (boba.hitEnemyIds) {
            boba.hitEnemyIds.add(enemy.enemyId);
        }

        if (this.hasFreeze && boba.owner === 'player' && Math.random() < this.freezeChance) {
            enemy.body.setVelocity(0, 0);
            enemy.setTint(0x88ccff);
            enemy.nextAttackAt = Math.max(enemy.nextAttackAt || 0, this.time.now + 900);
            this.time.delayedCall(900, () => { if (enemy.active) enemy.clearTint(); });
        }

        let damage = (boba.damage || this.playerDamage) * (1 + ((boba.pierceHits || 0) * this.pierceDamageScale));
        if (boba.weaponType === 'strawberryShotgun') {
            const travel = Phaser.Math.Distance.Between(boba.spawnX, boba.spawnY, boba.x, boba.y);
            damage *= Phaser.Math.Clamp(1.65 - (travel / 360), 0.55, 1.65);
        } else if (boba.weaponType === 'lycheeShotgun' && boba.volleyId) {
            const key = `${boba.volleyId}:${enemy.enemyId}`;
            const hits = (this.lycheeVolleyHits.get(key) || 0) + 1;
            this.lycheeVolleyHits.set(key, hits);
            damage *= 1 + ((hits - 1) * 0.18);
        }
        if (boba.weaponType === 'matchaOrb') {
            this.applyMatchaPoison(enemy, boba.baseDamage || damage);
            this.healFromMatchaDamage(damage);
        }
        if (this.time.now < (enemy.petMarkedUntil || 0)) {
            damage *= 1.5;
            enemy.petMarkedUntil = 0;
            enemy.clearTint();
            this.showDamageNumber(enemy.x, enemy.y - 18, 'MARK!', '#ffcf7a');
        }
        this.showDamageNumber(enemy.x, enemy.y, damage);

        const hadPierce = (boba.pierceRemaining || 0) > 0;
        if (hadPierce) {
            boba.pierceRemaining--;
            boba.pierceHits = (boba.pierceHits || 0) + 1;
        } else {
            boba.destroy();
        }
        if (this.bounceCascadeEngine && boba.active && hadPierce) {
            const nextEnemy = this.findNearestUnhitEnemy(boba.x, boba.y, boba.hitEnemyIds, 520);
            if (nextEnemy) {
                const chainAngle = Phaser.Math.Angle.Between(boba.x, boba.y, nextEnemy.x, nextEnemy.y);
                boba.body.velocity.set(Math.cos(chainAngle) * this.projectileSpeed, Math.sin(chainAngle) * this.projectileSpeed);
                boba.setTint(0x7ed2ff);
                this.time.delayedCall(120, () => { if (boba.active) boba.clearTint(); });
            }
        }
        enemy.hp -= damage;

        if (enemy.hp <= 0) {
            const killX = enemy.x;
            const killY = enemy.y;
            const killedThrower = enemy.enemyType === 'thrower';
            enemy.destroy();

            this.registerEnemyKill();
            this.spawnXpPickup(killX, killY);
            if (killedThrower) {
                this.spawnHealingPickup(killX, killY);
            }

            const rageGain = getRagePerKill(this);
            GameState.rage += rageGain;
            GameState.totalRage += rageGain;
            GameState.runRageEarned += rageGain;
            const tcGain = getTcPerKill();
            GameState.tc += tcGain;
            GameState.runTcEarned += tcGain;

            if (this.splitOnKill && boba.owner === 'player') {
                this.splitBobaFromKill(boba, killX, killY);
            }

            if (this.hasExplode) {
                this.enemies.children.entries.forEach(otherEnemy => {
                    if (!otherEnemy.active) return;
                    const dist = Phaser.Math.Distance.Between(killX, killY, otherEnemy.x, otherEnemy.y);
                    if (dist < 80) {
                        this.showDamageNumber(otherEnemy.x, otherEnemy.y, 30, '#ffb36b');
                        otherEnemy.hp -= 30;
                        if (otherEnemy.hp <= 0) {
                            const explodeKillX = otherEnemy.x;
                            const explodeKillY = otherEnemy.y;
                            const killedExplodeThrower = otherEnemy.enemyType === 'thrower';
                            otherEnemy.destroy();
                            this.registerEnemyKill();
                            this.spawnXpPickup(explodeKillX, explodeKillY);
                            if (killedExplodeThrower) {
                                this.spawnHealingPickup(explodeKillX, explodeKillY);
                            }
                            GameState.rage += rageGain;
                            GameState.totalRage += rageGain;
                            GameState.runRageEarned += rageGain;
                            GameState.tc += tcGain;
                            GameState.runTcEarned += tcGain;
                        }
                    }
                });
            }

            if (this.vampireHeal > 0 && !this.playerDown) {
                GameState.health = Math.min(GameState.maxHealth, GameState.health + this.vampireHeal);
            }

            if (!this.waveTransitioning && this.enemiesKilledThisWave >= this.enemiesPerWave) {
                this.completeWave();
            }
        }

        this.updateUI();
        this.maybeLaunchLevelUpgrade();
    }

    registerEnemyKill() {
        GameState.score += 10;
        GameState.enemiesKilledThisRun++;
        GameState.totalEnemiesKilled++;
        this.enemiesKilledThisWave++;
    }

    killEnemyFromAbility(enemy) {
        if (!enemy?.active) return;
        const killX = enemy.x;
        const killY = enemy.y;
        const killedThrower = enemy.enemyType === 'thrower';
        enemy.destroy();
        this.registerEnemyKill();
        this.spawnXpPickup(killX, killY);
        if (killedThrower) {
            this.spawnHealingPickup(killX, killY);
        }
        const rageGain = getRagePerKill(this);
        GameState.rage += rageGain;
        GameState.totalRage += rageGain;
        GameState.runRageEarned += rageGain;
        const tcGain = getTcPerKill();
        GameState.tc += tcGain;
        GameState.runTcEarned += tcGain;
        if (!this.waveTransitioning && this.enemiesKilledThisWave >= this.enemiesPerWave) {
            this.completeWave();
        }
        this.updateUI();
        this.maybeLaunchLevelUpgrade();
    }

    splitBobaFromKill(sourceBoba, x, y) {
        const angle = sourceBoba.active
            ? Math.atan2(sourceBoba.body.velocity.y, sourceBoba.body.velocity.x)
            : this.currentAimAngle;
        [-0.45, 0.45].forEach(offset => {
            const child = this.createPlayerBoba(x, y, angle + offset, (sourceBoba.damage || this.playerDamage) * 0.6, sourceBoba.wallSplitDepth || 0, 'kill-split');
            if (!child) return;
            child.pierceRemaining = Math.max(0, (sourceBoba.pierceRemaining || 0));
        });
    }

    triggerEnemyAttack(enemy, targetX) {
        enemy.play(enemy.enemyType === 'thrower' ? 'thrower_attack' : 'enemy_attack');
        enemy.body.setVelocity(0, 0);
        enemy.setFlipX(enemy.x < targetX);
        this.time.delayedCall(200, () => {
            if (enemy.active) {
                enemy.play(enemy.enemyType === 'thrower' ? 'thrower_run' : 'enemy_run');
            }
        });
    }

    throwEnemyProjectile(enemy) {
        if (!enemy?.active || !this.player?.active || this.playerDown) return;
        this.triggerEnemyAttack(enemy, this.player.x);
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        const spawnX = enemy.x + Math.cos(angle) * 28;
        const spawnY = enemy.y + Math.sin(angle) * 28;
        const projectile = this.enemyProjectiles.create(spawnX, spawnY, 'thrower_projectile');
        projectile.setOrigin(0.5);
        projectile.setScale(0.11);
        projectile.setDepth(4);
        projectile.damage = 20;
        projectile.body.setCircle(150, 100, 100);
        projectile.body.setAllowGravity(false);
        projectile.body.velocity.set(Math.cos(angle) * 300, Math.sin(angle) * 300);
        projectile.rotation = angle;
        projectile.setAngularVelocity(360);
    }

    hitPlayerWithEnemyProjectile(player, projectile) {
        if (!projectile.active || this.runEnded || this.deathTransitionPending || this.playerDown) return;
        projectile.destroy();
        this.damagePlayer(projectile.damage || 20);
    }

    hitPlayer(player, enemy, time) {
        if (this.runEnded || this.deathTransitionPending || this.playerDown) return;
        enemy.nextAttackAt = time + 700;

        if (this.hasShield && !this.shieldActive) {
            this.shieldActive = true;
            this.player.setTint(0xffd700);
            this.time.delayedCall(300, () => {
                if (!this.playerDown) {
                    this.player.clearTint();
                }
            });
            this.time.delayedCall(this.shieldCooldown, () => { this.shieldActive = false; });
            this.updateUI();
            return;
        }

        this.triggerEnemyAttack(enemy, player.x);

        const rawDamage = Math.floor(10 + (GameState.wave * 1.5) + (getEnemyWaveScale(GameState.wave, 0.12) * 2));
        if (this.periodicFullBlock && time >= this.nextFullBlockAt) {
            this.nextFullBlockAt = time + 5000;
            this.player.setTint(0x9dfff2);
            this.time.delayedCall(140, () => {
                if (!this.playerDown) {
                    this.player.clearTint();
                }
            });
            this.updateUI();
            return;
        }

        this.damagePlayer(rawDamage);
    }

    damagePlayer(rawDamage) {
        if (this.runEnded || this.deathTransitionPending || this.playerDown) return;
        const totalReduction = Math.min(0.9, (this.damageReductionPercent || 0) + (this.dashDamageReduction || 0));
        const reducedDamage = rawDamage * (1 - totalReduction);
        const damage = Math.max(1, reducedDamage - (this.damageReduction || 0));
        GameState.health = Math.max(0, GameState.health - damage);
        this.playerInvincibleUntil = this.time.now + 500;

        this.player.setTint(0xff0000);
        this.time.delayedCall(100, () => {
            if (!this.playerDown) {
                this.player.clearTint();
            }
        });

        if (GameState.health <= 0) {
            this.endRun();
            return;
        }

        this.updateUI();
    }

    cleanExitToScene(targetKey, resetRun = true) {
        if (this.switchingScene) return;
        this.switchingScene = true;

        this.setCombatMouseLocked(false);
        resetCanvasInput(this);
        GameState.paused = false;
        GameState.upgradeSceneActive = false;

        if (this.input) {
            this.input.enabled = false;
        }
        if (this.physics?.world) {
            this.physics.pause();
        }
        if (this.player?.body) {
            this.player.body.setVelocity(0, 0);
        }
        if (this.enemySpawnTimer) {
            this.enemySpawnTimer.remove(false);
            this.enemySpawnTimer = null;
        }
        if (this.saveTimer) {
            this.saveTimer.remove(false);
            this.saveTimer = null;
        }

        this.enemies?.clear(true, true);
        this.bobas?.clear(true, true);
        this.enemyProjectiles?.clear(true, true);
        this.xpPickups?.clear(true, true);
        this.healingPickups?.clear(true, true);
        forceSceneTransition(this, targetKey, resetRun);
    }

    showGameOver() {
        if (this.switchingScene) return;
        this.switchingScene = true;
        this.setCombatMouseLocked(false);
        resetCanvasInput(this);
        GameState.paused = true;
        GameState.upgradeSceneActive = false;

        if (this.player?.body) {
            this.player.body.setVelocity(0, 0);
        }
        if (this.enemySpawnTimer) {
            this.enemySpawnTimer.remove(false);
            this.enemySpawnTimer = null;
        }
        if (this.saveTimer) {
            this.saveTimer.remove(false);
            this.saveTimer = null;
        }

        this.enemies?.clear(true, true);
        this.bobas?.clear(true, true);
        this.enemyProjectiles?.clear(true, true);
        this.xpPickups?.clear(true, true);
        this.healingPickups?.clear(true, true);
        SaveManager.save();

        this.scene.stop('PauseScene');
        this.scene.stop('UpgradeScene');
        this.scene.stop('FactoryScene');
        this.scene.pause('GameScene');
        this.scene.launch('GameOverScene');
    }

    endRun() {
        if (this.runEnded) return;
        this.runEnded = true;
        this.deathTransitionPending = true;
        GameState.health = 0;
        this.updateUI();
        this.enemies?.children?.entries?.forEach(enemy => {
            if (enemy?.body) {
                enemy.body.setVelocity(0, 0);
            }
        });
        this.time.delayedCall(1, () => this.showGameOver());
    }

    knockOutPlayer() {
        if (this.playerDown) return;
        this.playerDown = true;
        GameState.health = 0;
        this.player.setAlpha(0.25);
        this.player.setTint(0x666666);
        this.player.body.setVelocity(0);
        this.isReloading = false;
        this.reloadText.setVisible(false);
        this.playerDownBanner.setVisible(true);
        this.updateBobaDisplay();
    }

    revivePlayerForNextWave() {
        this.playerDown = false;
        GameState.health = Math.max(1, Math.ceil(GameState.maxHealth * 0.5));
        this.player.clearTint();
        this.player.setAlpha(1);
        this.player.setPosition(GAME_CENTER_X, GAME_HEIGHT - 180);
        this.playerDownBanner.setVisible(false);
        this.bobaCount = this.maxBobaCount;
        this.isReloading = false;
        this.reloadText.setVisible(false);
        this.updateBobaDisplay();
    }

    completeWave() {
        if (this.waveTransitioning) return;

        this.waveTransitioning = true;
        this.enemySpawnTimer.paused = true;

        this.enemies.children.entries.forEach(enemy => {
            if (enemy.healthBg) { enemy.healthBg.destroy(); }
            if (enemy.healthFill) { enemy.healthFill.destroy(); }
            enemy.destroy();
        });

        GameState.wave++;

        this.bobaCount = this.maxBobaCount;
        this.isReloading = false;
        this.reloadText.setVisible(false);

        SaveManager.save();
        this.waveTransitioning = false;
        this.configureWave();
        this.updateBobaDisplay();
        this.updateUI();
    }

    startNextWaveFromShop() {
        GameState.wave++;
        this.waveTransitioning = false;
        GameState.paused = false;
        this.configureWave();
        this.updateUI();
    }

    updateUI() {
        const healthPct = Math.max(0, GameState.health / GameState.maxHealth);
        this.healthBarFill.displayWidth = 260 * healthPct;
        this.healthText.setText(`${Math.ceil(GameState.health)} / ${GameState.maxHealth}`);

        const xpPct = GameState.xp / GameState.xpToLevel;
        this.xpBarFill.displayWidth = 260 * xpPct;
        this.xpText.setText(`XP: ${GameState.xp}/${GameState.xpToLevel}`);

        this.playerStateText.setText(GameState.aimMode === 'manual' ? 'MANUAL' : 'AUTO');
        this.rageText.setText(`RAGE ${Math.floor(GameState.rage)}`);
        this.tcText.setText(`TC ${Math.floor(GameState.tc)}`);
        this.outputText.setText(`RUN +${Math.floor(GameState.runTcEarned)} TC  +${Math.floor(GameState.runTapiocaEarned)} TP`);
        this.updateAbilityCooldownHud();

        this.waveText.setText(`WAVE ${GameState.wave}`);
        this.scoreText.setText(`SCORE: ${GameState.score}`);
        this.levelText.setText(`LVL ${GameState.level}`);
        this.factoryStatusText.setText(`${this.enemiesKilledThisWave}/${this.enemiesPerWave} cleared`);
        this.playerDownBanner.setVisible(false);
    }
}

// ============================================
// UPGRADE SCENE
// ============================================
class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    create() {
        SaveManager.save();
        resetCanvasInput(this);
        GameState.paused = true;
        GameState.upgradeSceneActive = true;

        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x04060d, 0.94).setInteractive();

        this.isSpecialDraft = (GameState.pendingSpecialUpgrades || 0) > 0;
        this.chosenUpgrades = this.isSpecialDraft ? buildSpecialUpgradeChoices() : buildWeightedUpgradeChoices();
        if (this.isSpecialDraft && this.chosenUpgrades.length === 0) {
            GameState.pendingSpecialUpgrades = 0;
            this.isSpecialDraft = false;
            this.chosenUpgrades = buildWeightedUpgradeChoices();
        }
        if (this.chosenUpgrades.length === 0) {
            GameState.pendingLevelUps = 0;
            resumeGameSceneFromOverlay(this);
            this.scene.stop();
            return;
        }

        this.cards = [];
        this.add.text(GAME_CENTER_X, 142, this.isSpecialDraft ? 'PICK A SPECIAL CORE' : 'PICK A BOBA MOD', {
            fontSize: '34px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#4c2d5e',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 178, this.isSpecialDraft ? 'Every 5 levels, choose one rare core.' : 'Choose one upgrade to keep the run rolling.', {
            fontSize: '13px',
            fill: '#b8eaff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);
        this.chosenUpgrades.forEach((upgrade, i) => {
            const x = GAME_CENTER_X - 200 + i * 200;
            const card = this.createUpgradeCard(x, 396, upgrade, i);
            this.cards.push(card);
        });

        this.input.keyboard.once('keydown-ONE', () => this.select(0));
        this.input.keyboard.once('keydown-TWO', () => this.select(1));
        this.input.keyboard.once('keydown-THREE', () => this.select(2));
    }

    createUpgradeCard(x, y, upgrade, index) {
        const theme = getUpgradeVisualTheme(upgrade);
        const accent = theme.accent;
        this.add.rectangle(x + 6, y + 8, 190, 255, 0x000000, 0.32);
        this.add.rectangle(x, y, 202, 267, accent, 0.09);
        const card = this.add.rectangle(x, y, 190, 255, BOBA_THEME.glass, 0.98)
            .setStrokeStyle(3, accent, 0.95)
            .setInteractive({ useHandCursor: true });
        this.add.rectangle(x, y - 108, 160, 3, BOBA_THEME.white, 0.18);
        this.add.rectangle(x, y + 108, 160, 2, accent, 0.34);

        const readableTag = (upgrade.branch || 'upgrade').replace(/^./, ch => ch.toUpperCase());
        this.add.text(x, y - 106, `${readableTag} - Tier ${upgrade.tier}`.toUpperCase(), {
            fontSize: '12px',
            fill: upgrade.tier >= 5 ? '#ffd700' : '#7ee0ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.rectangle(x, y - 64, 82, 56, accent, 0.18).setStrokeStyle(2, accent, 0.9);
        this.add.circle(x, y - 64, 34, accent, 0.08);
        const iconSize = upgrade.icon.length > 4 ? '18px' : upgrade.icon.length > 2 ? '23px' : '34px';
        this.add.text(x, y - 64, upgrade.icon, {
            fontSize: iconSize,
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(x, y + 2, upgrade.name, {
            fontSize: '19px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black',
            align: 'center',
            wordWrap: { width: 154 }
        }).setOrigin(0.5);

        this.add.text(x, y + 64, upgrade.desc, {
            fontSize: '13px',
            fill: '#c7d4ec',
            align: 'center',
            wordWrap: { width: 154 }
        }).setOrigin(0.5);

        this.add.text(x, y + 112, `[${index + 1}]`, {
            fontSize: '14px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(2);

        card.on('pointerover', () => {
            card.setFillStyle(0x232c42, 0.98);
            card.setStrokeStyle(4, BOBA_THEME.caramel);
            this.tweens.add({ targets: card, y: y - 4, duration: 90, ease: 'Quad.easeOut' });
        });
        card.on('pointerout', () => {
            card.setFillStyle(BOBA_THEME.glass, 0.98);
            card.setStrokeStyle(3, accent);
            this.tweens.add({ targets: card, y, duration: 90, ease: 'Quad.easeOut' });
        });
        card.on('pointerdown', () => {
            this.select(this.cards.indexOf(card));
        });

        return card;
    }

    select(index) {
        if (index < 0 || index >= this.chosenUpgrades.length) return;

        const upgrade = this.chosenUpgrades[index];
        const gameScene = this.scene.get('GameScene');
        upgrade.apply(gameScene);
        GameState.selectedUpgrades.push(upgrade.id);

        GameState.pendingLevelUps--;
        if (this.isSpecialDraft) {
            GameState.pendingSpecialUpgrades = Math.max(0, (GameState.pendingSpecialUpgrades || 0) - 1);
        }

        if (GameState.pendingLevelUps > 0) {
            GameState.upgradeSceneActive = true;
            this.scene.restart();
        } else {
            resumeGameSceneFromOverlay(this);
            this.scene.stop();
        }
    }
}

// ============================================
// GAME OVER SCENE
// ============================================
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    exitGameOverTo(targetKey) {
        if (this.switchingScene) return;
        this.switchingScene = true;
        resetRunUiState(this);
        GameState.reset();
        SaveManager.save();
        this.destroyDomButtons();
        sessionStorage.setItem('boba_boot_intent', targetKey === 'GameScene' ? 'play-again' : 'menu');
        window.location.reload();
    }

    startFreshRun() {
        this.exitGameOverTo('GameScene');
    }

    returnToMenu() {
        this.exitGameOverTo('MenuScene');
    }

    create() {
        resetRunUiState(this);
        this.scene.bringToTop();
        this.leaderboardSubmitText = null;
        window.BobaAuth?.submitRunStats?.({
            score: GameState.score,
            totalKills: GameState.totalEnemiesKilled,
            level: GameState.level
        })
            .then(() => {
                const status = window.BobaAuth?.getLastLeaderboardSubmit?.();
                if (this.leaderboardSubmitText && status?.message) {
                    this.leaderboardSubmitText.setText(status.message);
                    this.leaderboardSubmitText.setColor(status.status === 'remote' ? '#7cff8a' : '#ffd27a');
                }
            })
            .catch(error => {
                console.warn('Leaderboard submit failed', error);
                this.leaderboardSubmitText?.setText('Leaderboard submit failed.');
            });
        this.gameOverButtonBounds = [
            { x: GAME_CENTER_X - 138, y: 600, width: 230, height: 56, target: 'GameScene' },
            { x: GAME_CENTER_X + 138, y: 600, width: 230, height: 56, target: 'MenuScene' }
        ];

        drawSceneBackdrop(this, 0x4e315f);
        createNeonPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 760, 500, BRANCH_VISUALS.damage, 0.92);

        this.add.text(GAME_CENTER_X, 134, 'RUN ENDED', {
            fontSize: '48px',
            fill: '#ff9f80',
            fontFamily: 'Arial Black',
            stroke: '#161018',
            strokeThickness: 7
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 184, 'The shop lights flicker, but the tapioca keeps flowing.', {
            fontSize: '14px',
            fill: '#cfe6ff',
            align: 'center'
        }).setOrigin(0.5);

        this.createGameOverStatCard(424, 278, 'WAVE', GameState.wave, 0x7ed2ff);
        this.createGameOverStatCard(640, 278, 'SCORE', GameState.score, 0xffd86f);
        this.createGameOverStatCard(856, 278, 'LEVEL', GameState.level, 0x7cff8a);
        this.createGameOverStatCard(500, 414, 'TC EARNED', Math.floor(GameState.runTcEarned), 0x38d9ff);
        this.createGameOverStatCard(780, 414, 'RAGE', Math.floor(GameState.runRageEarned), 0xff7d9d);

        this.add.text(GAME_CENTER_X, 496, `Lifetime kills ${GameState.totalEnemiesKilled}   |   Tapioca ${Math.floor(GameState.tapioca)}`, {
            fontSize: '14px',
            fill: '#b8d8ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.leaderboardSubmitText = this.add.text(GAME_CENTER_X, 532, 'Saving leaderboard score...', {
            fontSize: '13px',
            fill: '#b8c9d8',
            align: 'center',
            wordWrap: { width: 480 }
        }).setOrigin(0.5);

        this.makeGameOverButton(GAME_CENTER_X - 138, 600, 'PLAY AGAIN', () => this.startFreshRun());
        this.makeGameOverButton(GAME_CENTER_X + 138, 600, 'MAIN MENU', () => this.returnToMenu());
        this.createDomGameOverButtons();
        this.fallbackGameOverClick = event => this.handleFallbackGameOverClick(event);
        document.addEventListener('pointerdown', this.fallbackGameOverClick, true);
        this.input.keyboard?.once('keydown-R', () => this.startFreshRun());
        this.input.keyboard?.once('keydown-ENTER', () => this.startFreshRun());
        this.input.keyboard?.once('keydown-M', () => this.returnToMenu());
        this.input.keyboard?.once('keydown-ESC', () => this.returnToMenu());
        this.events.once('shutdown', () => this.destroyDomButtons());
    }

    makeGameOverButton(x, y, label, callback) {
        const hit = this.add.rectangle(x, y, 220, 46, 0x121827, 0.96)
            .setStrokeStyle(3, 0x9aa7bd, 0.95)
            .setInteractive({ useHandCursor: true })
            .setDepth(20);
        const text = this.add.text(x, y, label, {
            fontSize: '17px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(21);
        const press = () => callback();
        hit.on('pointerover', () => hit.setFillStyle(0x24314a, 1).setStrokeStyle(3, 0xffd86f, 1));
        hit.on('pointerout', () => hit.setFillStyle(0x121827, 0.96).setStrokeStyle(3, 0x9aa7bd, 0.95));
        hit.on('pointerdown', press);
        text.setInteractive({ useHandCursor: true }).on('pointerdown', press);
        return { hit, text };
    }

    createGameOverStatCard(x, y, label, value, accent) {
        this.add.rectangle(x, y, 176, 88, 0x07121d, 0.64)
            .setStrokeStyle(2, accent, 0.72)
            .setDepth(4);
        this.add.text(x, y - 24, label, {
            fontSize: '12px',
            fill: '#cfe6ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(5);
        this.add.text(x, y + 12, String(value), {
            fontSize: '27px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#06101a',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(5);
    }

    createDomGameOverButtons() {
        this.destroyDomButtons();
        const canvas = this.game?.canvas;
        if (!canvas || !document?.body) return;

        const makeButton = (label, gameX, gameY, callback) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label.toUpperCase();
            button.setAttribute('aria-label', label);
            button.style.position = 'fixed';
            button.style.zIndex = '9999';
            button.style.opacity = '1';
            button.style.border = '2px solid #d7deee';
            button.style.borderRadius = '0';
            button.style.padding = '0';
            button.style.margin = '0';
            button.style.cursor = 'pointer';
            button.style.pointerEvents = 'auto';
            button.style.background = '#596274';
            button.style.color = '#fff7e6';
            button.style.font = '800 17px Arial, sans-serif';
            button.style.textShadow = '0 2px 0 rgba(0,0,0,0.45)';
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                callback();
            });
            document.body.appendChild(button);
            return { button, gameX, gameY, width: 220, height: 46 };
        };

        this.domGameOverButtons = [
            makeButton('Play again', GAME_CENTER_X - 138, 600, () => this.startFreshRun()),
            makeButton('Main menu', GAME_CENTER_X + 138, 600, () => this.returnToMenu())
        ];
        this.positionDomButtons = () => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = rect.width / GAME_WIDTH;
            const scaleY = rect.height / GAME_HEIGHT;
            this.domGameOverButtons?.forEach(entry => {
                entry.button.style.left = `${rect.left + ((entry.gameX - (entry.width / 2)) * scaleX)}px`;
                entry.button.style.top = `${rect.top + ((entry.gameY - (entry.height / 2)) * scaleY)}px`;
                entry.button.style.width = `${entry.width * scaleX}px`;
                entry.button.style.height = `${entry.height * scaleY}px`;
            });
        };
        this.positionDomButtons();
        window.addEventListener('resize', this.positionDomButtons);
    }

    destroyDomButtons() {
        if (this.fallbackGameOverClick) {
            document.removeEventListener('pointerdown', this.fallbackGameOverClick, true);
            this.fallbackGameOverClick = null;
        }
        if (this.positionDomButtons) {
            window.removeEventListener('resize', this.positionDomButtons);
            this.positionDomButtons = null;
        }
        this.domGameOverButtons?.forEach(entry => entry.button.remove());
        this.domGameOverButtons = null;
    }

    handleFallbackGameOverClick(event) {
        if (this.switchingScene) return;
        const gamePoint = this.getGamePointFromClient(event.clientX, event.clientY);
        if (!gamePoint) return;
        const clicked = this.gameOverButtonBounds?.find(bounds => {
            return Math.abs(gamePoint.x - bounds.x) <= bounds.width / 2
                && Math.abs(gamePoint.y - bounds.y) <= bounds.height / 2;
        });
        if (!clicked) return;
        event.preventDefault();
        event.stopPropagation();
        this.exitGameOverTo(clicked.target);
    }

    getGamePointFromClient(clientX, clientY) {
        const canvas = this.game?.canvas;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;
        return {
            x: ((clientX - rect.left) / rect.width) * GAME_WIDTH,
            y: ((clientY - rect.top) / rect.height) * GAME_HEIGHT
        };
    }
}

// ============================================
// FACTORY SCENE (Idle shop)

// ============================================
class FactoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FactoryScene' });
    }

    create(data = {}) {
        this.battleChoices = data.battleChoices || buildWeightedUpgradeChoices();
        this.battleDraftTaken = !!data.battleDraftTaken;
        drawSceneBackdrop(this, 0x7a4f61);
        createPanel(this, 400, 300, 760, 548, 0x10141f, 0x5b4f6f, 0.96);
        this.add.text(400, 36, `WAVE ${GameState.wave} COMPLETE`, {
            fontSize: '30px',
            fill: '#ffd700',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(400, 72, 'Runs use TC for combat upgrades. Rage upgrades the idle factory outside runs.', {
            fontSize: '14px',
            fill: '#98acd3',
            align: 'center'
        }).setOrigin(0.5);

        this.rageDisplayText = this.add.text(60, 36, '', { fontSize: '18px', fill: '#ff6666' }).setOrigin(0, 0.5);
        this.tapiocaDisplayText = this.add.text(740, 36, '', { fontSize: '18px', fill: '#66ccff' }).setOrigin(1, 0.5);
        this.factoryStatusText = this.add.text(400, 102, '', {
            fontSize: '13px',
            fill: '#ffcc99',
            align: 'center'
        }).setOrigin(0.5);

        createPanel(this, 220, 350, 350, 440, 0x121827, 0x3f4a68, 0.95);
        createPanel(this, 580, 350, 350, 440, 0x23151a, 0x6b3d4a, 0.95);

        this.add.text(220, 132, 'RAGE BANK', {
            fontSize: '22px',
            fill: '#ff8888',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(580, 132, 'TC UPGRADES', {
            fontSize: '22px',
            fill: '#7ad8ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.buildRageSummaryPanel();
        this.buildBattleDraftPanel();

        const continueBtn = this.add.image(400, 562, 'btn').setInteractive({ useHandCursor: true });
        const continueLabel = this.add.text(400, 562, 'CONTINUE', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
        continueBtn.on('pointerover', () => continueBtn.setTexture('btn_hover'));
        continueBtn.on('pointerout', () => continueBtn.setTexture('btn'));
        continueBtn.on('pointerdown', () => this.continueRun());

        this.input.keyboard.on('keydown-ESC', () => this.continueRun());
        this.updateDisplays();
    }

    updateDisplays() {
        this.rageDisplayText.setText(`RAGE BANK: ${Math.floor(GameState.rage)}`);
        this.tapiocaDisplayText.setText(`TC: ${Math.floor(GameState.tc)}`);
        this.factoryStatusText.setText(`Wave ${GameState.wave} clear   |   Spend TC before continuing`);
    }

    refreshShop() {
        this.scene.restart({
            battleChoices: this.battleChoices,
            battleDraftTaken: this.battleDraftTaken
        });
    }

    continueRun() {
        const gameScene = this.scene.get('GameScene');
        gameScene.startNextWaveFromShop();
        this.scene.stop();
        this.scene.resume('GameScene');
    }

    buildRageSummaryPanel() {
        this.add.text(220, 170, 'Rage now buys factory machines and upgrade tiers outside the run.', {
            fontSize: '14px',
            fill: '#ffd0c0',
            align: 'center'
        }).setOrigin(0.5);
        this.add.rectangle(220, 264, 300, 110, 0x1e2538).setStrokeStyle(2, 0x4b556f);
        this.add.text(220, 226, 'OUTSIDE-RUN FACTORY', {
            fontSize: '16px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(220, 270, `Rage Bank: ${Math.floor(GameState.rage)}\nPassive Tapioca: +${calcIdleMachineTPS().toFixed(1)} / sec\nEvolution Boost: ${(GameState.evolutionBoost * 100).toFixed(1)}%`, {
            fontSize: '14px',
            fill: '#b8c3dd',
            align: 'center'
        }).setOrigin(0.5);

        this.add.rectangle(220, 412, 300, 150, 0x1e2538).setStrokeStyle(2, 0x4b556f);
        this.add.text(220, 354, 'RUN CURRENCY', {
            fontSize: '16px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.text(220, 414, `TC is earned from kills during the run.\nUse it here for damage, speed,\nmultishot, reload, and synergy upgrades.`, {
            fontSize: '14px',
            fill: '#b8c3dd',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);
    }

    buildBattleDraftPanel() {
        this.add.text(580, 164, 'Spend TC on in-run combat upgrades before continuing.', {
            fontSize: '13px',
            fill: '#a6dbff',
            align: 'center'
        }).setOrigin(0.5);

        if (this.battleChoices.length === 0) {
            this.add.text(580, 320, 'All run upgrades are maxed for this build.', {
                fontSize: '18px',
                fill: '#ffe4c7',
                align: 'center'
            }).setOrigin(0.5);
        } else {
            this.battleChoices.forEach((upgrade, index) => {
                const y = 246 + (index * 96);
                this.createBattleDraftCard(580, y, upgrade);
            });
        }

        this.add.rectangle(580, 500, 300, 58, 0x2c1b22).setStrokeStyle(2, 0x6c4d58);
        this.add.text(580, 488, `TC ${Math.floor(GameState.tc)}   |   RAGE ${Math.floor(GameState.rage)}   |   KILLS ${GameState.totalEnemiesKilled}`, {
            fontSize: '13px',
            fill: '#d7eefc',
            align: 'center'
        }).setOrigin(0.5);
        this.add.text(580, 514, 'Permanent upgrades and idle factory are on separate menu pages.', {
            fontSize: '12px',
            fill: '#ffcc99',
            align: 'center'
        }).setOrigin(0.5);
    }

    createBattleDraftCard(x, y, upgrade) {
        const cost = getRunUpgradeCost(upgrade);
        const canTake = GameState.tc >= cost;
        const card = this.add.rectangle(x, y, 300, 80, 0x2c1b22).setStrokeStyle(2, canTake ? 0xffd700 : 0x6c4d58);
        card.setInteractive({ useHandCursor: canTake });
        if (canTake) {
            card.on('pointerdown', () => this.takeBattleUpgrade(upgrade));
        }

        const primaryTag = upgrade.pathTags?.[0] || 'classic';
        const readableTag = primaryTag.replace(/([A-Z])/g, ' $1').replace(/^./, ch => ch.toUpperCase());
        this.add.text(x - 126, y, upgrade.icon, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(x - 90, y - 18, upgrade.name, { fontSize: '14px', fill: '#fff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.add.text(x - 90, y + 6, upgrade.desc, {
            fontSize: '11px',
            fill: '#d7c8cf',
            wordWrap: { width: 176 }
        }).setOrigin(0, 0.5);
        this.add.text(x + 104, y - 10, upgrade.requires ? 'SYNERGY' : readableTag.toUpperCase(), {
            fontSize: '11px',
            fill: upgrade.requires ? '#ffd700' : '#7ad8ff',
            align: 'center'
        }).setOrigin(0.5);
        this.add.text(x + 104, y + 12, `${cost} TC`, {
            fontSize: '13px',
            fill: canTake ? '#ffe4a3' : '#777',
            align: 'center'
        }).setOrigin(0.5);
    }

    takeBattleUpgrade(upgrade) {
        const cost = getRunUpgradeCost(upgrade);
        if (GameState.tc < cost) return;
        const gameScene = this.scene.get('GameScene');
        GameState.tc -= cost;
        upgrade.apply(gameScene);
        GameState.selectedUpgrades.push(upgrade.id);
        this.refreshShop();
    }
}

// ============================================
// CONFIG
// ============================================
const config = {
    type: Phaser.AUTO,
    parent: 'game-root',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [BootScene, MenuScene, MultiplayerScene, BuildSelectScene, IdleFactoryScene, PermaUpgradeScene, LeaderboardScene, ControlsScene, GameScene, PauseScene, UpgradeScene, GameOverScene, FactoryScene],
    input: {
        mouse: {
            preventDefaultWheel: false
        }
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        expandParent: true,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

window.game = new Phaser.Game(config);

