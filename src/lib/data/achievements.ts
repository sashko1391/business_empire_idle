import type { Achievement } from '$lib/types';
import type { GameState } from '$lib/types';

export const ACHIEVEMENTS: (Achievement & { check: (s: GameState) => boolean })[] = [
	{ id: 'first_click', name: 'First Steps', icon: '👆', desc: 'Click WORK for the first time', check: (s) => s.totalClicks >= 1 },
	{ id: 'clicks_100', name: 'Hard Worker', icon: '💪', desc: 'Click WORK 100 times', check: (s) => s.totalClicks >= 100 },
	{ id: 'clicks_1000', name: 'Workaholic', icon: '🏋️', desc: 'Click WORK 1,000 times', check: (s) => s.totalClicks >= 1000 },
	{ id: 'first_business', name: 'Entrepreneur', icon: '🏪', desc: 'Buy your first business', check: (s) => s.businesses.some(b => b.owned >= 1) },
	{ id: 'three_businesses', name: 'Business Owner', icon: '🏬', desc: 'Own 3 different businesses', check: (s) => s.businesses.filter(b => b.owned >= 1).length >= 3 },
	{ id: 'all_businesses', name: 'Tycoon', icon: '🏙️', desc: 'Own all 13 businesses', check: (s) => s.businesses.filter(b => b.owned >= 1).length >= 13 },
	{ id: 'earn_1k', name: 'First Thousand', icon: '💵', desc: 'Earn $1,000 total', check: (s) => s.totalEarned >= 1000 },
	{ id: 'earn_1m', name: 'Millionaire', icon: '💰', desc: 'Earn $1,000,000 total', check: (s) => s.totalEarned >= 1000000 },
	{ id: 'earn_1b', name: 'Billionaire', icon: '💎', desc: 'Earn $1,000,000,000 total', check: (s) => s.totalEarned >= 1000000000 },
	{ id: 'first_upgrade', name: 'Improver', icon: '🔧', desc: 'Buy your first upgrade', check: (s) => s.upgrades.some(u => u.purchased) },
	{ id: 'all_upgrades', name: 'Maximized', icon: '⚡', desc: 'Buy all upgrades', check: (s) => s.upgrades.every(u => u.purchased) },
	{ id: 'first_prestige', name: 'Prestige!', icon: '⭐', desc: 'Prestige for the first time', check: (s) => s.prestigeLevel >= 1 },
	{ id: 'prestige_5', name: 'Legacy Builder', icon: '🌟', desc: 'Prestige 5 times', check: (s) => s.prestigeLevel >= 5 },
	{ id: 'own_10_lemonade', name: 'Lemon Empire', icon: '🍋', desc: 'Own 10 Lemonade Stands', check: (s) => (s.businesses.find(b => b.id === 'lemonade')?.owned ?? 0) >= 10 },
	{ id: 'own_10_coffee', name: 'Coffee Baron', icon: '☕', desc: 'Own 10 Coffee Shops', check: (s) => (s.businesses.find(b => b.id === 'coffee')?.owned ?? 0) >= 10 },
	{ id: 'reach_bank', name: 'Banker', icon: '🏦', desc: 'Unlock the Private Bank', check: (s) => (s.businesses.find(b => b.id === 'bank')?.owned ?? 0) >= 1 },
	{ id: 'reach_space', name: 'Space Pioneer', icon: '🚀', desc: 'Unlock Space Mining Corp', check: (s) => (s.businesses.find(b => b.id === 'spacemining')?.owned ?? 0) >= 1 },
	{ id: 'rp_10', name: 'Prestige Collector', icon: '💠', desc: 'Accumulate 10 Reputation Points', check: (s) => (s.prestigePoints || 0) >= 10 },
	{ id: 'daily_complete', name: 'Daily Grind', icon: '📅', desc: 'Complete all daily contracts', check: (s) => s.daily?.contracts?.every(Boolean) ?? false },
	{ id: 'income_1k_sec', name: 'Income Machine', icon: '📈', desc: 'Reach $1,000/sec income', check: (s) => s.businesses.reduce((sum, b) => sum + b.baseIncome * b.incomeMultiplier * b.synergyMultiplier * b.owned, 0) >= 1000 },
	{ id: 'income_1m_sec', name: 'Mega Corporation', icon: '🏢', desc: 'Reach $1,000,000/sec income', check: (s) => s.businesses.reduce((sum, b) => sum + b.baseIncome * b.incomeMultiplier * b.synergyMultiplier * b.owned, 0) >= 1000000 },
	{ id: 'prestige_shop_5', name: 'Investor', icon: '🛍️', desc: 'Buy 5 prestige upgrades', check: (s) => Object.keys(s.prestigeShopPurchased || {}).length >= 5 },
	{ id: 'night_owl', name: 'Night Owl', icon: '🦉', desc: 'Collect offline earnings', check: (s) => s.offlineMultiplier > 1 }
];
