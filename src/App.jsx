import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { TransitionProvider } from "./context/TransitionContext";
import SplashScreen from "./components/SplashScreen";
import LoadingScreen from "./components/LoadingScreen";
import HomeScreen from "./components/HomeScreen";
import HowToPlay from "./components/HowToPlay";
import CategoryScreen from "./components/CategoryScreen";
import GameSettings from "./components/GameSettings";
import Gameplay from "./components/Gameplay";
import UpgradeScreen from "./components/UpgradeScreen";

function Intro() {
  const [screen, setScreen] = useState("splash");
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setScreen("loading"), 3800);
    const t2 = setTimeout(() => navigate("/home"), 7800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {screen === "splash" && <SplashScreen />}
      {screen === "loading" && <LoadingScreen />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/category" element={<CategoryScreen />} />
          <Route path="/new-game" element={<GameSettings />} />
          <Route path="/gameplay" element={<Gameplay />} />
          <Route path="/upgrade" element={<UpgradeScreen />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}

export default App;