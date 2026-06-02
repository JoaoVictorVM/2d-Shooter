import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { WeaponSelectScreen } from './WeaponSelectScreen.tsx';
import { useGameStore } from '@/store/index.ts';

describe('WeaponSelectScreen', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'weaponSelect',
      currentPhase: 1,
      selectedWeapon: 'pistol',
      score: 0,
      currentWave: 0,
    });
  });

  afterEach(cleanup);

  it('lists the available weapons', () => {
    render(<WeaponSelectScreen />);
    expect(screen.getByText(/pistola m9/i)).toBeInTheDocument();
  });

  it('marks the currently selected weapon as active', () => {
    render(<WeaponSelectScreen />);
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('selecting a weapon stores it and returns to the menu', () => {
    render(<WeaponSelectScreen />);
    fireEvent.click(screen.getByRole('button', { name: /pistola m9/i }));
    const state = useGameStore.getState();
    expect(state.selectedWeapon).toBe('pistol');
    expect(state.currentScreen).toBe('menu');
  });

  it('BACK returns to the menu', () => {
    render(<WeaponSelectScreen />);
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }));
    expect(useGameStore.getState().currentScreen).toBe('menu');
  });
});
