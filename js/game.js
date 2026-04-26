

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 700;
const GAME_CENTER_X = GAME_WIDTH / 2;
const GAME_CENTER_Y = GAME_HEIGHT / 2;
const CAMPAIGN_BASE_SOUL_TARGET = 100000;
const CAMPAIGN_SOUL_SCALE = 5;

const CAMPAIGN_LOCATIONS = [
    { id: 'america', name: 'America', shortName: 'USA', x: 150, y: 382, accent: 0x6fb7ff, boss: 'Cupzilla Prime' },
    { id: 'brazil', name: 'Brazil', shortName: 'BRA', x: 280, y: 496, accent: 0x64d970, boss: 'Carnival Shaker' },
    { id: 'egypt', name: 'Egypt', shortName: 'EGY', x: 510, y: 398, accent: 0xf3c35c, boss: 'Pharaoh Tapioca' },
    { id: 'india', name: 'India', shortName: 'IND', x: 665, y: 420, accent: 0xff9f66, boss: 'Masala Monarch' },
    { id: 'taiwan', name: 'Taiwan', shortName: 'TWN', x: 798, y: 372, accent: 0xd98bff, boss: 'Pearl Empress' }
];

function getCampaignLocation(index = GameState.campaignLocationIndex) {
    return CAMPAIGN_LOCATIONS[Phaser.Math.Clamp(index || 0, 0, CAMPAIGN_LOCATIONS.length - 1)];
}

function getCampaignSoulTarget() {
    return Math.floor(CAMPAIGN_BASE_SOUL_TARGET * Math.pow(CAMPAIGN_SOUL_SCALE, GameState.campaignLocationIndex || 0));
}

function getCampaignWeaponProfile() {
    const location = getCampaignLocation();
    if (location.id === 'brazil') {
        return {
            id: 'lychee-shotgun',
            playerTexture: 'lychee_player',
            gunTexture: 'lychee_shotgun',
            projectileTexture: 'lychee_projectile',
            projectileDamage: 3,
            projectileCount: 4,
            spread: 0.62,
            playerScale: 0.055,
            gunScale: 0.055,
            projectileScale: 0.035,
            projectileSpeed: 540,
            fireRate: 520
        };
    }
    return {
        id: 'classic-boba',
        playerTexture: 'player_boba',
        gunTexture: 'boba_gun',
        projectileTexture: 'projectile_boba'
    };
}

function getCampaignSoulProgress() {
    const target = getCampaignSoulTarget();
    return {
        souls: GameState.runSouls || 0,
        target,
        pct: target > 0 ? Math.min(1, (GameState.runSouls || 0) / target) : 1
    };
}

function sanitizeCampaignState() {
    GameState.campaignLocationIndex = Phaser.Math.Clamp(GameState.campaignLocationIndex || 0, 0, CAMPAIGN_LOCATIONS.length - 1);
    GameState.campaignUnlockedIndex = Phaser.Math.Clamp(
        Math.max(GameState.campaignUnlockedIndex || 0, GameState.campaignLocationIndex),
        0,
        CAMPAIGN_LOCATIONS.length - 1
    );
    GameState.campaignCleared = GameState.campaignCleared || {};
}

function advanceCampaignLocation() {
    sanitizeCampaignState();
    const current = getCampaignLocation();
    GameState.campaignCleared[current.id] = true;
    const nextIndex = Math.min(GameState.campaignLocationIndex + 1, CAMPAIGN_LOCATIONS.length - 1);
    GameState.campaignUnlockedIndex = Math.max(GameState.campaignUnlockedIndex, nextIndex);
    GameState.campaignLocationIndex = nextIndex;
    GameState.runSouls = 0;
    SaveManager.save();
}

// ============================================
// SAVE MANAGER
// ============================================
const SaveManager = {
    STORAGE_KEY: 'boba_roguelike_save',
    VERSION: 8,

    save() {
        const data = {
            version: this.VERSION,
            tapioca: GameState.tapioca,
            totalTapioca: GameState.totalTapioca,
            rage: GameState.rage,
            totalRage: GameState.totalRage,
            totalEnemiesKilled: GameState.totalEnemiesKilled,
            aimMode: GameState.aimMode,
            campaignLocationIndex: GameState.campaignLocationIndex,
            campaignUnlockedIndex: GameState.campaignUnlockedIndex,
            campaignCleared: GameState.campaignCleared,
            idleMachines: GameState.idleMachines,
            idleFactoryTech: GameState.idleFactoryTech,
            evolutionBoost: GameState.evolutionBoost,
            savedAt: Date.now(),
            factoryUpgrades: this.sanitizeFactoryUpgrades(GameState.factoryUpgrades)
        };
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
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
            GameState.campaignLocationIndex = data.campaignLocationIndex || 0;
            GameState.campaignUnlockedIndex = data.campaignUnlockedIndex || GameState.campaignLocationIndex || 0;
            GameState.campaignCleared = data.campaignCleared || {};
            sanitizeCampaignState();
            GameState.idleMachines = data.idleMachines || {};
            GameState.idleFactoryTech = data.idleFactoryTech || {};
            GameState.evolutionBoost = data.evolutionBoost || 0;
            GameState.factoryUpgrades = this.sanitizeFactoryUpgrades(data.factoryUpgrades);
            GameState.machines = {};
            this.applyOfflineIdleProgress(data.savedAt);
            return true;
        } catch (e) {
            return false;
        }
    },

    migrate(data) {
        // Version 8 preserves progression and adds campaign map progress.
        GameState.tapioca = data.tapioca || 0;
        GameState.totalTapioca = data.totalTapioca || 0;
        GameState.rage = data.rage || 0;
        GameState.totalRage = data.totalRage || 0;
        GameState.totalEnemiesKilled = data.totalEnemiesKilled || 0;
        GameState.aimMode = data.aimMode === 'manual' ? 'manual' : 'auto';
        GameState.campaignLocationIndex = data.campaignLocationIndex || 0;
        GameState.campaignUnlockedIndex = data.campaignUnlockedIndex || GameState.campaignLocationIndex || 0;
        GameState.campaignCleared = data.campaignCleared || {};
        sanitizeCampaignState();
        GameState.idleMachines = data.idleMachines || {};
        GameState.idleFactoryTech = data.idleFactoryTech || {};
        GameState.evolutionBoost = data.evolutionBoost || 0;
        GameState.factoryUpgrades = this.sanitizeFactoryUpgrades(data.factoryUpgrades);
        GameState.machines = {};
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
        GameState.campaignLocationIndex = 0;
        GameState.campaignUnlockedIndex = 0;
        GameState.campaignCleared = {};
        GameState.idleMachines = {};
        GameState.idleFactoryTech = {};
        GameState.evolutionBoost = 0;
        GameState.factoryUpgrades = {};
        GameState.reset();
    },

    sanitizeFactoryUpgrades(factoryUpgrades) {
        const allowedIds = new Set((PERMA_UPGRADES || []).map(upgrade => upgrade.id));
        const sanitized = {};
        Object.entries(factoryUpgrades || {}).forEach(([id, level]) => {
            if (!allowedIds.has(id)) return;
            sanitized[id] = Math.max(0, level || 0);
        });
        return sanitized;
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
    { name: 'Classic Boba', color: 0x8B4513, speed: 160, damage: 10, fireRate: 300, desc: 'Balanced starter' },
    { name: 'Taro Milk', color: 0x9B59B6, speed: 150, damage: 8, fireRate: 200, desc: 'Fast shooter, less damage' },
    { name: 'Matcha Latte', color: 0x27AE60, speed: 140, damage: 15, fireRate: 400, desc: 'Slow but powerful' },
    { name: 'Brown Sugar', color: 0xD35400, speed: 190, damage: 12, fireRate: 350, desc: 'Fastest movement' }
];

// ============================================
// MACHINE DEFINITIONS (Idle / Factory side)
// ============================================
const MACHINES = [
    { id: 'basicBall',   name: 'Ball Roller',     desc: 'Slow but steady',        icon: '🔵', baseCost: 10,   costScale: 1.15, tps: 1,   rageDrop: 0.01 },
    { id: 'advancedBall',name: 'Ball Maker',      desc: 'Faster production',      icon: '🟢', baseCost: 75,   costScale: 1.18, tps: 5,   rageDrop: 0.03 },
    { id: 'speedBall',   name: 'Speed Line',      desc: 'High throughput',        icon: '🟡', baseCost: 300,  costScale: 1.20, tps: 15,  rageDrop: 0.05 },
    { id: 'megaBall',    name: 'Mega Press',       desc: 'Industrial scale',       icon: '🟠', baseCost: 1000, costScale: 1.22, tps: 50,  rageDrop: 0.08 },
    { id: 'autoBall',    name: 'Auto Factory',     desc: 'Fully automated',        icon: '⚙️',  baseCost: 4000, costScale: 1.25, tps: 200, rageDrop: 0.12 },
    { id: 'quantumBall', name: 'Quantum Gen',      desc: 'Exotic production',      icon: '🟣', baseCost: 15000, costScale: 1.30, tps: 800, rageDrop: 0.20 }
];

const IDLE_MACHINE_TABLE = [
    { id: 'ballRoller', name: 'Ball Roller', desc: 'Steady hand-rolled tapioca', icon: 'BR', baseCost: 10, costScale: 1.20, tps: 0.1, evolutionPts: 1, mutationText: '+1% run speed each' },
    { id: 'ballMaker', name: 'Ball Maker', desc: 'Reliable machine-made pearls', icon: 'BM', baseCost: 50, costScale: 1.15, tps: 1, evolutionPts: 2, mutationText: '+0.5% run damage each' },
    { id: 'megaPress', name: 'Mega Press', desc: 'Bulk pressing line', icon: 'MP', baseCost: 200, costScale: 1.10, tps: 5, evolutionPts: 5, mutationText: '+1% rage per kill each' },
    { id: 'quantumGen', name: 'Quantum Gen', desc: 'Reality-warped generator', icon: 'QG', baseCost: 1000, costScale: 1.20, tps: 10, evolutionPts: 10, mutationText: '-0.1% upgrade costs each' }
];

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
    { id: 'menuRageBonus', branch: 'Per-Run Boosts', name: 'Rage Bonus', desc: '+2% rage gained per level', icon: 'RAGE', baseCost: 10000, costScale: 1.10, maxLevel: 999, effectText: '+2% rage', apply: scene => { scene.permaRageBonusPercent += 0.02; } },
    { id: 'menuRunDamage', branch: 'Per-Run Boosts', name: 'Damage Bonus', desc: '+1% run damage per level', icon: 'DMG+', baseCost: 10000, costScale: 1.25, maxLevel: 999, effectText: '+1% damage', apply: scene => { scene.playerDamage += scene.basePlayerDamage * 0.01; } },
    { id: 'menuXpBonus', branch: 'Per-Run Boosts', name: 'XP Bonus', desc: '+5% XP gained per level', icon: 'XP', baseCost: 20000, costScale: 1.10, maxLevel: 999, effectText: '+5% XP', apply: scene => { scene.permaXpBonusPercent += 0.05; } }
];

