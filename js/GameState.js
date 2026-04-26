const GameState = {
    // Core stats
    tapioca: 0,
    totalTapioca: 0,
    rage: 0,
    totalRage: 0,
    tc: 0,
    
    // Factory progress
    machines: {},
    idleMachines: {},
    idleFactoryTech: {},
    evolutionBoost: 0,
    factoryUpgrades: {},
    totalEnemiesKilled: 0,
    
    // Roguelike run
    wave: 1,
    score: 0,
    level: 1,
    xp: 0,
    xpToLevel: 100,
    pendingLevelUps: 0,
    selectedUpgrades: [],
    enemiesKilledThisRun: 0,
    health: 100,
    maxHealth: 100,
    factoryHealth: 2000,
    factoryMaxHealth: 2000,
    runTapiocaEarned: 0,
    runRageEarned: 0,
    runTcEarned: 0,
    factoryRepairCount: 0,
    factoryFortifyLevel: 0,
    paused: false,
    upgradeSceneActive: false,
    selectedCharacter: 0,
    volume: 0.8,
    aimMode: 'auto',

    // Campaign progress
    campaignLocationIndex: 0,
    campaignUnlockedIndex: 0,
    campaignCleared: {},
    runSouls: 0,
    
    addXP(amount) {
        let levelsGained = 0;
        this.xp += amount;
        while (this.xp >= this.xpToLevel) {
            this.xp -= this.xpToLevel;
            this.level++;
            levelsGained++;
            this.pendingLevelUps++;
            this.xpToLevel = Math.floor(this.xpToLevel * 1.35);
        }
        return levelsGained;
    },
    
    reset() {
        this.machines = {};
        this.wave = 1;
        this.score = 0;
        this.level = 1;
        this.xp = 0;
        this.xpToLevel = 100;
        this.pendingLevelUps = 0;
        this.selectedUpgrades = [];
        this.enemiesKilledThisRun = 0;
        this.maxHealth = 100;
        this.health = 100;
        this.factoryMaxHealth = 2000;
        this.factoryHealth = 2000;
        this.runTapiocaEarned = 0;
        this.runRageEarned = 0;
        this.tc = 0;
        this.runTcEarned = 0;
        this.runSouls = 0;
        this.factoryRepairCount = 0;
        this.factoryFortifyLevel = 0;
        this.paused = false;
        this.upgradeSceneActive = false;
    }
};

