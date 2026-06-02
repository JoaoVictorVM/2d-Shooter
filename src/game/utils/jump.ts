export interface JumpDecisionInput {
  now: number;
  lastGroundedTime: number;
  lastJumpPressedTime: number;
  coyoteTimeMs: number;
  jumpBufferMs: number;
}

/**
 * Decide se um pulo deve ser executado neste frame (RF01).
 * - Coyote time: ainda é possível pular por `coyoteTimeMs` após sair do chão.
 * - Jump buffer: um input de pulo registrado até `jumpBufferMs` antes de poder
 *   pular é "lembrado" e executado assim que ficar elegível.
 * Consumir os timestamps após pular (no chamador) é o que impede double jump.
 */
export function shouldJump(input: JumpDecisionInput): boolean {
  const withinCoyote = input.now - input.lastGroundedTime <= input.coyoteTimeMs;
  const withinBuffer = input.now - input.lastJumpPressedTime <= input.jumpBufferMs;
  return withinCoyote && withinBuffer;
}
