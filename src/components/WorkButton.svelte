<script lang="ts">
	import { spring } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import type { FloatingNumber } from '$lib/types';

	// Spring animation for button scale
	const scale = spring(1, { stiffness: 0.4, damping: 0.3 });

	// Click combo
	let comboClicks = $state(0);
	let comboTimer: ReturnType<typeof setTimeout> | null = null;
	let comboMultiplier = $derived(
		comboClicks >= 10 ? 5 :
		comboClicks >= 5  ? 2 : 1
	);
	let comboLabel = $derived(
		comboClicks >= 10 ? '🔥 COMBO ×5!' :
		comboClicks >= 5  ? '⚡ COMBO ×2!' : ''
	);

	// Floating numbers
	let floats = $state<FloatingNumber[]>([]);
	let nextId = 0;

	function handleClick(e: MouseEvent) {
		// Button spring press
		scale.set(0.88).then(() => scale.set(1));

		// Combo tracking
		comboClicks++;
		if (comboTimer) clearTimeout(comboTimer);
		comboTimer = setTimeout(() => { comboClicks = 0; }, 3000);

		// Earn money (with combo multiplier)
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

	<button
		class="work-btn"
		style="transform: scale({$scale})"
		onclick={handleClick}
	>
		💪 WORK
	</button>

	<p style="margin-top:10px;color:#888;font-size:0.9rem">
		+${formatNumber(game.state.clickPower * comboMultiplier)} per click
		{#if comboClicks > 1}<span style="color:#f5a623"> ({comboClicks} combo)</span>{/if}
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
	.work-btn {
		transition: box-shadow 0.1s;
		transform-origin: center;
	}
</style>
