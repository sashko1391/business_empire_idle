export interface BusinessTier {
	minOwned: number;  // owned count to reach this tier
	name: string;      // tier name
	bonus: number;     // income multiplier at this tier (stacks on base)
	label: string;     // short tier label e.g. "Lvl 2"
}

export interface Business {
	id: string;
	name: string;
	icon: string;
	owned: number;
	baseCost: number;
	baseIncome: number;
	costMultiplier: number;
	incomeMultiplier: number;
	synergyMultiplier: number;
	unlockCost: number;
	unlockPrestige: number;
	sceneUrl: string;
	tiers: BusinessTier[];
}

export interface Upgrade {
	id: string;
	name: string;
	icon: string;
	effect: string;
	type: string;
	cost: number;
	unlockCost: number;
	unlockPrestige: number;
	purchased: boolean;
}

export interface PrestigeShopItem {
	id: string;
	name: string;
	icon: string;
	effect: string;
	cost: number;
	requires: string | null;
}

export interface Achievement {
	id: string;
	name: string;
	icon: string;
	desc: string;
}

export interface Synergy {
	ids: [string, string];
	name: string;
	bonus: number;
	desc: string;
}

export interface DailyEvent {
	name: string;
	icon: string;
	desc: string;
	multiplier: number;
	affects: string;
}

export interface ContractTemplate {
	type: string;
	name: string;
	icon: string;
	reward: number;
}

export interface InvestOffer {
	name: string;
	icon: string;
	risk: string;
	winChance: number;
	winMultiplier: number;
	lossMultiplier: number;
	desc: string;
}

export interface PrestigePerks {
	globalMultiplier: number;
	startMoney: number;
	clickPowerBonus: number;
	offlineBonus: number;
	costReduction: number;
	upgradeCostReduction: number;
	managerOperations: boolean;
	managerBrand: boolean;
	managerCFO: boolean;
	managerCTO: boolean;
}

export interface DailyState {
	day: number;
	startEarned: number;
	startClicks: number;
	startBizOwned: number;
	startUpgrades: number;
	contracts: boolean[];
	eventApplied: boolean;
}

export interface GameState {
	money: number;
	totalEarned: number;
	clickPower: number;
	clickMultiplier: number;
	globalMultiplier: number;
	bonusIncome: number;
	offlineMultiplier: number;
	autoClickInterval: number;
	prestigeLevel: number;
	prestigeMultiplier: number;
	prestigePoints: number;
	prestigeShopPurchased: Record<string, boolean>;
	prestigePerks: PrestigePerks;
	totalClicks: number;
	achievements: Record<string, number>;
	daily: DailyState | null;
	lastSaved: number;
	businesses: Business[];
	upgrades: Upgrade[];
}

export interface FloatingNumber {
	id: number;
	value: string;
	x: number;
	y: number;
}

export interface AchievementToast {
	icon: string;
	name: string;
	desc: string;
}
