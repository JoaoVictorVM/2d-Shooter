import type { EnemyId } from './enemy.ts';

export interface WaveEnemyGroup {
  type: EnemyId;
  count: number;
  spawnDelay: number;
}

export interface WaveConfig {
  waveNumber: number;
  enemies: WaveEnemyGroup[];
  spawnInterval?: number;
  bossWave?: boolean;
}
