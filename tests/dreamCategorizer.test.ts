import { test } from 'node:test';
import assert from 'node:assert';
import { categorizeDream } from '../src/utils/dreamCategorizer.ts';

test('dreamCategorizer: Serene when serene keywords dominate', () => {
  const result = categorizeDream('I felt so peace and calm in a beautiful garden.');
  assert.strictEqual(result, 'Serene');
});

test('dreamCategorizer: Nightmare when nightmare keywords dominate', () => {
  const result = categorizeDream('A monster was chasing me in the dark, I felt such terror.');
  assert.strictEqual(result, 'Nightmare');
});

test('dreamCategorizer: Epic when epic keywords dominate', () => {
  const result = categorizeDream('An epic adventure where a hero fights a dragon with a magic sword.');
  assert.strictEqual(result, 'Epic');
});

test('dreamCategorizer: Strange when no keywords match', () => {
  const result = categorizeDream('I was eating a sandwich while sitting on a giant purple floating toaster.');
  assert.strictEqual(result, 'Strange');
});

test('dreamCategorizer: empty content as Strange', () => {
  const result = categorizeDream('');
  assert.strictEqual(result, 'Strange');
});

test('dreamCategorizer priority: Nightmare over others', () => {
  // 3 nightmare: fear, nightmare, dark
  // 2 serene: peace, calm
  // 1 epic: adventure
  const result = categorizeDream('It was a nightmare adventure in the dark fear, despite some peace and calm.');
  assert.strictEqual(result, 'Nightmare');
});

test('dreamCategorizer priority: Epic over Serene', () => {
  // 3 epic: battle, adventure, hero
  // 2 serene: peace, love
  // 1 nightmare: fear
  const result = categorizeDream('A battle adventure hero, filled with peace and love, but a bit of fear.');
  assert.strictEqual(result, 'Epic');
});

test('dreamCategorizer priority: Serene fallback', () => {
  // 1 serene: peace
  // 1 nightmare: fear
  // 1 epic: adventure
  const result = categorizeDream('peace fear adventure');
  assert.strictEqual(result, 'Serene');
});
