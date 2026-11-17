/* ==========================================================================
   PANPALS · MAGAZINE FLIPBOOK
   Ayarlar data/config.js -> magazine. Sayfalar assets/magazine/p-01.jpg ...
   spreads: true → her görsel iki sayfalık bir açılım; masaüstünde açılım olarak,
   telefonda yarım yarım (tek sayfa) gösterilir.
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
  if (!files.length) { box.innerHTML = '<div class="book-empty">The magazine is on its way to the table.</div>'; return; }

  // A "page" is one half of a spread image (or a whole image when spreads is false)
  const pages = [];
  files.forEach((src) => { if (M.spreads) { pages.push({ src, half: "l" }); pages.push({ src, half: "r" }); } else pages.push({ src }); });

  let ratio = 0.707, spreadMode = window.innerWidth > 760, idx = 0, busy = false;
  /* Decoded image cache: pages are decoded before a turn starts, so the flip never stutters */
  const cache = {};
  const load = (src) => { if (!cache[src]) { const im = new Image(); im.src = src; cache[src] = (im.decode ? im.decode() : Promise.resolve()).catch(() => {}); cache[src].img = im; } return cache[src]; };
  const preload = (list) => list.forEach((p) => p && load(p.src));
  const bg = (p) => !p ? "" : p.half
    ? "background-image:url('" + p.src + "');background-size:200% 100%;background-position:" + (p.half === "l" ? "left" : "right") + " center"
    : "background-image:url('" + p.src + "');background-size:cover;background-position:center";

  box.innerHTML = '<div class="book-stage"><div class="book"></div></div><div class="book-controls"><button class="round-btn" data-prev aria-label="Previous page">' + I.left + '</button><span data-count></span><button class="round-btn" data-next aria-label="Next page">' + I.right + "</button></div>";
  const stage = box.querySelector(".book-stage"), bk = box.querySelector(".book"), count = box.querySelector("[data-count]");
  const prevB = box.querySelector("[data-prev]"), nextB = box.querySelector("[data-next]");

  const spreads = () => {
    if (!spreadMode) return pages.map((p) => [p]);
    const s = [];
    for (let i = 0; i < pages.length; i += 2) s.push([pages[i], pages[i + 1] || null]);
    return s;
  };
  function size() {
    const maxW = stage.clientWidth || box.clientWidth;
    const maxH = Math.min(window.innerHeight * 0.76, 760);
    let pw = spreadMode ? maxW / 2 : maxW, ph = pw / ratio;
    if (ph > maxH) { ph = maxH; pw = ph * ratio; }
    bk.style.setProperty("--pw", Math.floor(pw) + "px");
    bk.style.setProperty("--ph", Math.floor(ph) + "px");
    stage.style.minHeight = Math.floor(ph) + "px";
  }
  function draw() {
    const all = spreads(), s = all[idx];
    bk.classList.toggle("book-single", !spreadMode);
    bk.innerHTML = spreadMode
      ? '<div class="page left' + (s[0] ? "" : " blank") + '" style="' + bg(s[0]) + '" data-side="l"></div><div class="page right' + (s[1] ? "" : " blank") + '" style="' + bg(s[1]) + '" data-side="r"></div>'
      : '<div class="page right" style="' + bg(s[0]) + '" data-side="r"></div>';
    prevB.disabled = idx === 0; nextB.disabled = idx >= all.length - 1;
    count.textContent = (spreadMode ? "Spread " : "Page ") + (idx + 1) + " of " + all.length;
    preload([].concat(all[idx + 1] || [], all[idx - 1] || [], all[idx + 2] || [], all[idx + 3] || []));
  }
  async function turn(dir) {
    const all = spreads(), to = idx + dir;
    if (busy || to < 0 || to >= all.length) return;
    busy = true;
    await Promise.all(all[to].filter(Boolean).map((p) => load(p.src)));
    sfx("page");
    const cur = all[idx], nxt = all[to], leaf = document.createElement("div");
    if (spreadMode) {
      if (dir > 0) {
        leaf.className = "leaf from-right";
        leaf.innerHTML = '<div class="face" style="' + bg(cur[1]) + '"></div><div class="face back" style="' + bg(nxt[0]) + '"></div>';
        const r = bk.querySelector(".right"); r.setAttribute("style", bg(nxt[1])); r.classList.toggle("blank", !nxt[1]);
      } else {
        leaf.className = "leaf from-left";
        leaf.innerHTML = '<div class="face" style="' + bg(cur[0]) + '"></div><div class="face back" style="' + bg(nxt[1]) + '"></div>';
        const l = bk.querySelector(".left"); l.setAttribute("style", bg(nxt[0])); l.classList.toggle("blank", !nxt[0]);
      }
    } else {
      leaf.className = "leaf from-right";
      leaf.innerHTML = '<div class="face" style="' + bg(dir > 0 ? cur[0] : nxt[0]) + '"></div>';
      if (dir > 0) bk.querySelector(".right").setAttribute("style", bg(nxt[0]));
      else { leaf.style.transform = "rotateY(-100deg)"; leaf.style.opacity = "0"; }
    }
    leaf.classList.add("turning", dir > 0 ? "fwd" : "bwd");
    const cast = document.createElement("div");
    cast.className = "cast " + (dir > 0 ? "on-right" : "on-left") + (spreadMode ? "" : " single");
    bk.appendChild(cast);
    bk.appendChild(leaf);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (spreadMode) leaf.style.transform = dir > 0 ? "rotateY(-180deg)" : "rotateY(180deg)";
      else { leaf.style.transform = dir > 0 ? "rotateY(-100deg)" : "rotateY(0deg)"; leaf.style.opacity = dir > 0 ? "0" : "1"; }
    }));
    setTimeout(() => { idx = to; draw(); busy = false; }, 820);
  }
  prevB.addEventListener("click", () => turn(-1));
  nextB.addEventListener("click", () => turn(1));
  bk.addEventListener("click", (e) => { const p = e.target.closest("[data-side]"); if (!p) return; turn(spreadMode ? (p.dataset.side === "l" ? -1 : 1) : (e.offsetX < p.clientWidth / 3 ? -1 : 1)); });
  let tx = null;
  stage.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  stage.addEventListener("touchend", (e) => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) turn(d < 0 ? 1 : -1); tx = null; });
  box.tabIndex = 0;
  box.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") turn(1); if (e.key === "ArrowLeft") turn(-1); });
  window.addEventListener("resize", () => {
    const m = window.innerWidth > 760;
    if (m !== spreadMode) { idx = m ? Math.floor(idx / 2) : idx * 2; spreadMode = m; }
    size(); draw();
  });

  const first = new Image();
  first.onload = () => { ratio = (first.naturalWidth / first.naturalHeight) / (M.spreads ? 2 : 1); size(); draw(); };
  first.onerror = () => (box.innerHTML = '<div class="book-empty">The magazine is on its way to the table.</div>');
  first.src = files[0];
})();
