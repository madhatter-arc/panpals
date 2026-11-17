/* ==========================================================================
   PANPALS · GAME MODE: ONE BIG TABLE
   Yatay kayan, döngüyle sonsuz uzayan masa. Bölümler (istasyonlar):
   Welcome, How it works, Titles (tavalar), Team, Thesis, Fridge (News),
   About, Your seat (Download). Metinleri aşağıdaki STATIONS içinden değiştir.
   Ekip data/team.js, tabaklar data/feed.js, buzdolabı data/news.js'ten gelir.
   ========================================================================== */

(function () {
  const K = document.getElementById("kitchen");
  if (!K) return;
  const C = window.PANPALS_CONFIG || {};
  const TEAM = window.PANPALS_TEAM || [];
  const FEED = window.PANPALS_FEED || [];
  const NEWS = (window.PANPALS_NEWS || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const esc = window.PP_ESC, I = window.PP_ICONS, photo = window.PP_PHOTO;
  const sfx = (n) => window.PP_SOUND && window.PP_SOUND.play(n);

  /* ---------- Drawings ---------- */
  function pan(kind, color, inner) {
    if (kind === "pot") return '<svg viewBox="0 0 80 120"><rect x="36" y="2" width="8" height="40" rx="4" fill="#9c8f84"/><circle cx="40" cy="8" r="3" fill="#f3ede5"/><rect x="8" y="44" width="64" height="58" rx="10" fill="' + color + '"/><rect x="4" y="42" width="72" height="9" rx="4.5" fill="' + inner + '"/><rect x="0" y="58" width="9" height="8" rx="3" fill="' + inner + '"/><rect x="71" y="58" width="9" height="8" rx="3" fill="' + inner + '"/></svg>';
    if (kind === "wok") return '<svg viewBox="0 0 90 130"><rect x="41" y="2" width="8" height="52" rx="4" fill="#6b4a3d"/><circle cx="45" cy="9" r="3" fill="#f3ede5"/><circle cx="45" cy="92" r="38" fill="' + color + '"/><circle cx="45" cy="92" r="29" fill="' + inner + '"/><path d="M27 78a22 22 0 0 1 14-10" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    if (kind === "ladle") return '<svg viewBox="0 0 40 120"><rect x="17" y="2" width="6" height="80" rx="3" fill="#9c8f84"/><circle cx="20" cy="7" r="2.4" fill="#f3ede5"/><path d="M6 84h28a14 14 0 0 1-28 0z" fill="#9c8f84"/></svg>';
    return '<svg viewBox="0 0 70 130"><rect x="31" y="2" width="8" height="56" rx="4" fill="' + inner + '"/><circle cx="35" cy="9" r="3" fill="#f3ede5"/><circle cx="35" cy="94" r="32" fill="' + color + '"/><circle cx="35" cy="94" r="24" fill="' + inner + '"/><path d="M20 82a18 18 0 0 1 11-9" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
  }
  const plant = '<svg viewBox="0 0 60 80"><path d="M14 52h32l-4 26H18z" fill="#481D24"/><path d="M30 52C30 34 18 26 8 24c4 12 10 22 22 28zM30 52c0-18 10-30 22-34-2 14-8 26-22 34zM30 52c-2-16 0-30 0-44 6 12 6 30 0 44z" fill="#7d8a6a"/></svg>';

  const at = (x, y, cls, html, extra) => '<div class="k-it ' + (cls || "") + '" style="left:calc(' + x + ' * var(--u));top:' + y + "%;" + (extra || "") + '">' + html + "</div>";
  let plateN = 0;
  const DISHES = ["pasta-plate-color", "fish-plate-color"];
  const plate = (x, y) => '<button class="k-plate" style="left:calc(' + x + ' * var(--u));top:' + y + '%" data-plate aria-label="Bon appétit"><img src="assets/illustrations/' + DISHES[plateN++ % DISHES.length] + '.png" alt="" draggable="false"><span class="yum">+1 bon appétit</span></button>';
  const sign = (x, y, w, html, cls) => '<div class="k-sign ' + (cls || "") + '" style="left:calc(' + x + ' * var(--u));top:' + y + "%;width:calc(" + w + ' * var(--u))">' + html + "</div>";
  const hanging = (x, w, kind, color, inner, extra) => '<button class="k-pan" style="left:calc(' + x + ' * var(--u));width:calc(' + w + ' * var(--u))" ' + (extra || "data-clang") + ' aria-label="Pan">' + pan(kind, color, inner) + "</button>";
  const legs = (w) => '<span class="k-leg" style="left:calc(4 * var(--u))"></span><span class="k-leg" style="left:calc(' + (w - 7) + ' * var(--u))"></span>';
  const img = () => "";

  /* ---------- Stations (edit texts here) ---------- */
  const TITLES = [
    { name: "Skillet", range: "Eggs at midnight", kind: "skillet", color: "#481D24", inner: "#5e2d35", says: "Reliable, quick, always on the stove. Breakfast for dinner is a valid choice." },
    { name: "Wok", range: "Fast and smoky", kind: "wok", color: "#2b1215", inner: "#3d2226", says: "Bold, fast, a little smoky. You cook like you text: quickly and with feeling." },
    { name: "Pot", range: "Slow Sundays", kind: "pot", color: "#d9d9d9", inner: "#481D24", says: "Soups, stews, enough for everyone. You are the reason there are leftovers." },
    { name: "Cast iron", range: "Built to last", kind: "skillet", color: "#6d5a5c", inner: "#481D24", says: "Patient, seasoned, a little heavy. Your pancakes are legendary." }
  ];
  const peopleColors = ["#481D24", "#6d5a5c", "#2b1215", "#a8998d", "#5e2d35", "#8a7470", "#3d2226"];

  const STATIONS = [
    {
      key: "welcome", name: "Welcome", w: 150,
      html: () =>
        sign(8, 13, 58,
          '<div class="k-l">Game Mode</div><h2>Pull up a chair at One Big Table.</h2>' +
          "<p>PanPals is a social app for home cooking. Walk along the table to meet us: scroll, swipe or use the arrow keys.</p>" +
          '<div class="cta-row">' + window.PP_APPSTORE() + '<button class="btn btn--soft" data-go="join">Android waitlist</button></div>' +
          '<button class="k-hint" data-go="how">Find your seat at the table ' + I.arrow + "</button>") +
        hanging(84, 11, "skillet", "#481D24", "#5e2d35") + hanging(100, 7, "ladle") + hanging(112, 14, "wok", "#2b1215", "#3d2226") + hanging(132, 10, "pot", "#d9d9d9", "#481D24") +
        at(136, 37, "k-wall k-plant", plant, "width:calc(9 * var(--u))") +
        plate(8, 69, img(0)) + plate(36, 72, img(1)) + plate(64, 68, img(2)) + plate(92, 71, img(3)) + plate(120, 68, img(4))
    },
    {
      key: "how", name: "How it works", w: 140,
      html: () =>
        sign(8, 13, 44, '<div class="k-l">How it works</div><h3>Cook. Share. Repeat.</h3><p>We don’t need more recipes. We need motivation.</p>', "pin") +
        hanging(62, 10, "skillet", "#6d5a5c", "#481D24") + hanging(76, 7, "ladle") + hanging(118, 12, "skillet", "#481D24", "#5e2d35") +
        '<div class="k-card" style="left:calc(8 * var(--u));top:52%"><b>01</b><h3>Cook anything</h3><p>A feast or toast for one. It all counts.</p></div>' +
        '<div class="k-card" style="left:calc(46 * var(--u));top:54%;--rot:1deg"><b>02</b><h3>Share it</h3><p>Post your plate, collect bon appétits from your pals.</p></div>' +
        '<div class="k-card" style="left:calc(84 * var(--u));top:52%;--rot:-1deg"><b>03</b><h3>Keep your streak</h3><p>Set a weekly goal and watch your progress grow.</p></div>' +
        plate(116, 73, img(5))
    },
    {
      key: "titles", name: "Pick a pan", w: 124,
      html: () =>
        sign(6, 13, 30, '<div class="k-l">Which pan are you?</div><h3>Pick a pan.</h3><p data-title-result>Tap one. We won’t judge. Much.</p>', "pin") +
        TITLES.map((t, i) => '<button class="k-pan" style="left:calc(' + (42 + i * 20) + ' * var(--u));width:calc(' + (t.kind === "wok" ? 15 : 13) + ' * var(--u))" data-title="' + i + '" aria-label="' + t.name + '">' + pan(t.kind, t.color, t.inner) +
          '<span class="k-pan-tag">' + t.name + "<small>" + t.range + "</small></span></button>").join("") +
        plate(14, 70, img(6)) + plate(48, 73, img(7)) + plate(84, 69, img(8))
    },
    {
      key: "team", name: "Team", w: Math.max(110, 16 + (TEAM.length + 2) * 19),
      html: (st) => {
        let h = sign(6, 9, 40, '<div class="k-l">Our team</div><h3>The pals behind the pans</h3><p>Tap someone to say hi.</p><a class="btn btn--small" href="about.html#team">Meet everyone</a>', "pin");
        const seats = TEAM.map((m, i) => ({ m, i })).concat([{ empty: true }, { empty: true }]);
        seats.forEach((s, k) => {
          const x = 8 + k * 19;
          if (s.empty) {
            h += '<button class="k-person empty" style="left:calc(' + x + ' * var(--u))" data-seat aria-label="Empty seat"><span class="chair"></span></button>';
          } else {
            h += '<button class="k-person" style="left:calc(' + x + ' * var(--u));--c:' + peopleColors[k % peopleColors.length] + '" data-person="' + s.i + '" aria-label="' + esc(s.m.name) + '"><span class="chair"></span><span class="body"></span><span class="head">' + photo(s.m.photo, s.m.name) + "</span></button>" +
              '<span class="k-nametag" style="left:calc(' + (x + 8) + ' * var(--u))"><b>' + esc(s.m.name) + "</b><span>" + esc(s.m.handle || "@") + "</span></span>" +
              plate(x + 0.5, 70.5, img(k + 2));
          }
        });
        return h;
      }
    },
    {
      key: "thesis", name: "Thesis", w: 112,
      html: () =>
        '<div class="k-frame" style="left:calc(10 * var(--u));top:14%;width:calc(22 * var(--u));height:calc(26 * var(--u))"><img src="assets/app/app-icon.png" alt="PanPals app icon"></div>' +
        sign(40, 13, 46, '<div class="k-l">Where it started</div><h3>PanPals began as a master’s thesis.</h3><p>Cansu’s research on what really makes us cook at home more often became the app.</p><a class="btn btn--small" href="thesis.html">Read the thesis</a>', "pin") +
        hanging(94, 11, "skillet", "#481D24", "#5e2d35") +
        '<button class="k-book" style="left:calc(30 * var(--u));top:70%" data-href="thesis.html" aria-label="Open the thesis"><span class="l"><i style="top:30%"></i><i style="top:50%"></i><i style="top:70%"></i></span><span class="r"><i style="top:30%"></i><i style="top:50%"></i><i style="top:70%"></i></span></button>' +
        plate(70, 71, img(1))
    },
    {
      key: "fridge", name: "Fridge", w: 128,
      html: () =>
        '<div class="k-fridge" style="left:calc(8 * var(--u))" data-fridge>' +
          '<div class="inside">' + [0, 1, 2].map((r) => '<div class="shelf">' + NEWS.slice(r, r + 1).map((n) => {
              const href = n.body ? "article.html?id=" + encodeURIComponent(n.title) : n.url || "news.html";
              return '<a class="note" href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") + ">" + (n.image ? '<img src="' + esc(n.image) + '" alt="">' : "") + "<b>" + esc((window.PP_SOCIAL_NAMES || {})[n.platform] || "PanPals news") + "</b>" + esc(n.title) + "</a>";
            }).join("") + "</div>").join("") + "</div>" +
          '<button class="door" data-open-fridge aria-label="Open the fridge"><span class="k-magnet">News</span><span class="k-magnet alt">Tap to open</span></button>' +
        "</div>" +
        sign(44, 13, 44, '<div class="k-l">What’s in the fridge</div><h3>Fresh from the table.</h3><p>Our editorial, our socials and a little magazine we made.</p><div class="cta-row"><a class="btn btn--small" href="news.html">All news</a><a class="btn btn--small btn--soft" href="news.html#magazine">Read the magazine</a></div>', "pin") +
        '<button class="k-mag" style="left:calc(62 * var(--u));top:63%" data-href="news.html#magazine" aria-label="Read our magazine"><img src="assets/brand/wordmark.png" alt=""></button>' +
        plate(84, 71, img(3)) +
        at(112, 37, "k-wall k-plant", plant, "width:calc(8 * var(--u))")
    },
    {
      key: "about", name: "About", w: 104,
      html: () =>
        sign(8, 13, 50, '<div class="k-l">About</div><h3>A behavioural scientist, an engineer and an architect walk into a kitchen…</h3><p>…and build an app for themselves and their friends. Then people sent it to other people.</p><a class="btn btn--small" href="about.html">Read our story</a>', "pin") +
        hanging(68, 12, "wok", "#481D24", "#5e2d35") + hanging(86, 7, "ladle") +
        '<button class="k-letter" style="left:calc(34 * var(--u));top:69%" data-href="about.html" aria-label="Read our letter"></button>' +
        plate(8, 70, img(4)) + plate(70, 72, img(6))
    },
    {
      key: "join", name: "Your seat", w: 150,
      html: () =>
        sign(8, 10, 54,
          '<div class="k-l">Your seat is ready</div><h2>Come sit with us.</h2><p>Free on the App Store. Android is almost here.</p>' +
          '<div class="cta-row">' + window.PP_APPSTORE() + "</div>" +
          '<form class="form" data-kwait style="margin-top:calc(1.2 * var(--u))"><div class="form-row"><input class="field" type="email" placeholder="Email for the Android waitlist" aria-label="Email" required><button class="btn" type="submit">Notify me</button></div><p class="form-msg" role="status"></p></form>') +
        [74, 94, 114].map((x) => '<button class="k-person empty" style="left:calc(' + x + ' * var(--u))" data-seat aria-label="Empty seat"><span class="chair"></span></button>').join("") +
        plate(74.5, 70.5, img(0)) + plate(94.5, 70.5, img(5)) + plate(114.5, 70.5, img(2)) +
        hanging(132, 10, "skillet", "#481D24", "#5e2d35")
    }
  ];

  /* ---------- Build: 3 copies for the endless loop ---------- */
  const track = document.createElement("div");
  track.className = "k-track";
  let html = "";
  for (let copy = 0; copy < 3; copy++) {
    STATIONS.forEach((s) => {
      html += '<section class="k-st" data-key="' + s.key + '" style="--w:' + s.w + '" aria-label="' + esc(s.name) + '">' +
        '<div class="k-table"><div class="top"></div><div class="runner"></div><div class="front"></div></div>' + legs(s.w) +
        '<span class="k-rug" style="left:calc(10 * var(--u));width:calc(' + (s.w - 20) + ' * var(--u))"></span>' +
        s.html() + "</section>";
    });
  }
  track.innerHTML = html;
  K.appendChild(track);

  const bubble = document.createElement("div");
  bubble.className = "k-bubble";
  bubble.style.position = "fixed";
  document.body.appendChild(bubble);
  const toastEl = document.createElement("div");
  toastEl.className = "k-toast";
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  let tT;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tT); tT = setTimeout(() => toastEl.classList.remove("show"), 2400); };

  /* ---------- HUD ---------- */
  const hud = document.createElement("div");
  hud.className = "k-hud";
  hud.innerHTML =
    '<button class="round-btn" data-step="-1" aria-label="Previous">' + I.left + "</button>" +
    '<div class="k-stops">' + STATIONS.map((s) => '<button class="k-stop" data-stop="' + s.key + '"><span class="dot"></span><span class="t">' + s.name + "</span></button>").join("") + "</div>" +
    '<button class="round-btn" data-step="1" aria-label="Next">' + I.right + "</button>" +
    '<span class="k-rank" aria-live="polite"></span>' +
    '<button class="round-btn" data-sound aria-label="Kitchen sounds" aria-pressed="false"></button>';
  document.body.appendChild(hud);
  const soundBtn = hud.querySelector("[data-sound]");
  const spk = (on) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z"/>' + (on ? '<path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>' : '<path d="M17 9l5 6M22 9l-5 6"/>') + "</svg>";
  function syncSound() {
    const on = window.PP_SOUND && window.PP_SOUND.enabled;
    soundBtn.innerHTML = spk(on); soundBtn.classList.toggle("on", !!on); soundBtn.setAttribute("aria-pressed", String(!!on));
    if (window.PP_SOUND) window.PP_SOUND.ambient(on && active());
  }
  soundBtn.addEventListener("click", () => { window.PP_SOUND && window.PP_SOUND.toggle(); syncSound(); });

  /* ---------- Progress: visiting stops = meals cooked ---------- */
  const RANKS = [[1, "Guest"], [3, "Pal"], [6, "Regular"], [8, "Family"]];
  let seen = new Set();
  try { seen = new Set(JSON.parse(sessionStorage.getItem("pp-seen") || "[]")); } catch (e) {}
  const rankOf = (n) => { let r = ""; RANKS.forEach(([min, name]) => { if (n >= min) r = name; }); return r; };
  function renderRank() {
    const n = seen.size;
    hud.querySelector(".k-rank").innerHTML = (rankOf(n) || "Guest") + "<small>" + n + " of " + STATIONS.length + " stops</small>";
    hud.querySelectorAll(".k-stop").forEach((b) => b.classList.toggle("seen", seen.has(b.dataset.stop)));
  }

  /* ---------- Scrolling, loop & navigation ---------- */
  let setW = 0, current = null;
  const active = () => document.documentElement.dataset.mode === "game";
  function measure() {
    K.style.setProperty("--u", K.clientHeight / 100 + "px");
    const firstOfSecond = track.children[STATIONS.length];
    setW = firstOfSecond ? firstOfSecond.offsetLeft : 0;
  }
  function wrap() {
    if (!setW) return 0;
    if (K.scrollLeft < setW * 0.5) { K.scrollLeft += setW; return setW; }
    if (K.scrollLeft > setW * 1.5) { K.scrollLeft -= setW; return -setW; }
    return 0;
  }
  let walked = 0, lastX = 0;
  function onScroll() {
    wrap();
    const mid = K.scrollLeft + K.clientWidth / 2;
    let found = null;
    for (const el of track.children) { if (el.offsetLeft <= mid && el.offsetLeft + el.offsetWidth > mid) { found = el.dataset.key; break; } }
    if (found && found !== current) {
      current = found;
      hud.querySelectorAll(".k-stop").forEach((b) => b.classList.toggle("on", b.dataset.stop === found));
      const onBtn = hud.querySelector(".k-stop.on");
      if (onBtn) onBtn.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (!seen.has(found)) {
        const before = rankOf(seen.size);
        seen.add(found);
        try { sessionStorage.setItem("pp-seen", JSON.stringify([...seen])); } catch (e) {}
        const after = rankOf(seen.size);
        if (after !== before && after) { toast("You’re now: " + after + " at the table"); sfx("ding"); }
        renderRank();
      }
    }
    walked += Math.abs(K.scrollLeft - lastX); lastX = K.scrollLeft;
    if (walked > 280) { walked = 0; sfx("knock"); }
    bubble.classList.remove("show");
  }
  K.addEventListener("scroll", onScroll, { passive: true });

  let tween = null;
  function goTo(key, dir) {
    measure();
    const els = [...track.children].filter((el) => el.dataset.key === key);
    const target = (el) => el.offsetLeft - Math.max(16, (K.clientWidth - el.offsetWidth) / 2 > 0 ? (K.clientWidth - el.offsetWidth) / 2 : 16);
    let best = null, bestD = Infinity;
    els.forEach((el) => {
      const d = target(el) - K.scrollLeft;
      if (dir && Math.sign(d) !== dir && Math.abs(d) > 4) return;
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = el; }
    });
    if (!best) return;
    let to = target(best), from = K.scrollLeft;
    const t0 = performance.now(), dur = Math.min(1100, 400 + Math.abs(to - from) * 0.35);
    cancelAnimationFrame(tween);
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      K.scrollLeft = from + (to - from) * e;
      const shift = wrap(); from += shift; to += shift;
      if (p < 1) tween = requestAnimationFrame(step);
    };
    tween = requestAnimationFrame(step);
  }
  function stepTo(dir) {
    const i = STATIONS.findIndex((s) => s.key === current);
    const next = STATIONS[(i + dir + STATIONS.length) % STATIONS.length].key;
    goTo(next, dir);
    sfx("tick");
  }

  K.addEventListener("wheel", (e) => {
    if (!active()) return;
    if (e.target.closest(".k-fridge.open .inside")) return;
    e.preventDefault();
    cancelAnimationFrame(tween);
    K.scrollLeft += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 32 : 1);
  }, { passive: false });
  document.addEventListener("keydown", (e) => {
    if (!active() || e.target.closest("input,textarea")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); stepTo(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); stepTo(-1); }
  });
  hud.addEventListener("click", (e) => {
    const s = e.target.closest("[data-step]"); if (s) return stepTo(+s.dataset.step);
    const st = e.target.closest("[data-stop]"); if (st) { goTo(st.dataset.stop); sfx("tick"); }
  });

  /* Mouse drag */
  let drag = false, moved = false, sx = 0, ss = 0;
  K.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.target.closest("a,input,button:not(.k-person):not(.k-plate):not(.k-pan),textarea,.k-fridge.open .inside")) return;
    drag = true; moved = false; sx = e.clientX; ss = K.scrollLeft; cancelAnimationFrame(tween);
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const d = e.clientX - sx;
    if (Math.abs(d) > 5) { moved = true; K.classList.add("dragging"); }
    K.scrollLeft = ss - d; ss += wrap();
  });
  window.addEventListener("pointerup", () => { if (!drag) return; drag = false; K.classList.remove("dragging"); setTimeout(() => (moved = false), 0); });

  /* ---------- Interactions ---------- */
  function showBubble(el, title, text) {
    const r = el.getBoundingClientRect();
    bubble.innerHTML = "<b>" + esc(title) + "</b>" + esc(text);
    bubble.style.left = r.left + r.width / 2 + "px";
    bubble.style.top = "0px";
    bubble.classList.add("show");
    const h = bubble.offsetHeight;
    bubble.style.top = Math.max(72, r.top - h - 10) + "px";
  }
  K.addEventListener("click", (e) => {
    if (moved) return;
    const t = e.target;
    let el;
    if ((el = t.closest("[data-go]"))) { goTo(el.dataset.go); return; }
    if ((el = t.closest("[data-plate]"))) { el.classList.remove("ate"); void el.offsetWidth; el.classList.add("ate"); sfx("pop"); return; }
    if ((el = t.closest("[data-title]"))) {
      const tt = TITLES[+el.dataset.title];
      track.querySelectorAll("[data-title]").forEach((p) => p.classList.toggle("sel", p.dataset.title === el.dataset.title));
      el.classList.remove("swing"); void el.offsetWidth; el.classList.add("swing");
      track.querySelectorAll("[data-title-result]").forEach((p) => (p.innerHTML = "<strong style=\"color:var(--wine)\">" + tt.name + ".</strong> " + tt.says));
      sfx("clang");
      return;
    }
    if ((el = t.closest("[data-clang]"))) { el.classList.remove("swing"); void el.offsetWidth; el.classList.add("swing"); sfx("clang"); return; }
    if ((el = t.closest("[data-person]"))) {
      const m = TEAM[+el.dataset.person];
      const facts = (m.funFacts || []).filter((f) => !/^TODO/.test(f));
      showBubble(el.querySelector(".head"), (m.handle || "@") + " (" + m.name + ")", facts.length ? facts[Math.floor(Math.random() * facts.length)] : m.role);
      sfx("pop");
      return;
    }
    if ((el = t.closest("[data-seat]"))) { showBubble(el, "This seat is saved for you", "Download PanPals and pull up a chair."); sfx("knock"); return; }
    if ((el = t.closest("[data-open-fridge]"))) { el.closest(".k-fridge").classList.add("open"); sfx("door"); return; }
    if ((el = t.closest("[data-href]"))) { sfx("tick"); location.href = el.dataset.href; return; }
    if (!t.closest(".k-bubble")) bubble.classList.remove("show");
  });
  K.addEventListener("submit", async (e) => {
    const f = e.target.closest("[data-kwait]");
    if (!f) return;
    e.preventDefault();
    if (await window.PP_WAITLIST(f.querySelector("input").value.trim(), f.querySelector(".form-msg"))) { f.reset(); sfx("ding"); }
  });

  /* ---------- Mode switching ---------- */
  let started = false;
  function start() {
    measure();
    if (!started) { K.scrollLeft = setW; lastX = K.scrollLeft; started = true; }
    onScroll(); renderRank(); syncSound();
  }
  document.addEventListener("pp:mode", (e) => { if (e.detail === "game") requestAnimationFrame(start); else syncSound(); });
  window.addEventListener("resize", () => {
    if (!active()) return;
    const ratio = setW ? (K.scrollLeft - setW) / setW : 0;
    measure(); K.scrollLeft = setW + ratio * setW;
  });
  if (active()) requestAnimationFrame(start);
})();
