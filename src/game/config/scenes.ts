export const SCENE = {
  BOOT: 'Boot',
  PRELOAD: 'Preload',
} as const;

export type SceneKey = (typeof SCENE)[keyof typeof SCENE];
