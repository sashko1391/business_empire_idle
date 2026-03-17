<script lang="ts">
	import { game } from '$lib/store.svelte';
	import { DAILY_EVENTS, CONTRACT_TEMPLATES } from '$lib/data/daily';

	function seededRandom(seed: number) { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); }

	const event = $derived(game.getDailyEvent());

	function getContract(i: number) {
		if (!game.state.daily) return null;
		const idx = Math.floor(seededRandom(game.state.daily.day * 100 + i) * CONTRACT_TEMPLATES.length);
		return CONTRACT_TEMPLATES[idx];
	}

	let timer = $state('');
	function updateTimer() {
		const now = new Date();
		const msTomorrow = new Date(now);
		msTomorrow.setUTCHours(24, 0, 0, 0);
		const diff = Math.floor((msTomorrow.getTime() - now.getTime()) / 1000);
		const h = Math.floor(diff / 3600);
		const m = Math.floor((diff % 3600) / 60);
		timer = `Resets in ${h}h ${m}m`;
	}

	$effect(() => {
		updateTimer();
		const t = setInterval(updateTimer, 60000);
		return () => clearInterval(t);
	});
</script>

{#if game.state.daily}
<div class="daily-panel">
	<h3>📅 Daily</h3>
	{#if event}
	<div class="daily-event-badge">{event.icon} {event.name} — {event.desc}</div>
	{/if}
	<ul class="contract-list">
		{#each [0,1,2] as i}
			{@const c = getContract(i)}
			{@const done = game.state.daily?.contracts[i]}
			{#if c}
			<li class="contract-item {done ? 'done' : ''}">
				<span class="contract-check">{done ? '✅' : '☐'}</span>
				{c.icon} {c.name}
			</li>
			{/if}
		{/each}
	</ul>
	<div class="daily-timer">{timer}</div>
</div>
{/if}
