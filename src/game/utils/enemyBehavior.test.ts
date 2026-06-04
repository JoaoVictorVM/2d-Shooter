import { describe, it, expect } from 'vitest';
import { decideChaseIntent, decideRangedIntent } from './enemyBehavior.ts';

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

describe('decideRangedIntent', () => {
  const RANGED_DETECTION = 500;
  const PREFERRED = 200;
  const TOL = 30;

  it('stays idle out of detection range', () => {
    const intent = decideRangedIntent(600, 600, RANGED_DETECTION, PREFERRED, TOL);
    expect(intent).toEqual({ state: 'idle', moveDirection: 0, wantsToShoot: false });
  });

  it('approaches without shooting when farther than the preferred range', () => {
    const intent = decideRangedIntent(400, 400, RANGED_DETECTION, PREFERRED, TOL);
    expect(intent.state).toBe('chasing');
    expect(intent.moveDirection).toBe(1);
    expect(intent.wantsToShoot).toBe(false);
  });

  it('holds and shoots when inside the preferred band', () => {
    const intent = decideRangedIntent(200, 200, RANGED_DETECTION, PREFERRED, TOL);
    expect(intent.state).toBe('attacking');
    expect(intent.moveDirection).toBe(0);
    expect(intent.wantsToShoot).toBe(true);
  });

  it('retreats away from the player while shooting when too close', () => {
    const intent = decideRangedIntent(100, 100, RANGED_DETECTION, PREFERRED, TOL);
    expect(intent.state).toBe('attacking');
    expect(intent.moveDirection).toBe(-1); // alvo à direita, recua para a esquerda
    expect(intent.wantsToShoot).toBe(true);
  });
});
