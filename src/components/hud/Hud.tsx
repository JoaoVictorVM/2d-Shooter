import { AmmoDisplay } from './AmmoDisplay.tsx';
import './hud.css';

export function Hud() {
  return (
    <div className="hud">
      <div className="hud__bottom-right">
        <AmmoDisplay />
      </div>
    </div>
  );
}
