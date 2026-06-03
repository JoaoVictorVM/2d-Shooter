export {};

declare global {
  interface Window {
    // Handle de debug exposto apenas em DEV (ver GameCanvas) para inspeção manual.
    __GAME__?: import('phaser').Game;
  }
}
