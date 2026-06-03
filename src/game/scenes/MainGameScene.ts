import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { GAME, POOL } from '@/game/config/constants.ts';
import { TEXTURE, PLACEHOLDER_TEXTURES } from '@/game/config/assets.ts';
import { WEAPONS } from '@/game/config/weapons.ts';
import { Player } from '@/game/entities/Player.ts';
import { Projectile } from '@/game/entities/Projectile.ts';
import { ObjectPool } from '@/game/utils/ObjectPool.ts';
import { useGameStore } from '@/store/index.ts';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;
  private projectiles!: ObjectPool<Projectile>;

  constructor() {
    super(SCENE.MAIN_GAME);
  }

  create() {
    this.createTemporaryGround();
    // Spawn no centro do mapa, acima do chão (RF09).
    this.player = new Player(this, GAME.WIDTH / 2, GAME.HEIGHT / 2);
    this.projectiles = new ObjectPool(POOL.PROJECTILES, () => new Projectile(this));

    this.input.on('pointerdown', this.handlePointerDown, this);
  }

  update(_time: number, delta: number) {
    this.player.update(delta);
    this.projectiles.forEachActive((projectile) => {
      if (!projectile.update(delta)) {
        this.projectiles.release(projectile);
      }
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (pointer.leftButtonDown()) {
      this.fireProjectile();
    }
  }

  private fireProjectile() {
    const projectile = this.projectiles.acquire();
    if (!projectile) {
      return;
    }
    const weaponId = useGameStore.getState().selectedWeapon;
    const muzzle = this.player.getMuzzlePosition();
    projectile.fire(muzzle.x, muzzle.y, this.player.aimAngle, WEAPONS[weaponId].projectile);
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
