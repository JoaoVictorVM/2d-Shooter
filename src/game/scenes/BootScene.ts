import * as Phaser from 'phaser';
import { SCENE } from '@/game/config/scenes.ts';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE.BOOT);
  }

  create() {
    // Sem arquivos a carregar no MVP (assets são gerados no Preload), então o Boot
    // apenas encadeia para a cena de preload.
    this.scene.start(SCENE.PRELOAD);
  }
}
