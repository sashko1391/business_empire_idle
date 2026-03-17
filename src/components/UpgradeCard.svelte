<script lang="ts">
	import { fly } from 'svelte/transition';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import type { Upgrade } from '$lib/types';

	let { upgrade, index }: { upgrade: Upgrade; index: number } = $props();

	const cost = $derived(game.getUpgradeCost(index));
	const canAfford = $derived(game.state.money >= cost && !upgrade.purchased);
	const unlocked = $derived(upgrade.unlockCost <= game.state.totalEarned && upgrade.unlockPrestige <= game.state.prestigeLevel);

	let justBought = $state(false);
	function buy() {
		if (game.buyUpgrade(index)) {
			justBought = true;
			setTimeout(() => { justBought = false; }, 500);
		}
	}
</script>

{#if unlocked}
<div
	class="upgrade-card {upgrade.purchased ? 'purchased' : ''} {justBought ? 'purchase-flash' : ''} glass"
	in:fly={{ y: 15, duration: 250 }}
>
	<div class="upgrade-icon">{upgrade.icon}</div>
	<div class="upgrade-info">
		<div class="upgrade-name">{upgrade.name}</div>
		<div class="upgrade-effect">{upgrade.effect}</div>
		<div class="upgrade-type">{upgrade.type}</div>
	</div>
	{#if upgrade.purchased}
		<button class="upgrade-btn purchased" disabled>✓ Owned</button>
	{:else}
		<button class="upgrade-btn" onclick={buy} disabled={!canAfford}>
			${formatNumber(cost)}
		</button>
	{/if}
</div>
{/if}

<style>
	.glass {
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}
</style>
