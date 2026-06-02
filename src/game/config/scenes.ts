export const SCENE = {
  BOOT: 'Boot',
  PRELOAD: 'Preload',
  MAIN_GAME: 'MainGame',
} as const;

export type SceneKey = (typeof SCENE)[keyof typeof SCENE];
