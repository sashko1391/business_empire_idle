<script lang="ts">
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';

	const biz     = $derived(game.sceneIndex !== null ? game.state.businesses[game.sceneIndex] : null);
	const cost    = $derived(game.sceneIndex !== null ? game.getBusinessCost(game.sceneIndex) : 0);
	const tierIdx  = $derived(biz ? game.getBusinessTierIndex(biz) : -1);
	const tier     = $derived(biz?.tiers?.[tierIdx] ?? null);
	const nextTier = $derived(biz?.tiers?.[tierIdx + 1] ?? null);
	const tierBonus = $derived(biz ? game.getBusinessTierBonus(biz) : 1);
	const income  = $derived(biz ? biz.baseIncome * biz.incomeMultiplier * game.state.prestigeMultiplier * tierBonus : 0);
	const canAfford = $derived(game.state.money >= cost);

	const TIER_OVERLAYS = ['', 'scene-tier-2', 'scene-tier-3'];

	function overlayClick(e: MouseEvent) {
		if ((e.target as HTMLElement).classList.contains('scene-modal') ||
			(e.target as HTMLElement).classList.contains('scene-overlay')) {
			game.closeScene();
		}
	}
</script>

<div class="scene-modal {game.sceneIndex !== null ? 'show' : ''}" onclick={overlayClick} role="dialog" aria-modal="true">
	{#if biz}
	<div class="scene-background" style="background-image: url('{base}/{biz.sceneUrl}')"></div>
	<div class="scene-overlay {tierIdx >= 0 ? TIER_OVERLAYS[Math.min(tierIdx, 2)] : ''}"></div>
	<div class="scene-content">
		<div class="scene-header">
			<div class="scene-title">
				{tier?.name ?? biz.name}
				{#if tier}
				<span class="scene-tier-badge scene-tier-badge-{tierIdx + 1}">{tier.label}</span>
				{/if}
			</div>
			<button class="scene-close" onclick={game.closeScene}>✕</button>
		</div>
		<div class="scene-stats">
			{#if tier && tierIdx >= 0}
			<div class="scene-stat-row">
				<span class="scene-stat-label">Tier Bonus</span>
				<span class="scene-stat-value tier-val">×{tier.bonus} income</span>
			</div>
			{/if}
			<div class="scene-stat-row">
				<span class="scene-stat-label">Owned</span>
				<span class="scene-stat-value">{biz.owned}</span>
			</div>
			<div class="scene-stat-row">
				<span class="scene-stat-label">Income per unit</span>
				<span class="scene-stat-value">${formatNumber(income)}/sec</span>
			</div>
			<div class="scene-stat-row">
				<span class="scene-stat-label">Total income</span>
				<span class="scene-stat-value">${formatNumber(income * biz.owned)}/sec</span>
			</div>
			{#if nextTier}
			<div class="scene-stat-row">
				<span class="scene-stat-label">Next tier at</span>
				<span class="scene-stat-value">{biz.owned}/{nextTier.minOwned} owned → {nextTier.name}</span>
			</div>
			{:else if tier}
			<div class="scene-stat-row">
				<span class="scene-stat-label">Tier</span>
				<span class="scene-stat-value tier-val">✦ Max Tier reached</span>
			</div>
			{/if}
			<button class="scene-buy-btn" onclick={() => game.sceneIndex !== null && game.buyBusiness(game.sceneIndex)} disabled={!canAfford}>
				Buy — ${formatNumber(cost)}
			</button>
		</div>
	</div>
	{/if}
</div>
