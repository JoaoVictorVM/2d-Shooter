import { describe, it, expect, beforeEach } from 'vitest';
import { useWeaponStore } from './weaponStore.ts';

describe('weaponStore', () => {
  beforeEach(() => {
    useWeaponStore.setState({
      magazineAmmo: 0,
      reserveAmmo: 0,
      isReloading: false,
      reloadProgress: 0,
    });
  });

  it('initializes magazine and reserve ammo together', () => {
    useWeaponStore.getState().initAmmo(12, 96);
    const state = useWeaponStore.getState();
    expect(state.magazineAmmo).toBe(12);
    expect(state.reserveAmmo).toBe(96);
  });

  it('updates reload flag and progress independently', () => {
    const store = useWeaponStore.getState();
    store.setReloading(true);
    store.setReloadProgress(0.5);
    const state = useWeaponStore.getState();
    expect(state.isReloading).toBe(true);
    expect(state.reloadProgress).toBe(0.5);
  });

  it('reset clears ammo and reload state', () => {
    const store = useWeaponStore.getState();
    store.initAmmo(12, 96);
    store.setReloading(true);
    store.reset();
    const state = useWeaponStore.getState();
    expect(state.magazineAmmo).toBe(0);
    expect(state.reserveAmmo).toBe(0);
    expect(state.isReloading).toBe(false);
    expect(state.reloadProgress).toBe(0);
  });
});
