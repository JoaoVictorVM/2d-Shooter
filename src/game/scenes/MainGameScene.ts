import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { GAME } from '@/game/config/constants.ts';
import { TEXTURE, PLACEHOLDER_TEXTURES } from '@/game/config/assets.ts';
import { Player } from '@/game/entities/Player.ts';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;

  constructor() {
    super(SCENE.MAIN_GAME);
  }

  create() {
    this.createTemporaryGround();
    // Spawn no centro do mapa, acima do chão (RF09).
    this.player = new Player(this, GAME.WIDTH / 2, GAME.HEIGHT / 2);
  }

  update(_time: number, delta: number) {
    this.player.update(delta);
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
