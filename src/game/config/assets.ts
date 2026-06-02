/**
 * Premissas:
 * - Todos os assets do MVP são placeholders gerados em runtime como retângulos
 *   coloridos (RF09 / roadmap 2.3) — nenhum arquivo de imagem é carregado ainda.
 * - Dimensões e cores são específicas do placeholder, não constantes de gameplay,
 *   por isso vivem aqui no catálogo e não em constants.ts.
 * - Cores em hexadecimal 0xRRGGBB (formato de cor numérica do Phaser).
 */

export const TEXTURE = {
  PLAYER: 'player',
  WEAPON: 'weapon',
  PROJECTILE: 'projectile',
  ENEMY_RUNNER: 'enemy-runner',
  ENEMY_SHOOTER: 'enemy-shooter',
  ENEMY_PROJECTILE: 'enemy-projectile',
  BOSS: 'boss',
  PLATFORM: 'platform',
  PARTICLE_DUST: 'particle-dust',
  PARTICLE_BLOOD: 'particle-blood',
  MUZZLE_FLASH: 'muzzle-flash',
} as const;

export type TextureKey = (typeof TEXTURE)[keyof typeof TEXTURE];

export interface PlaceholderTextureSpec {
  width: number;
  height: number;
  color: number;
}

export const PLACEHOLDER_TEXTURES: Record<TextureKey, PlaceholderTextureSpec> = {
  [TEXTURE.PLAYER]: { width: 32, height: 48, color: 0x4ade80 },
  [TEXTURE.WEAPON]: { width: 28, height: 10, color: 0xcbd5e1 },
  [TEXTURE.PROJECTILE]: { width: 12, height: 4, color: 0xfde047 },
  [TEXTURE.ENEMY_RUNNER]: { width: 30, height: 44, color: 0xef4444 },
  [TEXTURE.ENEMY_SHOOTER]: { width: 30, height: 44, color: 0xf97316 },
  [TEXTURE.ENEMY_PROJECTILE]: { width: 8, height: 8, color: 0xfb923c },
  [TEXTURE.BOSS]: { width: 96, height: 120, color: 0xa21caf },
  [TEXTURE.PLATFORM]: { width: 200, height: 24, color: 0x475569 },
  [TEXTURE.PARTICLE_DUST]: { width: 6, height: 6, color: 0xd6d3d1 },
  [TEXTURE.PARTICLE_BLOOD]: { width: 6, height: 6, color: 0xb91c1c },
  [TEXTURE.MUZZLE_FLASH]: { width: 16, height: 16, color: 0xfff7ae },
};
