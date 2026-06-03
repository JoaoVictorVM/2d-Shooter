/**
 * Premissas:
 * - Etapa 5.1: a arma é uma sprite sobreposta ao player que aponta para o mouse.
 *   Munição/fire rate (Sprint 6) entram depois.
 * - O pivô (origin) fica perto do "punho" para o cano girar em volta do ombro.
 * - Ao mirar para a esquerda, espelha em Y (flipY) para a arma não ficar de
 *   cabeça para baixo quando a rotação passa de 90°.
 * - A ponta do cano (muzzle) é onde o projétil nasce (RF02), calculada a partir
 *   da posição do ombro deslocada pelo ângulo de mira.
 */
import * as Phaser from 'phaser';
import { TEXTURE } from '@/game/config/assets.ts';
import { WEAPON_DISPLAY } from '@/game/config/constants.ts';
import { offsetByAngle, type Vector2 } from '@/game/utils/MathUtils.ts';
import type { Aim } from '@/game/utils/aim.ts';

export class Weapon {
  readonly sprite: Phaser.GameObjects.Sprite;
  private currentAngle = 0;

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add
      .sprite(0, 0, TEXTURE.WEAPON)
      .setOrigin(WEAPON_DISPLAY.PIVOT_ORIGIN_X, WEAPON_DISPLAY.PIVOT_ORIGIN_Y)
      .setDepth(WEAPON_DISPLAY.DEPTH);
  }

  get angle(): number {
    return this.currentAngle;
  }

  getMuzzlePosition(): Vector2 {
    return offsetByAngle(this.sprite.x, this.sprite.y, this.currentAngle, WEAPON_DISPLAY.MUZZLE_LENGTH);
  }

  update(originX: number, originY: number, aim: Aim) {
    this.currentAngle = aim.angle;
    this.sprite.setPosition(originX, originY);
    this.sprite.setRotation(aim.angle);
    this.sprite.setFlipY(aim.facingLeft);
  }
}
