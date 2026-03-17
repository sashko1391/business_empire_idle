<script lang="ts">
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';
	import { fade } from 'svelte/transition';

	// early  = garage (background_1.png)
	// mid    = corporate office
	// endgame = penthouse skyscraper
	const bg = $derived(game.bgStage);
</script>

{#key bg}
<div
	class="game-background bg-{bg}"
	style={bg === 'early' ? `background-image: url('${base}/images/backgrounds/background_1.png')` : ''}
	transition:fade={{ duration: 1200 }}
></div>
{/key}
<div class="game-background-overlay"></div>

<style>
	/* early: garage (uses bg image from JS) */
	.bg-early {
		background-size: cover;
		background-position: center;
	}

	/* mid: modern corporate office — deep blue gradient + geometric shapes */
	.bg-mid {
		background:
			radial-gradient(ellipse at 20% 50%, rgba(30,64,175,0.4) 0%, transparent 60%),
			radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.2) 0%, transparent 50%),
			linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2440 70%, #0a1628 100%);
	}
	.bg-mid::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			repeating-linear-gradient(
				0deg,
				transparent,
				transparent 60px,
				rgba(255,255,255,0.015) 60px,
				rgba(255,255,255,0.015) 61px
			),
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 80px,
				rgba(255,255,255,0.015) 80px,
				rgba(255,255,255,0.015) 81px
			);
	}

	/* endgame: luxury penthouse — gold/purple prestige gradient */
	.bg-endgame {
		background:
			radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.25) 0%, transparent 50%),
			radial-gradient(ellipse at 100% 100%, rgba(168,85,247,0.3) 0%, transparent 50%),
			radial-gradient(ellipse at 0% 100%, rgba(245,166,35,0.15) 0%, transparent 40%),
			linear-gradient(160deg, #0c0a1e 0%, #1a0f2e 30%, #0d1525 60%, #050d18 100%);
	}
	.bg-endgame::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 30% 40%, rgba(245,166,35,0.08) 0%, transparent 30%),
			radial-gradient(circle at 70% 60%, rgba(168,85,247,0.08) 0%, transparent 30%);
		animation: ambientPulse 6s ease-in-out infinite alternate;
	}

	@keyframes ambientPulse {
		0%   { opacity: 0.5; }
		100% { opacity: 1; }
	}
</style>
