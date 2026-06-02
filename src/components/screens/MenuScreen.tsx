import { useGameStore } from '@/store/index.ts';
import './screens.css';

export function MenuScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const selectedWeapon = useGameStore((state) => state.selectedWeapon);

  return (
    <div className="screen">
      <h1 className="screen__title">2D SHOOTER</h1>

      <div className="screen__menu">
        <button className="btn btn--primary" type="button" onClick={() => setScreen('game')}>
          PLAY
        </button>
        <button className="btn" type="button" onClick={() => setScreen('weaponSelect')}>
          CHOOSE WEAPON
        </button>
      </div>

      <p className="screen__subtitle">WEAPON: {selectedWeapon.toUpperCase()}</p>
    </div>
  );
}
