import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { localized, t } from "../../data/translations";

const dateValue = (value) => (value ? new Date(value) : null);
const formatDate = (language, timezone, value) => {
  const date = dateValue(value);
  return date
    ? new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
        timeZone: timezone,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    : t(language, "date");
};
const formatTime = (language, timezone, value) => {
  const date = dateValue(value);
  return date
    ? new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
      }).format(date)
    : t(language, "time");
};
const calendarUrl = (language, data, event) => {
  const start = dateValue(event.start),
    end =
      dateValue(event.end) || (start && new Date(start.getTime() + 3600000));
  if (!start || !end) return null;
  const compact = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(localized(language, event.title))}&dates=${compact(start)}/${compact(end)}&location=${encodeURIComponent(`${event.venue}, ${event.address}`)}`;
};

function Monogram({ data, side }) {
  const initials = data.family.names[side].map((key) =>
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

export function InvitationPage({ data, language, side, invitationRef }) {
  const pageRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [videoModal, setVideoModal] = useState(false);
  const [toast, setToast] = useState("");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const events = data.functions;
  const names = data.family.names[side].map((key) =>
    localized(language, data[key]),
  );
  const posterImages = data.gallery.length ? data.gallery : [];

  useEffect(() => {
    let active = true;
    const prepare = async () => {
      await document.fonts?.ready;
      if (!active) return;
      await Promise.all(
        [...pageRef.current.querySelectorAll("img")].map((image) =>
          image.decode?.().catch(() => {}),
        ),
      );
    };
    prepare();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const sections = [...root.querySelectorAll("section")].slice(1);
    const context = gsap.context(() => {
      gsap.set(sections, { opacity: 0, y: 24 });
    }, root);
    const revealed = new WeakSet();
    const reveal = (section) => {
      if (revealed.has(section)) return;
      revealed.add(section);
      gsap.fromTo(
        section,
        { opacity: 0, y: 24, willChange: "transform,opacity" },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => gsap.set(section, { clearProps: "willChange" }),
        },
      );
    };
    const isInRevealViewport = (section) => {
      const bounds = section.getBoundingClientRect();
      return (
        bounds.top < window.innerHeight * 0.9 &&
        bounds.bottom > window.innerHeight * 0.1
      );
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!document.body.classList.contains("go")) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    const revealInitial = () => {
      sections.forEach((section) => {
        if (isInRevealViewport(section)) {
          reveal(section);
          observer.unobserve(section);
        } else {
          observer.observe(section);
        }
      });
    };
    const handleInvitationReady = () =>
      window.requestAnimationFrame(revealInitial);
    document.addEventListener("invitation:ready", handleInvitationReady);
    return () => {
      document.removeEventListener("invitation:ready", handleInvitationReady);
      observer.disconnect();
      context.revert();
    };
  }, []);
  useEffect(() => {
    const update = () => {
      const target = dateValue(events[2].start);
      if (!target) return setCountdown(null);
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0) return setCountdown("done");
      setCountdown(
        [
          remaining / 864e5,
          (remaining / 36e5) % 24,
          (remaining / 6e4) % 60,
          (remaining / 1e3) % 60,
        ].map(Math.floor),
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [events]);

  const copyLink = () =>
    navigator.clipboard
      ?.writeText(data.siteUrl || window.location.href)
      .then(() => {
        setToast(t(language, "copied"));
        window.setTimeout(() => setToast(""), 2000);
      });
  const share = () =>
    navigator.share
      ? navigator.share({
          title: "Shubh Vivah",
          url: data.siteUrl || window.location.href,
        })
      : window.open(
          `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
          "_blank",
          "noopener",
        );
  const saveCalendar = (event) => {
    const url = calendarUrl(language, data, event);
    if (url) window.open(url, "_blank", "noopener");
  };
  const gallery = useMemo(
    () => (posterImages.length ? posterImages : [0, 1, 2, 3, 4, 5]),
    [posterImages],
  );

  return (
    <>
      <main
        ref={(node) => {
          pageRef.current = node;
          invitationRef.current = node;
        }}
        lang={language}
        className="main-invitation"
      >
        <section id="hero" className="reference-hero" data-fl="rose">
          <header className="invitation-header">
            <span className="header-monogram"><Monogram data={data} side={side} /></span>
            <span className="menu-mark" aria-hidden="true"><i /><i /><i /></span>
          </header>
          <img className="hero-floral hero-floral-left" src="/assets/floaral.png" alt="" />
          <img className="hero-floral hero-floral-right" src="/assets/floaral.png" alt="" />
          <div className="reference-arch">
            <div className="arch-copy">
              <p className="sm">{t(language, "hero")}</p>
              <p className="gold-kicker">{localized(language, data.city)}</p>
            </div>
          </div>
          <h1 id="names" className="names">
            {names.map((name, index) => (
              <span key={name}>
                {index > 0 && (
                  <span className="amp">{language === "hi" ? "और" : "&"}</span>
                )}
                <span>
                  <span className="name-line">{name}</span>
                </span>
              </span>
            ))}
          </h1>
          <p className="tag">{t(language, "tag")}</p>
          <p className="sm">
            {formatDate(language, data.timezone, events[2].start)}
          </p>
          <div className="ornament-divider" aria-hidden="true">◆</div>
        </section>
        <section id="bless" className="blessing-section" data-fl="genda">
          <div className="gold-symbol" aria-hidden="true">❧</div>
          <h2>{t(language, "blessings")}</h2>
          <div className="dia" />
          <p className="shl hi">{t(language, "shloka")}</p>
          <p className="sm">{t(language, "shlokaTr")}</p>
        </section>
        <section id="invite" className="reference-invite" data-fl="lotus">
          <img className="section-floral section-floral-left" src="/assets/floaral.png" alt="" />
          <img className="section-floral section-floral-right" src="/assets/floaral.png" alt="" />
          <h2>{t(language, "inv")}</h2>
          <article className="card">
            <i className="c a" />
            <i className="c b" />
            <i className="c c2" />
            <i className="c d" />
            {(data.family[side][language] || data.family[side].en).map(
              (line) => (
                <p key={line}>{line}</p>
              ),
            )}
          </article>
        </section>
        <section id="landscape" className="landscape-section" data-fl="pink">
          <img src="/assets/palace.jpg" alt="Rajasthan palace beside a lotus lake" />
        </section>
        <section id="family" className="family-section" data-fl="genda">
          <h2>{t(language, "blessings")}</h2>
          <p className="tag">WITH BLESSINGS FROM</p>
          <div className="family-columns">
            <div className="family-column">
              <div className="family-icon" aria-hidden="true">ॐ</div>
              <p className="tag">OUR PARENTS</p>
              {(data.family[side][language] || data.family[side].en).slice(0, 3).map((line) => <p key={line}>{line}</p>)}
            </div>
            <div className="family-rule" aria-hidden="true" />
            <div className="family-column">
              <div className="family-icon lotus-icon" aria-hidden="true">❀</div>
              <p className="tag">OUR PARENTS</p>
              {(data.family[side][language] || data.family[side].en).slice(3, 6).map((line) => <p key={line}>{line}</p>)}
            </div>
          </div>
        </section>
        <section id="count" data-fl="pink">
          <h2>{t(language, "cd")}</h2>
          {Array.isArray(countdown) ? (
            <div className="cd">
              {countdown.map((value, index) => (
                <div key={index}>
                  <b>{String(value).padStart(2, "0")}</b>
                  <span>
                    {t(language, ["days", "hrs", "min", "sec"][index])}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="sm">
              {countdown === "done"
                ? t(language, "cdDone")
                : t(language, "cdNone")}
            </p>
          )}
        </section>
        <section id="funcs" data-fl="ashoka">
          <h2>{t(language, "fn")}</h2>
          <div className="tl">
            <div id="thread" />
            <div id="fl">
              {events.map((event) => (
                <article className="fc" key={event.id}>
                  <h3>{localized(language, event.title)}</h3>
                  <p className="d">
                    {formatDate(language, data.timezone, event.start)} ·{" "}
                    {formatTime(language, data.timezone, event.start)}
                    {event.end &&
                      ` – ${formatTime(language, data.timezone, event.end)}`}
                  </p>
                  <p>
                    <b>{event.venue}</b>
                    <br />
                    {event.address}
                  </p>
                  <p>
                    {t(language, "dress")}: {event.dress}
                  </p>
                  {event.muhurat && (
                    <p className="mu">
                      {t(language, "muh")} · {localized(language, event.note)}
                    </p>
                  )}
                  <div className="acts">
                    <a
                      className="pill"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`}
                    >
                      {t(language, "dir")}
                    </a>
                    {event.start && (
                      <>
                        <button
                          className="pill"
                          onClick={() => saveCalendar(event)}
                        >
                          {t(language, "cal")}
                        </button>
                        <button
                          className="pill"
                          onClick={() => saveCalendar(event)}
                        >
                          {t(language, "ics")}
                        </button>
                      </>
                    )}
                    {event.muhurat && (
                      <button
                        className="pill"
                        onClick={() => setVideoModal(true)}
                      >
                        {t(language, "film")}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="gallery" data-fl="bougain">
          <h2>{t(language, "gal")}</h2>
          <div className="masonry">
            {gallery.map((image, index) => (
              <div
                key={image}
                tabIndex="0"
                role="button"
                onClick={() => image && setLightbox(image)}
              >
                {image ? <img loading="lazy" src={image} alt="" /> : "❀"}
              </div>
            ))}
          </div>
        </section>
        <section id="closing" data-fl="gold">
          <h2>{t(language, "thanks")}</h2>
          <p className="sm">{localized(language, data.closingNote)}</p>
          <div className="acts">
            <button className="pill" onClick={share}>
              {t(language, "share")}
            </button>
            <button className="pill" onClick={copyLink}>
              {t(language, "copy")}
            </button>
            <button className="pill" onClick={() => window.print()}>
              {t(language, "pdf")}
            </button>
          </div>
          <h3>{t(language, "rsvp")}</h3>
          <div id="rs">
            {data.rsvp.map((contact) => (
              <p key={contact.phone}>
                {contact.name} —{" "}
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                  {contact.phone}
                </a>
              </p>
            ))}
          </div>
          <button
            id="tp"
            className="pill"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth",
              })
            }
          >
            {t(language, "top")}
          </button>
        </section>
      </main>
      {lightbox && (
        <div className="modal" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Close">
            ×
          </button>
          <img src={lightbox} alt="" />
        </div>
      )}
      {videoModal && (
        <div className="modal">
          <button onClick={() => setVideoModal(false)} aria-label="Close">
            ×
          </button>
          <video src={data.assets.video} controls playsInline autoPlay />
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
