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
