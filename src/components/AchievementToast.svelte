<script lang="ts">
	import { game } from '$lib/store.svelte';
</script>

<div class="achievement-toast {game.toastVisible ? 'show' : ''}">
	{#if game.currentToast}
	<div class="achievement-toast-icon">{game.currentToast.icon}</div>
	<div class="achievement-toast-text">
		<div class="achievement-toast-label">ACHIEVEMENT UNLOCKED</div>
		<div class="achievement-toast-name">{game.currentToast.name}</div>
		<div class="achievement-toast-desc">{game.currentToast.desc}</div>
	</div>
	{/if}
</div>