// FACTORY UPGRADE DEFINITIONS (legacy draft data)
// ============================================
const FACTORY_STAT_UPGRADES = [
    { id: 'rageDamage',   name: 'Bitter Rage',    desc: '+10% damage per level',        icon: '😤', baseCost: 50,  costScale: 1.5, maxLevel: 10, apply: (scene, level) => { scene.playerDamage *= 1 + (level * 0.10); } },
    { id: 'rageSpeed',    name: 'Swift Fury',     desc: '+8% move speed per level',     icon: '💨', baseCost: 40,  costScale: 1.5, maxLevel: 10, apply: (scene, level) => { scene.playerSpeed *= 1 + (level * 0.08); } },
    { id: 'rageFireRate', name: 'Furious Stir',    desc: '-5% fire cooldown per level',  icon: '🔥', baseCost: 60,  costScale: 1.6, maxLevel: 8,  apply: (scene, level) => { scene.playerFireRate *= 1 - (level * 0.05); } },
    { id: 'rageHealth',   name: 'Overflowing Cup', desc: '+20 max health per level',     icon: '🩸', baseCost: 45,  costScale: 1.4, maxLevel: 10, apply: (scene, level) => { GameState.maxHealth += (level * 20); } },
    { id: 'rageMulti',    name: 'Double Shot+',    desc: '+1 pearl every 2 levels',      icon: '🎯', baseCost: 100, costScale: 2.0, maxLevel: 5,  apply: (scene, level) => { scene.multiShot += Math.floor(level / 2); } },
    { id: 'rageArmor',    name: 'Straw Shield',    desc: '-1 damage taken per level',    icon: '🛡️', baseCost: 75,  costScale: 1.5, maxLevel: 5,  apply: (scene, level) => { scene.damageReduction = (scene.damageReduction || 0) + level; } }
];

const FACTORY_SPECIAL_UPGRADES = [
    { id: 'freeze',     name: 'Ice Pearl',    desc: '20% chance to freeze enemies 1.5s',          icon: '❄️',  cost: 150,  apply: (scene) => { scene.hasFreeze = true; scene.freezeChance = 0.2; } },
    { id: 'explode',    name: 'Boba Detonate',desc: 'Killed enemies explode: 30 AoE damage',      icon: '💥', cost: 250,  apply: (scene) => { scene.hasExplode = true; } },
    { id: 'vampire',    name: 'Vampire Boba', desc: 'Heal 5 HP per kill',                        icon: '🩸', cost: 125,  apply: (scene) => { scene.vampireHeal = 5; } },
    { id: 'shield',     name: 'Milk Shield',  desc: 'Block 1 hit every 15 seconds',              icon: '🛡️', cost: 175,  apply: (scene) => { scene.hasShield = true; scene.shieldCooldown = 15000; } },
    { id: 'crit',       name: 'Tapioca Crit', desc: '+15% crit chance for 2x damage',            icon: '⭐', cost: 100,  apply: (scene) => { scene.critChance = 0.15; } }
];

