/* ==========================================================================
   PANPALS · PHONE PROTOTYPE
   App'in simulator ekran görüntülerine göre (Kasım 2026):
   Welcome → Feed, Post (fotoğraf seç → paylaş), PalStats, Profile.
   Veriler data/feed.js'ten gelir.
   ========================================================================== */

(function () {
  const root = document.getElementById("phone");
  if (!root) return;
  const FEED = (window.PANPALS_FEED || []).map((p) => Object.assign({}, p));
  const ME = Object.assign({}, window.PANPALS_ME || {});
  const ST = window.PANPALS_PALSTATS || { fame: [], top: [], streak: [] };
  const esc = window.PP_ESC || ((s) => String(s));
  const sfx = (n) => window.PP_SOUND && window.PP_SOUND.play(n);
  const s = (p, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  const ic = {
    feed: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="6" r="1.6"/><circle cx="4" cy="12" r="1.6"/><circle cx="4" cy="18" r="1.6"/><rect x="8" y="5" width="13" height="2.2" rx="1.1"/><rect x="8" y="10.9" width="13" height="2.2" rx="1.1"/><rect x="8" y="16.8" width="13" height="2.2" rx="1.1"/></svg>',
    post: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 7v10M7 12h10" stroke="var(--tab-bg,#fff)" stroke-width="2.2" stroke-linecap="round"/></svg>',
    stats: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 6.6l1.6 3.4 3.7.4-2.8 2.5.8 3.7-3.3-1.9-3.3 1.9.8-3.7-2.8-2.5 3.7-.4z" fill="var(--tab-bg,#fff)"/></svg>',
    person: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="9.5" r="3.3" fill="var(--tab-bg,#fff)"/><path d="M5.8 18.2c1.4-2.5 3.6-3.7 6.2-3.7s4.8 1.2 6.2 3.7" fill="var(--tab-bg,#fff)"/></svg>',
    search: s('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>', 2),
    bell: s('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>'),
    gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-2.7a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7z"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
    heart: s('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    bubble: s('<path d="M4 4.5h16v11.5H10l-4.5 4v-4H4z"/>'),
    flag: s('<path d="M5 21V4h12l-2.5 4.5L17 13H5"/>'),
    flagL: s('<path d="M19 21V4H7l2.5 4.5L7 13h12"/>'),
    bowl: s('<path d="M4 12h16a8 8 0 0 1-16 0zM9 9c0-1 1-1.4 1-2.4M13 9c0-1 1-1.4 1-2.4"/>'),
    chart: s('<path d="M4 4v16h16M7 15l4-4 3 3 5-6"/>'),
    flame: s('<path d="M12 21c3.9 0 6-2.6 6-5.8 0-3.6-3-5.6-3.6-9.2-1.8 1.2-2.7 3-2.7 4.6-1-.6-1.6-1.8-1.6-3C7.7 9.4 6 12 6 15.2 6 18.4 8.1 21 12 21z"/>'),
    cone: s('<path d="M8 10a4 4 0 1 1 8 0zM8 10l4 11 4-11"/>'),
    glass: s('<path d="M5 4h14l-7 8zM12 12v8M8 20h8"/>'),
    gem: s('<path d="M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l3 16M15 4l-3 16"/>'),
    medal: s('<circle cx="12" cy="8.5" r="5.5"/><path d="M9 13.5L8 21l4-2.2 4 2.2-1-7.5"/>'),
    fork: s('<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M15 3c2 0 3 2 3 5s-1 4-3 4v9"/>'),
    spatula: s('<circle cx="15" cy="8" r="5"/><path d="M11.5 11.5L4 19"/>'),
    pizza: s('<path d="M4 9l16-4-6 15zM9 10.5h.01M13 13h.01"/>'),
    croissant: s('<path d="M5 15c-1-3 0-7 3-8l3 3-2 4zM19 15c1-3 0-7-3-8l-3 3 2 4zM9 14l3-4 3 4-3 3z"/>'),
    chevL: s('<path d="M15 5l-7 7 7 7"/>', 2.2),
    film: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>'),
    music: s('<path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"/>'),
    down: s('<path d="M6 9l6 6 6-6"/>'),
    cam: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h3l1.6-2h6.8L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>',
    camSwitch: s('<path d="M4 8h3l1.5-2h7L17 8h3v10H4zM9 13a3 3 0 0 1 5.2-2M15 13a3 3 0 0 1-5.2 2"/>'),
    check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.6),
    signal: '<svg viewBox="0 0 64 22" fill="currentColor"><rect x="0" y="14" width="4" height="7" rx="1"/><rect x="6" y="10" width="4" height="11" rx="1"/><rect x="12" y="6" width="4" height="15" rx="1"/><rect x="18" y="2" width="4" height="19" rx="1"/><path d="M34 9.5a11 11 0 0 1 14 0l-1.6 1.7a8.6 8.6 0 0 0-10.8 0zm3.2 3.4a6.4 6.4 0 0 1 7.6 0L41 17z"/><rect x="51" y="5" width="11" height="12" rx="2.5" fill="#34c759"/></svg>'
  };

  const st = { liked: new Set(), following: new Set(), view: "feed", who: "me", ptab: "posts", stack: [], pick: null, music: "" };

  root.innerHTML =
    '<div class="app"><div class="island"></div>' +
      '<div class="a-status"><span>10:44</span><span class="sig">' + ic.signal + "</span></div>" +
      '<div class="a-body">' + ["feed", "pick", "compose", "stats", "profile", "goal"].map((v) => '<div class="a-view" data-v="' + v + '"></div>').join("") + "</div>" +
      '<nav class="a-tabs">' +
        '<button class="a-tab" data-tab="feed">' + ic.feed + "<span>Feed</span></button>" +
        '<button class="a-tab" data-tab="pick">' + ic.post + "<span>Post</span></button>" +
        '<button class="a-tab" data-tab="stats">' + ic.stats + "<span>PalStats</span></button>" +
        '<button class="a-tab" data-tab="me">' + ic.person + "<span>Profile</span></button>" +
      "</nav>" +
      '<div class="a-splash"><h5>Welcome to PanPals</h5><img src="assets/app/splash-illustration.jpg" alt=""><span class="spin"></span></div>' +
      '<div class="a-hint"><i></i><span>Double tap the plate</span></div>' +
      '<div class="a-toast" role="status"></div><div class="a-home"></div>' +
    "</div>";

  const app = root.querySelector(".app");
  const body = root.querySelector(".a-body");
  const V = (n) => root.querySelector('[data-v="' + n + '"]');
  const toastEl = root.querySelector(".a-toast");
  let tT;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tT); tT = setTimeout(() => toastEl.classList.remove("show"), 2200); };

  /* Splash, the first time the phone is on screen */
  const splash = root.querySelector(".a-splash");
  const hideSplash = () => setTimeout(() => splash.classList.add("gone"), 1500);
  if ("IntersectionObserver" in window) { const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { hideSplash(); io.disconnect(); } }, { threshold: 0.4 }); io.observe(root); } else hideSplash();

  /* FEED */
  function postHTML(p, i) {
    const liked = st.liked.has(i);
    return '<article class="a-post">' +
      '<div class="a-post-head">' + (p.avatar ? '<img class="a-av" src="' + esc(p.avatar) + '" alt="" draggable="false">' : '<span class="a-av a-avph">' + ic.person + "</span>") +
        '<div class="a-who"><button class="a-name" data-open="' + i + '"><b>' + esc(p.user) + "</b> - " + esc(p.title) + "</button>" +
          (p.tag && p.tag.text ? '<span class="a-listen">' + (p.tag.type === "watching" ? ic.film : ic.music) + esc(p.tag.text) + "</span>" : "") + "</div>" +
        '<span class="a-more">' + ic.dots + "</span></div>" +
      '<div class="a-photo" data-dbl="' + i + '"><img src="' + esc(p.image) + '" alt="' + esc(p.caption) + '" draggable="false" loading="lazy"><span class="a-pop">' + ic.heartFill + "</span></div>" +
      '<div class="a-meta"><div class="a-acts">' +
        '<button class="a-like' + (liked ? " on" : "") + '" data-like="' + i + '">' + ic.heart + "<span>" + (p.likes + (liked ? 1 : 0)) + " bon appétit</span></button>" +
        '<button class="a-cm" data-toast="Table talk lives in the app. Pull up a chair!">' + (p.comments || 0) + ic.bubble + "</button></div>" +
        (p.caption ? '<div class="a-cap">' + esc(p.caption) + "</div>" : "") +
        '<div class="a-ago">' + esc(p.ago) + "</div></div></article>";
  }
  function renderFeed() {
    V("feed").innerHTML = '<div class="a-top"><button class="a-ic" data-toast="Search for pals and dishes">' + ic.search + '</button><span class="a-brand">PanPals</span><button class="a-ic a-bell" data-toast="3 pals cooked today. Your turn?">' + ic.bell + "</button></div>" + FEED.map(postHTML).join("") + '<div class="a-spacer"></div>';
  }

  /* POST: pick a photo, then compose */
  function renderPick() {
    const pool = FEED.map((x) => x.image);
    if (!st.pick) st.pick = pool[0];
    V("pick").innerHTML = '<div class="a-title">What\'s cooking?</div><div class="a-next"><button data-next>Next &gt;</button></div>' +
      '<div class="a-crop"><img src="' + esc(st.pick) + '" alt="" draggable="false"><i class="g1"></i><i class="g2"></i><i class="g3"></i><i class="g4"></i></div>' +
      '<div class="a-gallery"><button class="tile" data-toast="The camera opens in the app">' + ic.cam + '</button><button class="tile light" data-toast="The camera opens in the app">' + ic.camSwitch + "</button>" +
        pool.map((src) => '<button class="tile ph' + (src === st.pick ? " sel" : "") + '" data-choose="' + esc(src) + '"><img src="' + esc(src) + '" alt="" draggable="false">' + (src === st.pick ? '<span class="tick">' + ic.check + "</span>" : "") + "</button>").join("") +
      '</div><div class="a-spacer"></div>';
  }
  function renderCompose() {
    V("compose").innerHTML = '<div class="a-backrow"><button data-back>&lt; Back</button><span>What\'s cooking?</span></div>' +
      '<div class="a-cimg"><img src="' + esc(st.pick) + '" alt="" draggable="false"></div>' +
      '<button class="a-music" data-music>' + ic.music + ic.down + "<span>" + esc(st.music || "What are you listening/watching?") + "</span></button>" +
      '<textarea class="a-captionbox" placeholder="Add a caption..." data-caption maxlength="80"></textarea>' +
      '<button class="a-share" data-share>Share</button>';
  }

  /* PALSTATS */
  function list(rows) { return '<div class="a-card">' + rows.map((r, k) => '<div class="a-row"><span class="m">' + ic.medal + "<em>" + (k + 1) + "</em></span><span class=\"n\">" + esc(r[0]) + "</span><span>" + esc(r[1]) + "</span></div>").join("") + "</div>"; }
  function renderStats() {
    V("stats").innerHTML = '<div class="a-brand big">PanPals</div>' +
      '<div class="a-lb">' + ic.flagL + "<span>PanPals Leaderboard</span>" + ic.flag + "</div>" +
      '<div class="a-h">Pan of Fame:</div>' +
      ST.fame.map((f) => '<div class="a-fame"><span class="fi">' + (ic[f.icon] || ic.medal) + '</span><span>' + esc(f.label) + " <b>" + esc(f.who) + (f.n != null ? " " + f.n : "") + "</b></span></div>").join("") +
      '<div class="a-h c">Top Homecooks of the Week<small>' + esc(ST.week) + "</small></div>" + list(ST.top) +
      '<div class="a-h c">Livestream Streak</div>' + list(ST.streak) +
      '<p class="a-quote">' + esc(ST.quote || "") + '</p><div class="a-spacer"></div>';
  }

  /* Weekly line chart for the profile stats tab (same look as the app's progress chart) */
  function weekChart(pts) {
    const W = 260, H = 120, x0 = 18, y0 = 6, w = W - x0 - 4, h = H - 24, max = 32;
    const X = (i) => x0 + (i / (pts.length - 1)) * w, Y = (v) => y0 + h - (v / max) * h;
    let g = "";
    for (let i = 0; i <= 8; i++) g += '<line x1="' + (x0 + (i / 8) * w) + '" y1="' + y0 + '" x2="' + (x0 + (i / 8) * w) + '" y2="' + (y0 + h) + '" stroke="rgba(0,0,0,.45)" stroke-width=".6"/>';
    [8, 16, 24, 32].forEach((v) => (g += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + (x0 + w) + '" y2="' + Y(v) + '" stroke="rgba(0,0,0,.45)" stroke-width=".6"/><text x="0" y="' + (Y(v) + 3) + '" font-size="8" fill="#333">' + v + "</text>"));
    const line = pts.map((v, i) => X(i) + "," + Y(v)).join(" ");
    const area = "M" + X(0) + "," + (y0 + h) + " L" + line.replace(/ /g, " L") + " L" + X(pts.length - 1) + "," + (y0 + h) + " Z";
    const dots = pts.map((v, i) => '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="2.4" fill="#fff" stroke="#481D24" stroke-width="1"/>').join("");
    const months = '<text x="' + X(0) + '" y="' + (H - 4) + '" font-size="8" fill="#333">Sept</text><text x="' + X(3) + '" y="' + (H - 4) + '" font-size="8" fill="#333">Oct</text><text x="' + X(6) + '" y="' + (H - 4) + '" font-size="8" fill="#333">Nov</text>';
    return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">' + g + '<path d="' + area + '" fill="rgba(72,29,36,.12)"/><polyline points="' + line + '" fill="none" stroke="#481D24" stroke-width="1.2"/>' + dots + months + "</svg>";
  }

  /* PROFILE */
  function renderProfile() {
    const isMe = st.who === "me";
    const p = isMe ? ME : FEED[st.who];
    const fol = !isMe && st.following.has(st.who);
    const stats = isMe ? [["flame", "Streak", ME.streak], ["bowl", "Goal", ME.goal], ["bowl", "Meals", ME.meals + " meals"], ["medal", "Achievements", ME.achievement]]
                       : [["flame", "Streak", (p.streak || 3) + " day"], ["bowl", "Goal", p.title], ["bowl", "Meals", p.meals + " meals"], ["medal", "Achievements", p.meals >= 100 ? "100 Club" : "First Plate"]];
    const posts = isMe ? ME.posts : [p.image].concat(FEED.filter((x) => x !== p).slice(0, 5).map((x) => x.image));
    V("profile").innerHTML =
      '<div class="a-ptop">' + (isMe ? "<span></span>" : '<button class="a-pback" data-back>&lt;</button>') + "<span>Profile</span>" + '<button class="a-ic" data-toast="Settings live in the app">' + ic.gear + "</button></div>" +
      '<div class="a-phead"><div class="a-pleft">' + (p.avatar ? '<img src="' + esc(p.avatar) + '" alt="" draggable="false">' : '<span class="a-pph">' + ic.person + "</span>") + '<b>' + esc(p.title) + "</b><small>" + esc(isMe ? ME.city : "") + "</small></div>" +
        '<div class="a-pright"><div class="a-pname">' + esc(p.user) + '</div><div class="a-pnums"><span><b>' + (isMe ? ME.meals : p.meals) + "</b>meals</span><span><b>" + (isMe ? ME.followers : 120 + p.likes + (fol ? 1 : 0)) + "</b>followers</span><span><b>" + (isMe ? ME.following : 98) + "</b>following</span></div>" +
        (isMe ? "" : '<button class="a-followbtn' + (fol ? " on" : "") + '" data-follow="' + st.who + '">' + (fol ? "Following" : "Follow") + "</button>") + "</div></div>" +
      '<div class="a-ptabs"><button data-ptab="posts" class="' + (st.ptab === "posts" ? "on" : "") + '">' + ic.bowl + '</button><button data-ptab="stats" class="' + (st.ptab === "stats" ? "on" : "") + '">' + ic.chart + "</button></div>" +
      (st.ptab === "posts"
        ? '<div class="a-grid">' + posts.map((src) => '<img src="' + esc(src) + '" alt="" draggable="false">').join("") + "</div>"
        : '<div class="a-pills">' + stats.map((r) => '<' + (isMe && r[1] === "Goal" ? 'button data-goal class="a-spill tap"' : 'div class="a-spill"') + '><span class="i">' + ic[r[0]] + '</span><span class="l">' + r[1] + '</span><span class="v">' + esc(r[2]) + "</span></" + (isMe && r[1] === "Goal" ? "button" : "div") + ">").join("") + "</div>" +
          '<div class="a-week"><b>' + esc(isMe ? ME.week : "Week of 16.11 - 22.11") + "</b><span>" + esc(isMe ? ME.weekLine : "3 Meals, 0 Challenges, 1 Goals") + '</span><div class="a-gridchart">' + weekChart(isMe ? [9, 12, 7, 14, 18, 11, 16, 20, 13] : [3, 5, 4, 6, 8, 5, 7, 9, 6]) + "</div></div>") +
      '<div class="a-spacer"></div>';
  }

  /* CHANGE GOAL */
  const GOALS = [["Commis Team", [["fork", "Prep Chef", "1-3 meals/week"], ["spatula", "Line Chef", "4-6 meals/week"]]], ["Chefs Table", [["pizza", "Sous Chef", "7-10 meals/week"], ["croissant", "Head Chef", "11+ meals/week"]]]];
  function renderGoal() {
    if (!st.goalSel) st.goalSel = ME.goal;
    V("goal").innerHTML = '<div class="a-ghead"><button class="a-gback" data-back>' + ic.chevL + "</button><span>Change Goal</span><span></span></div>" +
      '<div class="a-gbody"><h5>Change Your Cooking Goal</h5><p>Update your cooking title and weekly goal</p>' +
      GOALS.map((g) => '<div class="a-ggrp">' + g[0] + '</div><div class="a-gopts">' + g[1].map((o) => '<button class="a-gopt' + (st.goalSel === o[1] ? " sel" : "") + '" data-gopt="' + o[1] + '"><span class="gi">' + ic[o[0]] + "</span><span><b>" + o[1] + "</b>" + o[2] + "</span></button>").join("") + "</div>").join("") +
      '<button class="a-gsave" data-gsave>Save Goal</button><div class="a-spacer"></div></div>';
  }

  const RENDER = { feed: renderFeed, pick: renderPick, compose: renderCompose, stats: renderStats, profile: renderProfile, goal: renderGoal };
  function show(v, opt) {
    opt = opt || {};
    if (opt.push) st.stack.push({ v: st.view, who: st.who, y: body.scrollTop });
    st.view = v; RENDER[v]();
    root.querySelectorAll(".a-view").forEach((el) => el.classList.toggle("on", el.dataset.v === v));
    const tab = v === "goal" ? "me" : v === "profile" ? (st.who === "me" ? "me" : "feed") : v === "compose" ? "pick" : v;
    root.querySelectorAll(".a-tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === tab));
    app.classList.toggle("no-tabs", v === "compose");
    app.classList.toggle("wine", v === "goal");
    body.scrollTop = opt.y || 0;
  }
  function like(i, dbl, photo) {
    if (dbl && photo) { const pop = photo.querySelector(".a-pop"); pop.classList.remove("go"); void pop.offsetWidth; pop.classList.add("go"); }
    if (dbl && st.liked.has(i)) return;
    st.liked.has(i) ? st.liked.delete(i) : st.liked.add(i);
    sfx(st.liked.has(i) ? "pop" : "tick");
    const b = root.querySelector('[data-like="' + i + '"]');
    if (b) { b.classList.toggle("on", st.liked.has(i)); b.querySelector("span").textContent = FEED[i].likes + (st.liked.has(i) ? 1 : 0) + " bon appétit"; }
  }

  const MUSIC = ["Listening: Taylor", "Watching: the bear s3", "Listening: cooking podcast", ""];
  const hint = root.querySelector(".a-hint");
  const dropHint = () => { if (hint) { hint.classList.add("gone"); setTimeout(() => hint.remove(), 400); } };
  root.addEventListener("pointerdown", dropHint, { once: true });
  root.addEventListener("wheel", dropHint, { once: true, passive: true });
  let lastTap = 0;
  root.addEventListener("click", (e) => {
    if (dragMoved) return;
    const q = (sel) => e.target.closest(sel);
    let el;
    if ((el = q("[data-tab]"))) { st.stack = []; sfx("tick"); const v = el.dataset.tab; if (v === "me") { st.who = "me"; st.ptab = "posts"; show("profile"); } else show(v); return; }
    if ((el = q("[data-open]"))) { st.who = +el.dataset.open; st.ptab = "posts"; show("profile", { push: true }); sfx("tick"); return; }
    if ((el = q("[data-like]"))) { like(+el.dataset.like); return; }
    if ((el = q("[data-dbl]"))) { const now = Date.now(); if (now - lastTap < 320) { like(+el.dataset.dbl, true, el); lastTap = 0; } else lastTap = now; return; }
    if (q("[data-back]")) { const h = st.stack.pop() || { v: "feed", who: "me" }; st.who = h.who; show(h.v, { y: h.y }); sfx("tick"); return; }
    if ((el = q("[data-follow]"))) { const i = +el.dataset.follow; st.following.has(i) ? st.following.delete(i) : st.following.add(i); renderProfile(); sfx("pop"); return; }
    if ((el = q("[data-ptab]"))) { st.ptab = el.dataset.ptab; renderProfile(); sfx("tick"); return; }
    if (q("[data-goal]")) { st.goalSel = ME.goal; show("goal", { push: true }); sfx("tick"); return; }
    if ((el = q("[data-gopt]"))) { st.goalSel = el.dataset.gopt; renderGoal(); sfx("tick"); return; }
    if (q("[data-gsave]")) { ME.goal = ME.title = st.goalSel; st.stack = []; st.who = "me"; show("profile"); sfx("ding"); toast("Goal saved: " + ME.goal); return; }
    if ((el = q("[data-choose]"))) { st.pick = el.dataset.choose; renderPick(); sfx("tick"); return; }
    if (q("[data-next]")) { show("compose", { push: true }); sfx("tick"); return; }
    if (q("[data-music]")) { st.music = MUSIC[(MUSIC.indexOf(st.music) + 1) % MUSIC.length]; q("[data-music] span").textContent = st.music || "What are you listening/watching?"; sfx("tick"); return; }
    if (q("[data-share]")) {
      const cap = (V("compose").querySelector("[data-caption]").value || "").trim();
      FEED.unshift({ user: ME.user, avatar: ME.avatar, title: ME.title, image: st.pick, caption: cap, tag: st.music ? { type: /^Watching/.test(st.music) ? "watching" : "listening", text: st.music.replace(/^(Listening|Watching):\s*/, "") } : null, likes: 0, comments: 0, ago: "Just now", meals: ME.meals + 1 });
      st.liked = new Set([...st.liked].map((i) => i + 1)); st.following = new Set([...st.following].map((i) => i + 1));
      ME.meals += 1; ME.posts = [st.pick].concat(ME.posts); st.pick = null; st.music = ""; st.stack = [];
      show("feed"); sfx("ding"); toast("Shared! Bon appétit");
      document.dispatchEvent(new CustomEvent("pp:shared")); return;
    }
    if ((el = q("[data-toast]"))) toast(el.dataset.toast);
  });

  let drag = false, dragMoved = false, sy = 0, ss = 0;
  body.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.target.closest("textarea,input")) return; drag = true; dragMoved = false; sy = e.clientY; ss = body.scrollTop; });
  window.addEventListener("pointermove", (e) => { if (!drag) return; const d = e.clientY - sy; if (Math.abs(d) > 4) { dragMoved = true; body.classList.add("dragging"); } body.scrollTop = ss - d; });
  window.addEventListener("pointerup", () => { if (!drag) return; drag = false; body.classList.remove("dragging"); setTimeout(() => (dragMoved = false), 0); });

  /* Public: open the Post screen with a photo and caption ready (used by Game Mode) */
  window.PP_PHONE = {
    compose(image, caption) {
      splash.classList.add("gone");
      const h = root.querySelector(".a-hint"); if (h) h.remove();
      st.pick = image; st.stack = [{ v: "feed", who: st.who, y: 0 }];
      show("compose");
      const c = V("compose").querySelector("[data-caption]"); if (c) c.value = caption || "";
    },
    feed() { st.stack = []; show("feed"); }
  };

  show("feed");
})();
