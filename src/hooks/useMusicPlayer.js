import { useEffect, useRef, useState } from "react";

export function useMusicPlayer(source) {
  const audioRef = useRef(null);
  const sourceRef = useRef(source);
  const [playing, setPlaying] = useState(false);
  const wasPlaying = useRef(false);
  const playingRef = useRef(false);
  sourceRef.current = source;
  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
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
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);
  const updatePlaying = (value) => {
    playingRef.current = value;
    setPlaying(value);
  };
  const toggleMusic = () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(sourceRef.current);
      audio.loop = true;
      audio.volume = 0.5;
      audioRef.current = audio;
    }
    if (playing) {
      audio.pause();
      updatePlaying(false);
    } else {
      audio.play().then(() => updatePlaying(true)).catch(() => updatePlaying(false));
    }
  };
  return { playing, toggleMusic };
}
