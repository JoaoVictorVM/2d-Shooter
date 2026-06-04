import { describe, it, expect, beforeEach } from 'vitest';
import { WeaponSystem } from './WeaponSystem.ts';
import { useWeaponStore } from '@/store/index.ts';
import type { WeaponConfig } from '@/types/index.ts';

const config: WeaponConfig = {
  id: 'pistol',
  displayName: 'Pistola M9',
  fireMode: 'semi',
  fireRate: 400,
  magazineSize: 12,
  totalAmmo: 96,
  reloadTime: 1500,
  projectile: {
    damage: 25,
    speed: 800,
    maxRange: 600,
    piercing: false,
    knockbackForce: 80,
    spriteKey: 'projectile',
  },
  recoilAngle: 8,
  sfx: { shoot: 's', reload: 'r', empty: 'e' },
};

describe('WeaponSystem', () => {
  beforeEach(() => {
    useWeaponStore.setState({
      magazineAmmo: 0,
      reserveAmmo: 0,
      isReloading: false,
      reloadProgress: 0,
    });
  });

  it('starts loaded with the magazine and reserve from the config', () => {
    const system = new WeaponSystem(config);
    expect(system.magazineAmmoCount).toBe(12);
    expect(system.reserveAmmoCount).toBe(96);
  });

  it('syncs the initial ammo to the weapon store', () => {
    new WeaponSystem(config);
    const state = useWeaponStore.getState();
    expect(state.magazineAmmo).toBe(12);
    expect(state.reserveAmmo).toBe(96);
  });

  it('can fire when loaded and the fire rate has elapsed', () => {
    const system = new WeaponSystem(config);
    expect(system.canFire(1000)).toBe(true);
  });

  it('consumes one round per shot and updates the store', () => {
    const system = new WeaponSystem(config);
    system.registerShot(1000);
    expect(system.magazineAmmoCount).toBe(11);
    expect(useWeaponStore.getState().magazineAmmo).toBe(11);
  });

  it('enforces the fire rate between shots', () => {
    const system = new WeaponSystem(config);
    system.registerShot(1000);
    expect(system.canFire(1000 + config.fireRate - 1)).toBe(false);
    expect(system.canFire(1000 + config.fireRate)).toBe(true);
  });

  it('cannot fire with an empty magazine', () => {
    const system = new WeaponSystem(config);
    let now = 0;
    for (let i = 0; i < config.magazineSize; i++) {
      expect(system.canFire(now)).toBe(true);
      system.registerShot(now);
      now += config.fireRate;
    }
    expect(system.magazineAmmoCount).toBe(0);
    expect(system.canFire(now)).toBe(false);
  });
});
