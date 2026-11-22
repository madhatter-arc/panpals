/* ==========================================================================
   PANPALS · NEWS
   Otomatik: data/feeds.js (Substack, Instagram, TikTok; GitHub her 6 saatte günceller)
   Elle: data/news.js
   Substack yazıları sitede okunur (article.html). Diğerleri önce sitede bir
   önizleme olarak açılır, oradan "Visit on Instagram" ile gerçek gönderiye gidilir.
   ========================================================================== */

(function () {
  const esc = window.PP_ESC, I = window.PP_ICONS;
  const NAMES = Object.assign({}, window.PP_SOCIAL_NAMES, { substack: "Editorial", news: "PanPals news", press: "Press", event: "IRL meetup" });
  const VISIT = { instagram: "Visit on Instagram", tiktok: "Watch on TikTok", linkedin: "Visit on LinkedIn", threads: "Visit on Threads", x: "Visit on X", press: "Read the article", news: "Open" };
  const fmt = (d) => { const x = new Date(d); return isNaN(x) ? "" : x.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); };
  const playIc = '<span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></span>';

  let items = (window.PANPALS_FEEDS || []).concat(window.PANPALS_NEWS || []);
  items.forEach((n, i) => (n._i = i));
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const isArticle = (n) => n.platform === "substack" && n.slug;
  const fmtEvent = (n) => n.platform === "event" ? "Upcoming · " : "";
  const metaLabel = (n) => (n.platform === "substack" ? (n.source || "Editorial") : NAMES[n.platform] || n.platform);

  function story(n, lead) {
    const meta = '<div class="story-meta"><b>' + esc(metaLabel(n)) + "</b><span>" + esc(fmtEvent(n) + fmt(n.date)) + "</span></div>";
    const text = "<h3>" + esc(n.title) + "</h3>" + ((n.excerpt || n.caption) ? "<p>" + esc(n.excerpt || n.caption) + "</p>" : "") +
      '<span class="go">' + (isArticle(n) ? "Read here" : n.platform === "event" ? "Details and RSVP" : "Preview") + I.arrow + "</span>";
    const pic = n.image ? '<div class="story-img"><img src="' + esc(n.image) + '" alt="" loading="lazy">' + (n.video ? playIc : "") + "</div>" : '<div class="story-img empty"><img src="assets/brand/logo.svg" alt=""></div>';
    const attrs = isArticle(n) ? 'href="article.html?a=' + encodeURIComponent(n.slug) + '"' : 'href="#" data-preview="' + n._i + '"';
    return '<a class="story' + (lead ? " lead-story" : "") + '" ' + attrs + ">" + (lead ? pic + "<div>" + meta + text + "</div>" : meta + "<div>" + text + "</div>" + pic) + "</a>";
  }

  let filter = "all";
  const targets = document.querySelectorAll("[data-news]");
  const tabs = document.querySelector(".tabs");
  function render() {
    targets.forEach((t) => {
      const limit = t.dataset.news ? +t.dataset.news : Infinity;
      const list = items.filter((n) => filter === "all" || n.platform === filter).slice(0, limit);
      const lead = t.hasAttribute("data-lead") && filter === "all";
      t.innerHTML = list.length ? list.map((n, i) => story(n, lead && i === 0)).join("") : '<p class="muted">Nothing here yet. Check back soon.</p>';
      window.PP_REVEAL(t);
    });
    if (tabs) {
      const present = [...new Set(items.map((n) => n.platform))];
      const order = ["event", "substack", "instagram", "tiktok", "linkedin", "threads", "x", "press", "news"].filter((p) => present.includes(p));
      tabs.innerHTML = ["all"].concat(order).map((p) => '<button class="tab" data-filter="' + p + '" aria-pressed="' + (p === filter) + '">' + (p === "all" ? "Everything" : NAMES[p]) + "</button>").join("");
    }
  }
  if (tabs) tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) { filter = b.dataset.filter; render(); } });

  /* In-site preview */
  const pv = document.createElement("div");
  pv.className = "preview";
  pv.innerHTML = '<div class="preview-card" role="dialog" aria-modal="true"></div>';
  document.body.appendChild(pv);
  function openPreview(n) {
    const ext = /^https?:/.test(n.url || "");
    const cap = n.caption || n.excerpt || "";
    const sameAsCap = cap && n.title && cap.replace(/\s+/g, " ").startsWith(n.title.replace(/[.…]+$/, "").replace(/\s+/g, " ").slice(0, 40));
    const canTr = n.caption_en || window.PP_IS_TURKISH(n.title + " " + cap);
    pv.querySelector(".preview-card").innerHTML =
      '<div class="preview-media">' + (n.image ? '<img src="' + esc(n.image) + '" alt="">' + (n.video ? playIc : "") : '<div class="story-img empty" style="position:absolute;inset:0;border-radius:0"><img src="assets/brand/logo.svg" alt=""></div>') + "</div>" +
      '<button class="preview-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="preview-body"><div class="meta"><b>' + esc(metaLabel(n)) + "</b> · " + esc(fmt(n.date)) + "</div>" +
        (sameAsCap ? "" : '<h3 data-t="title">' + esc(n.title) + "</h3>") +
        '<div class="cap" data-t="cap">' + esc(cap) + "</div>" +
        '<div class="cta-row">' +
          (n.url ? '<a class="btn" href="' + esc(n.url) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(n.cta || VISIT[n.platform] || "Visit") + (ext ? I.out : "") + "</a>" : "") +
          (canTr ? '<button class="btn btn--soft" data-tr>Translate to English</button>' : "") +
        "</div>" +
      "</div>";
    const trBtn = pv.querySelector("[data-tr]");
    if (trBtn) {
      let en = false;
      const capEl = pv.querySelector('[data-t="cap"]'), tEl = pv.querySelector('[data-t="title"]');
      trBtn.addEventListener("click", async () => {
        if (en) { capEl.textContent = cap; if (tEl) tEl.textContent = n.title; trBtn.textContent = "Translate to English"; en = false; return; }
        trBtn.textContent = "Translating…";
        try {
          capEl.textContent = n.caption_en || await window.PP_TRANSLATE(cap);
          if (tEl) tEl.textContent = n.title_en || await window.PP_TRANSLATE(n.title);
          trBtn.textContent = "Show original"; en = true;
        } catch (e) { trBtn.textContent = "Couldn’t translate"; }
      });
    }
    pv.classList.add("open");
    pv.querySelector(".preview-close").focus();
  }
  const closePreview = () => pv.classList.remove("open");
  pv.addEventListener("click", (e) => { if (e.target === pv || e.target.closest(".preview-close")) closePreview(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePreview(); });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-preview]");
    if (!a) return;
    e.preventDefault();
    const n = items.find((x) => x._i === +a.dataset.preview);
    if (n) openPreview(n);
  });

  const follow = document.querySelector("[data-follow]");
  if (follow) follow.innerHTML = window.PP_SOCIALS().map((s) => '<a href="' + esc(s.url) + '" target="_blank" rel="noopener"><b>' + s.name + "</b><span>" + esc(s.handle || "") + "</span></a>").join("");
  const dl = document.querySelector("[data-dateline]");
  if (dl) dl.textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  render();
})();
