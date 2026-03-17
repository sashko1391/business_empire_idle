<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';

	const displayMoney = tweened(0, { duration: 400, easing: cubicOut });
	const displayIncome = tweened(0, { duration: 600, easing: cubicOut });
	const displayMilestone = tweened(0, { duration: 700, easing: cubicOut });

	$effect(() => { displayMoney.set(game.state.money); });
	$effect(() => { displayIncome.set(game.totalIncomePerSecond); });
	$effect(() => { displayMilestone.set(game.milestoneProgress); });
</script>

<h1>💼 Business Empire</h1>

<div class="money-display">
	<div class="money-amount">${formatNumber($displayMoney)}</div>
	<div class="income-rate">${formatNumber($displayIncome)}/sec</div>
	<div class="prestige-info">
		Prestige {game.state.prestigeLevel} |
		{game.state.prestigeMultiplier.toFixed(1)}x multiplier
	</div>
</div>

<div class="milestone-wrap">
	<div class="milestone-label">
		{#if game.milestoneNext !== null}
			Next milestone: <span>${formatNumber(game.milestoneNext)}</span>
		{:else}
			🏆 All milestones reached!
		{/if}
	</div>
	<div class="milestone-track">
		<div class="milestone-fill" style="width:{$displayMilestone}%"></div>
	</div>
</div>

<style>
	.milestone-wrap {
		margin-top: 6px;
		margin-bottom: 2px;
	}
	.milestone-label {
		font-size: 0.72rem;
		color: #888;
		margin-bottom: 3px;
	}
	.milestone-label span { color: #a78bfa; }
	.milestone-track {
		background: rgba(255,255,255,0.07);
		border-radius: 4px;
		height: 5px;
		overflow: hidden;
	}
	.milestone-fill {
		height: 100%;
		background: linear-gradient(90deg, #818cf8, #a78bfa);
		border-radius: 4px;
		transition: width 0.7s ease;
		box-shadow: 0 0 6px rgba(167,139,250,0.5);
	}
</style>
