import { describe, it, expect } from 'vitest';
import { computeHorizontalVelocity, type HorizontalMovementConfig } from './movement.ts';

const config: HorizontalMovementConfig = {
  maxSpeed: 300,
  acceleration: 2000,
  friction: 1800,
};

describe('computeHorizontalVelocity', () => {
  it('accelerates gradually toward the input direction', () => {
    const v = computeHorizontalVelocity(0, 1, 0.05, config);
    expect(v).toBeCloseTo(100);
    expect(v).toBeLessThan(config.maxSpeed);
  });

  it('clamps to max speed when accelerating', () => {
    const v = computeHorizontalVelocity(290, 1, 0.05, config);
    expect(v).toBe(config.maxSpeed);
  });

  it('clamps to negative max speed moving left', () => {
    const v = computeHorizontalVelocity(-290, -1, 0.05, config);
    expect(v).toBe(-config.maxSpeed);
  });

  it('decelerates toward zero when there is no input', () => {
    const v = computeHorizontalVelocity(200, 0, 0.05, config);
    expect(v).toBeCloseTo(110);
    expect(Math.abs(v)).toBeLessThan(200);
  });

  it('snaps to zero without overshooting past it', () => {
    const v = computeHorizontalVelocity(20, 0, 0.05, config);
    expect(v).toBe(0);
  });

  it('treats any positive input as full right direction', () => {
    const v = computeHorizontalVelocity(0, 0.2, 0.05, config);
    expect(v).toBeCloseTo(100);
  });
});
