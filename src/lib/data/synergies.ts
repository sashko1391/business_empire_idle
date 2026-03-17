import type { Synergy } from '$lib/types';

export const SYNERGIES: Synergy[] = [
	{ ids: ['lemonade', 'coffee'], name: 'Caffeine Hustle', bonus: 0.20, desc: '+20% Lemonade & Coffee' },
	{ ids: ['restaurant', 'delivery'], name: 'Full Service', bonus: 0.25, desc: '+25% Restaurant & Delivery' },
	{ ids: ['fitness', 'carwash'], name: 'Clean & Fit', bonus: 0.15, desc: '+15% Fitness & Car Wash' },
	{ ids: ['itcompany', 'media'], name: 'Digital Empire', bonus: 0.30, desc: '+30% IT & Media' },
	{ ids: ['bank', 'fund'], name: 'Finance Titan', bonus: 0.35, desc: '+35% Bank & Fund' },
	{ ids: ['realestate', 'bank'], name: 'Property Mogul', bonus: 0.25, desc: '+25% Real Estate & Bank' },
	{ ids: ['spacemining', 'interplanetary'], name: 'Galactic Corp', bonus: 0.40, desc: '+40% Space Mining & Trade' },
	{ ids: ['itcompany', 'fund'], name: 'Tech Finance', bonus: 0.20, desc: '+20% IT & Fund' }
];
