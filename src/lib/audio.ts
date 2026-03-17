let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) audioCtx = new AudioContext();
	return audioCtx;
}

function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
	const ctx = getAudioCtx();
	if (!ctx) return;
	try {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.type = type;
		osc.frequency.setValueAtTime(freq, ctx.currentTime);
		gain.gain.setValueAtTime(vol, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + duration);
	} catch {}
}

export function playClickSound() {
	playTone(800, 'sine', 0.05, 0.05);
}

export function playPurchaseSound() {
	playTone(523, 'sine', 0.1, 0.08);
	setTimeout(() => playTone(659, 'sine', 0.1, 0.08), 80);
	setTimeout(() => playTone(784, 'sine', 0.15, 0.08), 160);
}

export function playMilestoneSound() {
	[523, 659, 784, 1047].forEach((f, i) => {
		setTimeout(() => playTone(f, 'sine', 0.2, 0.1), i * 100);
	});
}

export function playPrestigeSound() {
	[261, 329, 392, 523, 659].forEach((f, i) => {
		setTimeout(() => playTone(f, 'triangle', 0.3, 0.12), i * 120);
	});
}
