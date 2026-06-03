import { describe, it, expect } from 'vitest';
import { velocityFromAngle } from './MathUtils.ts';

describe('velocityFromAngle', () => {
  it('points fully along +x at angle 0', () => {
    const v = velocityFromAngle(0, 800);
    expect(v.x).toBeCloseTo(800);
    expect(v.y).toBeCloseTo(0);
  });

  it('points downward at +90 degrees (screen space)', () => {
    const v = velocityFromAngle(Math.PI / 2, 800);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(800);
  });

  it('splits speed evenly on a 45 degree diagonal', () => {
    const v = velocityFromAngle(Math.PI / 4, 100);
    expect(v.x).toBeCloseTo(70.71, 1);
    expect(v.y).toBeCloseTo(70.71, 1);
  });

  it('preserves the speed magnitude', () => {
    const v = velocityFromAngle(1.234, 500);
    expect(Math.hypot(v.x, v.y)).toBeCloseTo(500);
  });
});
