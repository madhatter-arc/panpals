/* ==========================================================================
   PANPALS · MAGAZINE FLIPBOOK (issuu-style page curl)
   Uses StPageFlip (MIT, js/vendor/page-flip.browser.js).
   Ayarlar data/config.js -> magazine. Sayfalar assets/magazine/p-01.jpg ...
   spreads: true → her görsel iki sayfalık bir açılım; ikiye bölünüp gösterilir.
   Telefonda da iki sayfa yan yana görünür.
   ========================================================================== */

(function () {
  const box = document.getElementById("flipbook");
  if (!box) return;
  const M = (window.PANPALS_CONFIG || {}).magazine || {};
  const I = window.PP_ICONS;
  const sfx = (n) => window.PP_SOUND && window.PP_SOUND.play(n);
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  const files = [];
  for (let i = 1; i <= (M.count || 0); i++) files.push((M.folder || "assets/magazine/") + "p-" + pad(i) + ".jpg");
  if (!files.length || !window.St) { box.innerHTML = '<div class="book-empty">The magazine is on its way to the table.</div>'; return; }

  const pages = [];
  files.forEach((src) => { if (M.spreads) { pages.push([src, "left"]); pages.push([src, "right"]); } else pages.push([src, "center"]); });

  const first = new Image();
  first.onload = () => build((first.naturalWidth / first.naturalHeight) / (M.spreads ? 2 : 1));
  first.src = files[0];

  function build(ratio) {
    box.innerHTML = '<div class="flip-stage"><div class="flip-book"></div></div>' +
      '<div class="book-controls"><button class="round-btn" data-prev aria-label="Previous page">' + I.left + '</button><span data-count></span><button class="round-btn" data-next aria-label="Next page">' + I.right + "</button></div>";
    const el = box.querySelector(".flip-book"), count = box.querySelector("[data-count]");
    el.innerHTML = pages.map((p) => '<div class="flip-page" data-pos="' + p[1] + '"><img data-src="' + p[0] + '" alt="" draggable="false"></div>').join("");
    const pageEls = [...el.children];

    const W = 500, H = Math.round(W / ratio);
    const pf = new St.PageFlip(el, {
      width: W, height: H, size: "stretch", autoSize: true,
      minWidth: 120, maxWidth: 900, minHeight: Math.round(120 / ratio), maxHeight: Math.round(900 / ratio),
      usePortrait: false, showCover: false, drawShadow: true, maxShadowOpacity: 0.45,
      flippingTime: 900, mobileScrollSupport: true, startZIndex: 2
    });
    pf.loadFromHTML(pageEls);

    /* lazy image loading: only pages near the current spread get their background */
    const load = (i) => { const im = pageEls[i] && pageEls[i].querySelector("img"); if (im && !im.src) im.src = im.dataset.src; };
    const around = (i) => { for (let k = i - 2; k <= i + 5; k++) load(k); };
    const update = () => {
      const i = pf.getCurrentPageIndex(), n = pf.getPageCount();
      around(i);
      count.textContent = "Spread " + (Math.floor(i / 2) + 1) + " of " + Math.ceil(n / 2);
      box.querySelector("[data-prev]").disabled = i <= 0;
      box.querySelector("[data-next]").disabled = i >= n - 2;
    };
    pf.on("flip", update);
    pf.on("changeState", (e) => { if (e.data === "flipping") sfx("page"); });
    box.querySelector("[data-prev]").addEventListener("click", () => pf.flipPrev("top"));
    box.querySelector("[data-next]").addEventListener("click", () => pf.flipNext("top"));
    box.tabIndex = 0;
    box.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") pf.flipNext(); if (e.key === "ArrowLeft") pf.flipPrev(); });
    update();
  }
})();
