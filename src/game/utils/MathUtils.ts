export interface Vector2 {
  x: number;
  y: number;
}

/** Decompõe uma velocidade escalar (px/s) num vetor a partir do ângulo (radianos). */
export function velocityFromAngle(angle: number, speed: number): Vector2 {
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
}
