<script lang="ts">
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';

	const biz = $derived(game.sceneIndex !== null ? game.state.businesses[game.sceneIndex] : null);
	const cost = $derived(game.sceneIndex !== null ? game.getBusinessCost(game.sceneIndex) : 0);
	const income = $derived(biz ? biz.baseIncome * biz.incomeMultiplier * game.state.prestigeMultiplier : 0);
	const canAfford = $derived(game.state.money >= cost);

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
	<div class="scene-overlay"></div>
	<div class="scene-content">
		<div class="scene-header">
			<div class="scene-title">{biz.name}</div>
			<button class="scene-close" onclick={game.closeScene}>✕</button>
		</div>
		<div class="scene-stats">
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
			<button class="scene-buy-btn" onclick={() => game.sceneIndex !== null && game.buyBusiness(game.sceneIndex)} disabled={!canAfford}>
				Buy — ${formatNumber(cost)}
			</button>
		</div>
	</div>
	{/if}
</div>
