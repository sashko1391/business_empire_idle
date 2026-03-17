import type { Upgrade } from '$lib/types';
import type { GameState } from '$lib/types';

export const DEFAULT_UPGRADES: Upgrade[] = [
	{ id: 'better_tools', name: 'Better Tools', icon: '🔧', effect: '+1$/sec passive income', type: 'income', cost: 25, unlockCost: 0, unlockPrestige: 0, purchased: false },
	{ id: 'second_worker', name: 'Second Worker', icon: '👷', effect: '+2$/sec passive income', type: 'income', cost: 75, unlockCost: 50, unlockPrestige: 0, purchased: false },
	{ id: 'basic_advertising', name: 'Basic Advertising', icon: '📢', effect: '+10% global income', type: 'multiplier', cost: 200, unlockCost: 150, unlockPrestige: 0, purchased: false },
	{ id: 'coffee_machine', name: 'Coffee Machine', icon: '☕', effect: 'Coffee Shop x2 income', type: 'multiplier', cost: 500, unlockCost: 300, unlockPrestige: 0, purchased: false },
	{ id: 'ergonomic_chair', name: 'Ergonomic Chair', icon: '🪑', effect: '+1 click power', type: 'click', cost: 150, unlockCost: 100, unlockPrestige: 0, purchased: false },
	{ id: 'delivery_van', name: 'Delivery Van', icon: '🚐', effect: '+5$/sec passive income', type: 'income', cost: 1000, unlockCost: 600, unlockPrestige: 0, purchased: false },
	{ id: 'franchise_deal', name: 'Franchise Deal', icon: '🤝', effect: 'Early businesses +15% income', type: 'multiplier', cost: 3000, unlockCost: 2000, unlockPrestige: 0, purchased: false },
	{ id: 'auto_cashier', name: 'Auto Cashier', icon: '🤖', effect: 'Auto-click every 2 seconds', type: 'utility', cost: 5000, unlockCost: 3000, unlockPrestige: 0, purchased: false },
	{ id: 'viral_marketing', name: 'Viral Marketing', icon: '📣', effect: '+20% click income', type: 'click', cost: 2500, unlockCost: 1500, unlockPrestige: 0, purchased: false },
	{ id: 'night_shift', name: 'Night Shift', icon: '🌙', effect: '+10% offline income', type: 'utility', cost: 4000, unlockCost: 2500, unlockPrestige: 0, purchased: false }
];

// Apply functions separated from data (not serializable)
export const UPGRADE_EFFECTS: Record<string, (state: GameState) => void> = {
	better_tools: (s) => { s.bonusIncome = (s.bonusIncome || 0) + 1; },
	second_worker: (s) => { s.bonusIncome = (s.bonusIncome || 0) + 2; },
	basic_advertising: (s) => { s.globalMultiplier *= 1.1; },
	coffee_machine: (s) => {
		const coffee = s.businesses.find(b => b.id === 'coffee');
		if (coffee) coffee.incomeMultiplier *= 2;
	},
	ergonomic_chair: (s) => { s.clickPower += 1; },
	delivery_van: (s) => { s.bonusIncome = (s.bonusIncome || 0) + 5; },
	franchise_deal: (s) => {
		['lemonade', 'coffee', 'restaurant'].forEach(id => {
			const b = s.businesses.find(b => b.id === id);
			if (b) b.incomeMultiplier *= 1.15;
		});
	},
	auto_cashier: (s) => { s.autoClickInterval = 2000; },
	viral_marketing: (s) => { s.clickMultiplier = (s.clickMultiplier || 1) * 1.2; },
	night_shift: (s) => { s.offlineMultiplier = (s.offlineMultiplier || 1) * 1.1; }
};
