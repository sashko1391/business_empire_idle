<script lang="ts">
	import { base } from '$app/paths';
	import { game } from '$lib/store.svelte';

	const bgUrl = `${base}/images/backgrounds/background_1.png`;
</script>

<div class="game-background {game.bgStage}" style="background-image: url('{bgUrl}')"></div>
<div class="game-background-overlay"></div>
