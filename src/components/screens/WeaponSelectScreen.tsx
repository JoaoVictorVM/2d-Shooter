import { useGameStore } from '@/store/index.ts';
import { WEAPON_LIST } from '@/game/config/weapons.ts';
import type { WeaponId } from '@/types/index.ts';
import './screens.css';

export function WeaponSelectScreen() {
  const setScreen = useGameStore((state) => state.setScreen);
  const setSelectedWeapon = useGameStore((state) => state.setSelectedWeapon);
  const selectedWeapon = useGameStore((state) => state.selectedWeapon);

  const selectWeapon = (id: WeaponId) => {
    setSelectedWeapon(id);
    setScreen('menu');
  };

  return (
    <div className="screen">
      <h1 className="screen__title">SELECT WEAPON</h1>

      <div className="weapon-list">
        {WEAPON_LIST.map((weapon) => {
          const isActive = weapon.id === selectedWeapon;
          return (
            <button
              key={weapon.id}
              type="button"
              className={isActive ? 'weapon-card weapon-card--active' : 'weapon-card'}
              onClick={() => selectWeapon(weapon.id)}
            >
              <div className="weapon-card__header">
                <span className="weapon-card__name">{weapon.displayName}</span>
                {isActive && <span className="weapon-card__badge">ACTIVE</span>}
              </div>
              <dl className="weapon-card__stats">
                <div>
                  <dt>DMG</dt>
                  <dd>{weapon.projectile.damage}</dd>
                </div>
                <div>
                  <dt>RATE</dt>
                  <dd>{weapon.fireRate}ms</dd>
                </div>
                <div>
                  <dt>MAG</dt>
                  <dd>{weapon.magazineSize}</dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      <button className="btn" type="button" onClick={() => setScreen('menu')}>
        BACK
      </button>
    </div>
  );
}
