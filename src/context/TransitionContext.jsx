import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext(null);

export function TransitionProvider({ children }) {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const transitionTo = useCallback((path) => {
    setActive(true);
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setActive(false), 100);
    }, 500);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={transitionTo}>
      {children}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        opacity: active ? 1 : 0,
        pointerEvents: active ? "all" : "none",
        transition: "opacity 0.5s ease",
      }} />
    </TransitionContext.Provider>
  );
}

export function useTransitionNavigate() {
  return useContext(TransitionContext);
}