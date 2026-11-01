export const weddingData = {
  groom: { en: "Sagar", hi: "तृप्ति" },
  bride: { en: "Trapti", hi: "सागर" },
  city: { en: "Agra", hi: "आगरा" },
  timezone: "Asia/Kolkata",
  siteUrl: "",
  assets: { music: "/assets/song.mp3", video: "/assets/video.mp4" },
  monogram: { initials: "", separator: "|" },
  family: {
    groom: {
      en: ["[Hosts line 1 — exactly as on card]", "[Late grandparents' blessings]", "[Lineage lines]", "[Awaiting your gracious presence]", "[Best compliments]"],
      hi: ["[कार्ड के अनुसार पंक्ति 1]"]
    },
    bride: { en: ["[Bride-side hosts — exactly as on card]"], hi: ["[वधू पक्ष]"] },
    names: { groom: ["groom", "bride"], bride: ["bride", "groom"] }
  },
  rsvp: [{ name: "[Name]", phone: "[+91 XXXXX XXXXX]" }],
  gallery: [],
  closingNote: { en: "[Thank-you note]", hi: "[धन्यवाद संदेश]" },
  functions: [
    { id: "haldi", title: { en: "[Haldi / Mehendi]", hi: "[हल्दी / मेहंदी]" }, start: "", end: "", venue: "[Venue]", address: "[Address]", dress: "[Dress code]" },
    { id: "sangeet", title: { en: "[Sangeet / Ring Ceremony]", hi: "[संगीत / रिंग सेरेमनी]" }, start: "", end: "", venue: "[Venue]", address: "[Address]", dress: "[Dress code]" },
    { id: "pheras", title: { en: "Baraat Swagat & Pheras", hi: "बारात स्वागत एवं फेरे" }, start: "", end: "", venue: "[Venue]", address: "[Address]", dress: "[Dress code]", muhurat: true, note: { en: "Followed by Dinner & Ashirwad", hi: "तत्पश्चात् भोजन एवं आशीर्वाद" } },
    { id: "reception", title: { en: "[Reception]", hi: "[रिसेप्शन]" }, start: "", end: "", venue: "[Venue]", address: "[Address]", dress: "[Dress code]" }
  ]
};
