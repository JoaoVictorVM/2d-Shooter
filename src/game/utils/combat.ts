/** Aplica dano a um valor de vida, sem deixar passar de 0. */
export function applyDamage(currentHealth: number, amount: number): number {
  return Math.max(0, currentHealth - amount);
}

export function isDefeated(health: number): boolean {
  return health <= 0;
}

/** Razão de vida normalizada em [0, 1]. */
export function healthRatio(current: number, max: number): number {
  if (max <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, current / max));
}
