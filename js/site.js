/* ==========================================================================
   PANPALS · SHARED SITE SCRIPT
   Header, footer, Sleek / Game Mode geçişi, formlar ve küçük yardımcılar.
   Menüye link eklemek/çıkarmak için aşağıdaki NAV listesini düzenle.
   ========================================================================== */

(function () {
  const C = window.PANPALS_CONFIG || {};

  /* ---- Menü (sağ üst) ---- */
  const NAV = [
    { href: "about.html", label: "About & Team", id: "about" },
    { href: "thesis.html", label: "Thesis", id: "thesis" },
    { href: "news.html", label: "News", id: "news" },
    { href: "contact.html", label: "Contact", id: "contact" }
  ];

  /* ---- Sosyal hesap isimleri (sıra burada) ---- */
  const SOCIAL_NAMES = { instagram: "Instagram", tiktok: "TikTok", substack: "Substack", linkedin: "LinkedIn", threads: "Threads", x: "X" };

  const I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    pro: '<svg class="ic-pro" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 4-3 7h3v11"/></svg>',
    game: '<svg class="ic-game" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12a4 4 0 0 1 3.9 4.9l-1 4.2a2.4 2.4 0 0 1-4.1 1L15 16H9l-1.8 2.1a2.4 2.4 0 0 1-4.1-1l-1-4.2A4 4 0 0 1 6 8z"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01"/></svg>',
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.47V9.67a5.7 5.7 0 0 0-6.5 5.63A5.7 5.7 0 0 0 9.85 21a5.7 5.7 0 0 0 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48z"/></svg>',
    substack: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3h16v2.4H4zm0 4.6h16V10H4zM4 12.2h16V21l-8-4.5L4 21z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21h-4z"/></svg>',
    threads: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M16.8 10.7c-.5-2.6-2.3-3.9-4.7-3.9-3 0-4.9 2.2-4.9 5.3s1.9 5.5 5 5.5c2.4 0 4.2-1.3 4.2-3.4 0-1.9-1.5-3-3.6-3-2 0-3.3 1-3.3 2.4 0 1.2 1 2 2.3 2 2.2 0 3.3-1.8 3.3-5 0-5-3-7.3-6.6-7.3C4.9 3.3 2.9 6.9 2.9 12s2.5 8.7 7.9 8.7c3.7 0 6.3-1.6 7.5-4.6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>'
  };
  window.PP_ICONS = I;
  window.PP_SOCIAL_NAMES = SOCIAL_NAMES;

  const page = document.body.dataset.page || "";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  window.PP_ESC = esc;
  window.PP_SOCIALS = () => Object.keys(SOCIAL_NAMES).map((k) => Object.assign({ key: k, name: SOCIAL_NAMES[k] }, (C.social || {})[k] || {})).filter((s) => s.url);

  window.PP_PHOTO = function (src, name, alt) {
    const initials = (name || "?").trim().charAt(0).toUpperCase();
    return '<div class="ph"><span class="initials" aria-hidden="true">' + esc(initials) + "</span>" +
      (src ? '<img src="' + esc(src) + '" alt="' + esc(alt || name) + '" loading="lazy" onerror="this.remove()">' : "") + "</div>";
  };
  window.PP_APPSTORE = () => '<a class="appstore" href="' + esc(C.appStoreUrl) + '" target="_blank" rel="noopener">' + I.apple + "<span><small>Download on the</small><b>App Store</b></span></a>";

  /* ---- Header ---- */
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="PanPals home"><img class="logo" src="assets/brand/logo.svg" alt=""><img class="wordmark" src="assets/brand/wordmark.png" alt="PanPals"></a>' +
        '<a class="btn btn--small header-cta" href="index.html#download">Become a Pal</a>' +
        '<nav class="nav" aria-label="Main">' + NAV.map((n) => '<a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : "") + ">" + n.label + "</a>").join("") + "</nav>" +
        '<button class="mode-switch" type="button" data-mode-switch><span class="knob">' + I.pro + I.game + "</span></button>" +
        '<button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false">' + I.menu + "</button>" +
      "</div>";
    const mm = document.createElement("div");
    mm.className = "mobile-menu";
    mm.innerHTML = '<a href="index.html">Home</a>' + NAV.map((n) => '<a href="' + n.href + '">' + n.label + "</a>").join("") + '<a href="careers.html">Careers</a>' +
      '<div class="cta-row">' + window.PP_APPSTORE() + '<a class="btn btn--soft" href="index.html#download">Become a Pal</a></div>';
    header.after(mm);
    const mb = header.querySelector(".menu-btn");
    const close = () => { mm.classList.remove("is-open"); mb.innerHTML = I.menu; mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
    mb.addEventListener("click", () => {
      if (mm.classList.contains("is-open")) return close();
      mm.classList.add("is-open"); mb.innerHTML = I.close; mb.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
    });
    mm.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  }

  /* ---- Footer ---- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    const socials = window.PP_SOCIALS();
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap">' +
        '<div class="footer-top">' +
          '<div class="footer-brand"><img class="wordmark" src="assets/brand/wordmark.png" alt="PanPals">' +
            "<p>A social app for home cooking. Real people, real kitchens, real food. Pull up a chair.</p>" +
            '<div class="socials">' + socials.map((s) => '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' + I[s.key] + "</a>").join("") + "</div></div>" +
          '<div class="footer-col"><h4>Join us</h4><ul>' +
            '<li><a href="' + esc(C.appStoreUrl) + '" target="_blank" rel="noopener">Download on the App Store</a></li>' +
            '<li><a href="index.html#download">Android waitlist</a></li>' +
            '<li><a href="thesis.html">Read the thesis</a></li></ul></div>' +
          '<div class="footer-col"><h4>PanPals</h4><ul>' +
            '<li><a href="about.html">About</a></li><li><a href="about.html#team">Team</a></li><li><a href="news.html">News</a></li><li><a href="careers.html">Careers</a></li></ul></div>' +
          '<div class="footer-col"><h4>Say hi</h4><ul>' +
            '<li><a href="contact.html">Want to reach us?</a></li><li><a href="mailto:' + esc(C.contactEmail) + '">' + esc(C.contactEmail) + "</a></li>" +
            socials.slice(0, 3).map((s) => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + s.name + "</a></li>").join("") + "</ul></div>" +
          '<div class="footer-col"><h4>Legal</h4><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Use</a></li></ul></div>' +
        "</div>" +
        '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " PanPals. All rights reserved.</span><span>Made with love and too many pans.</span></div>" +
      "</div>";
  }

  /* Inner pages in Game Mode: a chip that leads back to the table */
  if (page !== "home") {
    const chip = document.createElement("a");
    chip.className = "btn table-chip";
    chip.href = "index.html";
    chip.innerHTML = I.left + "Back to the table";
    document.body.appendChild(chip);
  }

  /* ---- Placeholders ---- */
  document.querySelectorAll("[data-appstore]").forEach((el) => (el.outerHTML = window.PP_APPSTORE()));
  document.querySelectorAll("[data-icon]").forEach((el) => (el.outerHTML = I[el.dataset.icon] || ""));
  document.querySelectorAll("[data-mailto]").forEach((el) => { el.href = "mailto:" + C.contactEmail; if (!el.textContent.trim()) el.textContent = C.contactEmail; });
  document.querySelectorAll("[data-email-text]").forEach((el) => (el.textContent = C.contactEmail));
  document.querySelectorAll("[data-social]").forEach((el) => { const s = (C.social || {})[el.dataset.social]; if (s && s.url) el.href = s.url; else el.remove(); });

  /* ---- Mode switch (Pro mode / Game mode) ---- */
  const MN = Object.assign({ sleek: "Pro mode", game: "Game mode" }, C.modeNames || {});
  function setMode(m) {
    if (m !== "game") m = "sleek";
    document.documentElement.dataset.mode = m;
    try { localStorage.setItem("pp-mode", m); } catch (e) {}
    document.querySelectorAll("[data-mode-switch]").forEach((b) => {
      const other = m === "game" ? MN.sleek : MN.game;
      b.dataset.tip = "Switch to " + other;
      b.setAttribute("aria-label", "Switch to " + other);
      b.setAttribute("aria-pressed", String(m === "game"));
    });
    document.dispatchEvent(new CustomEvent("pp:mode", { detail: m }));
  }
  document.querySelectorAll("[data-mode-switch]").forEach((b) => b.addEventListener("click", () => {
    const next = document.documentElement.dataset.mode === "game" ? "sleek" : "game";
    setMode(next);
    if (next === "game" && page !== "home") location.href = "index.html";
  }));
  setMode(document.documentElement.dataset.mode);

  /* ---- Reveal on scroll ---- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -6% 0px" }) : null;
  window.PP_REVEAL = (root) => (root || document).querySelectorAll(".reveal:not(.in)").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  window.PP_REVEAL();

  /* ---- Forms ---- */
  function mailto(subject, body) { window.location.href = "mailto:" + C.contactEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body); }
  window.PP_WAITLIST = async function (email, msg) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "That email looks a bit undercooked. Try again?"; return false; }
    if (C.waitlistEndpoint) {
      msg.textContent = "Saving your seat…";
      try {
        const r = await fetch(C.waitlistEndpoint, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ email, list: "android-waitlist" }) });
        if (!r.ok) throw new Error();
        msg.textContent = "You're on the list. We'll email you the day Android lands.";
      } catch (err) { msg.textContent = "Something went wrong. Mind trying again, or email us?"; return false; }
    } else {
      mailto("Android waitlist", "Hi PanPals! Please let me know when the Android app is out.\n\nMy email: " + email);
      msg.textContent = "Your mail app should open. Hit send and you're on the list.";
    }
    return true;
  };
  document.querySelectorAll('form[data-form="waitlist"]').forEach((f) => f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (await window.PP_WAITLIST(f.querySelector('input[type="email"]').value.trim(), f.querySelector(".form-msg"))) f.reset();
  }));
  document.querySelectorAll('form[data-form="mail"]').forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(f);
    const subject = (f.dataset.subject || "Hello PanPals") + (fd.get("topic") ? ": " + fd.get("topic") : "");
    const lines = [];
    fd.forEach((v, k) => { if (k !== "topic" && String(v).trim()) lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v); });
    mailto(subject, lines.join("\n\n"));
    const msg = f.querySelector(".form-msg");
    if (msg) msg.textContent = "Your mail app should open with everything filled in. Just hit send.";
  }));
})();
