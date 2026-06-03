/**
 * Premissas:
 * - O ParticleEmitter do Phaser já reaproveita partículas internamente (ativa/
 *   desativa em vez de criar/destruir), atendendo ao requisito de object pooling.
 * - Emissores criados com `emitting: false`: emitem só sob demanda (explode),
 *   nunca em fluxo contínuo.
 */
import * as Phaser from 'phaser';
import { TEXTURE } from '@/game/config/assets.ts';
import { DUST_PARTICLE } from '@/game/config/constants.ts';

export function createDustEmitter(
  scene: Phaser.Scene
): Phaser.GameObjects.Particles.ParticleEmitter {
  return scene.add.particles(0, 0, TEXTURE.PARTICLE_DUST, {
    lifespan: DUST_PARTICLE.LIFESPAN_MS,
    speed: { min: DUST_PARTICLE.SPEED_MIN, max: DUST_PARTICLE.SPEED_MAX },
    scale: { start: DUST_PARTICLE.SCALE_START, end: DUST_PARTICLE.SCALE_END },
    alpha: { start: DUST_PARTICLE.ALPHA_START, end: 0 },
    angle: { min: 200, max: 340 },
    emitting: false,
    maxAliveParticles: DUST_PARTICLE.MAX_PARTICLES,
  });
}
