import { describe, it, expect } from 'vitest';
import { WEAPONS, WEAPON_LIST, DEFAULT_WEAPON_ID } from './weapons.ts';

describe('weapon catalog', () => {
  it('defines the pistol with the stats from the PRD', () => {
    const pistol = WEAPONS.pistol;
    expect(pistol.displayName).toBe('Pistola M9');
    expect(pistol.fireMode).toBe('semi');
    expect(pistol.fireRate).toBe(400);
    expect(pistol.magazineSize).toBe(12);
    expect(pistol.totalAmmo).toBe(96);
    expect(pistol.reloadTime).toBe(1500);
    expect(pistol.projectile.damage).toBe(25);
    expect(pistol.projectile.speed).toBe(800);
    expect(pistol.projectile.piercing).toBe(false);
    expect(pistol.recoilAngle).toBe(8);
  });

  it('exposes a list mirroring the weapon record', () => {
    expect(WEAPON_LIST).toHaveLength(Object.keys(WEAPONS).length);
    expect(WEAPON_LIST.map((w) => w.id)).toContain('pistol');
  });

  it('defaults to the pistol', () => {
    expect(DEFAULT_WEAPON_ID).toBe('pistol');
    expect(WEAPONS[DEFAULT_WEAPON_ID]).toBeDefined();
  });
});
