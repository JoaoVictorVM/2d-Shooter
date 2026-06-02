import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from './uiStore.ts';

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ isPaused: false, masterVolume: 1 });
  });

  it('toggles pause state', () => {
    useUiStore.getState().togglePause();
    expect(useUiStore.getState().isPaused).toBe(true);
    useUiStore.getState().togglePause();
    expect(useUiStore.getState().isPaused).toBe(false);
  });

  it('clamps master volume to the 0..1 range', () => {
    useUiStore.getState().setMasterVolume(2);
    expect(useUiStore.getState().masterVolume).toBe(1);
    useUiStore.getState().setMasterVolume(-0.5);
    expect(useUiStore.getState().masterVolume).toBe(0);
    useUiStore.getState().setMasterVolume(0.3);
    expect(useUiStore.getState().masterVolume).toBeCloseTo(0.3);
  });

  it('reset restores defaults', () => {
    const store = useUiStore.getState();
    store.setPaused(true);
    store.setMasterVolume(0.2);
    store.reset();
    const state = useUiStore.getState();
    expect(state.isPaused).toBe(false);
    expect(state.masterVolume).toBe(1);
  });
});
