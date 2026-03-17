<script lang="ts">
	import { spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import type { FloatingNumber } from '$lib/types';

	// Work button label evolves with progress
	function getWorkLabel() {
		const earned = game.state.totalEarned;
		const prestige = game.state.prestigeLevel;
		if (prestige >= 4) return '🌌 Dominate Galaxy';
		if (prestige >= 3) return '🏢 Run Corporation';
		if (prestige >= 2) return '📈 Move Markets';
		if (prestige >= 1) return '💼 Close Deal';
		if (earned >= 1_000_000) return '🚀 Launch Campaign';
		if (earned >= 100_000)   return '🤝 Sign Client';
		if (earned >= 10_000)    return '📋 Run Operations';
		if (earned >= 1_000)     return '💪 Hustle Hard';
		return '💪 WORK';
	}
	const workLabel = $derived(getWorkLabel());

	// Spring animation for button scale
	const scale = spring(1, { stiffness: 0.4, damping: 0.3 });

	// Click combo
	let comboClicks = $state(0);
	let comboTimer: ReturnType<typeof setTimeout> | null = null;
	const COMBO_MAX = 10;
	const comboMultiplier = $derived(
		comboClicks >= 10 ? 5 :
		comboClicks >= 5  ? 2 : 1
	);
	const comboLabel = $derived(
		comboClicks >= 10 ? '🔥 COMBO ×5!' :
		comboClicks >= 5  ? '⚡ COMBO ×2!' : ''
	);
	// Ring fill: 0–1
	const comboRingPct = $derived(Math.min(comboClicks / COMBO_MAX, 1));
	// SVG circle: circumference of r=46 ≈ 289
	const CIRC = 2 * Math.PI * 46;
	const ringDash = $derived(comboRingPct * CIRC);
	const ringColor = $derived(
		comboClicks >= 10 ? '#f87171' :
		comboClicks >= 5  ? '#f5a623' : '#4ade80'
	);

	// Floating numbers
	let floats = $state<FloatingNumber[]>([]);
	let nextId = 0;

	function handleClick(e: MouseEvent) {
		scale.set(0.88).then(() => scale.set(1));

		comboClicks++;
		if (comboTimer) clearTimeout(comboTimer);
		comboTimer = setTimeout(() => { comboClicks = 0; }, 3000);

		const result = game.doWork(e.clientX, e.clientY);
		const earned = parseFloat(result.value) * comboMultiplier;
		const displayVal = comboMultiplier > 1
			? `${formatNumber(earned)} ×${comboMultiplier}`
			: result.value;

		const id = nextId++;
		floats = [...floats, { id, value: displayVal, x: e.clientX, y: e.clientY }];
		setTimeout(() => { floats = floats.filter(f => f.id !== id); }, 900);
	}
</script>

<div class="work-section">
	{#if comboLabel}
	<div class="combo-label" transition:fly={{ y: -10, duration: 200 }}>{comboLabel}</div>
	{/if}

	<div class="btn-wrap">
		<!-- Combo ring -->
		<svg class="combo-ring" viewBox="0 0 100 100" aria-hidden="true">
			<circle class="ring-bg" cx="50" cy="50" r="46" />
			<circle
				class="ring-fill"
				cx="50" cy="50" r="46"
				stroke={ringColor}
				stroke-dasharray="{ringDash} {CIRC}"
				stroke-dashoffset="0"
				style="transition: stroke-dasharray 0.15s ease, stroke 0.3s ease"
			/>
		</svg>

		<button
			class="work-btn {comboClicks >= 10 ? 'combo-max' : comboClicks >= 5 ? 'combo-mid' : ''}"
			style="transform: scale({$scale})"
			onclick={handleClick}
		>
			{workLabel}
		</button>
	</div>

	<p class="click-hint">
		+${formatNumber(game.state.clickPower * comboMultiplier)} per click
		{#if comboClicks > 1}<span class="combo-count"> ({comboClicks} combo)</span>{/if}
	</p>
</div>

{#each floats as f (f.id)}
	<div
		class="click-feedback"
		style="left:{f.x}px;top:{f.y}px"
		transition:fly={{ y: -60, duration: 900 }}
	>
		+${f.value}
	</div>
{/each}

<style>
	.combo-label {
		text-align: center;
		font-size: 1rem;
		font-weight: bold;
		color: #f5a623;
		margin-bottom: 6px;
		letter-spacing: 1px;
	}
	.btn-wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.combo-ring {
		position: absolute;
		width: 130px;
		height: 130px;
		pointer-events: none;
		transform: rotate(-90deg);
	}
	.ring-bg {
		fill: none;
		stroke: rgba(255,255,255,0.07);
		stroke-width: 3;
	}
	.ring-fill {
		fill: none;
		stroke-width: 3;
		stroke-linecap: round;
	}
	.work-btn {
		transition: box-shadow 0.15s;
		transform-origin: center;
	}
	.work-btn.combo-mid {
		box-shadow: 0 0 18px rgba(245,166,35,0.5);
	}
	.work-btn.combo-max {
		box-shadow: 0 0 28px rgba(248,113,113,0.7);
		animation: pulse-max 0.6s ease-in-out infinite alternate;
	}
	@keyframes pulse-max {
		from { box-shadow: 0 0 20px rgba(248,113,113,0.5); }
		to   { box-shadow: 0 0 36px rgba(248,113,113,0.9); }
	}
	.click-hint {
		margin-top: 12px;
		color: #666;
		font-size: 0.82rem;
		letter-spacing: 0.2px;
	}
	.combo-count { color: #f5a623; font-weight: 700; }
</style>
