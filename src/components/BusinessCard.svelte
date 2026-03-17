<script lang="ts">
	import { fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import { SYNERGIES } from '$lib/data/synergies';
	import type { Business } from '$lib/types';

	let { business, index }: { business: Business; index: number } = $props();

	const income = $derived(
		business.baseIncome
		* business.incomeMultiplier
		* game.state.prestigeMultiplier
		* game.getBusinessTierBonus(business)
	);
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

	// Tier
	const tierIdx  = $derived(game.getBusinessTierIndex(business));
	const tier      = $derived(business.tiers?.[tierIdx] ?? null);
	const nextTier  = $derived(business.tiers?.[tierIdx + 1] ?? null);
	const tierClass = $derived(
		tierIdx >= 2 ? 'tier-3' :
		tierIdx >= 1 ? 'tier-2' : ''
	);
	const tierProgress = $derived(
		nextTier
			? Math.min(100, (business.owned / nextTier.minOwned) * 100)
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
	class="business-card has-scene glass {tierClass} {justBought ? 'purchase-flash' : ''}"
	onclick={view}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && view()}
	in:fly={{ y: 20, duration: 300 }}
>
	<div class="business-icon">{business.icon}</div>
	<div class="business-info">
		<div class="name-row">
			<span class="business-name">{tier?.name ?? business.name}</span>
			{#if tier}
			<span class="tier-badge tier-badge-{tierIdx + 1}">{tier.label}</span>
			{/if}
		</div>
		<div class="income-line">
			${formatNumber(income * business.owned)}<span class="per-sec">/sec</span>
			{#if tier && tier.bonus > 1}<span class="tier-bonus">×{tier.bonus}</span>{/if}
		</div>
		<div class="owned-line">
			<span class="owned-count">{business.owned}</span><span class="owned-label"> owned</span>
			{#if activeSyns.length}<span class="syn-dot">⚡</span>{/if}
		</div>
		<!-- Tier progress bar -->
		{#if nextTier}
		<div class="tier-progress-wrap">
			<div class="tier-progress-track">
				<div class="tier-progress-fill {tierClass}" style="width:{tierProgress}%"></div>
			</div>
			<span class="tier-progress-label">{business.owned}/{nextTier.minOwned} → {nextTier.name}</span>
		</div>
		{:else if tier}
		<div class="tier-maxed">✦ Max Tier</div>
		{/if}
	</div>
	<div class="business-actions">
		{#if business.sceneUrl}
		<button class="view-btn" onclick={(e) => { e.stopPropagation(); view(); }}>👁</button>
		{/if}
		<button class="buy-btn" onclick={buy} disabled={!canAfford}>
			×{qty}<br>${formatNumber(cost)}
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
		transition: border-color 0.4s ease, box-shadow 0.4s ease;
	}
	/* Tier 2: gold */
	.tier-2 {
		border-color: rgba(245,166,35,0.45) !important;
		box-shadow: 0 0 14px rgba(245,166,35,0.12);
	}
	/* Tier 3: purple cosmic */
	.tier-3 {
		border-color: rgba(167,139,250,0.55) !important;
		box-shadow: 0 0 20px rgba(167,139,250,0.18), inset 0 0 30px rgba(167,139,250,0.04);
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
	}
	.business-name { font-weight: 700; font-size: 1rem; color: #ffffff; }

	.tier-badge {
		font-size: 0.65rem;
		font-weight: bold;
		padding: 1px 6px;
		border-radius: 4px;
		letter-spacing: 0.5px;
		flex-shrink: 0;
	}
	.tier-badge-1 { background: rgba(255,255,255,0.1); color: #aaa; }
	.tier-badge-2 { background: rgba(245,166,35,0.2); color: #f5a623; border: 1px solid rgba(245,166,35,0.4); }
	.tier-badge-3 { background: rgba(167,139,250,0.2); color: #a78bfa; border: 1px solid rgba(167,139,250,0.5); }

	.income-line {
		font-size: 1.25rem;
		font-weight: 800;
		color: #4ade80;
		line-height: 1.2;
		margin-top: 3px;
		letter-spacing: -0.3px;
	}
	.income-line .per-sec {
		font-size: 0.75rem;
		font-weight: 500;
		color: #4ade8099;
		margin-left: 1px;
	}
	.owned-line {
		margin-top: 3px;
		font-size: 0.82rem;
		color: #888;
	}
	.owned-count { color: #f5a623; font-weight: 700; font-size: 0.9rem; }
	.owned-label { color: #666; }
	.syn-dot { margin-left: 4px; }
	.tier-bonus  { color: #a78bfa; font-size: 0.75rem; font-weight: bold; margin-left: 4px; }

	.tier-progress-wrap {
		margin-top: 5px;
	}
	.tier-progress-track {
		background: rgba(255,255,255,0.07);
		border-radius: 3px;
		height: 4px;
		overflow: hidden;
	}
	.tier-progress-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.6s ease;
		background: linear-gradient(90deg, #818cf8, #6366f1);
	}
	.tier-progress-fill.tier-2 {
		background: linear-gradient(90deg, #f5a623, #fbbf24);
	}
	.tier-progress-fill.tier-3 {
		background: linear-gradient(90deg, #a78bfa, #e879f9);
	}
	.tier-progress-label {
		font-size: 0.62rem;
		color: #666;
		margin-top: 1px;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tier-maxed {
		font-size: 0.68rem;
		color: #a78bfa;
		margin-top: 3px;
		letter-spacing: 0.5px;
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
