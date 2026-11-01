import { useEffect, useRef, useState } from "react";

export function useMusicPlayer(source) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const wasPlaying = useRef(false);
  const playingRef = useRef(false);
  useEffect(() => {
    const audio = new Audio(source);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    const handleVisibility = () => {
      if (document.hidden) {
        wasPlaying.current = playingRef.current;
        audio.pause();
        updatePlaying(false);
      } else if (wasPlaying.current) {
        audio.play().then(() => updatePlaying(true)).catch(() => updatePlaying(false));
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      audio.pause();
      audioRef.current = null;
    };
  }, [source]);
  const updatePlaying = (value) => {
    playingRef.current = value;
    setPlaying(value);
  };
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      updatePlaying(false);
    } else {
      audio.play().then(() => updatePlaying(true)).catch(() => updatePlaying(false));
    }
  };
  return { playing, toggleMusic };
}
