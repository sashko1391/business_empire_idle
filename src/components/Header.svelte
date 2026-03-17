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

	const TITLES = ['Garage Dreamer','Local Entrepreneur','Business Magnate','Corporate Titan','Industrial Baron','Galactic Emperor'];
	const playerTitle = $derived(TITLES[Math.min(game.state.prestigeLevel, TITLES.length - 1)]);
</script>

<div class="header-wrap">
	<div class="header-title-row">
		<span class="game-logo">💼</span>
		<h1>Business Empire</h1>
	</div>

	<div class="money-display">
		<div class="money-amount">${formatNumber($displayMoney)}</div>
		<div class="income-rate">+${formatNumber($displayIncome)}<span class="per-sec">/sec</span></div>
		<div class="prestige-row">
			<span class="player-title">{playerTitle}</span>
			{#if game.state.prestigeLevel > 0}
			<span class="prestige-badge">✦ Prestige {game.state.prestigeLevel}</span>
			{/if}
		</div>
	</div>

	<div class="milestone-wrap">
		{#if game.milestoneNext !== null}
		<div class="milestone-label">
			<span>Next milestone</span>
			<span class="milestone-target">${formatNumber(game.milestoneNext)}</span>
		</div>
		{:else}
		<div class="milestone-label"><span>🏆 All milestones reached!</span></div>
		{/if}
		<div class="milestone-track">
			<div class="milestone-fill" style="width:{$displayMilestone}%"></div>
		</div>
	</div>
</div>

<style>
	.header-wrap { margin-bottom: 20px; }

	.header-title-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-bottom: 10px;
	}
	.game-logo { font-size: 1.6rem; }

	.money-display {
		text-align: center;
		background: rgba(245,166,35,0.07);
		border: 1px solid rgba(245,166,35,0.18);
		padding: 20px 16px 14px;
		border-radius: 16px;
		margin-bottom: 10px;
	}

	.income-rate :global(.per-sec) { color: #4ade8099; font-size: 0.85em; }

	.prestige-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 8px;
	}
	.player-title {
		font-size: 0.78rem;
		color: #666;
		font-style: italic;
	}
	.prestige-badge {
		font-size: 0.72rem;
		color: #a78bfa;
		background: rgba(167,139,250,0.12);
		border: 1px solid rgba(167,139,250,0.25);
		border-radius: 5px;
		padding: 1px 7px;
		font-weight: 700;
	}

	.milestone-wrap { }
	.milestone-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.72rem;
		color: #555;
		margin-bottom: 4px;
	}
	.milestone-target { color: #a78bfa; font-weight: 700; }
	.milestone-track {
		background: rgba(255,255,255,0.06);
		border-radius: 4px;
		height: 5px;
		overflow: hidden;
	}
	.milestone-fill {
		height: 100%;
		background: linear-gradient(90deg, #818cf8, #a78bfa);
		border-radius: 4px;
		transition: width 0.7s ease;
		box-shadow: 0 0 8px rgba(167,139,250,0.4);
	}
</style>
