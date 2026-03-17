<script lang="ts">
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
	import type { FloatingNumber } from '$lib/types';

	let floats = $state<FloatingNumber[]>([]);
	let nextId = 0;

	function handleClick(e: MouseEvent) {
		const result = game.doWork(e.clientX, e.clientY);
		const id = nextId++;
		floats = [...floats, { id, ...result }];
		setTimeout(() => { floats = floats.filter(f => f.id !== id); }, 800);
	}
</script>

<div class="work-section">
	<button class="work-btn" onclick={handleClick}>💪 WORK</button>
	<p style="margin-top:10px;color:#888;font-size:0.9rem">
		+${formatNumber(game.state.clickPower)} per click
	</p>
</div>

{#each floats as f (f.id)}
	<div class="click-feedback" style="left:{f.x}px;top:{f.y}px">+${f.value}</div>
{/each}
