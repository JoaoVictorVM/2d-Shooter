import { create } from 'zustand';
import type { WeaponRuntimeState } from '@/types/index.ts';

interface WeaponActions {
  initAmmo: (magazineAmmo: number, reserveAmmo: number) => void;
  setMagazineAmmo: (magazineAmmo: number) => void;
  setReserveAmmo: (reserveAmmo: number) => void;
  setReloading: (isReloading: boolean) => void;
  setReloadProgress: (reloadProgress: number) => void;
  reset: () => void;
}

export type WeaponStore = WeaponRuntimeState & WeaponActions;

const initialState: WeaponRuntimeState = {
  magazineAmmo: 0,
  reserveAmmo: 0,
  isReloading: false,
  reloadProgress: 0,
};

export const useWeaponStore = create<WeaponStore>((set) => ({
  ...initialState,
  initAmmo: (magazineAmmo, reserveAmmo) => set({ magazineAmmo, reserveAmmo }),
  setMagazineAmmo: (magazineAmmo) => set({ magazineAmmo }),
  setReserveAmmo: (reserveAmmo) => set({ reserveAmmo }),
  setReloading: (isReloading) => set({ isReloading }),
  setReloadProgress: (reloadProgress) => set({ reloadProgress }),
  reset: () => set({ ...initialState }),
}));
