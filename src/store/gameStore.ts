import { create } from 'zustand';
import type { GameScreen, GameState, WeaponId } from '@/types/index.ts';

interface GameActions {
  setScreen: (screen: GameScreen) => void;
  setSelectedWeapon: (weapon: WeaponId) => void;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setCurrentWave: (wave: number) => void;
  setPhase: (phase: number) => void;
  incrementPhase: () => void;
  reset: () => void;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  currentScreen: 'menu',
  currentPhase: 1,
  selectedWeapon: 'pistol',
  score: 0,
  currentWave: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setScreen: (screen) => set({ currentScreen: screen }),
  setSelectedWeapon: (weapon) => set({ selectedWeapon: weapon }),
  setScore: (score) => set({ score }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  setCurrentWave: (wave) => set({ currentWave: wave }),
  setPhase: (phase) => set({ currentPhase: phase }),
  incrementPhase: () => set((state) => ({ currentPhase: state.currentPhase + 1 })),
  // reset preserva selectedWeapon: a arma escolhida persiste a partida inteira (RF03).
  reset: () => set((state) => ({ ...initialState, selectedWeapon: state.selectedWeapon })),
}));
