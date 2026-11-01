import gsap from "gsap";

export function crossfadeIntro({ video, invitation, controls, onComplete, reducedMotion }) {
  if (!video || !invitation) return null;
  const context = gsap.context(() => {});
  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete: () => {
      gsap.set([video, invitation], { clearProps: "willChange" });
      onComplete?.();
    }
  });
  if (reducedMotion) {
    timeline.set([video, controls], { opacity: 0 })
      .set(invitation, { opacity: 1, scale: 1 });
    return { timeline, context };
  }
  timeline
    .set([video, invitation], { willChange: "transform,opacity" })
    .set(invitation, { opacity: 0, scale: 0.985 })
    .to(video, { opacity: 0, scale: 1.02, duration: 1.6, ease: "power2.inOut", force3D: true }, 0)
    .to(invitation, { opacity: 1, scale: 1, duration: 1.6, ease: "power3.out", force3D: true }, 0)
    .to(controls, { opacity: 0, duration: 1.6, ease: "power2.inOut" }, 0);
  return { timeline, context };
}
