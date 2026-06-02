import { useGameStore } from '@/store/index.ts';
import './screens.css';

export function GameOverScreen() {
  const score = useGameStore((state) => state.score);
  const reset = useGameStore((state) => state.reset);

  return (
    <div className="screen">
      <h1 className="screen__title screen__title--danger">GAME OVER</h1>

      <p className="screen__score">
        SCORE: <strong>{score}</strong>
      </p>

      <button className="btn btn--primary" type="button" onClick={reset}>
        RESTART
      </button>
    </div>
  );
}
