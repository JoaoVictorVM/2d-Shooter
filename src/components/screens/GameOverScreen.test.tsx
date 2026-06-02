import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { GameOverScreen } from './GameOverScreen.tsx';
import { useGameStore } from '@/store/index.ts';

describe('GameOverScreen', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'gameOver',
      currentPhase: 1,
      selectedWeapon: 'pistol',
      score: 250,
      currentWave: 4,
    });
  });

  afterEach(cleanup);

  it('shows the final score', () => {
    render(<GameOverScreen />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('restart resets the run and returns to the menu, keeping the weapon', () => {
    render(<GameOverScreen />);
    fireEvent.click(screen.getByRole('button', { name: /restart/i }));
    const state = useGameStore.getState();
    expect(state.currentScreen).toBe('menu');
    expect(state.score).toBe(0);
    expect(state.currentWave).toBe(0);
    expect(state.selectedWeapon).toBe('pistol');
  });
});
