import type { EnemyState } from '@/types/index.ts';

export interface ChaseIntent {
  state: EnemyState;
  moveDirection: number;
}

/**
 * Decide o estado e a direção de um inimigo melee (RF04 — chase):
 * - fora do alcance de detecção → idle (parado)
 * - dentro do alcance de ataque (contato) → attacking (parado)
 * - entre os dois → chasing, movendo na direção horizontal do alvo
 */
export function decideChaseIntent(
  dx: number,
  distance: number,
  detectionRange: number,
  attackRange: number
): ChaseIntent {
  if (distance > detectionRange) {
    return { state: 'idle', moveDirection: 0 };
  }
  if (distance <= attackRange) {
    return { state: 'attacking', moveDirection: 0 };
  }
  return { state: 'chasing', moveDirection: Math.sign(dx) };
}

export interface RangedIntent {
  state: EnemyState;
  moveDirection: number;
  wantsToShoot: boolean;
}

/**
 * Decide estado/movimento/tiro de um inimigo ranged (RF04):
 * - fora do alcance de detecção → idle
 * - mais longe que preferredRange (+tolerância) → aproxima (sem atirar)
 * - mais perto que preferredRange (−tolerância) → recua, atirando
 * - dentro da banda em torno de preferredRange → para e atira
 */
export function decideRangedIntent(
  dx: number,
  distance: number,
  detectionRange: number,
  preferredRange: number,
  tolerance: number
): RangedIntent {
  if (distance > detectionRange) {
    return { state: 'idle', moveDirection: 0, wantsToShoot: false };
  }
  const toTarget = Math.sign(dx);
  if (distance > preferredRange + tolerance) {
    return { state: 'chasing', moveDirection: toTarget, wantsToShoot: false };
  }
  if (distance < preferredRange - tolerance) {
    return { state: 'attacking', moveDirection: -toTarget, wantsToShoot: true };
  }
  return { state: 'attacking', moveDirection: 0, wantsToShoot: true };
}
