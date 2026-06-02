/**
 * Premissas:
 * - Reúne apenas constantes globais de engine, física e game feel.
 *   Stats de armas, inimigos e waves vivem em seus próprios arquivos de config
 *   (weapons.ts, enemies.ts, waves.ts), conforme a estrutura do PRD.
 * - Valores marcados como "tunável" não são especificados no PRD; são defaults
 *   razoáveis que serão validados/ajustados no sprint correspondente.
 * - Tempos em milissegundos, distâncias em pixels, velocidades em px/s.
 */

export const GAME = {
  WIDTH: 1280,
  HEIGHT: 720,
  TARGET_FPS: 60,
  BACKGROUND_COLOR: '#0b0c10',
} as const;

export const PLAYER_MOVEMENT = {
  MAX_SPEED: 300,
  JUMP_FORCE: -550,
  // tunável: ganho/perda de velocidade por segundo para aceleração suave (RF01)
  GROUND_ACCELERATION: 2000,
  GROUND_FRICTION: 1800,
  AIR_CONTROL_FACTOR: 0.6,
  COYOTE_TIME_MS: 80,
  JUMP_BUFFER_MS: 100,
} as const;

export const DASH = {
  DISTANCE: 200,
  DURATION_MS: 80,
  COOLDOWN_MS: 1200,
  INVINCIBLE_DURATION_MS: 80,
  TRAIL_GHOST_COUNT: 4,
} as const;

export const COMBAT = {
  KNOCKBACK_FORCE: 200,
} as const;

export const PLAYER_STATS = {
  MAX_HEALTH: 100,
  MAX_SHIELD: 50,
  SHIELD_REGEN_RATE: 10,
  SHIELD_REGEN_DELAY_MS: 4000,
  LOW_SHIELD_THRESHOLD: 0.2,
} as const;

export const GAME_FEEL = {
  LAND_SQUASH_SCALE_X: 1.2,
  LAND_SQUASH_SCALE_Y: 0.8,
  LAND_SQUASH_DURATION_MS: 80,
  WEAPON_RECOIL_DURATION_MS: 50,
  // tunável: intensidade/duração do screen shake ao receber dano (RF01/RF09)
  DAMAGE_SHAKE_INTENSITY: 0.008,
  DAMAGE_SHAKE_DURATION_MS: 120,
} as const;

export const WAVE = {
  START_DELAY_MS: 3000,
  ANNOUNCE_DURATION_MS: 2000,
} as const;

export const BOSS = {
  PHASE_TWO_HEALTH_THRESHOLD: 0.5,
} as const;

export const POOL = {
  PROJECTILES: 50,
  PARTICLES_MAX: 50,
} as const;

export const AUDIO = {
  // rate = PITCH_MIN + random() * PITCH_VARIANCE → varia o pitch para evitar repetição
  PITCH_MIN: 0.9,
  PITCH_VARIANCE: 0.2,
  MASTER_VOLUME: 1,
} as const;
