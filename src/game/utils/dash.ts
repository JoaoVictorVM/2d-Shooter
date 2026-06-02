export interface DashAvailabilityInput {
  now: number;
  lastDashTime: number;
  cooldownMs: number;
  isOnGround: boolean;
}

/**
 * Dash só pode iniciar no chão e após o cooldown desde o último dash (RF01).
 * lastDashTime = -Infinity (nunca dashou) torna o cooldown trivialmente satisfeito.
 */
export function canStartDash(input: DashAvailabilityInput): boolean {
  return input.isOnGround && input.now - input.lastDashTime >= input.cooldownMs;
}

/** Verdadeiro enquanto `now` está dentro de [startTime, startTime + durationMs). */
export function isWithinWindow(now: number, startTime: number, durationMs: number): boolean {
  return now - startTime < durationMs;
}
