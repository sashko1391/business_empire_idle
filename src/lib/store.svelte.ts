import type { GameState, PrestigePerks, DailyState, AchievementToast } from '$lib/types';
import { DEFAULT_BUSINESSES } from '$lib/data/businesses';
import { DEFAULT_UPGRADES, UPGRADE_EFFECTS } from '$lib/data/upgrades';
import { PRESTIGE_SHOP, PRESTIGE_SHOP_EFFECTS } from '$lib/data/prestige';
import { ACHIEVEMENTS } from '$lib/data/achievements';
import { SYNERGIES } from '$lib/data/synergies';
import { DAILY_EVENTS, CONTRACT_TEMPLATES, INVEST_OFFERS } from '$lib/data/daily';
import { playClickSound, playPurchaseSound, playMilestoneSound, playPrestigeSound } from '$lib/audio';
import { formatNumber } from '$lib/format';

const GAME_VERSION = '3.0.0';
const STORAGE_KEY = 'businessEmpireIdle';
const MAX_OFFLINE_SECONDS = 8 * 60 * 60;
const PRESTIGE_THRESHOLD = 1_000_000;

function defaultPerks(): PrestigePerks {
	return { globalMultiplier: 1, startMoney: 0, clickPowerBonus: 0, offlineBonus: 1, costReduction: 1, upgradeCostReduction: 1, managerOperations: false, managerBrand: false, managerCFO: false, managerCTO: false };
}

function defaultState(): GameState {
	return {
		money: 0, totalEarned: 0, clickPower: 1, clickMultiplier: 1, globalMultiplier: 1,
		bonusIncome: 0, offlineMultiplier: 1, autoClickInterval: 0,
		prestigeLevel: 0, prestigeMultiplier: 1, prestigePoints: 0,
		prestigeShopPurchased: {}, prestigePerks: defaultPerks(),
		totalClicks: 0, achievements: {}, daily: null, lastSaved: Date.now(),
		businesses: JSON.parse(JSON.stringify(DEFAULT_BUSINESSES)),
		upgrades: JSON.parse(JSON.stringify(DEFAULT_UPGRADES))
	};
}

function getDayIndex() { return Math.floor(Date.now() / 86_400_000); }
function seededRandom(seed: number) { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); }

