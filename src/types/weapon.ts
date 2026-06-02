export type WeaponId = 'pistol';

export type FireMode = 'semi' | 'auto';

export interface ProjectileConfig {
  damage: number;
  speed: number;
  maxRange: number;
  piercing: boolean;
  knockbackForce: number;
  spriteKey: string;
}

export interface WeaponSfx {
  shoot: string;
  reload: string;
  empty: string;
}

export interface WeaponConfig {
  id: WeaponId;
  displayName: string;
  fireMode: FireMode;
  fireRate: number;
  magazineSize: number;
  totalAmmo: number;
  reloadTime: number;
  projectile: ProjectileConfig;
  recoilAngle: number;
  sfx: WeaponSfx;
}

export interface WeaponRuntimeState {
  magazineAmmo: number;
  reserveAmmo: number;
  isReloading: boolean;
  reloadProgress: number;
}
