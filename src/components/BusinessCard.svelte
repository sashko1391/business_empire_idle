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

	const cost = $derived(game.getBusinessCost(index));
	const income = $derived(business.baseIncome * business.incomeMultiplier * game.state.prestigeMultiplier);
	const canAfford = $derived(game.state.money >= cost);
	const unlocked = $derived(
		business.unlockPrestige <= game.state.prestigeLevel &&
		business.unlockCost <= game.state.totalEarned
	);
	const progress = $derived(Math.min(100, Math.round((game.state.totalEarned / Math.max(1, business.unlockCost)) * 100)));

	const progressBar = tweened(0, { duration: 800, easing: cubicOut });
	$effect(() => { progressBar.set(progress); });

	const activeSyns = $derived(SYNERGIES.filter(s => {
		if (!s.ids.includes(business.id)) return false;
		const otherId = s.ids.find(id => id !== business.id)!;
		const other = game.state.businesses.find(b => b.id === otherId);
		return other && other.owned >= 1 && business.owned >= 1;
	}));

	let justBought = $state(false);
	function buy(e: MouseEvent) {
		e.stopPropagation();
		if (game.buyBusiness(index)) {
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
			Owned: <span>{business.owned}</span> |
			Income: <span>${formatNumber(income)}/sec</span>
		</div>
		{#if activeSyns.length}
		<div class="syn-badge">⚡ {activeSyns.map(s => s.desc).join(' · ')}</div>
		{/if}
	</div>
	<div class="business-actions">
		{#if business.sceneUrl}
		<button class="view-btn" onclick={(e) => { e.stopPropagation(); view(); }}>👁</button>
		{/if}
		<button class="buy-btn" onclick={buy} disabled={!canAfford}>
			Buy<br>${formatNumber(cost)}
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
	.syn-badge {
		color: #4ade80;
		font-size: 0.72rem;
		margin-top: 2px;
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
