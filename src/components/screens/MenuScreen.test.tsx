import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MenuScreen } from './MenuScreen.tsx';
import { useGameStore } from '@/store/index.ts';

describe('MenuScreen', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'menu',
      currentPhase: 1,
      selectedWeapon: 'pistol',
      score: 0,
      currentWave: 0,
    });
  });

  afterEach(cleanup);

  it('renders the title and both action buttons', () => {
    render(<MenuScreen />);
    expect(screen.getByRole('heading', { name: /2d shooter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /choose weapon/i })).toBeInTheDocument();
  });

  it('shows the currently selected weapon', () => {
    render(<MenuScreen />);
    expect(screen.getByText(/weapon: pistol/i)).toBeInTheDocument();
  });

  it('PLAY navigates to the game screen', () => {
    render(<MenuScreen />);
    fireEvent.click(screen.getByRole('button', { name: /^play$/i }));
    expect(useGameStore.getState().currentScreen).toBe('game');
  });

  it('CHOOSE WEAPON navigates to the weapon select screen', () => {
    render(<MenuScreen />);
    fireEvent.click(screen.getByRole('button', { name: /choose weapon/i }));
    expect(useGameStore.getState().currentScreen).toBe('weaponSelect');
  });
});
