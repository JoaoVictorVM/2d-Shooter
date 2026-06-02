/**
 * Premissas:
 * - Phaser 4 publica named exports no build ESM, mas seus tipos declaram
 *   `export = Phaser` (namespace). O namespace import casa runtime e tipos
 *   sob verbatimModuleSyntax.
 * - Câmera fixa 1280x720 (RF09): Scale.FIT mantém a proporção ao redimensionar
 *   a janela sem alterar a resolução lógica do jogo.
 * - Cenas (Boot/Preload/...) são registradas em etapas posteriores; aqui o array
 *   fica vazio de propósito — esta etapa entrega apenas a montagem do Phaser.
 */
import * as Phaser from 'phaser';
import { GAME } from './config/constants.ts';

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
    scene: [],
  };

  return new Phaser.Game(config);
}
