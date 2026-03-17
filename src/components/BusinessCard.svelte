<script lang="ts">
	import { fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import { SYNERGIES } from '$lib/data/synergies';
	import type { Business } from '$lib/types';

	let { business, index }: { business: Business; index: number } = $props();

	const income = $derived(business.baseIncome * business.incomeMultiplier * game.state.prestigeMultiplier);
	const unlocked = $derived(
		business.unlockPrestige <= game.state.prestigeLevel &&
		business.unlockCost <= game.state.totalEarned
	);
	const progress = $derived(Math.min(100, Math.round((game.state.totalEarned / Math.max(1, business.unlockCost)) * 100)));

	const progressBar = tweened(0, { duration: 800, easing: cubicOut });
	$effect(() => { progressBar.set(progress); });

	// Bulk buy
	const qty = $derived(
		game.bulkBuyQty === 'max'
			? Math.max(1, game.getMaxAffordableBusiness(index))
			: game.bulkBuyQty
	);
	const cost = $derived(game.getBulkBusinessCost(index, qty));
	const canAfford = $derived(
		game.bulkBuyQty === 'max'
			? game.getMaxAffordableBusiness(index) >= 1
			: game.state.money >= cost
	);

	const activeSyns = $derived(SYNERGIES.filter(s => {
		if (!s.ids.includes(business.id)) return false;
		const otherId = s.ids.find(id => id !== business.id)!;
		const other = game.state.businesses.find(b => b.id === otherId);
		return other && other.owned >= 1 && business.owned >= 1;
	}));

	// Milestone badge: glow at 10, 25, 50, 100
	const MILESTONES_OWN = [10, 25, 50, 100];
	const nextOwnMilestone = $derived(MILESTONES_OWN.find(m => business.owned < m) ?? null);
	const ownProgress = $derived(
		nextOwnMilestone
			? Math.min(100, (business.owned / nextOwnMilestone) * 100)
			: 100
	);

	let justBought = $state(false);
	function buy(e: MouseEvent) {
		e.stopPropagation();
		const actualQty = game.bulkBuyQty === 'max' ? game.getMaxAffordableBusiness(index) : game.bulkBuyQty;
		if (actualQty <= 0) return;
		if (game.buyBusinessBulk(index, actualQty)) {
			justBought = true;
			setTimeout(() => { justBought = false; }, 500);
		}
	}
	function view() { if (business.sceneUrl) game.openScene(index); }
</script>

{#if unlocked}
<div
	class="business-card has-scene glass {justBought ? 'purchase-flash' : ''}"
	onclick={view}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && view()}
	in:fly={{ y: 20, duration: 300 }}
>
	<div class="business-icon">{business.icon}</div>
	<div class="business-info">
		<div class="business-name">{business.name}</div>
		<div class="business-stats">
			<span class="owned-count">{business.owned}</span> owned |
			<span class="income-val">${formatNumber(income * business.owned)}/sec</span>
		</div>
		{#if activeSyns.length}
		<div class="syn-badge">⚡ {activeSyns.map(s => s.desc).join(' · ')}</div>
		{/if}
		{#if nextOwnMilestone}
		<div class="own-progress-track">
			<div class="own-progress-fill" style="width:{ownProgress}%"></div>
		</div>
		<div class="own-progress-label">{business.owned}/{nextOwnMilestone}</div>
		{/if}
	</div>
	<div class="business-actions">
		{#if business.sceneUrl}
		<button class="view-btn" onclick={(e) => { e.stopPropagation(); view(); }}>👁</button>
		{/if}
		<button class="buy-btn" onclick={buy} disabled={!canAfford}>
			{game.bulkBuyQty === 'max' ? `×${qty}` : `×${qty}`}<br>${formatNumber(cost)}
		</button>
	</div>
</div>

{:else if business.unlockPrestige > game.state.prestigeLevel}
<div class="business-card locked glass">
	<div class="business-icon" style="filter:grayscale(1);opacity:0.5">{business.icon}</div>
	<div class="business-info">
		<div class="business-name" style="opacity:0.5">{business.name}</div>
		<div class="lock-info prestige-lock">🔒 Requires Prestige {business.unlockPrestige}</div>
	</div>
</div>

{:else}
<div class="business-card glass">
	<div class="business-icon">{business.icon}</div>
	<div class="business-info" style="flex:1">
		<div class="business-name">{business.name}</div>
		<div class="lock-info">Unlocks at ${formatNumber(business.unlockCost)} earned</div>
		<div class="progress-track">
			<div class="progress-fill" style="width:{$progressBar}%"></div>
			<div class="progress-shine"></div>
		</div>
		<div style="font-size:0.72rem;color:#888;margin-top:3px">{progress}% to unlock</div>
	</div>
</div>
{/if}

<style>
	.glass {
		background: rgba(255,255,255,0.04);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid rgba(255,255,255,0.1);
	}
	.owned-count { color: #f5a623; font-weight: bold; }
	.income-val  { color: #4ade80; }
	.syn-badge {
		color: #4ade80;
		font-size: 0.72rem;
		margin-top: 2px;
	}
	.own-progress-track {
		margin-top: 4px;
		background: rgba(255,255,255,0.07);
		border-radius: 3px;
		height: 3px;
		overflow: hidden;
	}
	.own-progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #818cf8, #6366f1);
		border-radius: 3px;
		transition: width 0.6s ease;
	}
	.own-progress-label {
		font-size: 0.65rem;
		color: #818cf8;
		margin-top: 1px;
	}
	.progress-track {
		position: relative;
		margin-top: 6px;
		background: rgba(255,255,255,0.08);
		border-radius: 4px;
		height: 6px;
		overflow: hidden;
	}
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #f5a623, #e08e0b);
		border-radius: 4px;
		transition: width 0.8s ease;
	}
	.progress-shine {
		position: absolute;
		top: 0; left: -100%;
		width: 60%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
		animation: shine 2.5s infinite;
	}
	@keyframes shine {
		0%   { left: -60%; }
		100% { left: 120%; }
	}
</style>
