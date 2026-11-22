/* ==========================================================================
   PANPALS · HOME (Pro mode) small interactions
   - Big statement: words fill in with colour as you scroll
   - Mini chart bars grow when visible
   - Mini post: tap the heart
   ========================================================================== */

(function () {
  /* Scroll-reveal text */
  const rt = document.getElementById("reveal-text");
  if (rt) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        }
      });
    };
    walk(rt);
    const words = [...rt.querySelectorAll(".w")];
    let tick = false;
    const run = () => {
      const r = rt.getBoundingClientRect();
      const start = innerHeight * 0.85, end = innerHeight * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height * 0.6)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
      tick = false;
    };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* Mini chart */
  const chart = document.getElementById("mini-chart");
  if (chart && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      chart.querySelectorAll("[data-h]").forEach((b, i) => setTimeout(() => (b.style.height = b.dataset.h + "%"), i * 80));
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(chart);
  }

  /* Mini like */
  document.querySelectorAll("[data-mini-like]").forEach((b) => b.addEventListener("click", () => {
    const on = b.classList.toggle("on");
    const n = b.querySelector("span");
    n.textContent = +n.textContent + (on ? 1 : -1);
    window.PP_SOUND && window.PP_SOUND.play(on ? "pop" : "tick");
  }));
})();

/* Animated mini widgets (relate + compete) */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const whenVisible = (el, fn) => {
    if (!el) return;
    if (!("IntersectionObserver" in window) || reduce) return fn();
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.4 });
    io.observe(el);
  };

  /* Relate: pals keep giving bon appétits */
  const mp = document.getElementById("mini-post");
  whenVisible(mp, () => {
    const heart = mp.querySelector(".mp-heart"), btn = mp.querySelector("[data-mini-like]"), n = btn.querySelector("span"), cm = mp.querySelector(".mp-comment");
    let k = 0;
    const beat = () => {
      heart.classList.remove("go"); void heart.offsetWidth; heart.classList.add("go");
      n.textContent = +n.textContent + 1;
      btn.classList.add("on"); setTimeout(() => btn.classList.remove("on"), 600);
      if (++k === 2) cm.classList.add("on");
      if (k > 7) { k = 0; n.textContent = "0"; cm.classList.remove("on"); }
    };
    setTimeout(beat, 500);
    if (!reduce) setInterval(beat, 2600);
  });

  /* Compete: "you" cooks more and climbs the board */
  const mb = document.getElementById("mini-board");
  whenVisible(mb, () => {
    const rows = [...mb.querySelectorAll(".mb-row")];
    const data = rows.map((r) => ({ el: r, who: r.dataset.who, n: +r.dataset.n }));
    const you = data.find((d) => d.who === "you");
    const place = () => {
      const sorted = data.slice().sort((a, b) => b.n - a.n || (a.who === "you" ? -1 : b.who === "you" ? 1 : 0));
      sorted.forEach((d, i) => { d.el.style.transform = "translateY(" + i * 32 + "px)"; d.el.querySelector("i").textContent = i + 1; d.el.querySelector("em").textContent = d.n + " meals"; });
    };
    // count up first
    data.forEach((d) => { const target = d.n; d.n = 0; let c = 0; const t = setInterval(() => { d.n = ++c; place(); if (c >= target) clearInterval(t); }, 120); });
    if (reduce) return;
    setInterval(() => {
      you.n = you.n >= 6 ? 3 : you.n + 1;
      you.el.classList.remove("bump"); void you.el.offsetWidth; you.el.classList.add("bump");
      place();
    }, 2200);
  });
})();

/* "Go on, try it": keep the arrow tip pointing at the phone's bottom tab bar */
(function () {
  const note = document.querySelector(".try-me"), stage = document.querySelector(".stage");
  const tabs = document.querySelector("#phone .a-tabs"), arrow = note && note.querySelector(".try-arrow");
  if (!note || !stage || !tabs || !arrow) return;
  function place() {
    if (innerWidth <= 900) { note.style.top = note.style.left = note.style.bottom = ""; return; }
    const st = stage.getBoundingClientRect(), tb = tabs.getBoundingClientRect();
    if (!st.width || !tb.width || document.documentElement.dataset.mode === "game") return; // hidden: try again later
    note.style.bottom = "auto";
    // tip of the arrow inside the svg (viewBox 120x70, tip at 10,56)
    note.style.left = (tb.right - st.left + 82) + "px";
    note.style.top = "0px";
    const nr = note.getBoundingClientRect(), ar = arrow.getBoundingClientRect();
    const tipY = ar.top + ar.height * (56 / 70) - nr.top;
    note.style.top = (tb.top + tb.height / 2 - st.top - tipY) + "px";
  }
  addEventListener("resize", place);
  addEventListener("load", place);
  document.addEventListener("pp:mode", () => requestAnimationFrame(place));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  if ("ResizeObserver" in window) { const ro = new ResizeObserver(place); ro.observe(stage); ro.observe(document.getElementById("phone")); }
  setTimeout(place, 300); setTimeout(place, 1500);
  place();
})();
