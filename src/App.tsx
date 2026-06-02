import { useGameStore } from './store/index.ts';
import { GameCanvas } from './components/GameCanvas.tsx';
import { MenuScreen } from './components/screens/MenuScreen.tsx';

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);
  const setScreen = useGameStore((state) => state.setScreen);

  switch (currentScreen) {
    case 'menu':
      return <MenuScreen />;
    case 'game':
      return <GameCanvas />;
    default:
      // Fallback temporário para telas ainda não implementadas (etapas 3.2–3.4).
      return (
        <div className="screen">
          <p className="screen__subtitle">{currentScreen.toUpperCase()} — em construção</p>
          <button className="btn" type="button" onClick={() => setScreen('menu')}>
            BACK TO MENU
          </button>
        </div>
      );
  }
}

export default App;
