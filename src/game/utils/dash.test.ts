import { describe, it, expect } from 'vitest';
import { canStartDash, isWithinWindow } from './dash.ts';

describe('canStartDash', () => {
  const base = { now: 5000, lastDashTime: 0, cooldownMs: 1200, isOnGround: true };

  it('allows a dash on the ground once the cooldown has elapsed', () => {
    expect(canStartDash(base)).toBe(true);
  });

  it('allows the very first dash (no previous dash recorded)', () => {
    expect(canStartDash({ ...base, lastDashTime: -Infinity })).toBe(true);
  });

  it('blocks dashing while airborne', () => {
    expect(canStartDash({ ...base, isOnGround: false })).toBe(false);
  });

  it('blocks dashing during the cooldown', () => {
    expect(canStartDash({ ...base, lastDashTime: base.now - 500 })).toBe(false);
  });

  it('unlocks exactly when the cooldown completes', () => {
    expect(canStartDash({ ...base, lastDashTime: base.now - 1200 })).toBe(true);
  });
});

describe('isWithinWindow', () => {
  it('is true at the start of the window', () => {
    expect(isWithinWindow(1000, 1000, 80)).toBe(true);
  });

  it('is true inside the window', () => {
    expect(isWithinWindow(1050, 1000, 80)).toBe(true);
  });

  it('is false once the window has elapsed', () => {
    expect(isWithinWindow(1080, 1000, 80)).toBe(false);
  });

  it('is false for an unset start time', () => {
    expect(isWithinWindow(1000, -Infinity, 80)).toBe(false);
  });
});
