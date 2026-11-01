import { useEffect, useRef } from "react";
import { crossfadeIntro } from "../../animations/introAnimations";
import { localized, t } from "../../data/translations";

function Monogram({ data }) {
  const initials = data.monogram.initials.trim()
    ? data.monogram.initials
        .trim()
        .split(/[\s|&/·,+-]+/)
        .filter(Boolean)
    : data.family.names.groom.map((key) =>
        String(localized("en", data[key]))
          .replace(/^[^\p{L}]+/u, "")
          .charAt(0)
          .toUpperCase(),
      );
  return (
    <span className="mono-t">
      {initials.map((initial, index) => (
        <span key={`${initial}-${index}`}>
          {index > 0 && <i className="ms">{data.monogram.separator}</i>}
          {initial}
        </span>
      ))}
    </span>
  );
}

export function WeddingIntro({ data, language, invitationRef, onComplete }) {
  const gateRef = useRef(null);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readyPromiseRef = useRef(null);
  const openedRef = useRef(false);
  const transitioned = useRef(false);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let resolved = false;
    let resolveReady;
    readyPromiseRef.current = new Promise((resolve) => {
      resolveReady = resolve;
    });
    const ready = () => {
      if (resolved) return;
      resolved = true;
      video.classList.add("ready");
      resolveReady();
    };
    video.addEventListener("loadeddata", ready);
    video.addEventListener("canplay", ready);
    if (video.readyState >= 2) ready();
    return () => {
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("canplay", ready);
      readyPromiseRef.current = null;
    };
  }, []);

  const finish = () => {
    if (transitioned.current || !invitationRef.current) return;
    transitioned.current = true;
    crossfadeIntro({
      video: videoRef.current,
      invitation: invitationRef.current,
      controls: controlsRef.current,
      reducedMotion,
      onComplete: () => {
        gateRef.current?.classList.add("gate-complete");
        onComplete();
      },
    });
  };

  const openInvitation = () => {
    if (openedRef.current || !videoRef.current) return;
    openedRef.current = true;
    controlsRef.current?.querySelector(".open")?.classList.add("playing");
    const video = videoRef.current;
    const start = () => {
      video.currentTime = 0;
      video.muted = false;
      video
        .play()
        .then(() => {})
        .catch(() => {
          video.muted = true;
          video
            .play()
            .then(() => {})
            .catch(() => {
              openedRef.current = false;
              controlsRef.current
                ?.querySelector(".open")
                ?.classList.remove("playing");
            });
        });
    };
    if (video.readyState >= 2) {
      start();
    } else {
      readyPromiseRef.current?.then(start);
    }
  };

  return (
    <div ref={gateRef} className="gate" aria-label="Wedding invitation intro">
      <video
        ref={videoRef}
        className="gate-video"
        src={data.assets.video}
        playsInline
        preload="auto"
        muted
        onEnded={finish}
        poster="/assets/video-poster.webp"
        onError={() => {
          openedRef.current = false;
        }}
      />
      <div ref={controlsRef} className="gate-overlay">
        <div className="gm" aria-hidden="true">
          <Monogram data={data} />
        </div>
        <button className="open" onClick={openInvitation} type="button">
          {t(language, "open")}
        </button>
      </div>
    </div>
  );
}
