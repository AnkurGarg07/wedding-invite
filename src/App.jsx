import { useEffect, useRef, useState } from "react";
import { Controls } from "./components/layout/Controls";
import { WeddingIntro } from "./components/intro/WeddingIntro";
import { InvitationPage } from "./components/invitation/InvitationPage";
import { useLanguage } from "./hooks/useLanguage";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { weddingData } from "./data/weddingData";
import "./styles/index.css";

export default function App() {
  const { language, toggleLanguage } = useLanguage();
  const { playing, toggleMusic } = useMusicPlayer(weddingData.assets.music);
  const invitationRef = useRef(null);
  const [side, setSide] = useState(() => window.location.hash === "#bride" ? "bride" : "groom");

  useEffect(() => {
    const handleHash = () => setSide(window.location.hash === "#bride" ? "bride" : "groom");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.body.classList.add("lock");
    return () => {
      window.history.scrollRestoration = previousRestoration;
      document.body.classList.remove("lock", "go");
    };
  }, []);

  return (
    <div className="app-viewport">
      <div className="app-shell">
        <canvas id="fx" aria-hidden="true" />
        <Controls language={language} toggleLanguage={toggleLanguage} playing={playing} toggleMusic={toggleMusic} />
        <InvitationPage data={weddingData} language={language} side={side} invitationRef={invitationRef} />
        <WeddingIntro
          data={weddingData}
          language={language}
          invitationRef={invitationRef}
          onComplete={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            document.body.classList.remove("lock");
            document.body.classList.add("go");
            document.getElementById("initial-poster")?.remove();
            document.dispatchEvent(new Event("invitation:ready"));
          }}
        />
      </div>
    </div>
  );
}
