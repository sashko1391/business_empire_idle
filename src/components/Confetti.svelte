<script lang="ts">
	let canvas: HTMLCanvasElement;
	let active = $state(false);

	interface Particle {
		x: number; y: number;
		vx: number; vy: number;
		color: string;
		size: number;
		rotation: number;
		rotSpeed: number;
		life: number;
	}

	const COLORS = ['#f5a623','#a855f7','#4ade80','#60a5fa','#f87171','#fbbf24','#e879f9'];

	export function burst(x?: number, y?: number) {
		if (!canvas) return;
		active = true;
		const ctx = canvas.getContext('2d')!;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const cx = x ?? window.innerWidth / 2;
		const cy = y ?? window.innerHeight / 3;

		const particles: Particle[] = Array.from({ length: 80 }, () => ({
			x: cx, y: cy,
			vx: (Math.random() - 0.5) * 14,
			vy: (Math.random() - 0.8) * 12,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			size: Math.random() * 8 + 4,
			rotation: Math.random() * Math.PI * 2,
			rotSpeed: (Math.random() - 0.5) * 0.3,
			life: 1
		}));

		let frame: number;
		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			let alive = false;
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.35; // gravity
				p.vx *= 0.99;
				p.rotation += p.rotSpeed;
				p.life -= 0.012;
				if (p.life <= 0) continue;
				alive = true;
				ctx.save();
				ctx.globalAlpha = Math.max(0, p.life);
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rotation);
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
				ctx.restore();
			}
			if (alive) { frame = requestAnimationFrame(animate); }
			else { ctx.clearRect(0, 0, canvas.width, canvas.height); active = false; }
		}
		animate();
		return () => cancelAnimationFrame(frame);
	}
</script>

<canvas
	bind:this={canvas}
	style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9000;display:{active ? 'block' : 'none'}"
></canvas>
