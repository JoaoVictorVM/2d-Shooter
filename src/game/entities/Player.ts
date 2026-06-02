/**
 * Premissas:
 * - Etapa 4.3 adiciona dash (Shift): impulso horizontal de DASH.DISTANCE em
 *   DASH.DURATION_MS, com cooldown e janela de invulnerabilidade. Só no chão
 *   (sem dash aéreo no MVP). O ghost trail visual é juice e entra na etapa 4.4.
 * - Velocidades em px/s são convertidas para a unidade do Matter (px por passo
 *   de 1/60s) só ao aplicar — o Matter trabalha em px por step.
 * - Detecção de chão por eventos de colisão: um corpo conta como chão quando seu
 *   centro está abaixo do centro do player no início do contato (heurística
 *   suficiente para plataformas; paredes/tetos ficam de fora).
 * - O corpo tem rotação travada (setFixedRotation) para não tombar.
 */
import * as Phaser from 'phaser';
import { GAME, PLAYER_MOVEMENT, DASH } from '@/game/config/constants.ts';
import { TEXTURE } from '@/game/config/assets.ts';
import { computeHorizontalVelocity } from '@/game/utils/movement.ts';
import { shouldJump } from '@/game/utils/jump.ts';
import { canStartDash, isWithinWindow } from '@/game/utils/dash.ts';

type MatterBody = MatterJS.BodyType;

// Velocidade constante do dash: cobrir DASH.DISTANCE px em DASH.DURATION_MS.
const DASH_SPEED_PX_S = DASH.DISTANCE / (DASH.DURATION_MS / 1000);

interface MovementKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
  jumpUp: Phaser.Input.Keyboard.Key;
  jumpSpace: Phaser.Input.Keyboard.Key;
  dash: Phaser.Input.Keyboard.Key;
}

export class Player {
  readonly sprite: Phaser.Physics.Matter.Sprite;
  private readonly scene: Phaser.Scene;
  private readonly body: MatterBody;
  private readonly keys: MovementKeys;

  private horizontalVelocity = 0;
  private facing: -1 | 1 = 1;
  private readonly groundContacts = new Set<number>();
  private lastGroundedTime = -Infinity;
  private lastJumpPressedTime = -Infinity;
  private dashStartTime = -Infinity;
  private dashDirection: -1 | 1 = 1;
  private lastDashTime = -Infinity;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, TEXTURE.PLAYER);
    this.sprite.setFixedRotation();
    this.body = this.sprite.body as MatterBody;

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
      jump: codes.W,
      jumpUp: codes.UP,
      jumpSpace: codes.SPACE,
      dash: codes.SHIFT,
    }) as MovementKeys;

    scene.matter.world.on('collisionstart', this.handleCollisionStart, this);
    scene.matter.world.on('collisionend', this.handleCollisionEnd, this);
  }

  get isInvincible(): boolean {
    return isWithinWindow(this.scene.time.now, this.dashStartTime, DASH.INVINCIBLE_DURATION_MS);
  }

  update(deltaMs: number) {
    const now = this.scene.time.now;

    this.handleDashInput(now);

    if (this.isDashing(now)) {
      this.applyDashVelocity();
    } else {
      this.updateHorizontalMovement(deltaMs);
    }

    this.updateJump(now);
  }

  private handleDashInput(now: number) {
    if (!Phaser.Input.Keyboard.JustDown(this.keys.dash) || this.isDashing(now)) {
      return;
    }
    const available = canStartDash({
      now,
      lastDashTime: this.lastDashTime,
      cooldownMs: DASH.COOLDOWN_MS,
      isOnGround: this.isOnGround(),
    });
    if (!available) {
      return;
    }
    this.dashDirection = (this.readHorizontalInput() || this.facing) < 0 ? -1 : 1;
    this.dashStartTime = now;
    this.lastDashTime = now;
  }

  private isDashing(now: number): boolean {
    return isWithinWindow(now, this.dashStartTime, DASH.DURATION_MS);
  }

  private applyDashVelocity() {
    this.horizontalVelocity = DASH_SPEED_PX_S * this.dashDirection;
    this.sprite.setVelocityX(this.horizontalVelocity / GAME.TARGET_FPS);
    this.sprite.setFlipX(this.dashDirection < 0);
  }

  private updateHorizontalMovement(deltaMs: number) {
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
      this.facing = inputDirection < 0 ? -1 : 1;
      this.sprite.setFlipX(inputDirection < 0);
    }
  }

  private updateJump(now: number) {
    if (this.isJumpJustPressed()) {
      this.lastJumpPressedTime = now;
    }
    if (this.isOnGround()) {
      this.lastGroundedTime = now;
    }

    const jump = shouldJump({
      now,
      lastGroundedTime: this.lastGroundedTime,
      lastJumpPressedTime: this.lastJumpPressedTime,
      coyoteTimeMs: PLAYER_MOVEMENT.COYOTE_TIME_MS,
      jumpBufferMs: PLAYER_MOVEMENT.JUMP_BUFFER_MS,
    });

    if (jump) {
      this.sprite.setVelocityY(PLAYER_MOVEMENT.JUMP_FORCE / GAME.TARGET_FPS);
      // Consome coyote e buffer para impedir double jump no mesmo voo.
      this.lastGroundedTime = -Infinity;
      this.lastJumpPressedTime = -Infinity;
    }
  }

  private readHorizontalInput(): number {
    const left = this.keys.left.isDown || this.keys.leftArrow.isDown;
    const right = this.keys.right.isDown || this.keys.rightArrow.isDown;
    return (right ? 1 : 0) - (left ? 1 : 0);
  }

  private isJumpJustPressed(): boolean {
    const justDown = Phaser.Input.Keyboard.JustDown;
    return justDown(this.keys.jump) || justDown(this.keys.jumpUp) || justDown(this.keys.jumpSpace);
  }

  private isOnGround(): boolean {
    return this.groundContacts.size > 0;
  }

  private handleCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
    for (const pair of event.pairs) {
      const other = this.resolveOtherBody(pair.bodyA, pair.bodyB);
      if (other && other.position.y > this.body.position.y) {
        this.groundContacts.add(other.id);
      }
    }
  }

  private handleCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionEndEvent) {
    for (const pair of event.pairs) {
      const other = this.resolveOtherBody(pair.bodyA, pair.bodyB);
      if (other) {
        this.groundContacts.delete(other.id);
      }
    }
  }

  private resolveOtherBody(bodyA: MatterBody, bodyB: MatterBody): MatterBody | null {
    if (bodyA === this.body) {
      return bodyB;
    }
    if (bodyB === this.body) {
      return bodyA;
    }
    return null;
  }
}
