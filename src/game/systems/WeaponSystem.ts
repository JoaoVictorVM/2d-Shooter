/**
 * Premissas:
 * - Sistema sem dependência do Phaser: cuida de munição, cadência e recarga.
 *   A cena consulta canFire()/registerShot()/startReload() e faz o spawn.
 * - Sincroniza munição e estado de recarga no weaponStore para o HUD (6.3).
 * - reserveAmmo === -1 representa munição infinita (campo totalAmmo do PRD).
 * - O SOM de carregador vazio depende do AudioSystem (Sprint 11); aqui só
 *   detectamos a condição (isMagazineEmpty) — a cena pluga o SFX depois.
 */
import type { WeaponConfig, ProjectileConfig, FireMode } from '@/types/index.ts';
import { useWeaponStore } from '@/store/index.ts';

const INFINITE_RESERVE = -1;

export class WeaponSystem {
  private readonly config: WeaponConfig;
  private magazineAmmo: number;
  private reserveAmmo: number;
  private lastShotTime = -Infinity;
  private reloading = false;
  private reloadStartTime = 0;

  constructor(config: WeaponConfig) {
    this.config = config;
    this.magazineAmmo = config.magazineSize;
    this.reserveAmmo = config.totalAmmo;
    this.syncAmmo();
  }

  get fireMode(): FireMode {
    return this.config.fireMode;
  }

  get projectile(): ProjectileConfig {
    return this.config.projectile;
  }

  get recoilAngle(): number {
    return this.config.recoilAngle;
  }

  get magazineAmmoCount(): number {
    return this.magazineAmmo;
  }

  get reserveAmmoCount(): number {
    return this.reserveAmmo;
  }

  get isReloading(): boolean {
    return this.reloading;
  }

  get isMagazineEmpty(): boolean {
    return this.magazineAmmo === 0;
  }

  canFire(now: number): boolean {
    return (
      !this.reloading && this.magazineAmmo > 0 && now - this.lastShotTime >= this.config.fireRate
    );
  }

  registerShot(now: number) {
    this.magazineAmmo -= 1;
    this.lastShotTime = now;
    this.syncAmmo();
    // Recarga automática ao esvaziar o carregador (RF03).
    if (this.magazineAmmo === 0) {
      this.startReload(now);
    }
  }

  startReload(now: number) {
    if (this.reloading || this.magazineAmmo >= this.config.magazineSize || this.reserveAmmo === 0) {
      return;
    }
    this.reloading = true;
    this.reloadStartTime = now;
    const store = useWeaponStore.getState();
    store.setReloading(true);
    store.setReloadProgress(0);
  }

  update(now: number) {
    if (!this.reloading) {
      return;
    }
    const progress = (now - this.reloadStartTime) / this.config.reloadTime;
    if (progress >= 1) {
      this.completeReload();
    } else {
      useWeaponStore.getState().setReloadProgress(progress);
    }
  }

  private completeReload() {
    const needed = this.config.magazineSize - this.magazineAmmo;
    const taken = this.reserveAmmo === INFINITE_RESERVE ? needed : Math.min(needed, this.reserveAmmo);
    this.magazineAmmo += taken;
    if (this.reserveAmmo !== INFINITE_RESERVE) {
      this.reserveAmmo -= taken;
    }
    this.reloading = false;

    const store = useWeaponStore.getState();
    store.setReloading(false);
    store.setReloadProgress(0);
    this.syncAmmo();
  }

  private syncAmmo() {
    const store = useWeaponStore.getState();
    store.setMagazineAmmo(this.magazineAmmo);
    store.setReserveAmmo(this.reserveAmmo);
  }
}
