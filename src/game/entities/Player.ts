/**
 * Premissas:
 * - Etapa 4.4 adiciona o game feel do movimento (visual): squash ao aterrissar,
 *   stretch de antecipação ao pular, poeira ao aterrissar/iniciar corrida/pular
 *   e ghost trail durante o dash. Nenhuma regra de gameplay muda aqui.
 * - Velocidades em px/s são convertidas para a unidade do Matter (px por passo
 *   de 1/60s) só ao aplicar — o Matter trabalha em px por step.
 * - Detecção de chão por eventos de colisão: um corpo conta como chão quando seu
 *   centro está abaixo do centro do player no início do contato (heurística
 *   suficiente para plataformas; paredes/tetos ficam de fora).
 * - O corpo tem rotação travada (setFixedRotation) para não tombar.
 */
import * as Phaser from 'phaser';
import {
  GAME,
  PLAYER_MOVEMENT,
  DASH,
  GAME_FEEL,
  DUST_PARTICLE,
  DASH_TRAIL,
  WEAPON_DISPLAY,
} from '@/game/config/constants.ts';
import { TEXTURE } from '@/game/config/assets.ts';
import { computeHorizontalVelocity, clamp } from '@/game/utils/movement.ts';
import { shouldJump } from '@/game/utils/jump.ts';
import { canStartDash, isWithinWindow } from '@/game/utils/dash.ts';
import { createDustEmitter } from '@/game/utils/ParticleFactory.ts';
import { computeAim } from '@/game/utils/aim.ts';
import type { Vector2 } from '@/game/utils/MathUtils.ts';
import { Weapon } from '@/game/entities/Weapon.ts';

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
  private readonly dustEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private readonly weapon: Weapon;

  private horizontalVelocity = 0;
  private facing: -1 | 1 = 1;
  private readonly groundContacts = new Set<number>();
  private lastGroundedTime = -Infinity;
  private lastJumpPressedTime = -Infinity;
  private dashStartTime = -Infinity;
  private dashDirection: -1 | 1 = 1;
  private lastDashTime = -Infinity;
  private lastGhostTime = -Infinity;
  private wasDashing = false;
  private wasOnGround = false;
  private previousInputDirection = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, TEXTURE.PLAYER);
    this.sprite.setFixedRotation();
    this.body = this.sprite.body as MatterBody;
    this.dustEmitter = createDustEmitter(scene);
    this.weapon = new Weapon(scene);

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

  get aimAngle(): number {
    return this.weapon.angle;
  }

  getMuzzlePosition(): Vector2 {
    return this.weapon.getMuzzlePosition();
  }

  update(deltaMs: number) {
    const now = this.scene.time.now;

    this.updateAim();
    const inputDirection = this.readHorizontalInput();

    this.handleDashInput(now);
    const dashing = this.isDashing(now);

    if (dashing) {
      this.applyDashVelocity();
      this.updateDashTrail(now);
    } else {
      // Ao terminar o dash, a velocidade ainda é a do dash (>> MAX_SPEED); sem
      // isto o atrito levaria ~1,4s para parar. Limitamos ao teto de corrida para
      // o personagem parar rápido (ou seguir correndo se houver input).
      if (this.wasDashing) {
        this.horizontalVelocity = clamp(
          this.horizontalVelocity,
          -PLAYER_MOVEMENT.MAX_SPEED,
          PLAYER_MOVEMENT.MAX_SPEED
        );
      }
      this.updateHorizontalMovement(deltaMs, inputDirection);
    }

    this.updateJump(now);
    this.updateGroundEffects(inputDirection, dashing);

    this.wasDashing = dashing;
    this.wasOnGround = this.isOnGround();
    this.previousInputDirection = inputDirection;
  }

  // O flip do personagem e a direção que ele encara seguem o mouse (RF02).
  private updateAim() {
    const pointer = this.scene.input.activePointer;
    const shoulderY = this.sprite.y + WEAPON_DISPLAY.SHOULDER_OFFSET_Y;
    const aim = computeAim(this.sprite.x, shoulderY, pointer.worldX, pointer.worldY);

    this.facing = aim.facingLeft ? -1 : 1;
    this.sprite.setFlipX(aim.facingLeft);
    this.weapon.update(this.sprite.x, shoulderY, aim);
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
    this.lastGhostTime = -Infinity;
  }

  private isDashing(now: number): boolean {
    return isWithinWindow(now, this.dashStartTime, DASH.DURATION_MS);
  }

  private applyDashVelocity() {
    this.horizontalVelocity = DASH_SPEED_PX_S * this.dashDirection;
    this.sprite.setVelocityX(this.horizontalVelocity / GAME.TARGET_FPS);
  }

  private updateDashTrail(now: number) {
    const interval = DASH.DURATION_MS / DASH.TRAIL_GHOST_COUNT;
    if (now - this.lastGhostTime < interval) {
      return;
    }
    this.lastGhostTime = now;
    this.spawnGhost();
  }

  private spawnGhost() {
    const ghost = this.scene.add
      .image(this.sprite.x, this.sprite.y, TEXTURE.PLAYER)
      .setFlipX(this.sprite.flipX)
      .setAlpha(DASH_TRAIL.GHOST_ALPHA);
    this.scene.tweens.add({
      targets: ghost,
      alpha: 0,
      duration: DASH_TRAIL.GHOST_FADE_MS,
      onComplete: () => ghost.destroy(),
    });
  }

  private updateHorizontalMovement(deltaMs: number, inputDirection: number) {
    const deltaSeconds = deltaMs / 1000;

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
      this.onJump();
    }
  }

  private updateGroundEffects(inputDirection: number, dashing: boolean) {
    const onGround = this.isOnGround();

    if (!this.wasOnGround && onGround) {
      this.onLand();
    }

    const startedRunning = onGround && this.previousInputDirection === 0 && inputDirection !== 0;
    if (!dashing && startedRunning) {
      this.emitDust(DUST_PARTICLE.RUN_COUNT);
    }
  }

  private onJump() {
    this.playScalePop(GAME_FEEL.JUMP_STRETCH_SCALE_X, GAME_FEEL.JUMP_STRETCH_SCALE_Y, GAME_FEEL.JUMP_STRETCH_DURATION_MS);
    this.emitDust(DUST_PARTICLE.RUN_COUNT);
  }

  private onLand() {
    this.playScalePop(GAME_FEEL.LAND_SQUASH_SCALE_X, GAME_FEEL.LAND_SQUASH_SCALE_Y, GAME_FEEL.LAND_SQUASH_DURATION_MS);
    this.emitDust(DUST_PARTICLE.LAND_COUNT);
  }

  // Aplica a escala alvo instantaneamente e volta a (1,1) — o "pop" do squash/stretch.
  private playScalePop(scaleX: number, scaleY: number, durationMs: number) {
    this.sprite.setScale(scaleX, scaleY);
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 1,
      scaleY: 1,
      duration: durationMs,
      ease: 'Quad.easeOut',
    });
  }

  private emitDust(count: number) {
    const feetY = this.sprite.y + this.sprite.displayHeight / 2;
    this.dustEmitter.explode(count, this.sprite.x, feetY);
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
