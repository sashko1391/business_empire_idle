<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';

	const displayMoney = tweened(0, { duration: 400, easing: cubicOut });
	const displayIncome = tweened(0, { duration: 600, easing: cubicOut });

	$effect(() => { displayMoney.set(game.state.money); });
	$effect(() => { displayIncome.set(game.totalIncomePerSecond); });
</script>

<h1>💼 Business Empire</h1>

<div class="money-display">
	<div class="money-amount">${formatNumber($displayMoney)}</div>
	<div class="income-rate">${formatNumber($displayIncome)}/sec</div>
	<div class="prestige-info">
		Prestige Level: {game.state.prestigeLevel} |
		Multiplier: {game.state.prestigeMultiplier.toFixed(1)}x
	</div>
</div>
