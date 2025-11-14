import { useEffect, useMemo, useRef, useState } from 'react';

interface ProgressiveTextProps {
  text: string;
  isActive?: boolean;
  className?: string;
  chunkSize?: [number, number];
}

const DEFAULT_RANGE: [number, number] = [3, 6];

export default function ProgressiveText({
  text,
  isActive = true,
  className = '',
  chunkSize = DEFAULT_RANGE,
}: ProgressiveTextProps) {
  const chunks = useMemo(() => createChunks(text, chunkSize), [text, chunkSize]);
  const [visibleChunks, setVisibleChunks] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setVisibleChunks(0);
    if (!isActive || chunks.length === 0) return;

    const durations = buildDurations(text, chunks.length);
    const thresholds: number[] = [];
    durations.reduce((acc, duration) => {
      const next = acc + duration;
      thresholds.push(next);
      return next;
    }, 0);

    const startedAt = performance.now();
    let nextIndex = 0;

    const step = (now: number) => {
      const elapsed = now - startedAt;
      while (nextIndex < thresholds.length && elapsed >= thresholds[nextIndex]) {
        nextIndex += 1;
      }

      setVisibleChunks((current) => (nextIndex > current ? nextIndex : current));

      if (nextIndex < thresholds.length) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [chunks, isActive, text]);

  return (
    <div className={`progressive-text ${className}`.trim()}>
      {chunks.slice(0, visibleChunks).map((chunk, index) => (
        <span key={`${chunk}-${index}`} className="progressive-chunk">
          {chunk}
        </span>
      ))}
    </div>
  );
}

function createChunks(text: string, [minWords, maxWords]: [number, number]) {
  const sanitized = text.replace(/\s+/g, ' ').trim();
  if (!sanitized) {
    return [];
  }

  const words = sanitized.split(' ');
  const chunks: string[] = [];
  let index = 0;
  const random = createSeededRandom(`${text}:${minWords}-${maxWords}`);

  while (index < words.length) {
    const remaining = words.length - index;
    const chunkSize = Math.min(
      remaining,
      Math.max(
        minWords,
        Math.min(maxWords, minWords + Math.floor(random() * (maxWords - minWords + 1)))
      )
    );
    const slice = words.slice(index, index + chunkSize).join(' ');
    chunks.push(slice);
    index += chunkSize;
  }

  return chunks;
}

function buildDurations(seed: string, count: number) {
  const baseMin = 150;
  const baseMax = 300;
  const jitter = 40;
  const random = createSeededRandom(`${seed}:durations:${count}`);

  return Array.from({ length: count }, () => {
    const base = baseMin + random() * (baseMax - baseMin);
    const offset = (random() * 2 - 1) * jitter;
    return Math.max(120, base + offset);
  });
}

function createSeededRandom(seed: string) {
  let state = hashString(seed);
  if (state === 0) {
    state = 0x6d2b79f5;
  }

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return hash >>> 0;
}