function createGame() {
	let state = $state<GameState>(defaultState());

	// ── Buy quantity (global toggle) ─────────────────────────────────────────
	let bulkBuyQty = $state<1 | 10 | 100 | 'max'>(1);

	// ── Prestige ceremony ─────────────────────────────────────────────────────
	let prestigeCeremonyVisible = $state(false);

	// ── Derived ──────────────────────────────────────────────────────────────
	const totalIncomePerSecond = $derived.by(() => {
		const perks = state.prestigePerks;
		const dailyMult = getDailyEventMultiplier();
		const brandBonus = perks.managerBrand ? 1 + state.prestigeLevel * 0.05 : 1;
		const base = state.businesses.reduce((sum, b) => {
			return sum + b.baseIncome * b.incomeMultiplier * b.synergyMultiplier * b.owned;
		}, 0);
		return (base + state.bonusIncome) * state.globalMultiplier * state.prestigeMultiplier * perks.globalMultiplier * dailyMult * brandBonus;
	});

	const rpWillEarn = $derived(Math.max(1, Math.floor(Math.sqrt(state.totalEarned / 1_000_000))));
	const canPrestige = $derived(state.totalEarned >= PRESTIGE_THRESHOLD);
	const bgStage = $derived(state.prestigeLevel >= 2 || state.totalEarned >= 10_000_000 ? 'endgame' : state.prestigeLevel >= 1 || state.totalEarned >= 100_000 ? 'mid' : 'early');

	// ── Milestone progress ────────────────────────────────────────────────────
	const milestoneNext = $derived(
		nextMilestoneIdx < MILESTONES.length ? MILESTONES[nextMilestoneIdx] : null
	);
	const milestonePrev = $derived(
		nextMilestoneIdx === 0 ? 0 : MILESTONES[nextMilestoneIdx - 1]
	);
	const milestoneProgress = $derived(
		milestoneNext === null ? 100
		: Math.min(100, (state.totalEarned - milestonePrev) / (milestoneNext - milestonePrev) * 100)
	);

	// Investment state
	let investActive = $state(false);
	let investOffer = $state<typeof INVEST_OFFERS[0] | null>(null);
	let investTimerPct = $state(100);

	// Toast queue
	let toastQueue = $state<AchievementToast[]>([]);
	let toastVisible = $state(false);
	let currentToast = $state<AchievementToast | null>(null);

	// Confetti / milestone trigger
	let confettiBurst = $state<{ x?: number; y?: number } | null>(null);

	// Milestone thresholds
	const MILESTONES = [1_000, 10_000, 100_000, 1_000_000, 1_000_000_000];
	let nextMilestoneIdx = $state(0);

	// Scene modal
	let sceneIndex = $state<number | null>(null);

	// Offline modal
	let offlineEarnings = $state(0);
	let offlineVisible = $state(false);

	// ── Helpers ───────────────────────────────────────────────────────────────
	function getBusinessCost(idx: number) {
		const b = state.businesses[idx];
		return Math.floor(b.baseCost * Math.pow(b.costMultiplier, b.owned) * state.prestigePerks.costReduction);
	}

	function getUpgradeCost(idx: number) {
		return Math.floor(state.upgrades[idx].cost * state.prestigePerks.upgradeCostReduction);
	}

	function getBulkBusinessCost(idx: number, qty: number): number {
		if (qty <= 0) return 0;
		const b = state.businesses[idx];
		const r = state.prestigePerks.costReduction;
		const m = b.costMultiplier;
		// Geometric series: baseCost * r * m^owned * (m^qty - 1) / (m - 1)
		return Math.floor(b.baseCost * r * Math.pow(m, b.owned) * (Math.pow(m, qty) - 1) / (m - 1));
	}

	function getMaxAffordableBusiness(idx: number): number {
		const b = state.businesses[idx];
		const r = state.prestigePerks.costReduction;
		const m = b.costMultiplier;
		// Solve: baseCost * r * m^owned * (m^qty - 1) / (m - 1) <= money
		const ratio = state.money * (m - 1) / (b.baseCost * r * Math.pow(m, b.owned));
		if (ratio <= 0) return 0;
		return Math.max(0, Math.floor(Math.log(ratio + 1) / Math.log(m)));
	}

	function getDailyEventMultiplier(): number {
		if (!state.daily?.eventApplied) return 1;
		const ev = getDailyEvent();
		if (!ev) return 1;
		if (ev.affects === 'all') return ev.multiplier;
		return 1;
	}

	function getDailyEvent() {
		if (!state.daily) return null;
		const idx = Math.floor(seededRandom(state.daily.day) * DAILY_EVENTS.length);
		return DAILY_EVENTS[idx];
	}

	function calculatePrestigePerks() {
		const perks = defaultPerks();
		Object.keys(state.prestigeShopPurchased).forEach(id => {
			const fn = PRESTIGE_SHOP_EFFECTS[id];
			if (fn) fn(perks);
		});
		state.prestigePerks = perks;
		state.prestigeMultiplier = 1 + state.prestigeLevel * 0.5;
	}

	function applySynergies() {
		state.businesses.forEach(b => { b.synergyMultiplier = 1; });
		SYNERGIES.forEach(syn => {
			const [aId, bId] = syn.ids;
			const a = state.businesses.find(b => b.id === aId);
			const b = state.businesses.find(b => b.id === bId);
			if (a && b && a.owned >= 1 && b.owned >= 1) {
				a.synergyMultiplier *= (1 + syn.bonus);
				b.synergyMultiplier *= (1 + syn.bonus);
			}
		});
	}

	function checkAchievements() {
		ACHIEVEMENTS.forEach(ach => {
			if (!state.achievements[ach.id] && ach.check(state)) {
				state.achievements[ach.id] = Date.now();
				enqueueToast({ icon: ach.icon, name: ach.name, desc: ach.desc });
				playMilestoneSound();
			}
		});
	}

	function enqueueToast(t: AchievementToast) {
		toastQueue = [...toastQueue, t];
		processToast();
	}

	function processToast() {
		if (toastVisible || toastQueue.length === 0) return;
		currentToast = toastQueue[0];
		toastQueue = toastQueue.slice(1);
		toastVisible = true;
		setTimeout(() => {
			toastVisible = false;
			setTimeout(processToast, 400);
		}, 3000);
	}

	function initDaily() {
		const today = getDayIndex();
		if (state.daily && state.daily.day === today) return;
		state.daily = {
			day: today,
			startEarned: state.totalEarned,
			startClicks: state.totalClicks,
			startBizOwned: state.businesses.reduce((s, b) => s + b.owned, 0),
			startUpgrades: state.upgrades.filter(u => u.purchased).length,
			contracts: [false, false, false],
			eventApplied: false
		};
		applyDailyEvent();
	}

	function applyDailyEvent() {
		if (!state.daily || state.daily.eventApplied) return;
		const ev = getDailyEvent();
		if (!ev) return;
		state.daily.eventApplied = true;
		if (ev.affects === 'click') state.clickMultiplier *= ev.multiplier;
		if (ev.affects === 'cost') { /* handled via getDailyEventMultiplier for cost */ }
		// business-specific handled in income calc
	}

	function checkContractProgress() {
		if (!state.daily) return;
		const d = state.daily;
		const earnedToday = state.totalEarned - d.startEarned;
		const clicksToday = state.totalClicks - d.startClicks;
		const bizBoughtToday = state.businesses.reduce((s, b) => s + b.owned, 0) - d.startBizOwned;
		const upgradesBoughtToday = state.upgrades.filter(u => u.purchased).length - d.startUpgrades;

		const targets = [
			{ type: 'earn', progress: earnedToday, target: 2000 },
			{ type: 'click', progress: clicksToday, target: 50 },
			{ type: 'buy_biz', progress: bizBoughtToday, target: 3 },
			{ type: 'buy_upgrade', progress: upgradesBoughtToday, target: 3 }
		];

		[0, 1, 2].forEach(i => {
			if (d.contracts[i]) return;
			const seed = d.day * 100 + i;
			const tIdx = Math.floor(seededRandom(seed) * CONTRACT_TEMPLATES.length);
			const tgt = targets.find(t => t.type === CONTRACT_TEMPLATES[tIdx].type);
			if (tgt && tgt.progress >= tgt.target) {
				state.daily!.contracts[i] = true;
				enqueueToast({ icon: CONTRACT_TEMPLATES[tIdx].icon, name: 'Contract Complete!', desc: CONTRACT_TEMPLATES[tIdx].name });
				playMilestoneSound();
			}
		});
	}

	function save() {
		if (typeof localStorage === 'undefined') return;
		state.lastSaved = Date.now();
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		localStorage.setItem('gameVersion', GAME_VERSION);
	}

	function load() {
		if (typeof localStorage === 'undefined') return;
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		try {
			const parsed = JSON.parse(raw) as Partial<GameState>;
			state = { ...defaultState(), ...parsed };
			// Sync sceneUrl and id from defaults
			state.businesses.forEach((biz, i) => {
				const def = DEFAULT_BUSINESSES[i];
				if (def) { if (!biz.sceneUrl) biz.sceneUrl = def.sceneUrl; if (!biz.id) biz.id = def.id; }
			});
			if (!state.prestigePerks) state.prestigePerks = defaultPerks();
			if (!state.prestigeShopPurchased) state.prestigeShopPurchased = {};
			if (!state.achievements) state.achievements = {};
			calculatePrestigePerks();
			// Re-apply purchased upgrades
			state.upgrades.forEach((u, i) => {
				if (u.purchased) { const fn = UPGRADE_EFFECTS[u.id]; if (fn) fn(state); }
			});
			// Offline progress
			const offlineSec = Math.min((Date.now() - (state.lastSaved || Date.now())) / 1000, MAX_OFFLINE_SECONDS);
			if (offlineSec > 30) {
				const income = state.businesses.reduce((s, b) => s + b.baseIncome * b.incomeMultiplier * b.synergyMultiplier * b.owned, 0);
				const earned = income * offlineSec * (state.prestigePerks.offlineBonus || 1);
				if (earned > 0) { state.money += earned; state.totalEarned += earned; offlineEarnings = earned; offlineVisible = true; }
			}
		} catch { /* corrupt save — use defaults */ }
	}

	// ── Actions ───────────────────────────────────────────────────────────────
	function doWork(x: number, y: number): { value: string; x: number; y: number } {
		const earned = state.clickPower * state.prestigeMultiplier * state.clickMultiplier * state.prestigePerks.globalMultiplier;
		state.money += earned;
		state.totalEarned += earned;
		state.totalClicks++;
		playClickSound();
		return { value: formatNumber(earned), x, y };
	}

	function buyBusiness(idx: number) {
		const cost = getBusinessCost(idx);
		if (state.money < cost) return false;
		state.money -= cost;
		state.businesses[idx].owned++;
		applySynergies();
		checkAchievements();
		playPurchaseSound();
		return true;
	}

	function buyBusinessBulk(idx: number, qty: number) {
		if (qty <= 0) return false;
		const cost = getBulkBusinessCost(idx, qty);
		if (state.money < cost) return false;
		state.money -= cost;
		state.businesses[idx].owned += qty;
		applySynergies();
		checkAchievements();
		playPurchaseSound();
		return true;
	}

	function buyUpgrade(idx: number) {
		const cost = getUpgradeCost(idx);
		if (state.money < cost || state.upgrades[idx].purchased) return false;
		state.money -= cost;
		state.upgrades[idx].purchased = true;
		const fn = UPGRADE_EFFECTS[state.upgrades[idx].id];
		if (fn) fn(state);
		checkAchievements();
		playPurchaseSound();
		return true;
	}

	function requestPrestige() {
		if (!canPrestige) return;
		prestigeCeremonyVisible = true;
	}

	function confirmPrestige() {
		prestigeCeremonyVisible = false;
		if (!canPrestige) return;
		let rp = Math.max(1, Math.floor(Math.sqrt(state.totalEarned / 1_000_000)));
		if (state.prestigePerks.managerCFO) rp = Math.ceil(rp * 1.1);
		const newLevel = state.prestigeLevel + 1;
		const newState = defaultState();
		newState.prestigeLevel = newLevel;
		newState.prestigePoints = state.prestigePoints + rp;
		newState.prestigeShopPurchased = { ...state.prestigeShopPurchased };
		newState.achievements = { ...state.achievements };
		newState.money = state.prestigePerks.startMoney;
		calculatePrestigePerks();
		newState.prestigePerks = state.prestigePerks;
		newState.prestigeMultiplier = 1 + newLevel * 0.5;
		state = newState;
		nextMilestoneIdx = 0;
		playPrestigeSound();
		confettiBurst = {};
		enqueueToast({ icon: '⭐', name: 'Prestige!', desc: `You earned ${rp} Reputation Points!` });
		checkAchievements();
	}

	function cancelPrestige() {
		prestigeCeremonyVisible = false;
	}

	function buyPrestigeUpgrade(id: string) {
		const item = PRESTIGE_SHOP.find(i => i.id === id);
		if (!item || state.prestigeShopPurchased[id]) return false;
		if (item.requires && !state.prestigeShopPurchased[item.requires]) return false;
		if (state.prestigePoints < item.cost) return false;
		state.prestigePoints -= item.cost;
		state.prestigeShopPurchased[id] = true;
		calculatePrestigePerks();
		return true;
	}

	function openScene(idx: number) {
		if (!state.businesses[idx]?.sceneUrl) return;
		sceneIndex = idx;
	}

	function closeScene() { sceneIndex = null; }

	function collectOffline() { offlineVisible = false; }

	function resolveInvestment(accept: boolean) {
		if (!investOffer) return;
		if (accept) {
			const wins = Math.random() < investOffer.winChance;
			const mult = wins ? investOffer.winMultiplier : investOffer.lossMultiplier;
			const delta = Math.floor(state.money * (mult - 1));
			state.money = Math.max(0, state.money + delta);
			if (wins) state.totalEarned += Math.max(0, delta);
			enqueueToast({ icon: wins ? '🎉' : '😞', name: wins ? 'Investment Won!' : 'Investment Lost', desc: `${wins ? '+' : ''}${formatNumber(delta)}` });
		}
		investActive = false;
		investOffer = null;
	}

	function triggerInvestment() {
		const idx = Math.floor(Math.random() * INVEST_OFFERS.length);
		investOffer = INVEST_OFFERS[idx];
		investActive = true;
		investTimerPct = 100;
	}

	function shareEmpire() {
		const text = `💼 My Business Empire: $${formatNumber(state.totalEarned)} earned | Prestige ${state.prestigeLevel} | Play at https://sashko1391.github.io/business_empire_idle/`;
		if (navigator.share) { navigator.share({ title: 'Business Empire Idle', text }).catch(() => {}); }
		else { navigator.clipboard.writeText(text).catch(() => {}); }
	}

	function resetGame() {
		if (typeof localStorage !== 'undefined') { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('gameVersion'); }
		if (typeof location !== 'undefined') location.reload();
	}

	// ── Tick (game loop body) ─────────────────────────────────────────────────
	let tickCount = 0;
	let autoClickAcc = 0;
	let investCooldown = 0;
	let autoManagerTimer = 0;
	let autoUpgradeTimer = 0;

	function tick() {
		tickCount++;
		// Income
		const income = totalIncomePerSecond;
		state.money += income;
		state.totalEarned += income;

		// Auto-click
		if (state.autoClickInterval > 0) {
			autoClickAcc += 1000;
			if (autoClickAcc >= state.autoClickInterval) {
				autoClickAcc = 0;
				const earned = state.clickPower * state.prestigeMultiplier;
				state.money += earned;
				state.totalEarned += earned;
			}
		}

		// Operations manager — auto-buy cheapest business every 30 ticks
		if (state.prestigePerks.managerOperations) {
			autoManagerTimer++;
			if (autoManagerTimer >= 30) {
				autoManagerTimer = 0;
				let cheapestIdx = -1, cheapestCost = Infinity;
				state.businesses.forEach((_, i) => {
					const cost = getBusinessCost(i);
					if (cost < cheapestCost && state.money >= cost) { cheapestCost = cost; cheapestIdx = i; }
				});
				if (cheapestIdx >= 0) buyBusiness(cheapestIdx);
			}
		}

		// CTO manager — auto-upgrade every 60 ticks
		if (state.prestigePerks.managerCTO) {
			autoUpgradeTimer++;
			if (autoUpgradeTimer >= 60) {
				autoUpgradeTimer = 0;
				const idx = state.upgrades.findIndex((u, i) => !u.purchased && state.money >= getUpgradeCost(i));
				if (idx >= 0) buyUpgrade(idx);
			}
		}

		// Investment trigger every ~180 ticks
		if (!investActive) {
			investCooldown++;
			if (investCooldown >= 180) { investCooldown = 0; triggerInvestment(); }
		}

		// Milestone confetti
		while (nextMilestoneIdx < MILESTONES.length && state.totalEarned >= MILESTONES[nextMilestoneIdx]) {
			confettiBurst = {};
			nextMilestoneIdx++;
		}

		// Daily checks every 60 ticks
		if (tickCount % 60 === 0) { initDaily(); checkContractProgress(); checkAchievements(); }

		// Synergies every 10 ticks
		if (tickCount % 10 === 0) applySynergies();
	}

	function init() {
		load();
		calculatePrestigePerks();
		applySynergies();
		initDaily();
		checkAchievements();
	}

	return {
		get state() { return state; },
		get totalIncomePerSecond() { return totalIncomePerSecond; },
		get rpWillEarn() { return rpWillEarn; },
		get canPrestige() { return canPrestige; },
		get bgStage() { return bgStage; },
		get investActive() { return investActive; },
		get investOffer() { return investOffer; },
		get investTimerPct() { return investTimerPct; },
		set investTimerPct(v) { investTimerPct = v; },
		get toastVisible() { return toastVisible; },
		get currentToast() { return currentToast; },
		get sceneIndex() { return sceneIndex; },
		get offlineEarnings() { return offlineEarnings; },
		get offlineVisible() { return offlineVisible; },
		get confettiBurst() { return confettiBurst; },
		clearConfetti() { confettiBurst = null; },
		// Bulk buy
		get bulkBuyQty() { return bulkBuyQty; },
		set bulkBuyQty(v) { bulkBuyQty = v; },
		getBulkBusinessCost, getMaxAffordableBusiness, buyBusinessBulk,
		// Prestige ceremony
		get prestigeCeremonyVisible() { return prestigeCeremonyVisible; },
		requestPrestige, confirmPrestige, cancelPrestige,
		// Milestone progress
		get milestoneNext() { return milestoneNext; },
		get milestoneProgress() { return milestoneProgress; },
		getBusinessCost, getUpgradeCost, getDailyEvent,
		init, tick, save,
		doWork, buyBusiness, buyUpgrade,
		buyPrestigeUpgrade,
		openScene, closeScene,
		collectOffline,
		resolveInvestment,
		shareEmpire, resetGame,
		PRESTIGE_SHOP
	};
}

export const game = createGame();
