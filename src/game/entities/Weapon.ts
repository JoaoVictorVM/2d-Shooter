/**
 * Premissas:
 * - A arma é uma sprite sobreposta ao player que aponta para o mouse (RF02).
 * - O pivô (origin) fica perto do "punho" para o cano girar em volta do ombro.
 * - Ao mirar para a esquerda, espelha em Y (flipY) para a arma não ficar de
 *   cabeça para baixo quando a rotação passa de 90°.
 * - A ponta do cano (muzzle) é onde o projétil nasce (RF02).
 * - Recoil (5.4): um offset de rotação aplicado sobre o ângulo de mira que decai
 *   a zero por tween — precisa ser offset porque a rotação é reescrita todo frame.
 */
import * as Phaser from 'phaser';
import { TEXTURE } from '@/game/config/assets.ts';
import { WEAPON_DISPLAY, WEAPON_FX, GAME_FEEL } from '@/game/config/constants.ts';
import { offsetByAngle, degreesToRadians, type Vector2 } from '@/game/utils/MathUtils.ts';
import type { Aim } from '@/game/utils/aim.ts';

export class Weapon {
  readonly sprite: Phaser.GameObjects.Sprite;
  private readonly scene: Phaser.Scene;
  private readonly muzzleFlash: Phaser.GameObjects.Image;
  private currentAngle = 0;
  private recoilOffset = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.sprite = scene.add
      .sprite(0, 0, TEXTURE.WEAPON)
      .setOrigin(WEAPON_DISPLAY.PIVOT_ORIGIN_X, WEAPON_DISPLAY.PIVOT_ORIGIN_Y)
      .setDepth(WEAPON_DISPLAY.DEPTH);
    this.muzzleFlash = scene.add
      .image(0, 0, TEXTURE.MUZZLE_FLASH)
      .setDepth(WEAPON_DISPLAY.DEPTH + 1)
      .setVisible(false)
      .setActive(false);
  }

  get angle(): number {
    return this.currentAngle;
  }

  getMuzzlePosition(): Vector2 {
    return offsetByAngle(
      this.sprite.x,
      this.sprite.y,
      this.currentAngle,
      WEAPON_DISPLAY.MUZZLE_LENGTH
    );
  }

  update(originX: number, originY: number, aim: Aim) {
    this.currentAngle = aim.angle;
    this.sprite.setPosition(originX, originY);
    this.sprite.setRotation(aim.angle - this.recoilOffset);
    this.sprite.setFlipY(aim.facingLeft);
  }

  // Kick-back visual da arma + flash no cano ao disparar (RF02).
  triggerShootFeedback(recoilAngleDegrees: number) {
    this.kickRecoil(recoilAngleDegrees);
    this.flashMuzzle();
  }

  private kickRecoil(recoilAngleDegrees: number) {
    this.recoilOffset = degreesToRadians(recoilAngleDegrees);
    const state = { value: this.recoilOffset };
    this.scene.tweens.add({
      targets: state,
      value: 0,
      duration: GAME_FEEL.WEAPON_RECOIL_DURATION_MS,
      ease: 'Quad.easeOut',
      onUpdate: () => {
        this.recoilOffset = state.value;
      },
      onComplete: () => {
        this.recoilOffset = 0;
      },
    });
  }

  private flashMuzzle() {
    const muzzle = this.getMuzzlePosition();
    this.muzzleFlash
      .setPosition(muzzle.x, muzzle.y)
      .setRotation(this.currentAngle)
      .setAlpha(1)
      .setVisible(true)
      .setActive(true);
    this.scene.tweens.add({
      targets: this.muzzleFlash,
      alpha: 0,
      duration: WEAPON_FX.MUZZLE_FLASH_DURATION_MS,
      onComplete: () => this.muzzleFlash.setVisible(false).setActive(false),
    });
  }
}
