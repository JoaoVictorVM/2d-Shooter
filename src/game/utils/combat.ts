/** Aplica dano a um valor de vida, sem deixar passar de 0. */
export function applyDamage(currentHealth: number, amount: number): number {
  return Math.max(0, currentHealth - amount);
}

export function isDefeated(health: number): boolean {
  return health <= 0;
}
