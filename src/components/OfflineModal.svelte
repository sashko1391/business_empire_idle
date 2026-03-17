<script lang="ts">
	import { game } from '$lib/store.svelte';
	import { formatNumber } from '$lib/format';
</script>

<div class="offline-modal {game.offlineVisible ? 'show' : ''}">
	<div class="offline-content">
		<h2>Welcome Back!</h2>
		<p>While you were away, your businesses earned:</p>
		<div class="offline-amount">${formatNumber(game.offlineEarnings)}</div>
		<button class="offline-btn" onclick={game.collectOffline}>Collect</button>
	</div>
</div>
