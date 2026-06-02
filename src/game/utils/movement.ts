export interface HorizontalMovementConfig {
  maxSpeed: number;
  acceleration: number;
  friction: number;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/**
 * Integra a velocidade horizontal em px/s com aceleração suave e atrito (RF01).
 * - Com input: acelera por `acceleration * dt` na direção, limitado a ±maxSpeed.
 * - Sem input: desacelera por `friction * dt` até zerar, sem ultrapassar 0
 *   (evita o "tremor" de oscilar em torno de zero).
 */
export function computeHorizontalVelocity(
  currentVelocity: number,
  inputDirection: number,
  deltaSeconds: number,
  config: HorizontalMovementConfig
): number {
  if (inputDirection !== 0) {
    const direction = Math.sign(inputDirection);
    const accelerated = currentVelocity + direction * config.acceleration * deltaSeconds;
    return clamp(accelerated, -config.maxSpeed, config.maxSpeed);
  }

  const drop = config.friction * deltaSeconds;
  if (Math.abs(currentVelocity) <= drop) {
    return 0;
  }
  return currentVelocity - Math.sign(currentVelocity) * drop;
}
