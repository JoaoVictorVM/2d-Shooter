export interface Vector2 {
  x: number;
  y: number;
}

/** Decompõe uma velocidade escalar (px/s) num vetor a partir do ângulo (radianos). */
export function velocityFromAngle(angle: number, speed: number): Vector2 {
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
}

/** Ponto a `distance` px de (x, y) na direção do ângulo (radianos) — ex.: ponta da arma. */
export function offsetByAngle(x: number, y: number, angle: number, distance: number): Vector2 {
  const offset = velocityFromAngle(angle, distance);
  return { x: x + offset.x, y: y + offset.y };
}
