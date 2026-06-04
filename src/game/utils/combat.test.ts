import { describe, it, expect } from 'vitest';
import { applyDamage, isDefeated } from './combat.ts';

describe('applyDamage', () => {
  it('subtracts the damage from current health', () => {
    expect(applyDamage(60, 25)).toBe(35);
  });

  it('never goes below zero', () => {
    expect(applyDamage(20, 25)).toBe(0);
  });

  it('leaves health unchanged for zero damage', () => {
    expect(applyDamage(60, 0)).toBe(60);
  });
});

describe('isDefeated', () => {
  it('is true at zero health', () => {
    expect(isDefeated(0)).toBe(true);
  });

  it('is true below zero', () => {
    expect(isDefeated(-5)).toBe(true);
  });

  it('is false with remaining health', () => {
    expect(isDefeated(1)).toBe(false);
  });
});
