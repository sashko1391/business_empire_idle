<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';

	const TITLES = [
		'Garage Dreamer',       // → level 1
		'Local Entrepreneur',   // → level 2
		'Business Magnate',     // → level 3
		'Corporate Titan',      // → level 4
		'Industrial Baron',     // → level 5
		'Galactic Emperor',     // → level 6+
	];

	const newLevel = $derived(game.state.prestigeLevel + 1);
	const title = $derived(TITLES[Math.min(newLevel - 1, TITLES.length - 1)]);
	const newMultiplier = $derived((1 + newLevel * 0.5).toFixed(1));
	const rpWillEarn = $derived(game.rpWillEarn);
</script>

{#if game.prestigeCeremonyVisible}
<div class="ceremony-backdrop" transition:fade={{ duration: 300 }}>
	<div class="ceremony-panel" transition:fly={{ y: 60, duration: 400 }}>

		<div class="star-row">⭐⭐⭐</div>
		<h2 class="ceremony-title">Prestige Ceremony</h2>
		<div class="earned-title">
			<span class="title-label">New Title</span>
			<span class="title-value">{title}</span>
		</div>

		<div class="stats-grid">
			<div class="stat-row">
				<span class="stat-label">Total Earned</span>
				<span class="stat-value gold">${formatNumber(game.state.totalEarned)}</span>
			</div>
			<div class="stat-row">
				<span class="stat-label">Prestige Level</span>
				<span class="stat-value">{game.state.prestigeLevel} → <span class="gold">{newLevel}</span></span>
			</div>
			<div class="stat-row">
				<span class="stat-label">New Income Multiplier</span>
				<span class="stat-value gold">{newMultiplier}×</span>
			</div>
			<div class="stat-row">
				<span class="stat-label">RP Earned</span>
				<span class="stat-value purple">+{rpWillEarn} RP</span>
			</div>
			<div class="stat-row">
				<span class="stat-label">Total RP After</span>
				<span class="stat-value purple">{game.state.prestigePoints + rpWillEarn} RP</span>
			</div>
		</div>

		<p class="warning">⚠️ Businesses and money will reset. Achievements and RP shop keep forever.</p>

		<div class="btn-row">
			<button class="cancel-btn" onclick={game.cancelPrestige}>Cancel</button>
			<button class="confirm-btn" onclick={game.confirmPrestige}>⭐ Prestige Now!</button>
		</div>
	</div>
</div>
{/if}

<style>
	.ceremony-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.75);
		backdrop-filter: blur(6px);
		z-index: 8000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}
	.ceremony-panel {
		background: linear-gradient(160deg, rgba(30,20,60,0.98) 0%, rgba(15,10,30,0.98) 100%);
		border: 1px solid rgba(167,139,250,0.4);
		border-radius: 16px;
		padding: 28px 24px;
		max-width: 380px;
		width: 100%;
		text-align: center;
		box-shadow: 0 0 40px rgba(167,139,250,0.2);
	}
	.star-row {
		font-size: 1.4rem;
		margin-bottom: 6px;
		letter-spacing: 4px;
	}
	.ceremony-title {
		font-size: 1.4rem;
		font-weight: bold;
		color: #f5a623;
		margin: 0 0 14px;
		letter-spacing: 1px;
	}
	.earned-title {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: rgba(167,139,250,0.12);
		border: 1px solid rgba(167,139,250,0.3);
		border-radius: 10px;
		padding: 10px 16px;
		margin-bottom: 18px;
	}
	.title-label {
		font-size: 0.72rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	.title-value {
		font-size: 1.2rem;
		font-weight: bold;
		color: #a78bfa;
		margin-top: 2px;
	}
	.stats-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
		text-align: left;
	}
	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: rgba(255,255,255,0.04);
		border-radius: 6px;
		padding: 6px 12px;
		font-size: 0.85rem;
	}
	.stat-label { color: #aaa; }
	.stat-value { font-weight: bold; color: #eee; }
	.gold { color: #f5a623; }
	.purple { color: #a78bfa; }
	.warning {
		font-size: 0.72rem;
		color: #f87171;
		margin-bottom: 18px;
		line-height: 1.4;
	}
	.btn-row {
		display: flex;
		gap: 10px;
	}
	.cancel-btn {
		flex: 1;
		padding: 10px;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.15);
		border-radius: 8px;
		color: #aaa;
		font-size: 0.9rem;
		cursor: pointer;
	}
	.cancel-btn:hover { background: rgba(255,255,255,0.1); }
	.confirm-btn {
		flex: 2;
		padding: 10px;
		background: linear-gradient(135deg, #f5a623, #e08e0b);
		border: none;
		border-radius: 8px;
		color: #000;
		font-weight: bold;
		font-size: 0.95rem;
		cursor: pointer;
		box-shadow: 0 0 20px rgba(245,166,35,0.3);
		transition: transform 0.1s, box-shadow 0.1s;
	}
	.confirm-btn:hover {
		transform: scale(1.02);
		box-shadow: 0 0 28px rgba(245,166,35,0.5);
	}
	.confirm-btn:active { transform: scale(0.97); }
</style>
