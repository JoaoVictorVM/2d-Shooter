import { describe, it, expect } from 'vitest';
import { decideChaseIntent } from './enemyBehavior.ts';

const DETECTION = 400;
const ATTACK = 40;

describe('decideChaseIntent', () => {
  it('stays idle when the target is out of detection range', () => {
    const intent = decideChaseIntent(500, 500, DETECTION, ATTACK);
    expect(intent.state).toBe('idle');
    expect(intent.moveDirection).toBe(0);
  });

  it('attacks (and stops) when within contact range', () => {
    const intent = decideChaseIntent(20, 20, DETECTION, ATTACK);
    expect(intent.state).toBe('attacking');
    expect(intent.moveDirection).toBe(0);
  });

  it('chases to the right when the target is to the right', () => {
    const intent = decideChaseIntent(200, 200, DETECTION, ATTACK);
    expect(intent.state).toBe('chasing');
    expect(intent.moveDirection).toBe(1);
  });

  it('chases to the left when the target is to the left', () => {
    const intent = decideChaseIntent(-200, 200, DETECTION, ATTACK);
    expect(intent.state).toBe('chasing');
    expect(intent.moveDirection).toBe(-1);
  });
});
