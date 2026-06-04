/**
 * Premissas:
 * - Shooter é o inimigo ranged: mantém preferredRange, atira no player e recua se
 *   o player se aproxima demais (RF04). Sem pathfinding; move só no eixo X.
 * - O spawn do projétil é injetado (callback `fire`) para não acoplar o inimigo à
 *   cena — a cena fornece o pool de projéteis de inimigo.
 * - Dano ao player depende do sistema de vida (Sprint 9); aqui o projétil só viaja.
 */
import * as Phaser from 'phaser';
import { Enemy } from '@/game/entities/Enemy.ts';
import { ENEMIES } from '@/game/config/enemies.ts';
import { ENEMY } from '@/game/config/constants.ts';
import { TEXTURE } from '@/game/config/assets.ts';
import { decideRangedIntent } from '@/game/utils/enemyBehavior.ts';
import { computeAim } from '@/game/utils/aim.ts';
import type { ProjectileConfig, EnemyWeaponConfig } from '@/types/index.ts';

export type EnemyFireFn = (x: number, y: number, angle: number, config: ProjectileConfig) => void;

export class Shooter extends Enemy {
  private readonly fire: EnemyFireFn;
  private readonly weapon: EnemyWeaponConfig;
  private readonly preferredRange: number;
  private readonly projectileConfig: ProjectileConfig;
  private lastShotTime = -Infinity;

  constructor(scene: Phaser.Scene, x: number, y: number, fire: EnemyFireFn) {
    super(scene, x, y, ENEMIES.shooter, TEXTURE.ENEMY_SHOOTER);
    if (!this.config.weapon || this.config.preferredRange === undefined) {
      throw new Error('Shooter config requires weapon and preferredRange');
    }
    this.fire = fire;
    this.weapon = this.config.weapon;
    this.preferredRange = this.config.preferredRange;
    this.projectileConfig = {
      damage: this.weapon.damage,
      speed: this.weapon.projectileSpeed,
      maxRange: this.config.detectionRange,
      piercing: false,
      knockbackForce: 0,
      spriteKey: TEXTURE.ENEMY_PROJECTILE,
    };
  }

  protected updateBehavior(_delta: number, targetX: number, targetY: number) {
    const dx = targetX - this.sprite.x;
    const distance = Math.hypot(dx, targetY - this.sprite.y);
    const intent = decideRangedIntent(
      dx,
      distance,
      this.config.detectionRange,
      this.preferredRange,
      ENEMY.RANGED_TOLERANCE
    );

    this.setState(intent.state);
    if (intent.moveDirection !== 0) {
      this.moveHorizontally(intent.moveDirection, this.config.speed);
    } else {
      this.stopHorizontal();
    }

    if (intent.wantsToShoot) {
      this.tryShoot(targetX, targetY);
    }
  }

  private tryShoot(targetX: number, targetY: number) {
    const now = this.scene.time.now;
    if (now - this.lastShotTime < this.weapon.fireRate) {
      return;
    }
    this.lastShotTime = now;
    const aim = computeAim(this.sprite.x, this.sprite.y, targetX, targetY);
    this.fire(this.sprite.x, this.sprite.y, aim.angle, this.projectileConfig);
  }
}
