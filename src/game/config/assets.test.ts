import { describe, it, expect } from 'vitest';
import { TEXTURE, PLACEHOLDER_TEXTURES, type TextureKey } from './assets.ts';

describe('placeholder texture catalog', () => {
  const keys = Object.values(TEXTURE) as TextureKey[];

  it('defines a spec for every texture key', () => {
    keys.forEach((key) => {
      expect(PLACEHOLDER_TEXTURES[key]).toBeDefined();
    });
  });

  it('uses unique texture keys', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('declares positive dimensions for every placeholder', () => {
    keys.forEach((key) => {
      const spec = PLACEHOLDER_TEXTURES[key];
      expect(spec.width).toBeGreaterThan(0);
      expect(spec.height).toBeGreaterThan(0);
    });
  });

  it('keeps colors within the 0xRRGGBB range', () => {
    keys.forEach((key) => {
      const { color } = PLACEHOLDER_TEXTURES[key];
      expect(color).toBeGreaterThanOrEqual(0x000000);
      expect(color).toBeLessThanOrEqual(0xffffff);
    });
  });
});
