import type { DailyEvent, ContractTemplate, InvestOffer } from '$lib/types';

export const DAILY_EVENTS: DailyEvent[] = [
	{ name: 'Market Boom', icon: '📈', desc: 'All income +50% today!', multiplier: 1.5, affects: 'all' },
	{ name: 'Rush Hour', icon: '⏰', desc: 'Food businesses +100% today!', multiplier: 2.0, affects: 'food' },
	{ name: 'Tech Surge', icon: '💻', desc: 'IT & Media +75% today!', multiplier: 1.75, affects: 'tech' },
	{ name: 'Finance Day', icon: '💹', desc: 'Bank & Fund +80% today!', multiplier: 1.8, affects: 'finance' },
	{ name: 'Click Frenzy', icon: '👆', desc: 'Click power x3 today!', multiplier: 3.0, affects: 'click' },
	{ name: 'Cost Freeze', icon: '🧊', desc: 'All business costs -25% today!', multiplier: 0.75, affects: 'cost' },
	{ name: 'Viral Moment', icon: '🔥', desc: 'All income +25% today!', multiplier: 1.25, affects: 'all' },
	{ name: 'Space Race', icon: '🚀', desc: 'Space businesses +150% today!', multiplier: 2.5, affects: 'space' },
	{ name: 'Gym Trend', icon: '💪', desc: 'Fitness +100% today!', multiplier: 2.0, affects: 'fitness' },
	{ name: 'Property Boom', icon: '🏙️', desc: 'Real Estate +90% today!', multiplier: 1.9, affects: 'realestate' },
	{ name: 'Normal Day', icon: '☀️', desc: 'A regular business day.', multiplier: 1.0, affects: 'none' },
	{ name: 'Lucky Stars', icon: '⭐', desc: 'All income +35% today!', multiplier: 1.35, affects: 'all' }
];

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
	{ type: 'earn', name: 'Revenue Target', icon: '💵', reward: 50 },
	{ type: 'click', name: 'Click Challenge', icon: '👆', reward: 30 },
	{ type: 'buy_biz', name: 'Expansion Drive', icon: '🏪', reward: 40 },
	{ type: 'buy_upgrade', name: 'Innovation Push', icon: '🔬', reward: 35 }
];

export const INVEST_OFFERS: InvestOffer[] = [
	{ name: 'Safe Bond', icon: '🏛️', risk: 'Low Risk', winChance: 0.85, winMultiplier: 1.3, lossMultiplier: 0.95, desc: 'Invest current balance for a safe 30% return.' },
	{ name: 'Stock Market', icon: '📊', risk: 'Medium Risk', winChance: 0.65, winMultiplier: 2.0, lossMultiplier: 0.7, desc: 'High volatility — double or lose 30%.' },
	{ name: 'Crypto Bet', icon: '₿', risk: 'High Risk', winChance: 0.45, winMultiplier: 3.5, lossMultiplier: 0.5, desc: 'Moon or bust. 3.5x or lose half.' },
	{ name: 'Real Estate Deal', icon: '🏠', risk: 'Low Risk', winChance: 0.80, winMultiplier: 1.5, lossMultiplier: 0.9, desc: 'Solid property investment. 50% upside.' },
	{ name: 'Startup Venture', icon: '🚀', risk: 'High Risk', winChance: 0.40, winMultiplier: 5.0, lossMultiplier: 0.4, desc: 'Unicorn or bankrupt. 5x potential.' },
	{ name: 'Gold Reserve', icon: '🥇', risk: 'Low Risk', winChance: 0.90, winMultiplier: 1.2, lossMultiplier: 0.98, desc: 'Safest bet. Modest 20% gain.' }
];
