import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { GAME, POOL, HIT_SPARK } from '@/game/config/constants.ts';
import { TEXTURE, PLACEHOLDER_TEXTURES } from '@/game/config/assets.ts';
import { WEAPONS } from '@/game/config/weapons.ts';
import { Player } from '@/game/entities/Player.ts';
import { Projectile } from '@/game/entities/Projectile.ts';
import type { Enemy } from '@/game/entities/Enemy.ts';
import { Shooter } from '@/game/entities/Shooter.ts';
import type { ProjectileConfig } from '@/types/index.ts';
import { WeaponSystem } from '@/game/systems/WeaponSystem.ts';
import { ObjectPool } from '@/game/utils/ObjectPool.ts';
import { createSparkEmitter } from '@/game/utils/ParticleFactory.ts';
import { useGameStore } from '@/store/index.ts';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;
  private projectiles!: ObjectPool<Projectile>;
  private enemyProjectiles!: ObjectPool<Projectile>;
  private hitSparks!: Phaser.GameObjects.Particles.ParticleEmitter;
  private weaponSystem!: WeaponSystem;
  private reloadKey!: Phaser.Input.Keyboard.Key;
  // Preenchida pelo WaveSystem (Sprint 8); o loop de update já vive aqui.
  readonly enemies: Enemy[] = [];

  constructor() {
    super(SCENE.MAIN_GAME);
  }

  create() {
    this.createTemporaryGround();
    // Spawn no centro do mapa, acima do chão (RF09).
    this.player = new Player(this, GAME.WIDTH / 2, GAME.HEIGHT / 2);
    this.projectiles = new ObjectPool(POOL.PROJECTILES, () => new Projectile(this));
    this.enemyProjectiles = new ObjectPool(POOL.PROJECTILES, () => new Projectile(this));
    this.hitSparks = createSparkEmitter(this);
    this.weaponSystem = new WeaponSystem(WEAPONS[useGameStore.getState().selectedWeapon]);

    this.reloadKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  // Partículas de impacto ao acertar um inimigo (acionado na colisão do Sprint 7).
  emitHitSparks(x: number, y: number) {
    this.hitSparks.explode(HIT_SPARK.COUNT, x, y);
  }

  // Spawn de inimigo ranged já com o callback de disparo conectado ao pool de inimigos.
  // O WaveSystem (Sprint 8) usará este helper.
  spawnShooter(x: number, y: number): Shooter {
    const shooter = new Shooter(this, x, y, (px, py, angle, config) =>
      this.spawnEnemyProjectile(px, py, angle, config)
    );
    this.enemies.push(shooter);
    return shooter;
  }

  private spawnEnemyProjectile(x: number, y: number, angle: number, config: ProjectileConfig) {
    const projectile = this.enemyProjectiles.acquire();
    if (projectile) {
      projectile.fire(x, y, angle, config);
    }
  }

  update(_time: number, delta: number) {
    const now = this.time.now;
    this.player.update(delta);

    if (Phaser.Input.Keyboard.JustDown(this.reloadKey)) {
      this.weaponSystem.startReload(now);
    }
    this.weaponSystem.update(now);

    const { x: playerX, y: playerY } = this.player.sprite;
    this.enemies.forEach((enemy) => enemy.update(delta, playerX, playerY));

    // Modo auto: dispara continuamente enquanto o botão esquerdo está pressionado.
    if (this.weaponSystem.fireMode === 'auto' && this.input.activePointer.leftButtonDown()) {
      this.shootIfReady(now);
    }

    this.projectiles.forEachActive((projectile) => {
      if (!projectile.update(delta)) {
        this.projectiles.release(projectile);
      }
    });
    this.enemyProjectiles.forEachActive((projectile) => {
      if (!projectile.update(delta)) {
        this.enemyProjectiles.release(projectile);
      }
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (!pointer.leftButtonDown() || this.weaponSystem.fireMode !== 'semi') {
      return;
    }
    const now = this.time.now;
    if (!this.shootIfReady(now) && this.weaponSystem.isMagazineEmpty) {
      // Carregador vazio: o SFX de empty é plugado no AudioSystem (Sprint 11).
      this.onEmptyFire();
    }
  }

  // Dispara se houver munição/cadência/projétil disponíveis; retorna se atirou.
  private shootIfReady(now: number): boolean {
    if (!this.weaponSystem.canFire(now)) {
      return false;
    }
    const projectile = this.projectiles.acquire();
    if (!projectile) {
      return false;
    }
    this.weaponSystem.registerShot(now);
    const muzzle = this.player.getMuzzlePosition();
    projectile.fire(muzzle.x, muzzle.y, this.player.aimAngle, this.weaponSystem.projectile);
    this.player.triggerShootFeedback(this.weaponSystem.recoilAngle);
    return true;
  }

  private onEmptyFire() {
    // Ponto de gancho para o SFX de carregador vazio (Sprint 11, AudioSystem).
  }

  private createTemporaryGround() {
    // Chão provisório até a arena da fase 1 (etapa 11.1).
    const groundHeight = 40;
    const ground = this.add.rectangle(
      GAME.WIDTH / 2,
      GAME.HEIGHT - groundHeight / 2,
      GAME.WIDTH,
      groundHeight,
      PLACEHOLDER_TEXTURES[TEXTURE.PLATFORM].color
    );
    this.matter.add.gameObject(ground, { isStatic: true });
  }
}
