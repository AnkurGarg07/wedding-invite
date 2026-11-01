import { useEffect, useState } from "react";

export function useLanguage() {
  const [language, setLanguage] = useState(() => localStorage.getItem("lang") || "en");
  const toggleLanguage = () => setLanguage((current) => current === "en" ? "hi" : "en");
  useEffect(() => {
    localStorage.setItem("lang", language);
    document.documentElement.lang = language;
  }, [language]);
  return { language, toggleLanguage };
}
