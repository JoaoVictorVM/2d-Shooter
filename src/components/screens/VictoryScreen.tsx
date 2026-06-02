import { useGameStore } from '@/store/index.ts';
import './screens.css';

export function VictoryScreen() {
  const score = useGameStore((state) => state.score);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const incrementPhase = useGameStore((state) => state.incrementPhase);
  const setCurrentWave = useGameStore((state) => state.setCurrentWave);
  const setScreen = useGameStore((state) => state.setScreen);

  const goToNextPhase = () => {
    incrementPhase();
    setCurrentWave(0);
    setScreen('game');
  };

  return (
    <div className="screen">
      <h1 className="screen__title screen__title--victory">VICTORY</h1>

      <p className="screen__subtitle">PHASE {currentPhase} CLEARED</p>
      <p className="screen__score">
        SCORE: <strong>{score}</strong>
      </p>

      <button className="btn btn--primary" type="button" onClick={goToNextPhase}>
        NEXT PHASE
      </button>
    </div>
  );
}
