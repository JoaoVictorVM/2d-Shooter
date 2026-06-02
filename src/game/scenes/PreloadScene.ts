import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { PLACEHOLDER_TEXTURES, type TextureKey } from '@/game/config/assets.ts';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE.PRELOAD);
  }

  preload() {
    this.generatePlaceholderTextures();
  }

  create() {
    this.scene.start(SCENE.MAIN_GAME);
  }

  private generatePlaceholderTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    (Object.keys(PLACEHOLDER_TEXTURES) as TextureKey[]).forEach((key) => {
      const { width, height, color } = PLACEHOLDER_TEXTURES[key];
      graphics.clear();
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.generateTexture(key, width, height);
    });

    graphics.destroy();
  }
}
