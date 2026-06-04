import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { GAME, POOL, HIT_SPARK } from '@/game/config/constants.ts';
import { TEXTURE, PLACEHOLDER_TEXTURES } from '@/game/config/assets.ts';
import { WEAPONS } from '@/game/config/weapons.ts';
import { Player } from '@/game/entities/Player.ts';
import { Projectile } from '@/game/entities/Projectile.ts';
import { WeaponSystem } from '@/game/systems/WeaponSystem.ts';
import { ObjectPool } from '@/game/utils/ObjectPool.ts';
import { createSparkEmitter } from '@/game/utils/ParticleFactory.ts';
import { useGameStore } from '@/store/index.ts';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;
  private projectiles!: ObjectPool<Projectile>;
  private hitSparks!: Phaser.GameObjects.Particles.ParticleEmitter;
  private weaponSystem!: WeaponSystem;

  constructor() {
    super(SCENE.MAIN_GAME);
  }

  create() {
    this.createTemporaryGround();
    // Spawn no centro do mapa, acima do chão (RF09).
    this.player = new Player(this, GAME.WIDTH / 2, GAME.HEIGHT / 2);
    this.projectiles = new ObjectPool(POOL.PROJECTILES, () => new Projectile(this));
    this.hitSparks = createSparkEmitter(this);
    this.weaponSystem = new WeaponSystem(WEAPONS[useGameStore.getState().selectedWeapon]);

    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  // Partículas de impacto ao acertar um inimigo (acionado na colisão do Sprint 7).
  emitHitSparks(x: number, y: number) {
    this.hitSparks.explode(HIT_SPARK.COUNT, x, y);
  }

  update(_time: number, delta: number) {
    this.player.update(delta);

    // Modo auto: dispara continuamente enquanto o botão esquerdo está pressionado.
    if (this.weaponSystem.fireMode === 'auto' && this.input.activePointer.leftButtonDown()) {
      this.attemptFire();
    }

    this.projectiles.forEachActive((projectile) => {
      if (!projectile.update(delta)) {
        this.projectiles.release(projectile);
      }
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    // Modo semi: um tiro por clique (a cadência ainda limita cliques rápidos).
    if (pointer.leftButtonDown() && this.weaponSystem.fireMode === 'semi') {
      this.attemptFire();
    }
  }

  private attemptFire() {
    const now = this.time.now;
    if (!this.weaponSystem.canFire(now)) {
      return;
    }
    const projectile = this.projectiles.acquire();
    if (!projectile) {
      return;
    }
    this.weaponSystem.registerShot(now);
    const muzzle = this.player.getMuzzlePosition();
    projectile.fire(muzzle.x, muzzle.y, this.player.aimAngle, this.weaponSystem.projectile);
    this.player.triggerShootFeedback(this.weaponSystem.recoilAngle);
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
