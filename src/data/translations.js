export const translations = {
  en: {
    open: "Open Invitation", tag: "Shubh Vivah", blessings: "Blessings",
    shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    shlokaTr: "O Lord of the curved trunk, radiant as a million suns, remove all obstacles from our undertakings, always.",
    inv: "Invitation", cd: "Countdown to the Shubh Muhurat", days: "Days", hrs: "Hours", min: "Minutes", sec: "Seconds",
    cdDone: "The Shubh Muhurat has begun", cdNone: "Muhurat time to be added", fn: "Wedding Functions",
    dress: "Dress code", dir: "Get Directions", cal: "Google Calendar", ics: "Add .ics", film: "Watch the invitation film",
    muh: "Shubh Muhurat", gal: "Gallery", thanks: "With Gratitude", share: "Share", copy: "Copy link",
    copied: "Link copied", pdf: "Save as PDF", rsvp: "R.S.V.P.", top: "Back to top", date: "[Date]", time: "[Time]",
    play: "Music", hero: "Together with their families"
  },
  hi: {
    open: "निमंत्रण खोलें", tag: "शुभ विवाह", blessings: "आशीर्वाद",
    shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    shlokaTr: "हे वक्रतुण्ड, महाकाय, करोड़ों सूर्यों के समान तेजस्वी देव, हमारे सभी कार्य सदा निर्विघ्न करें।",
    inv: "निमंत्रण", cd: "शुभ मुहूर्त की प्रतीक्षा", days: "दिन", hrs: "घंटे", min: "मिनट", sec: "सेकंड",
    cdDone: "शुभ मुहूर्त आरंभ हो चुका है", cdNone: "मुहूर्त का समय जोड़ा जाना है", fn: "विवाह कार्यक्रम",
    dress: "परिधान", dir: "मार्ग देखें", cal: "गूगल कैलेंडर", ics: ".ics जोड़ें", film: "निमंत्रण फ़िल्म देखें",
    muh: "शुभ मुहूर्त", gal: "चित्र-दीर्घा", thanks: "हार्दिक आभार", share: "साझा करें", copy: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया", pdf: "PDF सहेजें", rsvp: "R.S.V.P.", top: "ऊपर जाएँ", date: "[तिथि]", time: "[समय]",
    play: "संगीत", hero: "परिवारजनों सहित"
  }
};

export const t = (lang, key) => translations[lang]?.[key] || key;
export const localized = (lang, value) => value == null ? "" : typeof value === "string" ? value : value[lang] || value.en || "";
