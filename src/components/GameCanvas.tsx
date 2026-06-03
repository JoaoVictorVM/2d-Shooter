import { useEffect, useRef } from 'react';
import { createGame } from '@/game/createGame.ts';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  // ReturnType evita importar o tipo Phaser.Game aqui só para anotar a ref.
  const gameRef = useRef<ReturnType<typeof createGame> | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = createGame(containerRef.current);
    if (import.meta.env.DEV) {
      window.__GAME__ = gameRef.current;
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      if (import.meta.env.DEV) {
        window.__GAME__ = undefined;
      }
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" />;
}
