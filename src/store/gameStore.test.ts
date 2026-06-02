import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore.ts';

const resetStore = () =>
  useGameStore.setState({
    currentScreen: 'menu',
    currentPhase: 1,
    selectedWeapon: 'pistol',
    score: 0,
    currentWave: 0,
  });

describe('gameStore', () => {
  beforeEach(resetStore);

  it('starts on the menu at phase 1 with the pistol selected', () => {
    const state = useGameStore.getState();
    expect(state.currentScreen).toBe('menu');
    expect(state.currentPhase).toBe(1);
    expect(state.selectedWeapon).toBe('pistol');
    expect(state.score).toBe(0);
  });

  it('navigates between screens', () => {
    useGameStore.getState().setScreen('game');
    expect(useGameStore.getState().currentScreen).toBe('game');
  });

  it('accumulates score with addScore', () => {
    useGameStore.getState().addScore(10);
    useGameStore.getState().addScore(15);
    expect(useGameStore.getState().score).toBe(25);
  });

  it('advances phase with incrementPhase', () => {
    useGameStore.getState().incrementPhase();
    expect(useGameStore.getState().currentPhase).toBe(2);
  });

  it('reset restores defaults but keeps the selected weapon', () => {
    const store = useGameStore.getState();
    store.setSelectedWeapon('pistol');
    store.addScore(100);
    store.setCurrentWave(4);
    store.setScreen('gameOver');

    store.reset();

    const state = useGameStore.getState();
    expect(state.score).toBe(0);
    expect(state.currentWave).toBe(0);
    expect(state.currentScreen).toBe('menu');
    expect(state.selectedWeapon).toBe('pistol');
  });
});
