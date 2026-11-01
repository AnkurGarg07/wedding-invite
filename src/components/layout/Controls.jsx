import { t } from "../../data/translations";

export function Controls({ language, toggleLanguage, playing, toggleMusic }) {
  return (
    <header className="bar">
      <button className="pill" aria-pressed={playing} onClick={toggleMusic}>
        ♪ {t(language, "play")} {playing ? "❚❚" : "▶"}
      </button>
      <button className="pill" aria-label="Language" onClick={toggleLanguage}>
        {language === "en" ? "हिंदी" : "English"}
      </button>
    </header>
  );
}
