const GameState = {
    // Core stats
    tapioca: 0,
    totalTapioca: 0,
    rage: 0,
    totalRage: 0,
    tc: 0,
    
    // Factory progress
    idleMachines: {},
    idleFactoryTech: {},
    evolutionBoost: 0,
    factoryUpgrades: {},
    runBoosts: {},
    totalEnemiesKilled: 0,
    
    // Roguelike run
    wave: 1,
    score: 0,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    pendingLevelUps: 0,
    pendingSpecialUpgrades: 0,
    selectedUpgrades: [],
    enemiesKilledThisRun: 0,
    health: 100,
    maxHealth: 100,
    runTapiocaEarned: 0,
    runRageEarned: 0,
    runTcEarned: 0,
    paused: false,
    upgradeSceneActive: false,
    selectedCharacter: 0,
    selectedDrink: 'classic',
    selectedGun: 'classic',
    unlockedDrinks: { classic: true },
    unlockedGuns: { classic: true },
    volume: 0.8,
    aimMode: 'auto',

    addXP(amount) {
        let levelsGained = 0;
        this.xp += amount;
        while (this.xp >= this.xpToLevel) {
            this.xp -= this.xpToLevel;
            this.level++;
            levelsGained++;
            this.pendingLevelUps++;
            if (globalThis.BOBA_SPECIAL_DRAFT_ENABLED && this.level % 5 === 0) {
                this.pendingSpecialUpgrades++;
            }
            this.xpToLevel = Math.floor(this.xpToLevel * 1.35);
        }
        return levelsGained;
    },
    
    reset() {
        this.wave = 1;
        this.score = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToLevel = 100;
        this.pendingLevelUps = 0;
        this.pendingSpecialUpgrades = 0;
        this.selectedUpgrades = [];
        this.enemiesKilledThisRun = 0;
        this.maxHealth = 100;
        this.health = 100;
        this.runTapiocaEarned = 0;
        this.runRageEarned = 0;
        this.tc = 0;
        this.runTcEarned = 0;
        this.paused = false;
        this.upgradeSceneActive = false;
    }
};

