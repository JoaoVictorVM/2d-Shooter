/**
 * Premissas:
 * - Projéteis voam em linha reta com movimento manual (posição += velocidade*dt),
 *   não como corpos dinâmicos do Matter. É o padrão performático para muitas balas
 *   e deixa a cinemática determinística e testável. A colisão com inimigos será por
 *   overlap nos Sprints 7+. O Matter continua para player/inimigos/gravidade/knockback.
 * - Instância reutilizável de pool: criada uma vez, depois apenas fire()/deactivate().
 * - O disparo (acquire + fire a partir do input) entra na etapa 5.3.
 */
import * as Phaser from 'phaser';
import { TEXTURE } from '@/game/config/assets.ts';
import { velocityFromAngle } from '@/game/utils/MathUtils.ts';
import type { ProjectileConfig } from '@/types/index.ts';

export class Projectile {
  readonly sprite: Phaser.GameObjects.Image;

  private velocityX = 0;
  private velocityY = 0;
  private speed = 0;
  private maxRange = 0;
  private travelled = 0;
  private active = false;

  damage = 0;
  piercing = false;
  knockbackForce = 0;

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add.image(0, 0, TEXTURE.PROJECTILE).setActive(false).setVisible(false);
  }

  get isActive(): boolean {
    return this.active;
  }

  fire(x: number, y: number, angle: number, config: ProjectileConfig) {
    const velocity = velocityFromAngle(angle, config.speed);
    this.velocityX = velocity.x;
    this.velocityY = velocity.y;
    this.speed = config.speed;
    this.maxRange = config.maxRange;
    this.travelled = 0;
    this.damage = config.damage;
    this.piercing = config.piercing;
    this.knockbackForce = config.knockbackForce;
    this.active = true;

    this.sprite
      .setTexture(config.spriteKey)
      .setPosition(x, y)
      .setRotation(angle)
      .setActive(true)
      .setVisible(true);
  }

  // Avança o projétil; retorna false quando excedeu o alcance e foi desativado.
  update(deltaMs: number): boolean {
    if (!this.active) {
      return false;
    }
    const deltaSeconds = deltaMs / 1000;
    this.sprite.x += this.velocityX * deltaSeconds;
    this.sprite.y += this.velocityY * deltaSeconds;
    this.travelled += this.speed * deltaSeconds;

    if (this.travelled >= this.maxRange) {
      this.deactivate();
      return false;
    }
    return true;
  }

  deactivate() {
    this.active = false;
    this.sprite.setActive(false).setVisible(false);
  }
}
