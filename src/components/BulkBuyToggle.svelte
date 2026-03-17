<script lang="ts">
	import { game } from '$lib/store.svelte';
	const opts: Array<1 | 10 | 100 | 'max'> = [1, 10, 100, 'max'];
</script>

<div class="bulk-toggle">
	{#each opts as q}
	<button
		class="qty-btn {game.bulkBuyQty === q ? 'active' : ''}"
		onclick={() => { game.bulkBuyQty = q; }}
	>
		{q === 'max' ? 'Max' : `×${q}`}
	</button>
	{/each}
</div>

<style>
	.bulk-toggle {
		display: flex;
		gap: 6px;
		margin-bottom: 10px;
	}
	.qty-btn {
		flex: 1;
		padding: 5px 0;
		font-size: 0.8rem;
		font-weight: bold;
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.15);
		border-radius: 6px;
		color: #aaa;
		cursor: pointer;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
	}
	.qty-btn.active {
		background: rgba(245,166,35,0.2);
		border-color: rgba(245,166,35,0.6);
		color: #f5a623;
	}
	.qty-btn:hover:not(.active) {
		background: rgba(255,255,255,0.1);
		color: #ddd;
	}
</style>
