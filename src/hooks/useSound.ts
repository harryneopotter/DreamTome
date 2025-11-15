import { useCallback, useEffect, useMemo, useState } from 'react';

const SOUND_CUES = [
  'pageTurn',
  'sealPop',
  'flipBack',
  'hoverGlow',
  'bookOpen',
  'pageRustle',
  'ambientCandle',
] as const;

type SoundCue = (typeof SOUND_CUES)[number];

interface CueDefinition {
  volume: number;
  loop?: boolean;
  build: (context: AudioContext) => AudioBuffer;
}

interface LoopHandle {
  source: AudioBufferSourceNode;
  gain: GainNode;
}

const LOOPING_CUE = new Set<SoundCue>(['ambientCandle']);

const cueDefinitions: Record<SoundCue, CueDefinition> = {
  pageTurn: {
    volume: 0.5,
    build: (ctx) => createRustleBuffer(ctx, { duration: 0.55, seed: 101, shimmer: 0.2, brightness: 0.65 }),
  },
  sealPop: {
    volume: 0.6,
    build: (ctx) => createPopBuffer(ctx, { duration: 0.32, seed: 203, baseFreq: 540 }),
  },
  flipBack: {
    volume: 0.55,
    build: (ctx) => createRustleBuffer(ctx, { duration: 0.58, seed: 305, shimmer: 0.28, sweepDown: true }),
  },
  hoverGlow: {
    volume: 0.4,
    build: (ctx) => createGlowBuffer(ctx, { duration: 0.45, seed: 407 }),
  },
  bookOpen: {
    volume: 0.65,
    build: (ctx) => createBookOpenBuffer(ctx),
  },
  pageRustle: {
    volume: 0.48,
    build: (ctx) => createRustleBuffer(ctx, { duration: 0.7, seed: 509, shimmer: 0.34, brightness: 0.58 }),
  },
  ambientCandle: {
    volume: 0.28,
    loop: true,
    build: (ctx) => createAmbientCandleBuffer(ctx),
  },
};

let sharedContext: AudioContext | null = null;
const bufferCache = new Map<SoundCue, AudioBuffer>();
const loopingSources = new Map<SoundCue, LoopHandle>();

function getAudioContextConstructor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

function ensureContext(): AudioContext | null {
  const Ctor = getAudioContextConstructor();
  if (!Ctor) {
    return null;
  }

  if (!sharedContext) {
    sharedContext = new Ctor();
  }

  return sharedContext;
}

function obtainBuffer(cue: SoundCue, context: AudioContext): AudioBuffer {
  const existing = bufferCache.get(cue);
  if (existing) {
    return existing;
  }

  const definition = cueDefinitions[cue];
  const buffer = definition.build(context);
  bufferCache.set(cue, buffer);
  return buffer;
}

export function useSound() {
  const [isReady, setIsReady] = useState<boolean>(() => Boolean(getAudioContextConstructor()));

  useEffect(() => {
    const context = ensureContext();
    if (!context) {
      setIsReady(false);
      return;
    }

    const update = () => {
      setIsReady(context.state === 'running' || context.state === 'suspended');
    };

    update();
    context.addEventListener('statechange', update);
    return () => {
      context.removeEventListener('statechange', update);
    };
  }, []);

  const play = useCallback((cue: SoundCue) => {
    const context = ensureContext();
    if (!context) {
      return;
    }

    const definition = cueDefinitions[cue];
    if (!definition) {
      return;
    }

    const startPlayback = () => {
      const buffer = obtainBuffer(cue, context);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = Boolean(definition.loop);

      const gain = context.createGain();
      gain.gain.value = definition.volume;

      source.connect(gain);
      gain.connect(context.destination);

      if (definition.loop) {
        const previous = loopingSources.get(cue);
        if (previous) {
          try {
            previous.source.stop();
          } catch (error) {
            console.warn('[useSound] Unable to stop previous loop', error);
          }
          previous.source.disconnect();
          previous.gain.disconnect();
        }

        loopingSources.set(cue, { source, gain });
        source.start();
        return;
      }

      source.start();
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
      };
    };

    if (context.state === 'suspended') {
      context
        .resume()
        .then(startPlayback)
        .catch(() => startPlayback());
    } else {
      startPlayback();
    }
  }, []);

  const stop = useCallback((cue: SoundCue) => {
    if (!LOOPING_CUE.has(cue)) {
      return;
    }

    const handle = loopingSources.get(cue);
    if (!handle) {
      return;
    }

    try {
      handle.source.stop();
    } catch (error) {
      console.warn('[useSound] Unable to stop loop', error);
    }

    handle.source.disconnect();
    handle.gain.disconnect();
    loopingSources.delete(cue);
  }, []);

  return useMemo(() => ({ play, stop, isReady }), [play, stop, isReady]);
}

