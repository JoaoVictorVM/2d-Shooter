export type EnemyId = 'runner' | 'shooter';

export type EnemyBehavior = 'chase' | 'ranged';

export type EnemyState = 'idle' | 'chasing' | 'attacking' | 'dying';

export interface EnemyWeaponConfig {
  damage: number;
  fireRate: number;
  projectileSpeed: number;
}

export interface EnemyConfig {
  id: EnemyId;
  health: number;
  speed: number;
  damage?: number;
  attackRate?: number;
  detectionRange: number;
  preferredRange?: number;
  scoreValue: number;
  behavior: EnemyBehavior;
  weapon?: EnemyWeaponConfig;
}
