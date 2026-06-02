import { useGameStore } from './store/index.ts';
import { GameCanvas } from './components/GameCanvas.tsx';
import { MenuScreen } from './components/screens/MenuScreen.tsx';
import { WeaponSelectScreen } from './components/screens/WeaponSelectScreen.tsx';
import { GameOverScreen } from './components/screens/GameOverScreen.tsx';
import { VictoryScreen } from './components/screens/VictoryScreen.tsx';

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  switch (currentScreen) {
    case 'menu':
      return <MenuScreen />;
    case 'weaponSelect':
      return <WeaponSelectScreen />;
    case 'game':
      return <GameCanvas />;
    case 'gameOver':
      return <GameOverScreen />;
    case 'victory':
      return <VictoryScreen />;
    default:
      return null;
  }
}

export default App;
