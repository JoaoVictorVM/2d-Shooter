/**
 * Premissas:
 * - Catálogo de dados dos inimigos (stats por tipo), análogo a weapons.ts.
 * - runner (melee/chase) e shooter (ranged) definidos juntos para satisfazer o
 *   Record<EnemyId, ...>; o COMPORTAMENTO do shooter entra na etapa 7.3.
 */
import type { EnemyConfig, EnemyId } from '@/types/index.ts';

export const ENEMIES: Record<EnemyId, EnemyConfig> = {
  runner: {
    id: 'runner',
    health: 60,
    speed: 150,
    damage: 15,
    attackRate: 800,
    detectionRange: 400,
    scoreValue: 10,
    behavior: 'chase',
  },
  shooter: {
    id: 'shooter',
    health: 45,
    speed: 80,
    detectionRange: 500,
    preferredRange: 200,
    scoreValue: 15,
    behavior: 'ranged',
    weapon: {
      damage: 10,
      fireRate: 1500,
      projectileSpeed: 350,
    },
  },
};
