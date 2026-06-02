import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { VictoryScreen } from './VictoryScreen.tsx';
import { useGameStore } from '@/store/index.ts';

describe('VictoryScreen', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'victory',
      currentPhase: 1,
      selectedWeapon: 'pistol',
      score: 500,
      currentWave: 6,
    });
  });

  afterEach(cleanup);

  it('shows the cleared phase and score', () => {
    render(<VictoryScreen />);
    expect(screen.getByText(/phase 1 cleared/i)).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('NEXT PHASE advances the phase, resets the wave and returns to the game keeping score', () => {
    render(<VictoryScreen />);
    fireEvent.click(screen.getByRole('button', { name: /next phase/i }));
    const state = useGameStore.getState();
    expect(state.currentPhase).toBe(2);
    expect(state.currentWave).toBe(0);
    expect(state.currentScreen).toBe('game');
    expect(state.score).toBe(500);
  });
});
