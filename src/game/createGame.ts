/**
 * Premissas:
 * - Phaser 4 publica named exports no build ESM, mas seus tipos declaram
 *   `export = Phaser` (namespace). O namespace import casa runtime e tipos
 *   sob verbatimModuleSyntax.
 * - Câmera fixa 1280x720 (RF09): Scale.FIT mantém a proporção ao redimensionar
 *   a janela sem alterar a resolução lógica do jogo.
 * - A ordem do array de cenas define a primeira a rodar: Boot encadeia para Preload.
 */
import * as Phaser from 'phaser';
import { GAME } from './config/constants.ts';
import { BootScene } from './scenes/BootScene.ts';
import { PreloadScene } from './scenes/PreloadScene.ts';

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    backgroundColor: GAME.BACKGROUND_COLOR,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PreloadScene],
  };

  return new Phaser.Game(config);
}
