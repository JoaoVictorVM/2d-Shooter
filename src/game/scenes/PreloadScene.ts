import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';
import { GAME } from '@/game/config/constants.ts';
import { PLACEHOLDER_TEXTURES, type TextureKey } from '@/game/config/assets.ts';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE.PRELOAD);
  }

  preload() {
    this.generatePlaceholderTextures();
  }

  create() {
    // Visualização temporária do catálogo de placeholders até a cena MainGame existir,
    // serve apenas para validar que todas as texturas foram registradas.
    this.renderPlaceholderCatalog();
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

  private renderPlaceholderCatalog() {
    const keys = Object.keys(PLACEHOLDER_TEXTURES) as TextureKey[];
    const columns = 4;
    const cellWidth = 220;
    const cellHeight = 140;
    const gridWidth = columns * cellWidth;
    const rows = Math.ceil(keys.length / columns);
    const gridHeight = rows * cellHeight;
    const originX = (GAME.WIDTH - gridWidth) / 2 + cellWidth / 2;
    const originY = (GAME.HEIGHT - gridHeight) / 2 + cellHeight / 2;

    keys.forEach((key, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = originX + column * cellWidth;
      const y = originY + row * cellHeight;

      this.add.image(x, y, key);
      this.add
        .text(x, y + cellHeight / 2 - 24, key, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#e6e6e6',
        })
        .setOrigin(0.5);
    });
  }
}
