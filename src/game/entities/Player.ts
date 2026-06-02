/**
 * Premissas:
 * - Etapa 4.1 cobre apenas movimento horizontal (A/D/←/→). Pulo (4.2) e dash (4.3)
 *   entram nas próximas etapas.
 * - A velocidade horizontal é rastreada internamente em px/s e convertida para a
 *   unidade do Matter (px por passo de 1/60s) só na hora de aplicar — o Matter
 *   trabalha em px por step, não px/s.
 * - O corpo tem rotação travada (setFixedRotation) para o personagem não tombar.
 */
import * as Phaser from 'phaser';
import { GAME, PLAYER_MOVEMENT } from '@/game/config/constants.ts';
import { TEXTURE } from '@/game/config/assets.ts';
import { computeHorizontalVelocity } from '@/game/utils/movement.ts';

interface MovementKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
}

export class Player {
  readonly sprite: Phaser.Physics.Matter.Sprite;
  private readonly keys: MovementKeys;
  private horizontalVelocity = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.matter.add.sprite(x, y, TEXTURE.PLAYER);
    this.sprite.setFixedRotation();

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input plugin is not available in this scene');
    }
    const codes = Phaser.Input.Keyboard.KeyCodes;
    this.keys = keyboard.addKeys({
      left: codes.A,
      right: codes.D,
      leftArrow: codes.LEFT,
      rightArrow: codes.RIGHT,
    }) as MovementKeys;
  }

  update(deltaMs: number) {
    const deltaSeconds = deltaMs / 1000;
    const inputDirection = this.readHorizontalInput();

    this.horizontalVelocity = computeHorizontalVelocity(
      this.horizontalVelocity,
      inputDirection,
      deltaSeconds,
      {
        maxSpeed: PLAYER_MOVEMENT.MAX_SPEED,
        acceleration: PLAYER_MOVEMENT.GROUND_ACCELERATION,
        friction: PLAYER_MOVEMENT.GROUND_FRICTION,
      }
    );

    this.sprite.setVelocityX(this.horizontalVelocity / GAME.TARGET_FPS);

    if (inputDirection !== 0) {
      this.sprite.setFlipX(inputDirection < 0);
    }
  }

  private readHorizontalInput(): number {
    const left = this.keys.left.isDown || this.keys.leftArrow.isDown;
    const right = this.keys.right.isDown || this.keys.rightArrow.isDown;
    return (right ? 1 : 0) - (left ? 1 : 0);
  }
}
