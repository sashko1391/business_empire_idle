<script lang="ts">
	import { game } from '$lib/store.svelte';

	let timerPct = $state(100);

	$effect(() => {
		if (!game.investActive) { timerPct = 100; return; }
		timerPct = 100;
		const start = Date.now();
		const duration = 12000;
		const t = setInterval(() => {
			const elapsed = Date.now() - start;
			timerPct = Math.max(0, 100 - (elapsed / duration) * 100);
			if (timerPct <= 0) { clearInterval(t); game.resolveInvestment(false); }
		}, 100);
		return () => clearInterval(t);
	});
</script>

<div class="invest-modal {game.investActive ? 'show' : ''}">
	{#if game.investOffer}
	<div class="invest-content">
		<div class="invest-icon">{game.investOffer.icon}</div>
		<div class="invest-title">{game.investOffer.name}</div>
		<div class="invest-desc">{game.investOffer.desc} ({game.investOffer.risk})</div>
		<div class="invest-timer-bar">
			<div class="invest-timer-fill" style="width:{timerPct}%"></div>
		</div>
		<div class="invest-actions">
			<button class="invest-btn invest-btn-yes" onclick={() => game.resolveInvestment(true)}>Invest!</button>
			<button class="invest-btn invest-btn-no" onclick={() => game.resolveInvestment(false)}>Skip</button>
		</div>
	</div>
	{/if}
</div>