export type { SoundCue };

interface RustleOptions {
  duration: number;
  seed: number;
  shimmer: number;
  brightness?: number;
  sweepDown?: boolean;
}

function createRustleBuffer(context: AudioContext, options: RustleOptions): AudioBuffer {
  const { duration, seed, shimmer, brightness = 0.6, sweepDown = false } = options;
  return createBuffer(context, duration, seed, ({ t, progress, rand }) => {
    const envelope = Math.pow(Math.sin(Math.PI * progress), 1.12);
    const baseNoise = rand() * brightness * (1 - progress * 0.35);
    const flutter = Math.sin(progress * Math.PI * 12) * shimmer;
    const sweepFrequency = sweepDown ? 200 - 120 * progress : 160 + 90 * (1 - progress);
    const sweep = Math.sin(2 * Math.PI * sweepFrequency * t) * 0.22;
    return (baseNoise + flutter + sweep) * envelope;
  });
}

interface PopOptions {
  duration: number;
  seed: number;
  baseFreq: number;
}

function createPopBuffer(context: AudioContext, options: PopOptions): AudioBuffer {
  const { duration, seed, baseFreq } = options;
  return createBuffer(context, duration, seed, ({ t, progress, rand }) => {
    const envelope = Math.pow(Math.sin(Math.PI * progress), 0.9);
    const freq = baseFreq + 320 * Math.pow(1 - progress, 1.2);
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.6;
    const harmonic = Math.sin(2 * Math.PI * freq * 2 * t) * 0.22;
    const snap = rand() * 0.28 * (1 - progress * 0.7);
    return (tone + harmonic + snap) * envelope;
  });
}

interface GlowOptions {
  duration: number;
  seed: number;
}

function createGlowBuffer(context: AudioContext, options: GlowOptions): AudioBuffer {
  const { duration, seed } = options;
  return createBuffer(context, duration, seed, ({ t, progress }) => {
    const envelope = Math.pow(Math.sin(Math.PI * progress), 1.5);
    const base = 320 + Math.sin(progress * Math.PI * 4) * 60;
    const tone = Math.sin(2 * Math.PI * base * t) * 0.45;
    const overtone = Math.sin(2 * Math.PI * base * 2.1 * t + Math.sin(progress * Math.PI * 2) * 0.4) * 0.18;
    return (tone + overtone) * envelope;
  });
}

function createBookOpenBuffer(context: AudioContext): AudioBuffer {
  return createBuffer(context, 0.82, 611, ({ t, progress, rand }) => {
    const envelope = Math.pow(Math.sin(Math.PI * progress), 0.95);
    const sweep = Math.sin(2 * Math.PI * (90 + 35 * Math.pow(1 - progress, 1.4)) * t) * 0.38;
    const thud = Math.sin(2 * Math.PI * 42 * t) * (1 - progress) * 0.22;
    const rustle = rand() * 0.42 * (1 - progress * 0.5);
    return (sweep + thud + rustle) * envelope;
  });
}

function createAmbientCandleBuffer(context: AudioContext): AudioBuffer {
  return createBuffer(context, 3.6, 713, ({ t, progress }) => {
    const slowWave = Math.sin(progress * Math.PI * 2) * 0.07;
    const flicker = Math.sin(progress * Math.PI * 8 + Math.sin(progress * Math.PI * 2) * 0.8) * 0.05;
    const ember = Math.sin(2 * Math.PI * 38 * t) * 0.04;
    const shimmer = Math.sin(2 * Math.PI * 126 * t + Math.sin(progress * Math.PI * 6) * 0.6) * 0.02;
    return slowWave + flicker + ember + shimmer;
  });
}

interface SampleArgs {
  t: number;
  progress: number;
  rand: () => number;
}

type SampleGenerator = (args: SampleArgs) => number;

function createBuffer(context: AudioContext, duration: number, seed: number, sampler: SampleGenerator): AudioBuffer {
  const sampleRate = context.sampleRate;
  const totalSamples = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = context.createBuffer(1, totalSamples, sampleRate);
  const channel = buffer.getChannelData(0);
  const random = seededRandom(seed);

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    const progress = totalSamples > 1 ? i / (totalSamples - 1) : 0;
    const value = sampler({
      t,
      progress,
      rand: random,
    });
    channel[i] = clamp(value, -1, 1);
  }

  return buffer;
}

function seededRandom(seed: number): () => number {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646 * 2 - 1;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
