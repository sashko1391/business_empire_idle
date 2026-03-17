<script lang="ts">
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
</script>

<h1>💼 Business Empire</h1>

<div class="money-display">
	<div class="money-amount">${formatNumber(game.state.money)}</div>
	<div class="income-rate">${formatNumber(game.totalIncomePerSecond)}/sec</div>
	<div class="prestige-info">
		Prestige Level: {game.state.prestigeLevel} |
		Multiplier: {game.state.prestigeMultiplier.toFixed(1)}x
	</div>
</div>
