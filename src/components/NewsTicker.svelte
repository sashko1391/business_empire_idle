<script lang="ts">
	import { game } from '$lib/store.svelte';

	const ALL_NEWS = [
		'📈 Tech stocks surge 12% on AI boom — IT companies thriving',
		'☕ Coffee demand hits record high — café owners rejoice',
		'🏦 Central bank cuts rates — investment funds eye gains',
		'🚀 Space mining permits approved — early investors rush in',
		'🍋 Lemonade Stand industry disrupted by automation',
		'🏙️ Real estate values climb 8% in metro areas',
		'📱 Social media ad spend doubles — media agencies boom',
		'💪 Fitness sector expands as wellness trend accelerates',
		'🚗 EV adoption boosts car wash revenue by 34%',
		'🛵 Food delivery market grows 22% year-over-year',
		'🌍 Interplanetary trade routes open — historic agreement signed',
		'💹 Analysts predict economic growth for Q3',
		'🏆 Empire rankings updated — who tops the leaderboard?',
		'⚡ Energy prices fall — business costs decrease globally',
		'🤖 AI-powered managers outperform human counterparts',
		'💎 Billionaire club expands as markets rally',
		'📊 Investment funds post record quarterly returns',
		'🌟 Prestige economy emerges — reputation is the new currency',
	];

	// Show news relevant to current stage
	const news = $derived(
		game.state.totalEarned < 1_000 ? ALL_NEWS.slice(0, 6) :
		game.state.totalEarned < 1_000_000 ? ALL_NEWS.slice(0, 12) :
		ALL_NEWS
	);

	let currentIdx = $state(0);
	let visible = $state(true);

	$effect(() => {
		const t = setInterval(() => {
			visible = false;
			setTimeout(() => {
				currentIdx = (currentIdx + 1) % news.length;
				visible = true;
			}, 400);
		}, 5000);
		return () => clearInterval(t);
	});
</script>

<div class="ticker-wrap">
	<span class="ticker-label">MARKET</span>
	<div class="ticker-text" class:fade-in={visible} class:fade-out={!visible}>
		{news[currentIdx]}
	</div>
</div>

<style>
	.ticker-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(0,0,0,0.4);
		border: 1px solid rgba(245,166,35,0.2);
		border-radius: 6px;
		padding: 6px 12px;
		margin-bottom: 14px;
		font-size: 0.8rem;
		overflow: hidden;
	}
	.ticker-label {
		color: #f5a623;
		font-weight: bold;
		font-size: 0.7rem;
		letter-spacing: 1px;
		white-space: nowrap;
		border-right: 1px solid rgba(245,166,35,0.3);
		padding-right: 8px;
	}
	.ticker-text {
		color: #ccc;
		transition: opacity 0.4s ease;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.fade-in  { opacity: 1; }
	.fade-out { opacity: 0; }
</style>
