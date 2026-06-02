export type BossId = 'boss_phase1';

export type BossAttack = 'charge' | 'ranged_burst';

export interface BossConfig {
  id: BossId;
  health: number;
  phases: number;
  size: 'large';
  scoreValue: number;
  attacks: BossAttack[];
}
