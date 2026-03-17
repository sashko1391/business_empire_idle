import type { PrestigeShopItem } from '$lib/types';
import type { PrestigePerks } from '$lib/types';

export const PRESTIGE_SHOP: PrestigeShopItem[] = [
	{ id: 'income_1', name: 'Income Boost I', icon: '📈', effect: '+25% all income permanently', cost: 1, requires: null },
	{ id: 'income_2', name: 'Income Boost II', icon: '📈', effect: '+50% all income permanently', cost: 3, requires: 'income_1' },
	{ id: 'income_3', name: 'Income Boost III', icon: '📈', effect: '+100% all income permanently', cost: 7, requires: 'income_2' },
	{ id: 'head_start_1', name: 'Head Start I', icon: '💰', effect: 'Start each run with $1,000', cost: 1, requires: null },
	{ id: 'head_start_2', name: 'Head Start II', icon: '💰', effect: 'Start each run with $25,000', cost: 3, requires: 'head_start_1' },
	{ id: 'click_power_1', name: 'Click Power I', icon: '👆', effect: '+2 base click power permanently', cost: 1, requires: null },
	{ id: 'click_power_2', name: 'Click Power II', icon: '👆', effect: '+5 base click power permanently', cost: 2, requires: 'click_power_1' },
	{ id: 'offline_bonus', name: 'Night Owl', icon: '🌙', effect: '+50% offline earnings permanently', cost: 2, requires: null },
	{ id: 'cost_reduction', name: 'Bulk Buyer', icon: '🏷️', effect: '-10% business costs permanently', cost: 2, requires: null },
	{ id: 'upgrade_discount', name: 'Upgrade Expert', icon: '🔬', effect: '-20% upgrade costs permanently', cost: 2, requires: null },
	{ id: 'manager_operations', name: 'Operations Manager', icon: '👔', effect: 'Auto-buy cheapest business every 30s', cost: 3, requires: null },
	{ id: 'manager_brand', name: 'Brand Manager', icon: '🎯', effect: '+5% income per prestige level', cost: 4, requires: null },
	{ id: 'manager_cfo', name: 'CFO', icon: '💼', effect: '+10% RP earned on prestige', cost: 5, requires: null },
	{ id: 'manager_cto', name: 'CTO', icon: '⚙️', effect: 'Unlock auto-upgrade every 60s', cost: 5, requires: null }
];

export const PRESTIGE_SHOP_EFFECTS: Record<string, (perks: PrestigePerks) => void> = {
	income_1: (p) => { p.globalMultiplier *= 1.25; },
	income_2: (p) => { p.globalMultiplier *= 1.5; },
	income_3: (p) => { p.globalMultiplier *= 2; },
	head_start_1: (p) => { p.startMoney = Math.max(p.startMoney, 1000); },
	head_start_2: (p) => { p.startMoney = Math.max(p.startMoney, 25000); },
	click_power_1: (p) => { p.clickPowerBonus += 2; },
	click_power_2: (p) => { p.clickPowerBonus += 5; },
	offline_bonus: (p) => { p.offlineBonus = 1.5; },
	cost_reduction: (p) => { p.costReduction = 0.9; },
	upgrade_discount: (p) => { p.upgradeCostReduction = 0.8; },
	manager_operations: (p) => { p.managerOperations = true; },
	manager_brand: (p) => { p.managerBrand = true; },
	manager_cfo: (p) => { p.managerCFO = true; },
	manager_cto: (p) => { p.managerCTO = true; }
};
