import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { AmmoDisplay } from './AmmoDisplay.tsx';
import { useWeaponStore } from '@/store/index.ts';

describe('AmmoDisplay', () => {
  beforeEach(() => {
    useWeaponStore.setState({
      magazineAmmo: 12,
      reserveAmmo: 96,
      isReloading: false,
      reloadProgress: 0,
    });
  });

  afterEach(cleanup);

  it('shows magazine and reserve ammo', () => {
    render(<AmmoDisplay />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('96')).toBeInTheDocument();
  });

  it('hides the reload bar when not reloading', () => {
    const { container } = render(<AmmoDisplay />);
    expect(container.querySelector('.ammo__reload')).toBeNull();
  });

  it('shows the reload bar with progress while reloading', () => {
    useWeaponStore.setState({ isReloading: true, reloadProgress: 0.5 });
    const { container } = render(<AmmoDisplay />);
    const fill = container.querySelector<HTMLElement>('.ammo__reload-fill');
    expect(fill).not.toBeNull();
    expect(fill?.style.width).toBe('50%');
  });

  it('renders infinite reserve as the infinity symbol', () => {
    useWeaponStore.setState({ reserveAmmo: -1 });
    render(<AmmoDisplay />);
    expect(screen.getByText('∞')).toBeInTheDocument();
  });
});
