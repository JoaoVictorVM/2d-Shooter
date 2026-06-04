/**
 * Premissas:
 * - Classe base abstrata dos inimigos: física Matter + vida + máquina de estado
 *   (idle | chasing | attacking | dying). Comportamentos concretos (Runner 7.2,
 *   Shooter 7.3) e feedback/morte (7.4) são adicionados pelas subclasses/etapas.
 * - Corpo com rotação travada (não tomba). O spawn de inimigos vem com o
 *   WaveSystem (Sprint 8); aqui só existe a entidade.
 */
import * as Phaser from 'phaser';
import { GAME } from '@/game/config/constants.ts';
import { applyDamage, isDefeated } from '@/game/utils/combat.ts';
import type { TextureKey } from '@/game/config/assets.ts';
import type { EnemyConfig, EnemyState } from '@/types/index.ts';

type MatterBody = MatterJS.BodyType;

export abstract class Enemy {
  readonly sprite: Phaser.Physics.Matter.Sprite;
  protected readonly scene: Phaser.Scene;
  protected readonly config: EnemyConfig;
  protected readonly body: MatterBody;
  protected currentHealth: number;
  private currentState: EnemyState = 'idle';

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
  }

  get state(): EnemyState {
    return this.currentState;
  }

  get isDead(): boolean {
    return this.currentState === 'dying';
  }

  get scoreValue(): number {
    return this.config.scoreValue;
  }

  takeDamage(amount: number) {
    if (this.isDead) {
      return;
    }
    this.currentHealth = applyDamage(this.currentHealth, amount);
    if (isDefeated(this.currentHealth)) {
      this.setState('dying');
    }
  }

  update(delta: number, targetX: number, targetY: number) {
    if (this.isDead) {
      return;
    }
    this.updateBehavior(delta, targetX, targetY);
  }

  destroy() {
    this.sprite.destroy();
  }

  protected setState(state: EnemyState) {
    this.currentState = state;
  }

  // Movimento horizontal em px/s convertido para a unidade do Matter (px por step).
  protected moveHorizontally(direction: number, speed: number) {
    this.sprite.setVelocityX((direction * speed) / GAME.TARGET_FPS);
    if (direction !== 0) {
      this.sprite.setFlipX(direction < 0);
    }
  }

  protected stopHorizontal() {
    this.sprite.setVelocityX(0);
  }

  // Comportamento específico de cada tipo de inimigo (chase, ranged, ...).
  protected abstract updateBehavior(delta: number, targetX: number, targetY: number): void;
}
