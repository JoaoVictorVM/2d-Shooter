import { useWeaponStore } from '@/store/index.ts';

export function AmmoDisplay() {
  const magazineAmmo = useWeaponStore((state) => state.magazineAmmo);
  const reserveAmmo = useWeaponStore((state) => state.reserveAmmo);
  const isReloading = useWeaponStore((state) => state.isReloading);
  const reloadProgress = useWeaponStore((state) => state.reloadProgress);

  const reserveLabel = reserveAmmo < 0 ? '∞' : reserveAmmo;

  return (
    <div className="ammo">
      <div className="ammo__counts">
        <span className="ammo__magazine">{magazineAmmo}</span>
        <span className="ammo__sep">/</span>
        <span className="ammo__reserve">{reserveLabel}</span>
      </div>
      {isReloading && (
        <div className="ammo__reload" role="progressbar">
          <div
            className="ammo__reload-fill"
            style={{ width: `${Math.round(reloadProgress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
