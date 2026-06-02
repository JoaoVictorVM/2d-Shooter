import { describe, it, expect } from 'vitest';
import { shouldJump, type JumpDecisionInput } from './jump.ts';

const base: JumpDecisionInput = {
  now: 1000,
  lastGroundedTime: 1000,
  lastJumpPressedTime: 1000,
  coyoteTimeMs: 80,
  jumpBufferMs: 100,
};

describe('shouldJump', () => {
  it('jumps when grounded and pressed on the same frame', () => {
    expect(shouldJump(base)).toBe(true);
  });

  it('allows a jump within the coyote window after leaving the ground', () => {
    expect(shouldJump({ ...base, lastGroundedTime: base.now - 50 })).toBe(true);
  });

  it('rejects a jump once the coyote window has elapsed', () => {
    expect(shouldJump({ ...base, lastGroundedTime: base.now - 120 })).toBe(false);
  });

  it('executes a buffered press that landed slightly before becoming grounded', () => {
    expect(shouldJump({ ...base, lastJumpPressedTime: base.now - 80 })).toBe(true);
  });

  it('ignores a press older than the jump buffer window', () => {
    expect(shouldJump({ ...base, lastJumpPressedTime: base.now - 150 })).toBe(false);
  });

  it('does not jump when airborne with no recent ground or press', () => {
    expect(
      shouldJump({ ...base, lastGroundedTime: -Infinity, lastJumpPressedTime: -Infinity })
    ).toBe(false);
  });
});
