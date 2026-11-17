/* ==========================================================================
   PANPALS · SITE SETTINGS
   Bütün linkler, mail adresleri ve genel ayarlar burada.
   Sadece tırnak içindeki değerleri değiştir, virgülleri silme.
   ========================================================================== */

window.PANPALS_CONFIG = {
  appStoreUrl: "https://apps.apple.com/app/panpals/id6692625850",
  contactEmail: "contact@panpals.co",

  /* Sosyal hesaplar. Boş bırakılan ("") hesap sitede hiç görünmez.
     handle: sitede yazı olarak görünen kullanıcı adı */
  social: {
    instagram: { url: "https://www.instagram.com/panpals.app/", handle: "@panpals.app" },
    tiktok:    { url: "https://www.tiktok.com/@panpals.app",    handle: "@panpals.app" },
    substack:  { url: "https://panpalsapp.substack.com/",       handle: "PanPals Editorial" },
    linkedin:  { url: "https://www.linkedin.com/company/panpals/", handle: "PanPals" },
    threads:   { url: "https://www.threads.net/@panpals.app",   handle: "@panpals.app" },
    x:         { url: "https://x.com/panpals_app",              handle: "@panpals_app" }
  },

  /* ANDROID WAITLIST
     1) https://formspree.io adresinde ücretsiz bir form aç.
     2) Verdiği adresi (örn. "https://formspree.io/f/abcdwxyz") aşağıya yapıştır.
     Boş kalırsa form, ziyaretçinin mail uygulamasını hazır bir mail ile açar. */
  waitlistEndpoint: "",

  /* Sağ üstteki mod düğmesinin üzerine gelince görünen isimler */
  modeNames: { sleek: "Pro mode", game: "Game mode" },

  /* NEWS: Substack, Instagram ve TikTok kaynakları data/sources.json içinde.
     GitHub her 6 saatte bir otomatik günceller (README'ye bak). */

  /* DERGİ: News sayfasının sonunda sayfa sayfa çevrilir.
     Sayfalar assets/magazine/p-01.jpg ... p-62.jpg (her görsel iki sayfalık bir açılım). */
  magazine: {
    title: "PanPals Editorial",
    folder: "assets/magazine/",
    count: 62,
    spreads: true
  },

  thesis: {
    /* Tez sayfaları görsel olarak gösterilir (PDF indirilemez). assets/thesis/pages/t-01.jpg ... */
    pages: 38,
    skip: [2], /* silinen sayfaların numaraları */
    title: "Track, Share, Play: Using PanPals App To Motivate Home Cooking",
    author: "Esin Cansu Yılmaz",
    program: "MSc Behavioural Science",
    university: "The London School of Economics",
    year: "2024"
  }
};