// ============================================
// UPGRADE DEFINITIONS (in-run upgrades — existing)
// ============================================
const UPGRADES = [
    { id: 'shot1', branch: 'shot', tier: 1, name: 'Extra Tapioca', desc: '+1 shot', icon: '+1', apply: scene => { scene.multiShot += 1; } },
    { id: 'shot2', branch: 'shot', tier: 2, name: 'Tapioca+', desc: '+1 shot', icon: '+1', requires: ['shot1'], apply: scene => { scene.multiShot += 1; } },
    { id: 'shot3', branch: 'shot', tier: 3, name: 'Mostly Boba', desc: '+2 shots', icon: '+2', requires: ['shot2'], apply: scene => { scene.multiShot += 2; } },
    { id: 'shot4', branch: 'shot', tier: 4, name: 'All Boba', desc: '+3 shots', icon: '+3', requires: ['shot3'], apply: scene => { scene.multiShot += 3; } },
    { id: 'shot5', branch: 'shot', tier: 5, name: 'Boba God', desc: 'Shots split when killing enemies', icon: 'SPLIT', requires: ['shot4'], apply: scene => { scene.splitOnKill = true; } },
    { id: 'speed1', branch: 'speed', tier: 1, name: 'Fast Service', desc: '+10% speed', icon: 'SPD', apply: scene => { scene.playerSpeed *= 1.10; } },
    { id: 'speed2', branch: 'speed', tier: 2, name: 'Sugar Rush', desc: '+10% speed', icon: 'SPD', requires: ['speed1'], apply: scene => { scene.playerSpeed *= 1.10; } },
    { id: 'speed3', branch: 'speed', tier: 3, name: 'Sugar Fiend', desc: '+30% speed', icon: 'SPD', requires: ['speed2'], apply: scene => { scene.playerSpeed *= 1.30; } },
    { id: 'speed4', branch: 'speed', tier: 4, name: 'High on Boba', desc: '+20% speed. Speed bonus also boosts damage.', icon: 'SPD', requires: ['speed3'], apply: scene => { scene.playerSpeed *= 1.20; scene.applySpeedDamageBonus(); } },
    { id: 'speed5', branch: 'speed', tier: 5, name: 'Boba God', desc: 'XP gives +100% speed for 3 seconds', icon: 'XP', requires: ['speed4'], apply: scene => { scene.xpSpeedBoostEnabled = true; } },
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

const CHARACTER_PATHS = {
    0: { id: 'classic', label: 'Classic Blend' },
    1: { id: 'taro', label: 'Taro Tempo' },
    2: { id: 'matcha', label: 'Matcha Power' },
    3: { id: 'brownSugar', label: 'Brown Sugar Rush' }
};

function getUpgradePickCount(id) {
    return GameState.selectedUpgrades.filter(upgradeId => upgradeId === id).length;
}

function hasUpgrade(id) {
    return GameState.selectedUpgrades.includes(id);
}

function meetsUpgradeRequirements(upgrade) {
    return !upgrade.requires || upgrade.requires.every(id => hasUpgrade(id));
}

function getCurrentPath() {
    const defaultPath = CHARACTER_PATHS[GameState.selectedCharacter] || CHARACTER_PATHS[0];
    const scores = {
        classic: defaultPath.id === 'classic' ? 2 : 0,
        taro: defaultPath.id === 'taro' ? 2 : 0,
        matcha: defaultPath.id === 'matcha' ? 2 : 0,
        brownSugar: defaultPath.id === 'brownSugar' ? 2 : 0
    };

    GameState.selectedUpgrades.forEach(id => {
        const upgrade = UPGRADES.find(entry => entry.id === id);
        if (!upgrade || !upgrade.pathTags) return;
        upgrade.pathTags.forEach(tag => {
            scores[tag] = (scores[tag] || 0) + 1;
        });
    });

    let bestId = defaultPath.id;
    Object.entries(scores).forEach(([id, score]) => {
        if (score > scores[bestId]) {
            bestId = id;
        }
    });

    return Object.values(CHARACTER_PATHS).find(path => path.id === bestId) || defaultPath;
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

function calcMachineTPS() {
    let tps = getBaseFactoryTPS();
    MACHINES.forEach(machine => {
        const level = GameState.machines[machine.id] || 0;
        tps += machine.tps * level;
    });
    return tps;
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
    const megaPressBonus = 1 + ((GameState.idleMachines?.megaPress || 0) * 0.01);
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

function getEnemyMaxHpForWave(wave) {
    return 30 + ((Math.max(1, wave) - 1) * 5);
}

function getXpPerKill(scene) {
    return Math.max(1, Math.floor(20 * (1 + (scene?.permaXpBonusPercent || 0))));
}

function getMachineCost(machine) {
    const level = GameState.machines[machine.id] || 0;
    return Math.floor(machine.baseCost * Math.pow(machine.costScale, level));
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
    return Math.min(0.75, (GameState.idleMachines?.quantumGen || 0) * 0.001);
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
    return GameState.factoryUpgrades[id] || 0;
}

function getPermaUpgradeCost(upgrade) {
    const level = getPermaUpgradeLevel(upgrade.id);
    const baseCost = upgrade.baseCost || 0;
    const costScale = upgrade.costScale || 1;
    const discount = 1 - getQuantumCostReduction();
    return Math.max(1, Math.floor(baseCost * Math.pow(costScale, level) * discount));
}

function meetsPermaRequirements(upgrade) {
    return !upgrade.requires || upgrade.requires.every(id => getPermaUpgradeLevel(id) > 0);
}

function getTotalPermaPointsEarned() {
    return Math.floor(GameState.totalEnemiesKilled / 1000);
}

function getSpentPermaPoints() {
    return PERMA_UPGRADES.reduce((sum, upgrade) => {
        return sum + (getPermaUpgradeLevel(upgrade.id) * (upgrade.pointCost || upgrade.cost || 0));
    }, 0);
}

function getAvailablePermaPoints() {
    return Math.max(0, getTotalPermaPointsEarned() - getSpentPermaPoints());
}

function canBuyPermaUpgrade(upgrade) {
    return getPermaUpgradeLevel(upgrade.id) < upgrade.maxLevel
        && meetsPermaRequirements(upgrade)
        && GameState.tapioca >= getPermaUpgradeCost(upgrade);
}

function getTotalPermanentUpgradesOwned() {
    return Object.values(GameState.factoryUpgrades).reduce((sum, level) => sum + level, 0);
}

function getFactoryRepairCost() {
    return 12 + (GameState.factoryRepairCount * 6);
}

function getFactoryFortifyCost() {
    return 24 + (GameState.factoryFortifyLevel * 14);
}

function getReadableUpgradeStatus(upgrade) {
    return `Lvl ${getPermaUpgradeLevel(upgrade.id)}`;
}

function getBaseFactoryTPS() {
    return 1 + getPermaUpgradeLevel('corePrimer');
}

function resetCanvasInput(scene) {
    const canvas = scene.game?.canvas;
    if (!canvas) return;
    canvas.style.pointerEvents = '';
    canvas.style.cursor = '';
}

const RUN_SCENE_KEYS = ['GameScene', 'PauseScene', 'UpgradeScene', 'FactoryScene', 'GameOverScene'];

function resetRunUiState(scene) {
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
            const menuSideScenes = ['ControlsScene', 'IdleFactoryScene', 'PermaUpgradeScene', 'CampaignMapScene'];
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
    }

    scenePlugin.start(targetKey);
    scene.cleanSceneStartPending = false;
}

function drawSceneBackdrop(scene, accentColor = 0x2b3357) {
    scene.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x111522);
    scene.add.ellipse(230, 96, 420, 210, accentColor, 0.10);
    scene.add.ellipse(GAME_WIDTH - 160, GAME_HEIGHT - 84, 430, 250, 0xffb16b, 0.08);
    const grid = scene.add.graphics();
    grid.lineStyle(1, 0x24304c, 0.22);
    for (let x = 0; x < GAME_WIDTH; x += 40) {
        grid.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += 40) {
        grid.lineBetween(0, y, GAME_WIDTH, y);
    }
}

function createPanel(scene, x, y, width, height, fill = 0x171d2d, stroke = 0x425072, alpha = 0.96) {
    const panel = scene.add.rectangle(x, y, width, height, fill, alpha);
    panel.setStrokeStyle(2, stroke);
    return panel;
}

function getImageSource(path) {
    if (globalThis.BOBA_EMBEDDED_ASSETS?.[path]) {
        return globalThis.BOBA_EMBEDDED_ASSETS[path];
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
    { key: 'player_boba', path: 'assets/Player/player-boba.png' },
    { key: 'boba_gun', path: 'assets/Player/boba-gun.png' },
    { key: 'projectile_boba', path: 'assets/projectile-boba.png' },
    { key: 'lychee_player', path: 'assets/Lychee Player.png' },
    { key: 'lychee_shotgun', path: 'assets/Lychee Shotgun.png' },
    { key: 'lychee_projectile', path: 'assets/Lychee Projectile.png' },
    { key: 'enemy_run_1', path: 'assets/Enemy/run-1.png' },
    { key: 'enemy_run_2', path: 'assets/Enemy/run-2.png' },
    { key: 'enemy_attack_1', path: 'assets/Enemy/attack-1.png' },
    { key: 'factory-ingame', path: 'assets/factory-ingame.png' },
    { key: 'upgrade-shot', path: 'assets/Boba_Upgrades/upgrade-shot.png' },
    { key: 'upgrade-speed', path: 'assets/Boba_Upgrades/upgrade-speed.png' },
    { key: 'upgrade-damage', path: 'assets/Boba_Upgrades/upgrade-damage.png' },
    { key: 'upgrade-health', path: 'assets/Boba_Upgrades/upgrade-health.png' },
    { key: 'upgrade-pierce', path: 'assets/Boba_Upgrades/upgrade-pierce.png' },
    { key: 'upgrade-bounce', path: 'assets/Boba_Upgrades/upgrade-bounce.png' }
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
                if (!source || source === asset.path) {
                    reject(new Error(`Missing embedded asset ${asset.path}`));
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
        SaveManager.load();
        SaveManager.save();
        document.getElementById('boot-status')?.remove();
        this.scene.start('MenuScene');
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
        enemyHealthG.fillStyle(0x333333);
        enemyHealthG.fillRect(0, 0, 30, 4);
        enemyHealthG.generateTexture('enemy_health_bg', 30, 4);
        enemyHealthG.fillStyle(0xff0000);
        enemyHealthG.fillRect(0, 0, 30, 4);
        enemyHealthG.generateTexture('enemy_health_fill', 30, 4);
        enemyHealthG.destroy();

        // Health bar segments
        const healthG = this.add.graphics();
        healthG.fillStyle(0x333333);
        healthG.fillRect(0, 0, 200, 20);
        healthG.generateTexture('health_bg', 200, 20);
        healthG.fillStyle(0xff0000);
        healthG.fillRect(0, 0, 200, 20);
        healthG.generateTexture('health_fill', 200, 20);
        healthG.destroy();

        // XP bar
        const xpG = this.add.graphics();
        xpG.fillStyle(0x333333);
        xpG.fillRect(0, 0, 200, 12);
        xpG.generateTexture('xp_bg', 200, 12);
        xpG.fillStyle(0x3498db);
        xpG.fillRect(0, 0, 200, 12);
        xpG.generateTexture('xp_fill', 200, 12);
        xpG.destroy();

        // UI elements
        const btnG = this.add.graphics();
        btnG.fillStyle(0x444444);
        btnG.fillRoundedRect(0, 0, 200, 50, 8);
        btnG.generateTexture('btn', 200, 50);
        btnG.fillStyle(0x666666);
        btnG.fillRoundedRect(0, 0, 200, 50, 8);
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

        createPanel(this, 92, 112, 160, 146, 0x0a151f, 0x536784, 0.88);
        this.tapiocaText = this.add.text(74, 70, '', { fontSize: '15px', fill: '#7ed2ff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.rageBankText = this.add.text(74, 112, '', { fontSize: '15px', fill: '#ff9f80', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.killText = this.add.text(74, 154, '', { fontSize: '15px', fill: '#ffd27a', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.add.image(52, 70, 'player_boba').setScale(0.045);
        this.add.text(52, 112, 'R', { fontSize: '22px', fill: '#ff9f80', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.add.text(52, 154, 'P', { fontSize: '22px', fill: '#ffd27a', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.add.rectangle(92, 91, 132, 1, 0x536784, 0.45);
        this.add.rectangle(92, 133, 132, 1, 0x536784, 0.45);

        this.add.text(GAME_CENTER_X, 58, 'BOBA', {
            fontSize: '62px', fill: '#fff4d6', fontFamily: 'Arial Black',
            stroke: '#3a2c16', strokeThickness: 5
        }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 116, 'ROGUELIKE', {
            fontSize: '50px', fill: '#78b650', fontFamily: 'Arial Black',
            stroke: '#1d391f', strokeThickness: 5
        }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 158, 'BUILD YOUR IDLE FACTORY, SURVIVE ENDLESS WAVES, AND GROW YOUR PERMANENT BUILD.', {
            fontSize: '12px', fill: '#c2c2b8', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.makeTopIconButton(735, 70, 'Controls', () => this.scene.launch('ControlsScene'));
        this.makeTopIconButton(845, 70, 'Upgrades', () => this.scene.start('PermaUpgradeScene'));
        this.makeTopIconButton(945, 70, 'Factory', () => this.scene.start('IdleFactoryScene'));
        this.makeTopIconButton(625, 70, 'Map', () => this.scene.start('CampaignMapScene', { fromMenu: true }));

        createPanel(this, 330, 360, 330, 300, 0x0d241e, 0x3a7a55, 0.92);
        createPanel(this, 705, 360, 330, 300, 0x0b1722, 0x536784, 0.92);

        this.add.text(330, 230, 'FACTORY PREVIEW', {
            fontSize: '18px',
            fill: '#74c174',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.rectangle(330, 366, 284, 170, 0x07120f, 0.74).setStrokeStyle(2, 0x214c38);
        this.add.circle(330, 404, 86, 0x42b765, 0.08);
        this.charPreview = this.add.image(330, 370, 'player_boba').setScale(0.22);
        createPanel(this, 330, 485, 284, 62, 0x0c1c17, 0x326449, 0.94);
        this.add.text(330, 485, 'Your idle factory is always working.\nKeep it running and get stronger.', {
            fontSize: '13px',
            fill: '#cfe7c4',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);

        this.add.text(705, 230, 'RUN INFO', {
            fontSize: '18px',
            fill: '#ffe7aa',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.add.rectangle(705, 332, 284, 126, 0x07121d, 0.74).setStrokeStyle(2, 0x243c57);
        this.factoryPreview = this.add.image(705, 330, 'factory-ingame').setScale(0.16).setAlpha(0.98);
        createPanel(this, 705, 431, 284, 52, 0x241b13, 0x775b3b, 0.94);
        this.factoryPreviewLabel = this.add.text(705, 431, 'IDLE FACTORY RUNS OUTSIDE COMBAT.\nRUNS ARE PLAYER-ONLY.', {
            fontSize: '13px',
            fill: '#ffd39d',
            align: 'center',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.runHintText = this.add.text(705, 494, 'Idle factory generates tapioca.\nRage upgrades the factory outside runs.\nLevel-ups grant combat upgrades.', {
            fontSize: '13px',
            fill: '#c2cbda',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        const campaign = getCampaignLocation();
        const unlocked = GameState.campaignUnlockedIndex + 1;
        this.add.text(705, 544, `CAMPAIGN: ${campaign.name.toUpperCase()}   ${unlocked}/${CAMPAIGN_LOCATIONS.length} MAP STOPS`, {
            fontSize: '13px',
            fill: '#ffe7aa',
            align: 'center',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.makeButton(215, 590, 'START GAME', () => {
            GameState.reset();
            GameState.selectedCharacter = 0;
            this.scene.start('GameScene');
        }, 0x66c878, 0x153a20);

        this.makeButton(405, 590, 'UPGRADES', () => {
            this.scene.start('PermaUpgradeScene');
        }, 0x5db8e8, 0x102f42);

        this.makeButton(595, 590, 'CONTROLS', () => {
            this.scene.launch('ControlsScene');
        }, 0xc99af7, 0x2b1d40);

        this.makeButton(800, 590, 'IDLE FACTORY', () => {
            this.scene.start('IdleFactoryScene');
        }, 0xf0b14b, 0x442c0c, 188);

        createPanel(this, 500, 660, 750, 42, 0x0b121b, 0x31445e, 0.94);
        this.add.text(260, 660, 'VOLUME', { fontSize: '14px', fill: '#c2c2b8', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.volumeSlider = this.add.rectangle(372, 660, 220, 8, 0x293449).setOrigin(0, 0.5);
        this.volumeFill = this.add.rectangle(372, 660, GameState.volume * 220, 8, 0x5bbcff).setOrigin(0, 0.5);
        this.volumePercent = this.add.text(612, 660, '', { fontSize: '14px', fill: '#d5e4ff' }).setOrigin(0, 0.5);

        this.add.text(690, 660, 'AIM MODE', { fontSize: '14px', fill: '#c2c2b8', fontFamily: 'Arial Black' }).setOrigin(0, 0.5);
        this.aimModeBtn = this.add.rectangle(820, 660, 110, 24, 0x0d324a, 0.96)
            .setStrokeStyle(2, 0x4fa3da)
            .setInteractive({ useHandCursor: true });
        this.aimModeLabel = this.add.text(820, 660, '', { fontSize: '13px', fill: '#9fd7ff', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.aimModeBtn.on('pointerover', () => this.aimModeBtn.setFillStyle(0x164b6c, 0.96));
        this.aimModeBtn.on('pointerout', () => this.aimModeBtn.setFillStyle(0x0d324a, 0.96));
        this.aimModeBtn.on('pointerdown', () => {
            GameState.aimMode = GameState.aimMode === 'manual' ? 'auto' : 'manual';
            SaveManager.save();
            this.updateDisplays();
        });

        this.input.on('pointerdown', (ptr) => {
            if (ptr.y > 650 && ptr.y < 670 && ptr.x > 372 && ptr.x < 592) {
                const vol = Math.max(0, Math.min(1, (ptr.x - 372) / 220));
                GameState.volume = vol;
                this.volumeFill.width = vol * 220;
                this.volumePercent.setText(String(Math.floor(GameState.volume * 100)) + '%');
                this.scene.get('ControlsScene')?.events.emit('volumechange', vol);
            }
        });

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
        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x061018);
        const skyline = this.add.graphics();
        const buildings = [
            [0, 380, 70, 240], [82, 310, 88, 310], [184, 350, 78, 270],
            [754, 330, 88, 290], [858, 280, 74, 340], [940, 350, 72, 270],
            [260, 392, 60, 230], [660, 390, 58, 230]
        ];
        buildings.forEach(([x, y, w, h], index) => {
            skyline.fillStyle(index % 2 ? 0x0b1d24 : 0x0a171f, 0.9);
            skyline.fillRect(x, y, w, h);
            skyline.lineStyle(1, 0x183345, 0.65);
            skyline.strokeRect(x, y, w, h);
            for (let wx = x + 12; wx < x + w - 10; wx += 20) {
                for (let wy = y + 20; wy < y + h - 10; wy += 28) {
                    skyline.fillStyle((wx + wy) % 3 === 0 ? 0xd69b39 : 0x1c754a, 0.35);
                    skyline.fillRect(wx, wy, 6, 8);
                }
            }
        });
        skyline.lineStyle(2, 0x0d2c35, 0.7);
        skyline.lineBetween(0, 610, GAME_WIDTH, 610);
        for (let x = 0; x < GAME_WIDTH; x += 40) {
            skyline.lineStyle(1, 0x163442, 0.18);
            skyline.lineBetween(x, 0, x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 40) {
            skyline.lineStyle(1, 0x163442, 0.18);
            skyline.lineBetween(0, y, GAME_WIDTH, y);
        }
        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.18);
        createPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 980, 680, 0x000000, 0x1e3549, 0.10);
    }

    makeTopIconButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 92, 38, 0x101c25, 0.92)
            .setStrokeStyle(2, 0x385069)
            .setInteractive({ useHandCursor: true });
        this.add.text(x, y, text, { fontSize: '11px', fill: '#d6e5e3', fontFamily: 'Arial Black' }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setFillStyle(0x1a2a36, 0.94));
        btn.on('pointerout', () => btn.setFillStyle(0x101c25, 0.92));
        btn.on('pointerdown', callback);
        return btn;
    }

    updateDisplays() {
        this.tapiocaText.setText('TAPIOCA\n' + Math.floor(GameState.tapioca));
        this.rageBankText.setText('RAGE\n' + Math.floor(GameState.rage));
        this.killText.setText('PERMA PTS\n' + getAvailablePermaPoints() + ' / ' + getTotalPermaPointsEarned());
        if (this.volumePercent) {
            this.volumePercent.setText(String(Math.floor(GameState.volume * 100)) + '%');
        }
        if (this.aimModeLabel) {
            this.aimModeLabel.setText(GameState.aimMode === 'manual' ? 'MANUAL' : 'AUTO');
        }
    }

    makeButton(x, y, text, callback, accent = 0x7ed2ff, fill = 0x122438, width = 170) {
        const btn = this.add.rectangle(x, y, width, 48, fill, 0.96)
            .setStrokeStyle(3, accent)
            .setInteractive({ useHandCursor: true });
        this.add.text(x, y, text, { fontSize: '15px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0.5);

        btn.on('pointerover', () => {
            btn.setFillStyle(fill + 0x080808, 0.98);
        });
        btn.on('pointerout', () => {
            btn.setFillStyle(fill, 0.96);
        });
        btn.on('pointerdown', callback);

        return btn;
    }
}

// ============================================
// CAMPAIGN MAP SCENE
// ============================================
class CampaignMapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CampaignMapScene' });
    }

    create(data = {}) {
        sanitizeCampaignState();
        this.fromRun = Boolean(data.fromRun);
        this.fromMenu = Boolean(data.fromMenu);
        resetCanvasInput(this);

        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x071018, this.fromRun ? 0.94 : 1).setInteractive();
        drawSceneBackdrop(this, 0x456b86);
        createPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 900, 600, 0x101826, 0x536784, 0.96);

        this.add.text(GAME_CENTER_X, 76, 'CAMPAIGN MAP', {
            fontSize: '42px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black',
            stroke: '#2f2717',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 118, 'Earn souls from kills in a single run, then challenge the local boss to move forward.', {
            fontSize: '15px',
            fill: '#c9d6e4',
            align: 'center'
        }).setOrigin(0.5);

        this.drawMapSurface();
        this.drawRoute();
        this.drawLocationNodes();
        this.createSoulPanel();
        this.createActions();
    }

    drawMapSurface() {
        const map = this.add.graphics();
        map.fillStyle(0x0a1420, 0.92);
        map.fillRoundedRect(82, 160, 836, 330, 12);
        map.lineStyle(2, 0x2e4d66, 0.65);
        map.strokeRoundedRect(82, 160, 836, 330, 12);

        map.fillStyle(0x18374b, 0.34);
        map.fillEllipse(218, 330, 210, 145);
        map.fillEllipse(368, 420, 150, 112);
        map.fillEllipse(548, 332, 148, 138);
        map.fillEllipse(692, 358, 210, 122);
        map.fillEllipse(802, 306, 120, 96);

        for (let x = 120; x <= 880; x += 76) {
            map.lineStyle(1, 0x31506b, 0.15);
            map.lineBetween(x, 176, x, 474);
        }
        for (let y = 202; y <= 464; y += 44) {
            map.lineStyle(1, 0x31506b, 0.15);
            map.lineBetween(96, y, 904, y);
        }
    }

    drawRoute() {
        const route = this.add.graphics();
        route.lineStyle(4, 0x4d6e87, 0.58);
        for (let i = 0; i < CAMPAIGN_LOCATIONS.length - 1; i++) {
            const a = CAMPAIGN_LOCATIONS[i];
            const b = CAMPAIGN_LOCATIONS[i + 1];
            route.lineBetween(a.x, a.y, b.x, b.y);
        }
        route.lineStyle(5, 0xffd27a, 0.86);
        for (let i = 0; i < Math.min(GameState.campaignUnlockedIndex, CAMPAIGN_LOCATIONS.length - 1); i++) {
            const a = CAMPAIGN_LOCATIONS[i];
            const b = CAMPAIGN_LOCATIONS[i + 1];
            route.lineBetween(a.x, a.y, b.x, b.y);
        }
    }

    drawLocationNodes() {
        CAMPAIGN_LOCATIONS.forEach((location, index) => {
            const unlocked = index <= GameState.campaignUnlockedIndex;
            const active = index === GameState.campaignLocationIndex;
            const cleared = Boolean(GameState.campaignCleared?.[location.id]);
            const fill = active ? location.accent : cleared ? 0x67d58a : unlocked ? 0x203549 : 0x121923;
            const stroke = active ? 0xfff0b8 : unlocked ? location.accent : 0x4a5563;

            const node = this.add.circle(location.x, location.y, active ? 28 : 23, fill, unlocked ? 0.96 : 0.72)
                .setStrokeStyle(active ? 4 : 2, stroke)
                .setInteractive({ useHandCursor: unlocked && !this.fromRun });
            this.add.text(location.x, location.y, location.shortName, {
                fontSize: '13px',
                fill: unlocked ? '#fff7e6' : '#788390',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            this.add.text(location.x, location.y + 42, location.name.toUpperCase(), {
                fontSize: active ? '13px' : '11px',
                fill: active ? '#fff0b8' : unlocked ? '#d7e4ef' : '#7c8794',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);

            if (!this.fromRun && unlocked) {
                node.on('pointerdown', () => {
                    GameState.campaignLocationIndex = index;
                    SaveManager.save();
                    this.scene.restart({ fromMenu: true });
                });
            }
        });
    }

    createSoulPanel() {
        const location = getCampaignLocation();
        const progress = getCampaignSoulProgress();
        createPanel(this, GAME_CENTER_X, 548, 600, 86, 0x151b2b, 0x425072, 0.96);

        this.add.text(236, 522, `CURRENT STOP: ${location.name.toUpperCase()}`, {
            fontSize: '16px',
            fill: '#fff4d6',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        this.add.text(236, 554, `Boss: ${location.boss}`, {
            fontSize: '13px',
            fill: '#b9c8d9'
        }).setOrigin(0, 0.5);

        this.add.rectangle(650, 544, 240, 18, 0x2a1a22).setOrigin(0, 0.5).setStrokeStyle(2, 0x6d4c5f);
        this.add.rectangle(652, 544, 236 * progress.pct, 12, 0xd96bd8).setOrigin(0, 0.5);
        this.add.text(770, 544, `${progress.souls} / ${progress.target} SOULS`, {
            fontSize: '13px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
    }

    createActions() {
        const progress = getCampaignSoulProgress();
        const canAdvance = progress.souls >= progress.target;
        const allCleared = GameState.campaignLocationIndex >= CAMPAIGN_LOCATIONS.length - 1 && canAdvance;
        const bossLabel = allCleared ? 'FINAL BOSS READY' : canAdvance ? 'BOSS READY' : 'BOSS LOCKED';

        this.makeMapButton(366, 638, bossLabel, () => {
            if (!canAdvance) return;
            advanceCampaignLocation();
            this.scene.restart({ fromRun: this.fromRun, fromMenu: this.fromMenu });
        }, canAdvance ? 0xffd27a : 0x546070, canAdvance ? 0x3a2810 : 0x17202b, 220);

        this.makeMapButton(630, 638, this.fromRun ? 'RESUME RUN' : 'MAIN MENU', () => {
            if (this.fromRun) {
                GameState.paused = false;
                const gameScene = this.scene.get('GameScene');
                this.scene.stop();
                this.scene.resume('GameScene');
                if (gameScene?.updateUI) {
                    gameScene.updateUI();
                }
                return;
            }
            this.scene.start('MenuScene');
        }, 0x7ed2ff, 0x102f42, 190);
    }

    makeMapButton(x, y, text, callback, accent, fill, width) {
        const btn = this.add.rectangle(x, y, width, 44, fill, 0.98)
            .setStrokeStyle(3, accent)
            .setInteractive({ useHandCursor: true });
        this.add.text(x, y, text, {
            fontSize: '14px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        btn.on('pointerover', () => btn.setFillStyle(fill + 0x080808, 1));
        btn.on('pointerout', () => btn.setFillStyle(fill, 0.98));
        btn.on('pointerdown', callback);
        return btn;
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

        const card = this.add.rectangle(x, y, 360, 64, 0x162b2d).setStrokeStyle(2, canAfford ? 0xffd700 : 0x4b7878);
        card.setInteractive({ useHandCursor: canAfford });
        if (canAfford) {
            card.on('pointerdown', () => this.buyIdleMachine(machine));
        }
        this.machineCardRoots.push(card);

        this.machineCardRoots.push(this.add.text(x - 156, y, machine.icon, { fontSize: '18px', fill: '#fff4d6', fontFamily: 'Arial Black' }).setOrigin(0.5));
        this.machineCardRoots.push(this.add.text(x - 124, y - 16, machine.name, { fontSize: '13px', fill: '#fff', fontFamily: 'Arial Black' }).setOrigin(0, 0.5));
        this.machineCardRoots.push(this.add.text(x - 124, y + 5, `${machine.desc} | ${machine.mutationText}`, {
            fontSize: '10px',
            fill: '#a8d0cc',
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

    create() {
        SaveManager.load();
        drawSceneBackdrop(this, 0x476b86);

        createPanel(this, GAME_CENTER_X, 70, 760, 88, 0x101826, 0x536784, 0.95);
        createPanel(this, GAME_CENTER_X, 360, 890, 500, 0x111827, 0x536784, 0.96);
        createPanel(this, GAME_CENTER_X, 640, 860, 76, 0x101826, 0x536784, 0.95);

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

        this.add.text(GAME_CENTER_X, 130, 'TP means tapioca. Click any card to buy one permanent level for future runs.', {
            fontSize: '14px',
            fill: '#9fb3d9'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 175, 'PERMANENT SMALL BOOSTS', { fontSize: '19px', fill: '#74d39a', fontFamily: 'Arial Black' }).setOrigin(0.5);
        this.add.text(GAME_CENTER_X, 372, 'PER-RUN BOOSTS', { fontSize: '19px', fill: '#ffd27a', fontFamily: 'Arial Black' }).setOrigin(0.5);

        this.shopCards = [];
        [
            { branch: 'Small Boosts', y: 260 },
            { branch: 'Per-Run Boosts', y: 455 }
        ].forEach(row => {
            const rowUpgrades = PERMA_UPGRADES.filter(upgrade => upgrade.branch === row.branch);
            const compact = rowUpgrades.length >= 5;
            const spacing = compact ? 178 : 280;
            const startX = GAME_CENTER_X - ((rowUpgrades.length - 1) * spacing / 2);
            rowUpgrades.forEach((upgrade, index) => {
                this.shopCards.push(this.createMainMenuUpgradeCard(startX + (index * spacing), row.y, upgrade, compact));
            });
        });

        this.detailText = this.add.text(GAME_CENTER_X, 595, '', {
            fontSize: '14px',
            fill: '#f3d7df',
            align: 'center'
        }).setOrigin(0.5);

        this.makeActionButton(220, 640, 'BACK', () => this.scene.start('MenuScene'));
        this.makeActionButton(780, 640, 'START RUN', () => {
            GameState.reset();
            this.scene.start('GameScene');
        });

        this.updateUpgradeShop();
    }

    createMainMenuUpgradeCard(x, y, upgrade, compact = false) {
        const cardWidth = compact ? 168 : 220;
        const left = x - (cardWidth / 2) + 16;
        const textWidth = cardWidth - 28;
        const card = createPanel(this, x, y, cardWidth, 126, 0x1a2233, 0x4c5d83, 0.98).setInteractive({ useHandCursor: true });
        const name = this.add.text(left, y - 46, upgrade.name, {
            fontSize: compact ? (upgrade.name.length > 11 ? '12px' : '14px') : (upgrade.name.length > 12 ? '14px' : '16px'),
            fill: '#fff7e6',
            fontFamily: 'Arial Black',
            wordWrap: { width: textWidth, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);
        const effect = this.add.text(left, y - 18, '', {
            fontSize: compact ? '10px' : '12px',
            fill: '#9bd2ff',
            wordWrap: { width: textWidth, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);
        const status = this.add.text(left, y + 10, '', {
            fontSize: compact ? '10px' : '12px',
            fill: '#c7d4ec',
            wordWrap: { width: textWidth, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);
        const costBoxX = x + (cardWidth / 2) - (compact ? 40 : 46);
        const costBox = this.add.rectangle(costBoxX, y + 36, compact ? 64 : 74, 36, 0x0d1725, 0.92).setStrokeStyle(1, 0x526481);
        const cost = this.add.text(costBoxX, y + 36, '', {
            fontSize: compact ? '9px' : '11px',
            fill: '#ffe4a3',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);
        const cta = this.add.text(left, y + 46, '', {
            fontSize: compact ? '9px' : '11px',
            fill: '#8fa1bd',
            fontFamily: 'Arial Black',
            wordWrap: { width: compact ? 86 : 120, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);
        const select = () => this.buyPermaUpgrade(upgrade.id);
        [card, name, effect, status, costBox, cost, cta].forEach(item => {
            item.setInteractive?.({ useHandCursor: true });
            item.on?.('pointerdown', select);
            item.on?.('pointerover', () => this.showUpgradeDetails(upgrade));
        });
        return { card, name, effect, status, costBox, cost, cta, upgrade, compact };
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

    createUpgradeNode(x, y, upgrade) {
        const card = createPanel(this, x, y, 186, 58, 0x1f2940, 0x4c5d83, 0.98).setInteractive({ useHandCursor: true });
        const name = this.add.text(x, y - 12, upgrade.name, {
            fontSize: '14px',
            fill: '#fff7e6',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        const status = this.add.text(x, y + 12, '', {
            fontSize: '12px',
            fill: '#9bd2ff',
            align: 'center'
        }).setOrigin(0.5);
        const select = () => this.buyPermaUpgrade(upgrade.id);
        card.on('pointerdown', select);
        card.on('pointerover', () => this.showUpgradeDetails(upgrade));
        name.setInteractive({ useHandCursor: true }).on('pointerdown', select).on('pointerover', () => this.showUpgradeDetails(upgrade));
        status.setInteractive({ useHandCursor: true }).on('pointerdown', select).on('pointerover', () => this.showUpgradeDetails(upgrade));
        return { card, name, status, upgrade };
    }

    updateTree() {
        if (this.shopCards) {
            this.updateUpgradeShop();
            return;
        }
        const nextPointAt = (Math.floor(GameState.totalEnemiesKilled / 1000) + 1) * 1000;
        this.summaryText.setText(`POINTS ${getAvailablePermaPoints()} / ${getTotalPermaPointsEarned()}   |   KILLS ${GameState.totalEnemiesKilled}   |   NEXT POINT AT ${nextPointAt}`);
        this.treeNodes.forEach(node => {
            const owned = getPermaUpgradeLevel(node.upgrade.id);
            const canBuy = canBuyPermaUpgrade(node.upgrade);
            const unlocked = meetsPermaRequirements(node.upgrade);
            const isMaxed = owned >= node.upgrade.maxLevel;
            node.status.setText(`${node.upgrade.desc}\n${getReadableUpgradeStatus(node.upgrade)} ${isMaxed ? 'MAX' : `| ${node.upgrade.cost} PT`}`);
            if (isMaxed) {
                node.card.setFillStyle(0x284234, 0.98);
                node.card.setStrokeStyle(2, 0x5fe08c);
                node.status.setColor('#aef1c0');
            } else if (canBuy) {
                node.card.setFillStyle(0x26304a, 0.98);
                node.card.setStrokeStyle(2, 0xffd700);
                node.status.setColor('#ffe4a3');
            } else if (unlocked) {
                node.card.setFillStyle(0x2b2430, 0.98);
                node.card.setStrokeStyle(2, 0x8f719f);
                node.status.setColor('#d9c2eb');
            } else {
                node.card.setFillStyle(0x1b1e2a, 0.98);
                node.card.setStrokeStyle(2, 0x485066);
                node.status.setColor('#8892aa');
            }
        });
        this.showUpgradeDetails(PERMA_UPGRADES[0]);
    }

    updateUpgradeShop() {
        this.summaryText.setText(`TAPIOCA ${Math.floor(GameState.tapioca)}   |   Click a card to spend TP on one level   |   Boba Evolutions later`);
        this.shopCards.forEach(node => {
            const level = getPermaUpgradeLevel(node.upgrade.id);
            const cost = getPermaUpgradeCost(node.upgrade);
            const canBuy = canBuyPermaUpgrade(node.upgrade);
            const isMaxed = level >= node.upgrade.maxLevel;
            node.effect.setText(node.compact ? `${node.upgrade.effectText} / level` : `Each level: ${node.upgrade.effectText}`);
            node.status.setText(`Owned: ${level} levels`);
            node.cost.setText(isMaxed ? 'MAX' : `Next\n${cost} TP`);
            node.cta.setText(isMaxed ? 'MAXED OUT' : canBuy ? 'CLICK TO BUY' : 'NEED MORE TAPIOCA');
            if (isMaxed) {
                node.card.setFillStyle(0x284234, 0.98);
                node.card.setStrokeStyle(2, 0x5fe08c);
                node.costBox.setFillStyle(0x102418, 0.92);
                node.cost.setColor('#aef1c0');
                node.cta.setColor('#aef1c0');
            } else if (canBuy) {
                node.card.setFillStyle(0x26304a, 0.98);
                node.card.setStrokeStyle(2, 0xffd700);
                node.costBox.setFillStyle(0x271f0b, 0.92);
                node.cost.setColor('#ffe4a3');
                node.cta.setColor('#ffe4a3');
            } else {
                node.card.setFillStyle(0x1b1e2a, 0.98);
                node.card.setStrokeStyle(2, 0x485066);
                node.costBox.setFillStyle(0x0d1725, 0.92);
                node.cost.setColor('#7f8da7');
                node.cta.setColor('#7f8da7');
            }
        });
        this.showUpgradeDetails(PERMA_UPGRADES[0]);
    }

    showUpgradeDetails(upgrade) {
        const requires = upgrade.requires && upgrade.requires.length > 0
            ? 'Requires: ' + upgrade.requires.map(id => getPermaUpgrade(id)?.name || id).join(', ')
            : 'No prerequisite';
        const cost = getPermaUpgradeCost(upgrade);
        this.detailText.setText(`${upgrade.name}: permanent ${upgrade.desc}   |   Next ${cost} TP   |   ${requires}`);
    }

    buyPermaUpgrade(id) {
        const upgrade = getPermaUpgrade(id);
        if (!upgrade || !canBuyPermaUpgrade(upgrade)) return;
        GameState.tapioca -= getPermaUpgradeCost(upgrade);
        GameState.factoryUpgrades[id] = getPermaUpgradeLevel(id) + 1;
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
// CONTROLS SCENE (Overlay)
// ============================================
class ControlsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlsScene' });
    }

    create() {
        drawSceneBackdrop(this, 0x406694);
        createPanel(this, 400, 300, 620, 420, 0x131a2a, 0x536784, 0.95);

        this.add.text(400, 150, 'CONTROLS', {
            fontSize: '36px', fill: '#fff4d6', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        const controls = [
            'WASD - Move',
            GameState.aimMode === 'manual' ? 'MANUAL AIM - HOLD/CLICK TO FIRE' : 'AUTO AIM - TRACKS ENEMIES',
            'AUTO-FIRE',
            'ESC - Pause',
            '',
            'Survive the run.',
            'TC buys run upgrades.',
            'Rage upgrades the idle factory.',
            'Every 1000 kills gives 1 perma point.',
            'Buy permanent upgrades from the menu tree.'
        ];

        controls.forEach((line, i) => {
            this.add.text(400, 230 + i * 35, line, {
                fontSize: '22px', fill: '#d5e4ff'
            }).setOrigin(0.5);
        });

        const closeBtn = this.add.image(400, 500, 'btn').setInteractive({ useHandCursor: true });
        const closeLabel = this.add.text(400, 500, 'CLOSE', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        closeBtn.on('pointerover', () => closeBtn.setTexture('btn_hover'));
        closeBtn.on('pointerout', () => closeBtn.setTexture('btn'));
        closeBtn.on('pointerdown', () => this.scene.stop());
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

        const branches = ['shot', 'speed', 'damage', 'health', 'pierce', 'bounce'];
        const labels = {
            shot: 'Shots',
            speed: 'Speed',
            damage: 'Damage',
            health: 'Health',
            pierce: 'Pierce',
            bounce: 'Bounce'
        };

        branches.forEach((branch, branchIndex) => {
            const branchUpgrades = UPGRADES
                .filter(upgrade => upgrade.branch === branch)
                .sort((a, b) => a.tier - b.tier);
            const y = 220 + (branchIndex * 66);
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
                const tierBox = this.add.rectangle(x, y, 46, 38, fill, 0.98).setStrokeStyle(2, stroke);
                this.add.text(x, y - 5, `T${upgrade.tier}`, {
                    fontSize: '11px',
                    fill: ownedTier ? '#fff4c4' : '#8fa1bd',
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5);
                this.add.text(x, y + 10, upgrade.icon, {
                    fontSize: upgrade.icon.length > 3 ? '8px' : '11px',
                    fill: ownedTier ? '#ffd700' : '#8fa1bd',
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5);
            });

            this.add.text(780, y, highestOwned ? highestOwned.name : 'None', {
                fontSize: '12px',
                fill: highestOwned ? '#ffd27a' : '#6f7d95',
                wordWrap: { width: 130 }
            }).setOrigin(0, 0.5);
        });
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
        this.weaponProfile = getCampaignWeaponProfile();
        this.playerTextureKey = this.weaponProfile.playerTexture;
        this.gunTextureKey = this.weaponProfile.gunTexture;
        this.projectileTextureKey = this.weaponProfile.projectileTexture;
        this.playerSpeed *= 1 + ((GameState.idleMachines?.ballRoller || 0) * 0.01);
        this.playerDamage *= 1 + ((GameState.idleMachines?.ballMaker || 0) * 0.005);
        this.multiShot = char.multiShot || 1;
        this.maxBounces = char.maxBounces || 0;
        this.projectilePierce = 0;
        this.projectileSpeed = 500;
        this.projectileScale = 0.18;
        if (this.weaponProfile.id === 'lychee-shotgun') {
            this.playerDamage = this.weaponProfile.projectileDamage;
            this.basePlayerDamage = this.weaponProfile.projectileDamage;
            this.playerFireRate = this.weaponProfile.fireRate;
            this.multiShot = this.weaponProfile.projectileCount;
            this.projectileSpeed = this.weaponProfile.projectileSpeed;
            this.projectileScale = this.weaponProfile.projectileScale;
        }
        this.pierceDamageScale = 0;
        this.bounceDamageScale = 0;
        this.wallSplitCount = 0;
        this.wallFullDamageSplits = 0;
        this.splitOnKill = false;
        this.growingBoba = false;
        this.xpSpeedBoostEnabled = false;
        this.xpSpeedBoostUntil = 0;
        this.damageReductionPercent = 0;
        this.periodicFullBlock = false;
        this.nextFullBlockAt = 0;
        this.enemyIdCounter = 0;
        this.damageNumberCounter = 0;
        this.lastFireTime = -Infinity;
        this.permaFactoryBaseTpsBonus = 0;
        this.permaStartingRageBonus = 0;
        this.permaMaxAmmoBonus = 0;
        this.permaFactoryMaxHealthBonus = 0;
        this.permaFactoryWaveRegenBonus = 0;
        this.permaFactoryAttackRateMultiplier = 1;
        this.permaFactoryAmmoPerSecond = 2;
        this.permaEarlyWaveRageBonus = 0;
        this.permaRageBonusPercent = 0;
        this.permaXpBonusPercent = 0;
        this.permaReloadSpeedBonus = 0;
        this.playerDown = false;
        this.runEnded = false;
        this.deathTransitionPending = false;
        this.switchingScene = false;
        this.waveTransitioning = false;
        this.factoryInvincibleUntil = 0;
        this.playerInvincibleUntil = 0;

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

        GameState.rage += this.permaStartingRageBonus;
        GameState.health = GameState.maxHealth;
        GameState.tc = 0;

        this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
        this.add.rectangle(GAME_CENTER_X, GAME_CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

        const grid = this.add.graphics();
        grid.lineStyle(1, 0x2a2a4e, 0.3);
        for (let x = 0; x < GAME_WIDTH; x += 40) {
            grid.lineBetween(x, 0, x, GAME_HEIGHT);
        }
        for (let y = 0; y < GAME_HEIGHT; y += 40) {
            grid.lineBetween(0, y, GAME_WIDTH, y);
        }

        this.createPlayer();
        this.createHud();

        this.enemies = this.physics.add.group();
        this.bobas = this.physics.add.group();

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
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

        this.physics.world.on('worldbounds', this.handleBobaWorldBounds, this);

        this.input.keyboard.on('keydown-ESC', () => {
            if (!GameState.paused) {
                this.setCombatMouseLocked(false);
                GameState.paused = true;
                this.scene.pause();
                this.scene.launch('PauseScene');
            }
        });

        this.input.keyboard.on('keydown-M', () => this.openCampaignMap());

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
            this.physics.world.off('worldbounds', this.handleBobaWorldBounds, this);
        });

        this.syncAimInputMode();
        this.updateUI();
    }

    createFactory() {
        this.factory = { x: 400, y: 300, radius: 58 };
        this.factoryGlow = this.add.circle(this.factory.x, this.factory.y, 92, 0xff9955, 0.12).setDepth(0);
        this.factoryBase = this.add.circle(this.factory.x, this.factory.y + 18, 72, 0x2a1a12, 0.95).setDepth(0);
        this.factoryShadow = this.add.ellipse(this.factory.x, this.factory.y + 58, 170, 30, 0x000000, 0.25).setDepth(0);
        this.factorySprite = this.add.image(this.factory.x, this.factory.y, 'factory-ingame').setScale(0.22).setDepth(1);
        this.factoryLabel = this.add.text(this.factory.x, 186, 'TAPIOCA FACTORY', {
            fontSize: '16px',
            fill: '#ffd27a',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(3);
        this.factoryHealthBg = this.add.rectangle(this.factory.x, 208, 138, 10, 0x341313).setDepth(3);
        this.factoryHealthFill = this.add.rectangle(this.factory.x - 67, 208, 134, 6, 0xff7a45).setOrigin(0, 0.5).setDepth(3);
        this.factoryOutputText = this.add.text(this.factory.x, 225, '+0 TC/s', {
            fontSize: '12px',
            fill: '#ffe9a6'
        }).setOrigin(0.5).setDepth(3);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(GAME_CENTER_X, GAME_HEIGHT - 180, this.playerTextureKey || 'player_boba');
        this.player.setOrigin(0.5);
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
        this.bobaCount = this.maxBobaCount;
        this.isReloading = false;
        this.reloadDuration = Math.max(250, Math.floor(1000 / (1 + this.permaReloadSpeedBonus)));
    }

    createHud() {
        createPanel(this, 112, 130, 208, 146, 0x151b2b, 0x425072, 0.82).setDepth(4);
        createPanel(this, GAME_WIDTH - 96, 76, 176, 118, 0x151b2b, 0x425072, 0.82).setDepth(4);
        createPanel(this, GAME_CENTER_X, 24, 240, 36, 0x151b2b, 0x7a4f83, 0.82).setDepth(4);
        this.bobaCountText = this.add.text(16, 80, '', { fontSize: '14px', fill: '#fff' }).setOrigin(0, 0.5);
        this.reloadText = this.add.text(16, 98, 'RELOADING...', { fontSize: '10px', fill: '#ff6600' }).setOrigin(0, 0.5);
        this.reloadText.setVisible(false);
        this.playerStateText = this.add.text(16, 116, '', { fontSize: '12px', fill: '#ffcc66' }).setOrigin(0, 0.5);
        this.rageText = this.add.text(16, 138, '', { fontSize: '14px', fill: '#ff6666' }).setOrigin(0, 0.5);
        this.tcText = this.add.text(16, 158, '', { fontSize: '14px', fill: '#66ccff' }).setOrigin(0, 0.5);
        this.outputText = this.add.text(16, 178, '', { fontSize: '13px', fill: '#ffe9a6' }).setOrigin(0, 0.5);

        this.healthBarBg = this.add.image(100, 30, 'health_bg').setOrigin(0, 0.5);
        this.healthBarFill = this.add.image(100, 30, 'health_fill').setOrigin(0, 0.5);
        this.healthBarFill.displayWidth = 200;
        this.healthText = this.add.text(100, 30, '', { fontSize: '14px', fill: '#fff' }).setOrigin(0, 0.5);

        this.xpBarBg = this.add.image(100, 55, 'xp_bg').setOrigin(0, 0.5);
        this.xpBarFill = this.add.image(100, 55, 'xp_fill').setOrigin(0, 0.5);
        this.xpBarFill.displayWidth = 0;
        this.xpText = this.add.text(100, 55, '', { fontSize: '12px', fill: '#fff' }).setOrigin(0, 0.5);

        this.soulBarBg = this.add.rectangle(GAME_CENTER_X - 80, 24, 148, 12, 0x2a1a22).setOrigin(0, 0.5).setDepth(5);
        this.soulBarBg.setStrokeStyle(1, 0x7a4f83);
        this.soulBarFill = this.add.rectangle(GAME_CENTER_X - 79, 24, 0, 8, 0xd96bd8).setOrigin(0, 0.5).setDepth(5);
        this.soulText = this.add.text(GAME_CENTER_X + 4, 24, '', { fontSize: '12px', fill: '#fff7e6', fontFamily: 'Arial Black' }).setOrigin(0, 0.5).setDepth(5);
        this.mapButton = this.add.rectangle(GAME_CENTER_X + 108, 24, 42, 22, 0x22162b, 0.98)
            .setStrokeStyle(2, 0xd96bd8)
            .setDepth(5)
            .setInteractive({ useHandCursor: true });
        this.mapButtonLabel = this.add.text(GAME_CENTER_X + 108, 24, 'MAP', { fontSize: '10px', fill: '#ffd7ff', fontFamily: 'Arial Black' }).setOrigin(0.5).setDepth(6);
        this.mapButton.on('pointerover', () => this.mapButton.setFillStyle(0x332044, 1));
        this.mapButton.on('pointerout', () => this.mapButton.setFillStyle(0x22162b, 0.98));
        this.mapButton.on('pointerdown', () => this.openCampaignMap());

        this.waveText = this.add.text(GAME_WIDTH - 100, 20, 'WAVE 1', { fontSize: '18px', fill: '#fff4d6', fontFamily: 'Arial Black' }).setOrigin(0.5, 0.5).setDepth(5);
        this.scoreText = this.add.text(GAME_WIDTH - 100, 45, 'SCORE: 0', { fontSize: '14px', fill: '#d5e4ff' }).setOrigin(0.5, 0.5).setDepth(5);
        this.levelText = this.add.text(GAME_WIDTH - 100, 70, 'LVL 1', { fontSize: '14px', fill: '#7ed2ff' }).setOrigin(0.5, 0.5).setDepth(5);
        this.factoryStatusText = this.add.text(GAME_WIDTH - 100, 95, '', { fontSize: '13px', fill: '#ffb066', align: 'center' }).setOrigin(0.5, 0.5);
        this.playerDownBanner = this.add.text(GAME_CENTER_X, GAME_HEIGHT - 40, 'PLAYER DOWN', {
            fontSize: '18px',
            fill: '#ffd27a',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(6).setVisible(false);

        this.updateBobaDisplay();
    }

    openCampaignMap() {
        if (GameState.paused || this.runEnded || this.switchingScene) return;
        this.setCombatMouseLocked(false);
        GameState.paused = true;
        this.scene.pause();
        this.scene.launch('CampaignMapScene', { fromRun: true });
    }

    configureWave() {
        const waveIndex = GameState.wave - 1;
        this.enemiesPerWave = 8 + (GameState.wave * 3);
        this.enemiesSpawnedThisWave = 0;
        this.enemiesKilledThisWave = 0;
        this.maxActiveEnemies = Math.min(40, 5 + Math.floor(GameState.wave * 1.7));
        const waveSpawnDelay = Math.max(130, 950 - (waveIndex * 70));
        this.spawnDelay = GameState.wave >= 10 ? Math.max(65, Math.floor(waveSpawnDelay / 2)) : waveSpawnDelay;
        if (this.enemySpawnTimer) {
            this.enemySpawnTimer.delay = this.spawnDelay;
            this.enemySpawnTimer.paused = false;
        }
    }

    update(time) {
        if (GameState.paused || this.runEnded) return;

        this.updatePlayerMovement();
        this.updatePlayerVisuals();
        this.updateEnemyHealthBars();
        this.updateFactoryVisual(time);
        this.validateProjectiles();

        if (!this.playerDown && this.bobaCount <= 0 && !this.isReloading) {
            this.reloadBoba();
        }

        if (!this.playerDown && GameState.aimMode === 'manual') {
            this.updateManualFire(time);
        } else if (!this.playerDown && time >= this.lastFireTime + this.playerFireRate) {
            const aimPoint = this.getCurrentAimPoint();
            if (aimPoint && this.shootBoba(aimPoint)) {
                this.lastFireTime = time;
            }
        }

        const projectiles = [...this.bobas.children.entries];
        const enemies = [...this.enemies.children.entries];
        projectiles.forEach(boba => {
            if (!boba.active) return;
            this.updateBobaGrowth(boba);
            enemies.forEach(enemy => {
                if (!enemy.active || !boba.active) return;
                const dist = Phaser.Math.Distance.Between(boba.x, boba.y, enemy.x, enemy.y);
                if (dist < 40) {
                    this.hitEnemy(boba, enemy);
                }
            });
        });

        this.updateEnemies(time);
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

    updatePlayerMovement() {
        if (this.playerDown) {
            this.player.body.setVelocity(0);
            return;
        }

        let vx = 0;
        let vy = 0;
        if (this.cursors.left.isDown) vx = -1;
        else if (this.cursors.right.isDown) vx = 1;
        if (this.cursors.up.isDown) vy = -1;
        else if (this.cursors.down.isDown) vy = 1;

        if (vx !== 0 || vy !== 0) {
            const len = Math.sqrt((vx * vx) + (vy * vy));
            const speed = this.getEffectivePlayerSpeed();
            this.player.body.setVelocity((vx / len) * speed, (vy / len) * speed);
        } else {
            this.player.body.setVelocity(0);
        }
    }

    getEffectivePlayerSpeed() {
        return this.xpSpeedBoostEnabled && this.time.now < this.xpSpeedBoostUntil
            ? this.playerSpeed * 2
            : this.playerSpeed;
    }

    applySpeedDamageBonus() {
        const speedBonus = Math.max(0, (this.playerSpeed / this.basePlayerSpeed) - 1);
        this.playerDamage *= 1 + (speedBonus * 0.1);
    }

    triggerXpPickupBoost() {
        if (!this.xpSpeedBoostEnabled) return;
        this.xpSpeedBoostUntil = this.time.now + 3000;
    }

    maybeLaunchLevelUpgrade() {
        if (GameState.pendingLevelUps <= 0 || GameState.upgradeSceneActive) return;
        if (buildWeightedUpgradeChoices().length === 0) {
            GameState.pendingLevelUps = 0;
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
        // The source art faces left at zero rotation. Mirror it on right-side aim
        // so the gun stays visually upright while projectiles keep the true angle.
        this.gunSprite.setFlipY(aimPoint.x > pivot.x);
        this.gunSprite.setRotation(aimAngle + Math.PI);
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
        if (time < this.lastFireTime + this.playerFireRate) return;

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

            const enemySpeed = Math.min(220, 95 + ((GameState.wave - 1) * 9));
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distanceToPlayer = Math.max(0.001, Math.sqrt((dx * dx) + (dy * dy)));
            const stopRange = this.getEnemyPlayerStopRange();

            if (distanceToPlayer > stopRange + 8) {
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
        if (this.bobaCount <= 0 || this.playerDown) return false;
        if (!this.isFinitePoint(target)) return false;

        const pivot = this.getGunPivot();
        const baseAngle = Phaser.Math.Angle.Between(pivot.x, pivot.y, target.x, target.y);
        if (!Number.isFinite(baseAngle)) return false;

        const muzzle = this.getMuzzleFromAim(baseAngle, pivot);
        if (!this.isFinitePoint(muzzle)) return false;

        this.currentAimAngle = baseAngle;
        this.currentGunMuzzle = muzzle;

        let fired = false;
        const projectileCount = this.weaponProfile?.id === 'lychee-shotgun'
            ? this.weaponProfile.projectileCount
            : this.multiShot;
        const spread = this.weaponProfile?.spread || 0.4;
        const projectileDamage = this.weaponProfile?.id === 'lychee-shotgun'
            ? this.weaponProfile.projectileDamage
            : this.playerDamage;

        // Fire shotgun/multishot pearls evenly from the same gun muzzle point.
        if (projectileCount === 1) {
            fired = !!this.createPlayerBoba(muzzle.x, muzzle.y, baseAngle, projectileDamage);
        } else {
            for (let i = 0; i < projectileCount; i++) {
                const spreadAngle = ((i / (projectileCount - 1)) - 0.5) * spread;
                fired = !!this.createPlayerBoba(muzzle.x, muzzle.y, baseAngle + spreadAngle, projectileDamage) || fired;
            }
        }

        if (!fired) return false;
        this.bobaCount--;
        this.updateBobaDisplay();
        return true;
    }

    createPlayerBoba(spawnX, spawnY, angle, damage = this.playerDamage, splitDepth = 0, source = 'gun') {
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
        boba.damage = damage;
        boba.pierceRemaining = this.projectilePierce;
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
        this.time.delayedCall(source === 'gun' ? 2400 : 1800, () => {
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
        const text = this.add.text(x + offsetX, y - 18 + offsetY, String(Math.round(amount)), {
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

    factoryAutoDefend() {
    }

    factoryAmmoSupport() {
        if (!this.factory) return;
        if (GameState.paused || this.waveTransitioning || this.playerDown) return;

        const distToFactory = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.factory.x, this.factory.y);
        if (distToFactory > this.factory.radius) return;
        if (this.bobaCount >= this.maxBobaCount) return;

        const ammoGain = Math.max(1, Math.round(this.permaFactoryAmmoPerSecond * 0.5));
        this.bobaCount = Math.min(this.maxBobaCount, this.bobaCount + ammoGain);
        this.updateBobaDisplay();

        if (this.isReloading) {
            this.isReloading = false;
            this.reloadText.setVisible(false);
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

    updateBobaDisplay() {
        if (this.playerDown) {
            this.bobaCountText.setText('DOWN');
            return;
        }

        this.bobaCountText.setText(`BOBA: ${this.bobaCount}/${this.maxBobaCount}`);
    }

    reloadBoba() {
        if (this.isReloading || this.playerDown) return;
        this.isReloading = true;
        this.reloadText.setVisible(true);

        this.time.delayedCall(this.reloadDuration, () => {
            if (this.playerDown) return;
            this.bobaCount = this.maxBobaCount;
            this.isReloading = false;
            this.reloadText.setVisible(false);
            this.updateBobaDisplay();
        });
    }

    pickupBoba(player, boba) {
    }

    tickFactoryProduction() {
        if (!this.factory) return;
        if (GameState.paused) return;

        const tps = calcMachineTPS();
        if (tps > 0) {
            const tapiocaGain = tps / 10;
            GameState.tapioca += tapiocaGain;
            GameState.totalTapioca += tapiocaGain;
            GameState.runTapiocaEarned += tapiocaGain;

            const pearlCount = Math.min(3, Math.max(1, Math.ceil(tps / 35)));
            for (let i = 0; i < pearlCount; i++) {
                if (Math.random() > 0.18) continue;
                const pearl = this.add.circle(
                    this.factory.x + Phaser.Math.Between(-34, 34),
                    this.factory.y + Phaser.Math.Between(-12, 18),
                    Phaser.Math.Between(4, 7),
                    0x5b2f10
                ).setDepth(2);
                this.tweens.add({
                    targets: pearl,
                    x: 110 + Phaser.Math.Between(-10, 10),
                    y: 158 + Phaser.Math.Between(-8, 8),
                    alpha: 0,
                    scale: 0.35,
                    duration: 700,
                    ease: 'Sine.easeIn',
                    onComplete: () => pearl.destroy()
                });
            }
        }

        this.updateUI();
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

        const enemy = this.enemies.create(x, y, 'enemy_run_1');
        enemy.setOrigin(0.5);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1);
        enemy.play('enemy_run');
        enemy.setScale(0.2);
        enemy.body.setSize(72, 72, true);

        enemy.maxHp = getEnemyMaxHpForWave(GameState.wave);
        enemy.hp = enemy.maxHp;
        enemy.nextAttackAt = 0;
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

        const damage = (boba.damage || this.playerDamage) * (1 + ((boba.pierceHits || 0) * this.pierceDamageScale));
        this.showDamageNumber(enemy.x, enemy.y, damage);

        if ((boba.pierceRemaining || 0) > 0) {
            boba.pierceRemaining--;
            boba.pierceHits = (boba.pierceHits || 0) + 1;
        } else {
            boba.destroy();
        }
        enemy.hp -= damage;

        if (enemy.hp <= 0) {
            const killX = enemy.x;
            const killY = enemy.y;
            enemy.destroy();

            this.registerEnemyKill();

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
                            otherEnemy.destroy();
                            this.registerEnemyKill();
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
        GameState.addXP(getXpPerKill(this));
        this.triggerXpPickupBoost();
        GameState.enemiesKilledThisRun++;
        GameState.totalEnemiesKilled++;
        GameState.runSouls++;
        this.enemiesKilledThisWave++;
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
        enemy.play('enemy_attack');
        enemy.body.setVelocity(0, 0);
        enemy.setFlipX(enemy.x < targetX);
        this.time.delayedCall(200, () => {
            if (enemy.active) {
                enemy.play('enemy_run');
            }
        });
    }

    hitPlayer(player, enemy, time) {
        if (this.runEnded || this.deathTransitionPending || this.playerDown || time < this.playerInvincibleUntil) return;
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

        const rawDamage = 10 + GameState.wave * 2;
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

        const reducedDamage = rawDamage * (1 - Math.min(0.85, this.damageReductionPercent || 0));
        const damage = Math.max(1, reducedDamage - (this.damageReduction || 0));
        GameState.health = Math.max(0, GameState.health - damage);
        this.playerInvincibleUntil = time + 500;

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
        SaveManager.save();

        this.scene.stop('PauseScene');
        this.scene.stop('UpgradeScene');
        this.scene.stop('FactoryScene');
        this.scene.stop('CampaignMapScene');
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
        this.healthBarFill.displayWidth = 200 * healthPct;
        this.healthText.setText(`${Math.ceil(GameState.health)} / ${GameState.maxHealth}`);

        const xpPct = GameState.xp / GameState.xpToLevel;
        this.xpBarFill.displayWidth = 200 * xpPct;
        this.xpText.setText(`XP: ${GameState.xp}/${GameState.xpToLevel}`);

        this.playerStateText.setText(GameState.aimMode === 'manual' ? 'MANUAL HOLD' : 'AUTO AIM');
        this.rageText.setText(`RAGE: ${Math.floor(GameState.rage)} (+${getRagePerKill(this)}/kill)`);
        this.tcText.setText(`TC: ${Math.floor(GameState.tc)} (+${getTcPerKill()}/kill)`);
        this.outputText.setText(`THIS RUN: +${Math.floor(GameState.runTcEarned)} TC`);

        const soulProgress = getCampaignSoulProgress();
        this.soulBarFill.width = 146 * soulProgress.pct;
        this.soulText.setText(
            soulProgress.souls >= soulProgress.target
                ? `${getCampaignLocation().shortName} BOSS`
                : `${getCampaignLocation().shortName} ${soulProgress.souls}/${soulProgress.target}`
        );

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
        createPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 840, 560, 0x111827, 0x536784, 0.98);

        this.add.text(GAME_CENTER_X, 104, 'CHOOSE AN UPGRADE', {
            fontSize: '42px', fill: '#ffd700', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 148, `LEVEL ${GameState.level}`, {
            fontSize: '22px', fill: '#d5e4ff', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 178, 'Pick the next tier for your build', {
            fontSize: '18px', fill: '#7ee0ff'
        }).setOrigin(0.5);

        this.chosenUpgrades = buildWeightedUpgradeChoices();
        if (this.chosenUpgrades.length === 0) {
            GameState.pendingLevelUps = 0;
            resumeGameSceneFromOverlay(this);
            this.scene.stop();
            return;
        }

        this.cards = [];
        this.chosenUpgrades.forEach((upgrade, i) => {
            const x = GAME_CENTER_X - 220 + i * 220;
            const card = this.createUpgradeCard(x, 390, upgrade, i);
            this.cards.push(card);
        });

        this.input.keyboard.once('keydown-ONE', () => this.select(0));
        this.input.keyboard.once('keydown-TWO', () => this.select(1));
        this.input.keyboard.once('keydown-THREE', () => this.select(2));
    }

    legacyCreateUpgradeCard(x, y, upgrade, index) {
        const card = this.add.image(x, y, 'upgrade_card').setInteractive({ useHandCursor: true });

        const imageKey = `upgrade-${upgrade.branch}`;
        if (this.textures.exists(imageKey)) {
            const art = this.add.image(x, y - 42, imageKey).setOrigin(0.5);
            art.setDisplaySize(58, 58);
        } else {
            const iconSize = upgrade.icon.length > 4 ? '22px' : upgrade.icon.length > 2 ? '28px' : '40px';
            this.add.text(x, y - 50, upgrade.icon, { fontSize: iconSize }).setOrigin(0.5);
        }
        const name = this.add.text(x, y + 10, upgrade.name, { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);
        const desc = this.add.text(x, y + 50, upgrade.desc, { fontSize: '12px', fill: '#aaa' }).setOrigin(0.5, 0.5).setWordWrapWidth(130);
        const primaryTag = upgrade.branch || 'upgrade';
        const readableTag = primaryTag.replace(/^./, ch => ch.toUpperCase());
        const tagText = upgrade.requires
            ? `SYNERGY • ${readableTag}`
            : `PATH • ${readableTag}`;
        const tag = this.add.text(x, y - 82, `${readableTag} - Tier ${upgrade.tier}`.toUpperCase(), {
            fontSize: '10px',
            fill: upgrade.tier >= 5 ? '#ffd700' : '#7ee0ff'
        }).setOrigin(0.5);
        const key = this.add.text(x, y + 85, `[${index + 1}]`, { fontSize: '14px', fill: '#666' }).setOrigin(0.5);

        card.on('pointerover', () => {
            card.setTexture('upgrade_card_sel');
        });
        card.on('pointerout', () => {
            card.setTexture('upgrade_card');
        });
        card.on('pointerdown', () => {
            this.select(this.cards.indexOf(card));
        });

        return card;
    }

    createUpgradeCard(x, y, upgrade, index) {
        const branchColors = {
            shot: 0x7ed2ff,
            speed: 0x7dffa0,
            damage: 0xff9f80,
            health: 0xff7d9d,
            pierce: 0xe6d47a,
            bounce: 0xb08cff
        };
        const accent = branchColors[upgrade.branch] || 0x7ed2ff;
        const card = this.add.rectangle(x, y, 190, 255, 0x1a2132, 0.98)
            .setStrokeStyle(2, accent)
            .setInteractive({ useHandCursor: true });

        const readableTag = (upgrade.branch || 'upgrade').replace(/^./, ch => ch.toUpperCase());
        this.add.text(x, y - 106, `${readableTag} - Tier ${upgrade.tier}`.toUpperCase(), {
            fontSize: '12px',
            fill: upgrade.tier >= 5 ? '#ffd700' : '#7ee0ff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.rectangle(x, y - 64, 78, 52, accent, 0.15).setStrokeStyle(2, accent);
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
            fill: '#7f8da7',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        card.on('pointerover', () => {
            card.setFillStyle(0x232c42, 0.98);
            card.setStrokeStyle(3, 0xffd700);
        });
        card.on('pointerout', () => {
            card.setFillStyle(0x1a2132, 0.98);
            card.setStrokeStyle(2, accent);
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

        const sceneManager = this.game?.scene || this.scene?.manager;
        globalThis.setTimeout(() => {
            ['GameOverScene', 'GameScene', 'PauseScene', 'UpgradeScene', 'FactoryScene', 'CampaignMapScene'].forEach(sceneKey => {
                sceneManager?.stop(sceneKey);
            });
            sceneManager?.start(targetKey);
        }, 0);
    }

    startFreshRun() {
        this.exitGameOverTo('GameScene');
    }

    returnToMenu() {
        this.exitGameOverTo('MenuScene');
    }

    create() {
        resetRunUiState(this);

        drawSceneBackdrop(this, 0x6b4b86);
        createPanel(this, GAME_CENTER_X, GAME_CENTER_Y, 620, 530, 0x131a2a, 0x665a88, 0.96);

        this.add.text(GAME_CENTER_X, 200, 'GAME OVER', {
            fontSize: '56px', fill: '#ff8c6b', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 290, `Wave Reached: ${GameState.wave}`, {
            fontSize: '24px', fill: '#fff'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 330, `Final Score: ${GameState.score}`, {
            fontSize: '24px', fill: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 370, `Level: ${GameState.level}`, {
            fontSize: '20px', fill: '#3498db'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 410, `TC EARNED THIS RUN: ${Math.floor(GameState.runTcEarned)}`, {
            fontSize: '22px', fill: '#66ccff', fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 440, `RAGE COLLECTED THIS RUN: ${Math.floor(GameState.runRageEarned)}`, {
            fontSize: '16px', fill: '#888'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 462, `SOULS COLLECTED: ${GameState.runSouls} / ${getCampaignSoulTarget()} FOR ${getCampaignLocation().name.toUpperCase()}`, {
            fontSize: '14px', fill: '#d9a6ff'
        }).setOrigin(0.5);

        this.add.text(GAME_CENTER_X, 486, `Lifetime Kills: ${GameState.totalEnemiesKilled}   |   Perma Pts: ${getAvailablePermaPoints()} / ${getTotalPermaPointsEarned()}`, {
            fontSize: '16px', fill: '#b8d8ff'
        }).setOrigin(0.5);

        const restartBtn = this.add.image(GAME_CENTER_X, 530, 'btn').setInteractive({ useHandCursor: true });
        const restartLabel = this.add.text(GAME_CENTER_X, 530, 'PLAY AGAIN', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        restartBtn.on('pointerover', () => restartBtn.setTexture('btn_hover'));
        restartBtn.on('pointerout', () => restartBtn.setTexture('btn'));
        restartBtn.on('pointerdown', () => {
            this.startFreshRun();
        });
        restartLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.startFreshRun();
        });

        const menuBtn = this.add.image(GAME_CENTER_X, 595, 'btn').setInteractive({ useHandCursor: true });
        const menuLabel = this.add.text(GAME_CENTER_X, 595, 'MAIN MENU', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        menuBtn.on('pointerover', () => menuBtn.setTexture('btn_hover'));
        menuBtn.on('pointerout', () => menuBtn.setTexture('btn'));
        menuBtn.on('pointerdown', () => {
            this.returnToMenu();
        });
        menuLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            this.returnToMenu();
        });
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
    scene: [BootScene, MenuScene, CampaignMapScene, IdleFactoryScene, PermaUpgradeScene, ControlsScene, GameScene, PauseScene, UpgradeScene, GameOverScene, FactoryScene],
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

