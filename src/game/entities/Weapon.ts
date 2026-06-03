/**
 * Premissas:
 * - Etapa 5.1: a arma é uma sprite sobreposta ao player que aponta para o mouse.
 *   Disparo (5.3) e munição (Sprint 6) entram depois.
 * - O pivô (origin) fica perto do "punho" para o cano girar em volta do ombro.
 * - Ao mirar para a esquerda, espelha em Y (flipY) para a arma não ficar de
 *   cabeça para baixo quando a rotação passa de 90°.
 */
import * as Phaser from 'phaser';
import { TEXTURE } from '@/game/config/assets.ts';
import { WEAPON_DISPLAY } from '@/game/config/constants.ts';
import type { Aim } from '@/game/utils/aim.ts';

export class Weapon {
  readonly sprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add
      .sprite(0, 0, TEXTURE.WEAPON)
      .setOrigin(WEAPON_DISPLAY.PIVOT_ORIGIN_X, WEAPON_DISPLAY.PIVOT_ORIGIN_Y)
      .setDepth(WEAPON_DISPLAY.DEPTH);
  }

  update(originX: number, originY: number, aim: Aim) {
    this.sprite.setPosition(originX, originY);
    this.sprite.setRotation(aim.angle);
    this.sprite.setFlipY(aim.facingLeft);
  }
}
