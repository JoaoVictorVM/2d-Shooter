import type { WeaponId } from './weapon.ts';

export type GameScreen = 'menu' | 'weaponSelect' | 'game' | 'gameOver' | 'victory';

export interface GameState {
  currentScreen: GameScreen;
  currentPhase: number;
  selectedWeapon: WeaponId;
  score: number;
  currentWave: number;
}
