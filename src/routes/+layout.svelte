<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Business Empire Idle</title>
</svelte:head>

{@render children()}
