/**
 * Premissas:
 * - Classe base abstrata dos inimigos: física Matter + vida + máquina de estado
 *   (idle | chasing | attacking | dying). Comportamentos concretos são das subclasses.
 * - Feedback (7.4): hit flash (pisca branco), barra de vida acima (só quando < 100%)
 *   e morte (congela o corpo, faz fade em DEATH_FADE_MS e se autodestrói).
 * - Corpo com rotação travada (não tomba). Sangue/score/colisão são da cena.
 */
import * as Phaser from 'phaser';
import { GAME, ENEMY_FX } from '@/game/config/constants.ts';
import { applyDamage, isDefeated, healthRatio } from '@/game/utils/combat.ts';
import type { TextureKey } from '@/game/config/assets.ts';
import type { EnemyConfig, EnemyState } from '@/types/index.ts';

type MatterBody = MatterJS.BodyType;

const HIT_FLASH_COLOR = 0xffffff;
const HEALTH_BAR_FILL_COLOR = 0x4ade80;
const HEALTH_BAR_BG_COLOR = 0x000000;

export abstract class Enemy {
  readonly sprite: Phaser.Physics.Matter.Sprite;
  protected readonly scene: Phaser.Scene;
  protected readonly config: EnemyConfig;
  protected readonly body: MatterBody;
  protected currentHealth: number;
  private currentState: EnemyState = 'idle';
  private finished = false;
  private readonly healthBarBg: Phaser.GameObjects.Rectangle;
  private readonly healthBarFill: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: EnemyConfig,
    spriteKey: TextureKey
  ) {
    this.scene = scene;
    this.config = config;
    this.sprite = scene.matter.add.sprite(x, y, spriteKey);
    this.sprite.setFixedRotation();
    this.body = this.sprite.body as MatterBody;
    this.currentHealth = config.health;

    this.healthBarBg = scene.add
      .rectangle(x, y, ENEMY_FX.HEALTH_BAR_WIDTH, ENEMY_FX.HEALTH_BAR_HEIGHT, HEALTH_BAR_BG_COLOR, 0.6)
      .setOrigin(0, 0.5)
      .setDepth(ENEMY_FX.HEALTH_BAR_DEPTH)
      .setVisible(false);
    this.healthBarFill = scene.add
      .rectangle(x, y, ENEMY_FX.HEALTH_BAR_WIDTH, ENEMY_FX.HEALTH_BAR_HEIGHT, HEALTH_BAR_FILL_COLOR)
      .setOrigin(0, 0.5)
      .setDepth(ENEMY_FX.HEALTH_BAR_DEPTH)
      .setVisible(false);
  }

  get state(): EnemyState {
    return this.currentState;
  }

  get isDead(): boolean {
    return this.currentState === 'dying';
  }

  get isFinished(): boolean {
    return this.finished;
  }

  get scoreValue(): number {
    return this.config.scoreValue;
  }

  takeDamage(amount: number) {
    if (this.isDead) {
      return;
    }
    this.currentHealth = applyDamage(this.currentHealth, amount);
    this.flashHit();
    if (isDefeated(this.currentHealth)) {
      this.die();
    }
  }

  update(delta: number, targetX: number, targetY: number) {
    this.updateHealthBar();
    if (this.isDead) {
      return;
    }
    this.updateBehavior(delta, targetX, targetY);
  }

  destroy() {
    this.sprite.destroy();
    this.healthBarBg.destroy();
    this.healthBarFill.destroy();
  }

  protected setState(state: EnemyState) {
    this.currentState = state;
  }

  protected moveHorizontally(direction: number, speed: number) {
    this.sprite.setVelocityX((direction * speed) / GAME.TARGET_FPS);
    if (direction !== 0) {
      this.sprite.setFlipX(direction < 0);
    }
  }

  protected stopHorizontal() {
    this.sprite.setVelocityX(0);
  }

  protected abstract updateBehavior(delta: number, targetX: number, targetY: number): void;

  private flashHit() {
    // Phaser 4: flash sólido = setTint + modo FILL (substitui o antigo setTintFill).
    this.sprite.setTint(HIT_FLASH_COLOR).setTintMode(Phaser.TintModes.FILL);
    this.scene.time.delayedCall(ENEMY_FX.HIT_FLASH_DURATION_MS, () => {
      if (this.sprite.active) {
        this.sprite.clearTint();
      }
    });
  }

  private die() {
    this.setState('dying');
    this.sprite.setVelocity(0, 0);
    this.sprite.setStatic(true);
    this.sprite.clearTint();
    this.healthBarBg.setVisible(false);
    this.healthBarFill.setVisible(false);
    // Corpo some após DEATH_FADE_MS (RF04: "corpo que some em 2s").
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: ENEMY_FX.DEATH_FADE_MS,
      onComplete: () => {
        this.finished = true;
        this.destroy();
      },
    });
  }

  private updateHealthBar() {
    const showBar = !this.isDead && this.currentHealth < this.config.health;
    this.healthBarBg.setVisible(showBar);
    this.healthBarFill.setVisible(showBar);
    if (!showBar) {
      return;
    }
    const left = this.sprite.x - ENEMY_FX.HEALTH_BAR_WIDTH / 2;
    const top = this.sprite.y - ENEMY_FX.HEALTH_BAR_OFFSET_Y;
    this.healthBarBg.setPosition(left, top);
    this.healthBarFill.setPosition(left, top);
    this.healthBarFill.setScale(healthRatio(this.currentHealth, this.config.health), 1);
  }
}
