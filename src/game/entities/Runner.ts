/**
 * Premissas:
 * - Runner é o inimigo melee: persegue o player horizontalmente (RF04 — chase).
 *   Sem pathfinding no MVP; move só no eixo X em direção ao alvo.
 * - O dano de contato ao player depende do sistema de vida (Sprint 9); aqui o
 *   inimigo apenas entra em "attacking" ao encostar.
 */
import * as Phaser from 'phaser';
import { Enemy } from '@/game/entities/Enemy.ts';
import { ENEMIES } from '@/game/config/enemies.ts';
import { ENEMY } from '@/game/config/constants.ts';
import { TEXTURE } from '@/game/config/assets.ts';
import { decideChaseIntent } from '@/game/utils/enemyBehavior.ts';

export class Runner extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ENEMIES.runner, TEXTURE.ENEMY_RUNNER);
  }

  protected updateBehavior(_delta: number, targetX: number, targetY: number) {
    const dx = targetX - this.sprite.x;
    const distance = Math.hypot(dx, targetY - this.sprite.y);
    const intent = decideChaseIntent(
      dx,
      distance,
      this.config.detectionRange,
      ENEMY.MELEE_ATTACK_RANGE
    );

    this.setState(intent.state);
    if (intent.moveDirection !== 0) {
      this.moveHorizontally(intent.moveDirection, this.config.speed);
    } else {
      this.stopHorizontal();
    }
  }
}
