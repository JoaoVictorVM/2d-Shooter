import { describe, it, expect } from 'vitest';
import { computeAim } from './aim.ts';

describe('computeAim', () => {
  it('points straight right with no vertical offset', () => {
    const aim = computeAim(0, 0, 100, 0);
    expect(aim.angle).toBeCloseTo(0);
    expect(aim.facingLeft).toBe(false);
  });

  it('points straight left', () => {
    const aim = computeAim(0, 0, -100, 0);
    expect(Math.abs(aim.angle)).toBeCloseTo(Math.PI);
    expect(aim.facingLeft).toBe(true);
  });

  it('points straight down (positive y is down in screen space)', () => {
    const aim = computeAim(0, 0, 0, 100);
    expect(aim.angle).toBeCloseTo(Math.PI / 2);
  });

  it('points up-right at -45 degrees', () => {
    const aim = computeAim(0, 0, 100, -100);
    expect(aim.angle).toBeCloseTo(-Math.PI / 4);
    expect(aim.facingLeft).toBe(false);
  });

  it('faces left as soon as the target is left of the origin', () => {
    expect(computeAim(200, 100, 199, 100).facingLeft).toBe(true);
    expect(computeAim(200, 100, 201, 100).facingLeft).toBe(false);
  });
});
