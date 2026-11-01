export function crossfadeIntro({ video, invitation, controls, onComplete, reducedMotion }) {
  if (!video || !invitation) return null;
  const gate = video.closest(".gate");
  if (reducedMotion) {
    gate?.classList.add("intro-complete");
    invitation.classList.add("invitation-visible");
    controls?.classList.add("controls-hidden");
    onComplete?.();
    return null;
  }
  gate?.classList.add("intro-complete");
  invitation.classList.add("invitation-visible");
  controls?.classList.add("controls-hidden");
  window.setTimeout(() => onComplete?.(), 1600);
  return null;
}
