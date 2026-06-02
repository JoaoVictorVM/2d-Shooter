/**
 * Premissas:
 * - Catálogo de armas do jogo. Stats por arma vivem aqui (não em constants.ts),
 *   conforme a estrutura do PRD — este arquivo É o local centralizado deles.
 * - A pistola é a única arma do MVP; novas armas entram apenas adicionando
 *   entradas em WEAPONS, sem mudar quem consome o catálogo.
 * - spriteKey aponta para a textura placeholder do projétil (gerada no Preload).
 * - As chaves de sfx são identificadores; os arquivos de som são carregados
 *   apenas no Sprint 11 (áudio via Howler.js).
 */
import type { WeaponConfig, WeaponId } from '@/types/index.ts';
import { TEXTURE } from './assets.ts';

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  pistol: {
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
      spriteKey: TEXTURE.PROJECTILE,
    },
    recoilAngle: 8,
    sfx: {
      shoot: 'pistol-shoot',
      reload: 'pistol-reload',
      empty: 'pistol-empty',
    },
  },
};

export const WEAPON_LIST: WeaponConfig[] = Object.values(WEAPONS);

export const DEFAULT_WEAPON_ID: WeaponId = 'pistol';
