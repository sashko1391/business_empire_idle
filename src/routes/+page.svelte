<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import { ACHIEVEMENTS } from '$lib/data/achievements';

	import GameBackground from '$components/GameBackground.svelte';
	import Header from '$components/Header.svelte';
	import WorkButton from '$components/WorkButton.svelte';
	import DailyPanel from '$components/DailyPanel.svelte';
	import BusinessCard from '$components/BusinessCard.svelte';
	import UpgradeCard from '$components/UpgradeCard.svelte';
	import SceneModal from '$components/SceneModal.svelte';
	import InvestmentModal from '$components/InvestmentModal.svelte';
	import OfflineModal from '$components/OfflineModal.svelte';
	import AchievementToast from '$components/AchievementToast.svelte';
	import Confetti from '$components/Confetti.svelte';
	import NewsTicker from '$components/NewsTicker.svelte';
	import BulkBuyToggle from '$components/BulkBuyToggle.svelte';
	import PrestigeCeremonyModal from '$components/PrestigeCeremonyModal.svelte';

	let confetti: Confetti;

	// Watch for confetti bursts from store
	$effect(() => {
		if (game.confettiBurst !== null) {
			confetti?.burst();
			game.clearConfetti();
		}
	});

	let activeTab = $state('businesses');

	onMount(() => {
		game.init();
		const loop = setInterval(() => game.tick(), 1000);
		const save = setInterval(() => game.save(), 30000);
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {});
		}
		return () => { clearInterval(loop); clearInterval(save); };
	});

	const GAME_VERSION = '3.0.0';
</script>

<GameBackground />

<div class="container {game.shakeActive ? 'shake' : ''}">
	<Header />
	<WorkButton />

	<div class="tabs">
		{#each [['businesses','🏢 Biz'],['upgrades','🔧 Upgrades'],['prestige','⭐ Prestige'],['achievements','🏆 Achs']] as [tab, label]}
		<button class="tab-btn {activeTab === tab ? 'active' : ''}" onclick={() => activeTab = tab}>{label}</button>
		{/each}
	</div>

	<!-- BUSINESSES TAB -->
	{#if activeTab === 'businesses'}
	<div>
		<NewsTicker />
		<DailyPanel />
		<BulkBuyToggle />
		{#each game.state.businesses as biz, i}
			<BusinessCard business={biz} index={i} />
		{/each}
	</div>
	{/if}

	<!-- UPGRADES TAB -->
	{#if activeTab === 'upgrades'}
	<div>
		<div class="bonuses-summary">
			<h3>📊 Current Bonuses</h3>
			<div class="bonus-grid">
				<div class="bonus-item">
					<div class="bonus-label">Click Power</div>
					<div class="bonus-value">${formatNumber(game.state.clickPower)}</div>
				</div>
				<div class="bonus-item">
					<div class="bonus-label">Global Multiplier</div>
					<div class="bonus-value">{game.state.globalMultiplier.toFixed(2)}x</div>
				</div>
				<div class="bonus-item">
					<div class="bonus-label">Passive Income</div>
					<div class="bonus-value">${formatNumber(game.state.bonusIncome)}/sec</div>
				</div>
				<div class="bonus-item">
					<div class="bonus-label">Offline Multiplier</div>
					<div class="bonus-value {game.state.offlineMultiplier <= 1 ? 'neutral' : ''}">{game.state.offlineMultiplier.toFixed(2)}x</div>
				</div>
			</div>
		</div>
		{#each game.state.upgrades as upg, i}
			<UpgradeCard upgrade={upg} index={i} />
		{/each}
	</div>
	{/if}

	<!-- PRESTIGE TAB -->
	{#if activeTab === 'prestige'}
	<div>
		<div class="rp-display">
			<div class="rp-amount">{game.state.prestigePoints} RP</div>
			<div class="rp-label">Reputation Points</div>
		</div>

		<div class="prestige-panel">
			<h2>⭐ Prestige</h2>
			<p>Total Earned: ${formatNumber(game.state.totalEarned)}</p>
			<p>Prestige Level: {game.state.prestigeLevel} (×{game.state.prestigeMultiplier.toFixed(1)} income)</p>
			{#if game.canPrestige}
				<p>Will earn: <span class="rp-preview">{game.rpWillEarn} RP</span></p>
			{:else}
				<p>Need ${formatNumber(1_000_000)} total earned to prestige</p>
			{/if}
			<button class="prestige-btn" onclick={game.requestPrestige} disabled={!game.canPrestige}>
				⭐ Prestige Now
			</button>
		</div>

		<p class="shop-section-title">🛍️ Prestige Shop</p>
		<div class="prestige-shop-grid">
			{#each game.PRESTIGE_SHOP as item}
				{@const owned = !!game.state.prestigeShopPurchased[item.id]}
				{@const locked = item.requires && !game.state.prestigeShopPurchased[item.requires ?? '']}
				{@const canBuy = !owned && !locked && game.state.prestigePoints >= item.cost}
				<div class="shop-item {owned ? 'purchased' : ''} {locked ? 'shop-locked' : ''}">
					<div class="shop-item-icon">{item.icon}</div>
					<div class="shop-item-name">{item.name}</div>
					<div class="shop-item-effect">{item.effect}</div>
					{#if owned}
						<button class="shop-buy-btn owned-btn" disabled>✓ Owned</button>
					{:else}
						<button class="shop-buy-btn" onclick={() => game.buyPrestigeUpgrade(item.id)} disabled={!canBuy}>
							{item.cost} RP
						</button>
					{/if}
				</div>
			{/each}
		</div>

		<div class="reset-section">
			<button class="reset-btn" onclick={() => { if(confirm('Reset ALL progress?')) game.resetGame(); }}>🗑️ Reset Save</button>
			<button class="reset-btn" style="background:rgba(245,166,35,0.15);border-color:rgba(245,166,35,0.3);color:#f5a623" onclick={game.shareEmpire}>📤 Share Empire</button>
			<span class="version-info">v{GAME_VERSION}</span>
		</div>
	</div>
	{/if}

	<!-- ACHIEVEMENTS TAB -->
	{#if activeTab === 'achievements'}
	<div>
		<div class="ach-tab-header">
			<h2 style="color:#f5a623">🏆 Achievements</h2>
			<span class="ach-counter">{Object.keys(game.state.achievements).length}/{ACHIEVEMENTS.length}</span>
		</div>
		<div class="achievements-tab-grid">
			{#each ACHIEVEMENTS as ach}
				{@const unlocked = !!game.state.achievements[ach.id]}
				<div class="achievement-card {unlocked ? 'unlocked' : 'locked'}">
					<div class="ach-icon">{ach.icon}</div>
					<div>
						<div class="ach-name">{ach.name}</div>
						<div class="ach-desc">{ach.desc}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	{/if}
</div>

<SceneModal />
<InvestmentModal />
<OfflineModal />
<AchievementToast />
<PrestigeCeremonyModal />
<Confetti bind:this={confetti} />
