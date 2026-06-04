/**
 * Premissas:
 * - Sistema sem dependência do Phaser: cuida só de munição e cadência (fire rate).
 *   A cena consulta canFire()/registerShot() e faz o spawn do projétil.
 * - Sincroniza munição no weaponStore para o HUD (Phaser → React via Zustand).
 * - Recarga (manual/automática) é da etapa 6.2; aqui, carregador vazio = não dispara.
 * - reserveAmmo === -1 representa munição infinita (campo totalAmmo do PRD).
 */
import type { WeaponConfig, ProjectileConfig, FireMode } from '@/types/index.ts';
import { useWeaponStore } from '@/store/index.ts';

export class WeaponSystem {
  private readonly config: WeaponConfig;
  private magazineAmmo: number;
  private reserveAmmo: number;
  private lastShotTime = -Infinity;

  constructor(config: WeaponConfig) {
    this.config = config;
    this.magazineAmmo = config.magazineSize;
    this.reserveAmmo = config.totalAmmo;
    this.syncStore();
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

  canFire(now: number): boolean {
    return this.magazineAmmo > 0 && now - this.lastShotTime >= this.config.fireRate;
  }

  // Consome uma munição e registra o instante do tiro. Assume canFire() já checado.
  registerShot(now: number) {
    this.magazineAmmo -= 1;
    this.lastShotTime = now;
    this.syncStore();
  }

  private syncStore() {
    const store = useWeaponStore.getState();
    store.setMagazineAmmo(this.magazineAmmo);
    store.setReserveAmmo(this.reserveAmmo);
  }
}
