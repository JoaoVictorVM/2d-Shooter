import { describe, it, expect } from 'vitest';
import { GAME, PLAYER_MOVEMENT, DASH, PLAYER_STATS, POOL, AUDIO, BOSS } from './constants.ts';

describe('game constants', () => {
  it('matches the viewport defined in the PRD', () => {
    expect(GAME.WIDTH).toBe(1280);
    expect(GAME.HEIGHT).toBe(720);
  });

  it('keeps jump force negative so the impulse points upward', () => {
    expect(PLAYER_MOVEMENT.JUMP_FORCE).toBeLessThan(0);
  });

  it('keeps dash invincibility no longer than the dash itself', () => {
    expect(DASH.INVINCIBLE_DURATION_MS).toBeLessThanOrEqual(DASH.DURATION_MS);
  });

  it('defines player stats with shield smaller than health', () => {
    expect(PLAYER_STATS.MAX_SHIELD).toBeLessThan(PLAYER_STATS.MAX_HEALTH);
    expect(PLAYER_STATS.SHIELD_REGEN_RATE).toBeGreaterThan(0);
  });

  it('caps active particles per the performance budget', () => {
    expect(POOL.PARTICLES_MAX).toBe(50);
  });

  it('produces an audio pitch range centered around 1.0', () => {
    const minRate = AUDIO.PITCH_MIN;
    const maxRate = AUDIO.PITCH_MIN + AUDIO.PITCH_VARIANCE;
    expect(minRate).toBeLessThan(1);
    expect(maxRate).toBeGreaterThan(1);
  });

  it('switches boss phase at half health', () => {
    expect(BOSS.PHASE_TWO_HEALTH_THRESHOLD).toBe(0.5);
  });
});
