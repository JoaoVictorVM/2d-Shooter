import { create } from 'zustand';
import { AUDIO } from '@/game/config/constants.ts';
import type { UiState } from '@/types/index.ts';

interface UiActions {
  setPaused: (isPaused: boolean) => void;
  togglePause: () => void;
  setMasterVolume: (volume: number) => void;
  reset: () => void;
}

export type UiStore = UiState & UiActions;

const initialState: UiState = {
  isPaused: false,
  masterVolume: AUDIO.MASTER_VOLUME,
};

const clampVolume = (volume: number): number => Math.min(1, Math.max(0, volume));

export const useUiStore = create<UiStore>((set) => ({
  ...initialState,
  setPaused: (isPaused) => set({ isPaused }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  setMasterVolume: (volume) => set({ masterVolume: clampVolume(volume) }),
  reset: () => set({ ...initialState }),
}));
