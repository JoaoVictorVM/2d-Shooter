export interface Aim {
  angle: number;
  facingLeft: boolean;
}

/**
 * Calcula o ângulo de mira da origem (arma) até o alvo (mouse) e para que lado
 * o alvo está (RF02). atan2 retorna radianos — a mesma unidade de `rotation` no
 * Phaser, então o valor é usado direto, sem conversão para graus.
 */
export function computeAim(
  originX: number,
  originY: number,
  targetX: number,
  targetY: number
): Aim {
  const angle = Math.atan2(targetY - originY, targetX - originX);
  return { angle, facingLeft: targetX < originX };
}
