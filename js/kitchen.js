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
  const NEWS = (window.PANPALS_FEEDS || []).concat(window.PANPALS_NEWS || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const esc = window.PP_ESC, I = window.PP_ICONS, photo = window.PP_PHOTO;
  const sfx = (n) => window.PP_SOUND && window.PP_SOUND.play(n);

  /* ---------- Drawings: flat, simple shapes in the PanPals palette ---------- */
  const R = (x, y, w, h, rx, f, o) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>";
  const Ci = (x, y, r, f, o) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>";
  const El = (x, y, rx, ry, f, o) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>";
  const P = (d, f, o) => '<path d="' + d + '" fill="' + f + '"' + (o ? ' opacity="' + o + '"' : "") + "/>";
  const STEEL = "#9c8f84", WOOD = "#6b4a3d", HOOK = '<circle cx="50%" cy="7" r="3" fill="#f3ede5"/>';
  function pan(kind, color, inner) {
    if (kind === "pot") return '<svg viewBox="0 0 80 120">' + R(36, 2, 8, 40, 4, STEEL) + Ci(40, 8, 3, "#f3ede5") + R(8, 44, 64, 58, 10, color) + R(4, 42, 72, 9, 4.5, inner) + R(0, 58, 9, 8, 3, inner) + R(71, 58, 9, 8, 3, inner) + "</svg>";
    if (kind === "wok") return '<svg viewBox="0 0 90 130">' + R(41, 2, 8, 52, 4, WOOD) + Ci(45, 9, 3, "#f3ede5") + Ci(45, 92, 38, color) + Ci(45, 92, 29, inner) + "</svg>";
    if (kind === "ladle") return '<svg viewBox="0 0 40 120">' + R(17, 2, 6, 80, 3, STEEL) + Ci(20, 7, 2.4, "#f3ede5") + P("M6 84h28a14 14 0 0 1-28 0z", STEEL) + "</svg>";
    if (kind === "spoon") return '<svg viewBox="0 0 30 120">' + R(12, 2, 6, 74, 3, WOOD) + Ci(15, 7, 2.2, "#f3ede5") + El(15, 92, 10, 16, WOOD) + "</svg>";
    if (kind === "whisk") return '<svg viewBox="0 0 36 120">' + R(15, 2, 6, 46, 3, WOOD) + Ci(18, 7, 2.2, "#f3ede5") + P("M18 46c-14 20-14 50 0 66 14-16 14-46 0-66zm0 8c-7 16-7 40 0 52 7-12 7-36 0-52z", STEEL) + R(17, 48, 2, 62, 1, STEEL) + "</svg>";
    if (kind === "spatula") return '<svg viewBox="0 0 40 120">' + R(17, 2, 6, 66, 3, WOOD) + Ci(20, 7, 2.2, "#f3ede5") + R(8, 68, 24, 40, 4, STEEL) + R(13, 74, 3, 28, 1.5, "#f3ede5", .6) + R(19, 74, 3, 28, 1.5, "#f3ede5", .6) + R(25, 74, 3, 28, 1.5, "#f3ede5", .6) + "</svg>";
    if (kind === "board") return '<svg viewBox="0 0 50 120">' + Ci(25, 10, 5, "#c9a27e") + Ci(25, 10, 2.2, "#f3ede5") + R(6, 14, 38, 100, 8, "#c9a27e") + R(10, 20, 30, 88, 6, "#d8b48f") + "</svg>";
    return '<svg viewBox="0 0 70 130">' + R(31, 2, 8, 56, 4, inner) + Ci(35, 9, 3, "#f3ede5") + Ci(35, 94, 32, color) + Ci(35, 94, 24, inner) + "</svg>";
  }
  function sidePan(kind, color) {
    const steam = '<g class="steam">' + R(56, 4, 3, 12, 1.5, "#cfc5bb") + R(68, 0, 3, 14, 1.5, "#cfc5bb") + R(80, 4, 3, 12, 1.5, "#cfc5bb") + "</g>";
    if (kind === "pot") return '<svg viewBox="0 0 120 70">' + steam + R(22, 20, 76, 46, 8, color) + R(16, 16, 88, 8, 4, "#5e2d35") + R(10, 30, 10, 7, 3, "#5e2d35") + R(100, 30, 10, 7, 3, "#5e2d35") + "</svg>";
    if (kind === "wok") return '<svg viewBox="0 0 140 70">' + steam + P("M28 26h84c-4 24-20 38-42 38S32 50 28 26z", color) + R(0, 22, 32, 6, 3, WOOD) + "</svg>";
    return '<svg viewBox="0 0 140 70">' + steam + P("M30 40h84l-7 20c-1 3-4 5-8 5H45c-4 0-7-2-8-5z", color) + R(0, 38, 34, 6, 3, "#3d2226") + "</svg>";
  }
  /* bistro chair pulled up to the table: we only see its back above the tabletop */
  const chair = '<svg class="k-chair-svg" viewBox="0 0 80 120" preserveAspectRatio="none">' +
    R(12, 0, 56, 14, 7, "#7a5848") + R(14, 12, 6, 108, 3, "#6b4a3d") + R(60, 12, 6, 108, 3, "#6b4a3d") +
    R(30, 14, 5, 60, 2.5, "#7a5848") + R(45, 14, 5, 60, 2.5, "#7a5848") + R(14, 56, 52, 6, 3, "#6b4a3d") + "</svg>";
  const flower = '<svg viewBox="0 0 70 104"><g class="stems">' + R(33, 18, 3, 46, 1.5, "#7d8a6a") + P("M35 60c4-14 10-22 18-32l3 2c-8 10-13 18-17 31z", "#7d8a6a") + P("M34 60C27 51 21 47 13 43l1-3c9 4 15 9 22 18z", "#7d8a6a") +
    '<g class="bloom" style="transform-origin:34px 16px">' + Ci(34, 16, 10, "#c97a7a") + Ci(34, 16, 4, "#f2c94c") + "</g>" +
    '<g class="bloom" style="transform-origin:54px 28px">' + Ci(54, 28, 7, "#f1e3c6") + Ci(54, 28, 2.6, "#f2c94c") + "</g>" +
    '<g class="bloom" style="transform-origin:13px 42px">' + Ci(13, 42, 6, "#b56a86") + Ci(13, 42, 2.2, "#f2c94c") + "</g></g>" +
    P("M20 62h30c2 14 1 30-4 42H24c-5-12-6-28-4-42z", "#fbf6ee") + R(20, 72, 30, 5, 2, "#481D24", .7) + "</svg>";
  const plant = flower;
  const board = '<svg viewBox="0 10 120 34">' + R(4, 14, 112, 30, 8, "#c9a27e") + R(10, 18, 100, 22, 6, "#d8b48f") + Ci(40, 28, 7, "#d6574a") + Ci(57, 30, 6, "#d6574a") + R(74, 26, 30, 4, 2, STEEL) + R(100, 24, 12, 8, 3, WOOD) + "</svg>";
  const jar = '<svg viewBox="0 0 50 86">' + R(16, 2, 4, 34, 2, WOOD) + R(24, 0, 4, 36, 2, STEEL) + R(32, 4, 4, 32, 2, WOOD) + El(18, 4, 4, 6, WOOD) + R(10, 32, 30, 54, 7, "#efe6da") + R(10, 48, 30, 5, 0, "#481D24", .6) + "</svg>";
  const kettle = '<svg viewBox="0 0 80 68"><g class="steam">' + R(36, 0, 3, 10, 1.5, "#cfc5bb") + R(44, 2, 3, 8, 1.5, "#cfc5bb") + "</g>" + P("M16 34c0-14 10-22 24-22s24 8 24 22v30H16z", "#481D24") + P("M64 40c8 0 12-4 12-12h-5c0 5-3 7-7 7z", "#481D24") + R(28, 8, 24, 6, 3, "#3d2226") + R(10, 62, 60, 6, 3, "#3d2226") + R(24, 30, 6, 20, 3, "#fff", .18) + "</svg>";
  const coffee = '<svg viewBox="0 0 80 86">' + R(10, 0, 60, 18, 6, "#2b1215") + R(14, 18, 52, 50, 4, "#3d2226") + R(10, 66, 60, 20, 6, "#2b1215") + R(32, 18, 16, 10, 2, "#9c8f84") + R(30, 46, 20, 20, 4, "#fbf6ee") + R(50, 50, 6, 10, 3, "#fbf6ee") + R(33, 46, 14, 4, 1, "#6b4a3d") + Ci(58, 10, 3, "#d6574a") + '<g class="steam">' + R(36, 32, 2.5, 10, 1.2, "#cfc5bb") + R(42, 30, 2.5, 12, 1.2, "#cfc5bb") + "</g></svg>";
  const toaster = '<svg viewBox="0 0 90 66"><g class="toast">' + R(22, 0, 18, 26, 5, "#d8a868") + R(48, 4, 18, 22, 5, "#d8a868") + "</g>" + R(8, 18, 74, 48, 14, "#d9d9d9") + R(20, 18, 22, 4, 2, "#9c8f84") + R(48, 18, 22, 4, 2, "#9c8f84") + R(70, 36, 10, 5, 2, "#481D24") + R(14, 28, 62, 4, 2, "#fff", .5) + "</svg>";
  const blender = '<svg viewBox="0 0 60 106">' + R(22, 0, 16, 8, 3, "#3d2226") + P("M14 8h32l-4 58H18z", "#dfe9ea", .9) + P("M17 40h26l-2 26H19z", "#d6574a", .8) + Ci(26, 48, 3, "#f2c94c") + Ci(36, 54, 3, "#7d8a6a") + R(10, 66, 40, 40, 8, "#481D24") + Ci(30, 86, 6, "#d9d9d9") + "</svg>";
  const sink = '<svg viewBox="0 0 120 70">' + R(40, 30, 7, 12, 2, "#7d7068") + R(73, 30, 7, 12, 2, "#7d7068") + R(56, 6, 8, 38, 3, STEEL) + P("M60 2h26c6 0 10 4 10 10v8h-8v-8c0-2-1-3-3-3H60z", STEEL) + R(87, 18, 10, 4, 1.5, "#7d7068") +
    '<g class="stream">' + R(89.5, 22, 5, 22, 2.5, "#9fc6d2", .9) + R(90.5, 22, 1.6, 22, .8, "#e6f4f8") + El(92, 45, 7, 2, "#9fc6d2", .8) + "</g>" + R(0, 40, 120, 30, 6, "#cfc5bb") + R(8, 44, 104, 14, 5, "#b9ada1") + "</svg>";
  const veg = (kind) => {
    if (kind === "lemons") return '<svg viewBox="0 0 60 26">' + El(16, 16, 14, 10, "#f2c94c") + El(40, 17, 13, 9, "#e9bd3a") + El(28, 8, 4, 2, "#7d8a6a") + "</svg>";
    if (kind === "tomatoes") return '<svg viewBox="0 0 60 26">' + Ci(14, 15, 11, "#d6574a") + Ci(34, 16, 10, "#c94a3d") + Ci(50, 18, 8, "#d6574a") + R(12, 2, 4, 4, 2, "#7d8a6a") + R(32, 4, 4, 4, 2, "#7d8a6a") + "</svg>";
    if (kind === "eggplant") return '<svg viewBox="0 0 70 26">' + P("M8 16c0-8 14-12 34-10 14 1 22 6 22 11s-8 8-22 7C22 23 8 22 8 16z", "#4a2a4f") + P("M58 8l8-4 2 4-6 6z", "#7d8a6a") + "</svg>";
    if (kind === "bread") return '<svg viewBox="0 0 80 28">' + P("M4 22c0-12 16-18 36-18s36 6 36 18z", "#c98a4a") + R(18, 8, 3, 10, 1.5, "#e7b77c") + R(36, 6, 3, 12, 1.5, "#e7b77c") + R(54, 8, 3, 10, 1.5, "#e7b77c") + R(2, 22, 76, 5, 2, "#a8743c") + "</svg>";
    return '<svg viewBox="0 0 60 26">' + El(16, 16, 12, 9, "#d68a3a") + El(42, 16, 12, 9, "#9bb35a") + R(14, 4, 3, 5, 1.5, "#5d6b4a") + R(40, 4, 3, 5, 1.5, "#5d6b4a") + "</svg>"; // fruit
  };
  /* chopping board with something to chop */
  const chopBoard = '<svg viewBox="0 0 130 34"><g class="whole">' + R(4, 18, 122, 14, 6, "#c9a27e") + P("M30 18c0-8 12-12 26-10 10 1 16 5 16 10z", "#d6574a") + R(48, 6, 4, 5, 2, "#7d8a6a") + "</g>" +
    '<g class="cut">' + R(4, 18, 122, 14, 6, "#c9a27e") + El(30, 17, 7, 3, "#d6574a") + El(46, 16, 7, 3, "#e06a5c") + El(62, 17, 7, 3, "#d6574a") + El(78, 16, 7, 3, "#e06a5c") + "</g>" +
    R(92, 10, 26, 4, 2, STEEL) + R(114, 8, 10, 8, 3, WOOD) + "</svg>";
  /* food on the plates: illustrated like the magazine drawings (blue-rimmed plates, coloured line food).
     Every plate in a section is a different dish. */
  const BL = "#2a5a85";
  const sk = (d, c, w, f) => '<path d="' + d + '" fill="' + (f || "none") + '" stroke="' + c + '" stroke-width="' + (w ? w * .75 : 1.6) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const dot = (x, y, r, c, st) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"' + (st ? ' stroke="' + st + '" stroke-width="1.6"' : "") + "/>";
  const SKETCH = [
    /* salad */ sk("M30 46c6-12 18-14 24-6-8 2-14 6-24 6zM44 60c4-14 18-18 26-10-10 2-16 8-26 10zM34 36c10-6 22-4 26 4-10-2-18-2-26-4z", "#3f7d4b", 2, "#9cc47a") + dot(56, 56, 5, "#d6574a") + dot(40, 62, 4.5, "#d6574a") + dot(62, 42, 4, "#d6574a"),
    /* fried eggs */ sk("M24 48c0-10 10-14 18-12 8-4 18 2 16 12 4 8-6 14-16 12-10 4-20-2-18-12z", "#c9b48a", 1.6, "#fff") + dot(40, 48, 7, "#f2c94c", "#d9a520") + sk("M54 58c0-8 8-10 14-8 6-2 12 4 10 10 0 6-8 8-14 6-6 2-10-2-10-8z", "#c9b48a", 1.6, "#fff") + dot(64, 58, 6, "#f2c94c", "#d9a520"),
    /* soup */ dot(50, 50, 26, "#e9a15a", "#c0603a") + sk("M38 48c4-6 12-6 14 0s10 6 12 0", "#fff3dc", 2) + dot(42, 58, 2, "#3f7d4b") + dot(58, 42, 2, "#3f7d4b") + dot(52, 60, 2, "#3f7d4b"),
    /* pizza */ dot(50, 50, 28, "#e9b36a", "#c98a3a") + dot(50, 50, 23, "#d6574a") + dot(42, 42, 4, "#8a2a2a") + dot(58, 46, 4, "#8a2a2a") + dot(46, 58, 4, "#8a2a2a") + dot(60, 60, 3, "#8a2a2a") + sk("M52 36c2 2 4 2 6 0M36 52c2 2 4 2 6 0", "#3f7d4b", 2),
    /* cake slice */ sk("M30 60l40-26 2 18-38 22z", "#8a4b3a", 2, "#c98a6a") + sk("M30 60l40-26", "#fff", 4) + dot(62, 38, 4, "#d6574a"),
    /* mantı */ sk("M30 50c0-16 40-16 40 0s-40 16-40 0z", "#e9e1cf", 2, "#fff8ec") + dot(40, 46, 4, "#f1e3c6", "#c9b48a") + dot(50, 44, 4, "#f1e3c6", "#c9b48a") + dot(60, 48, 4, "#f1e3c6", "#c9b48a") + dot(46, 54, 4, "#f1e3c6", "#c9b48a") + dot(56, 56, 4, "#f1e3c6", "#c9b48a") + sk("M36 52c6 4 22 6 30-2", "#d6574a", 2),
    /* steak & potatoes */ sk("M28 50c0-10 14-16 26-12 8 3 8 16-2 20-10 4-24 2-24-8z", "#6b2e22", 2, "#a24a36") + sk("M34 46l12 6M38 42l12 6", "#6b2e22", 1.6) + dot(62, 44, 6, "#f2c94c", "#d9a520") + dot(68, 56, 6, "#f2c94c", "#d9a520") + dot(58, 62, 5, "#f2c94c", "#d9a520") + sk("M64 36c2-4 6-4 8 0", "#3f7d4b"),
    /* pancakes */ dot(50, 52, 22, "#e1a45a", "#b97a34") + dot(50, 48, 20, "#eab46a", "#b97a34") + dot(44, 44, 4, "#5a2a6b") + dot(54, 42, 4, "#5a2a6b") + dot(58, 52, 4, "#d6574a") + sk("M40 52c6 4 14 4 20 0", "#8a4b1a", 2.6),
    /* sushi */ dot(36, 46, 9, "#fff", "#1d1d1d") + dot(36, 46, 4, "#f08a5a") + dot(56, 42, 9, "#fff", "#1d1d1d") + dot(56, 42, 4, "#3f7d4b") + dot(50, 62, 9, "#fff", "#1d1d1d") + dot(50, 62, 4, "#f08a5a") + sk("M68 54l10-8M70 60l10-8", "#8a6a4a", 2),
    /* meze: olives, cheese, bread */ sk("M28 40h18v12H28z", "#c9b48a", 1.6, "#fff8ec") + dot(58, 40, 4, "#3a4a2a") + dot(64, 46, 4, "#3a4a2a") + dot(56, 48, 4, "#3a4a2a") + sk("M30 60c8-6 22-6 30 2-8 6-22 6-30-2z", "#b97a34", 2, "#e7b77c") + dot(68, 60, 5, "#f2c94c"),
    /* shakshuka */ dot(50, 50, 26, "#c0392b", "#8a2a1a") + sk("M36 44c0-6 10-6 10 0s-10 6-10 0z", "#e0d6c0", 1.4, "#fff") + dot(41, 44, 3, "#f2c94c") + sk("M54 56c0-6 10-6 10 0s-10 6-10 0z", "#e0d6c0", 1.4, "#fff") + dot(59, 56, 3, "#f2c94c") + sk("M56 38l4 2M40 60l4-2", "#3f7d4b", 2),
    /* rice & peas */ sk("M30 52c0-14 40-14 40 0s-40 14-40 0z", "#e9e1cf", 2, "#fffaf0") + dot(42, 48, 2.6, "#5c9c4a") + dot(52, 46, 2.6, "#5c9c4a") + dot(58, 54, 2.6, "#5c9c4a") + dot(46, 56, 2.6, "#5c9c4a") + dot(38, 54, 2.6, "#f2a24a") + dot(56, 50, 2.6, "#f2a24a"),
    /* berry tart */ dot(50, 50, 24, "#e1b06a", "#b97a34") + dot(50, 50, 18, "#f6e7c6") + dot(44, 46, 4, "#c0392b") + dot(54, 44, 4, "#5a2a6b") + dot(56, 54, 4, "#c0392b") + dot(46, 56, 4, "#5a2a6b") + dot(50, 50, 3, "#3f7d4b"),
    /* grilled veg */ sk("M30 44c6-6 16-6 20 0-4 6-14 6-20 0z", "#4a2a4f", 2, "#7a4a7f") + sk("M52 52c6-6 16-6 20 0-4 6-14 6-20 0z", "#4a2a4f", 2, "#7a4a7f") + sk("M34 60h16M38 56l2 8", "#3f7d4b", 2.4) + dot(64, 40, 5, "#d6574a"),
    /* lahmacun */ sk("M24 48c0-12 24-18 40-12 12 5 14 18 2 22-14 6-42 4-42-10z", "#c98a3a", 2, "#d9783a") + dot(40, 46, 2, "#8a2a1a") + dot(50, 50, 2, "#8a2a1a") + dot(58, 44, 2, "#8a2a1a") + sk("M66 60c4-6 10-6 12 0-4 4-8 4-12 0z", "#d9a520", 1.6, "#f2c94c") + sk("M38 56l6 2M52 40l6-2", "#3f7d4b", 2),
    /* avocado toast */ sk("M30 38h34l2 26H32z", "#b97a34", 2, "#e7b77c") + sk("M34 44c6-4 24-4 28 0v14c-8 4-20 4-28 0z", "#5d7a3a", 1.6, "#a9c46a") + dot(42, 50, 2, "#d6574a") + dot(52, 48, 2, "#d6574a") + dot(58, 54, 2, "#d6574a"),
    /* börek */ sk("M28 40l18-6 4 14-18 6z", "#b97a34", 2, "#e7b77c") + sk("M50 38l18-4 2 14-18 4z", "#b97a34", 2, "#e9c08a") + sk("M36 58l18-4 3 13-18 4z", "#b97a34", 2, "#e7b77c") + sk("M32 44l12-4M54 42l12-3M40 62l12-3", "#8a5a24", 1.2) + dot(66, 58, 4, "#3a4a2a"),
    /* fruit plate */ sk("M30 46c4-10 14-12 20-4-6 6-14 8-20 4z", "#c0392b", 1.6, "#e8584a") + dot(56, 40, 6, "#f2a24a", "#d97d1a") + dot(62, 54, 5, "#7a3a8a") + dot(54, 58, 5, "#7a3a8a") + sk("M36 58c4-4 12-4 14 2-4 4-10 4-14-2z", "#5c9c4a", 1.6, "#a9d46a") + dot(44, 40, 3, "#f2c94c"),
    /* burger */ sk("M30 50c0-12 40-12 40 0z", "#b97a34", 2, "#e7a85a") + sk("M30 50h40", "#3f7d4b", 3) + sk("M30 54h40", "#6b2e22", 4) + sk("M31 58c2 6 36 6 38 0z", "#b97a34", 2, "#e7a85a") + dot(40, 44, 1.2, "#fff") + dot(50, 42, 1.2, "#fff") + dot(60, 44, 1.2, "#fff") + dot(70, 64, 3, "#f2c94c"),
    /* dolma */ sk("M30 44c4-4 16-4 20 0-4 4-16 4-20 0z", "#3f5a2a", 2, "#6b8a4a") + sk("M34 54c4-4 16-4 20 0-4 4-16 4-20 0z", "#3f5a2a", 2, "#6b8a4a") + sk("M52 44c4-4 16-4 20 0-4 4-16 4-20 0z", "#3f5a2a", 2, "#6b8a4a") + sk("M58 56c4-6 10-6 12 0-4 4-8 4-12 0z", "#d9a520", 1.6, "#f2c94c")
  ];
  /* plate rim drawn as a slightly wobbly double line, food offset like a riso print, lines roughened */
  const sketchPlate = (food, rot) => '<svg viewBox="0 0 100 100" class="sketch"><g transform="rotate(' + (rot || 0) + ' 50 50)">' +
    '<path d="M50 4c26 0 47 20 46 46-1 26-21 46-47 46S4 75 4 49 24 4 50 4z" fill="#fbf6ee"/>' +
    '<g filter="url(#k-hand)"><path d="M50 4c26 0 47 20 46 46-1 26-21 46-47 46S4 75 4 49 24 4 50 4z" fill="none" stroke="' + BL + '" stroke-width="1.8"/>' +
    '<path d="M51 16c19 0 34 15 33 35-1 19-16 33-35 33S16 69 17 50s15-34 34-34z" fill="none" stroke="' + BL + '" stroke-width="1.3"/>' +
    '<g transform="translate(1.6 1.4)" opacity=".55">' + food.replace(/stroke="[^"]*"/g, 'stroke="none"') + "</g>" +
    food.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, 'fill="$1" fill-opacity=".85"') + "</g></g></svg>";
  const DISHES = SKETCH.map((_, i) => "sk:" + i);

  const at = (x, y, cls, html, extra) => '<div class="k-it ' + (cls || "") + '" style="left:calc(' + x + ' * var(--u));top:' + y + "%;" + (extra || "") + '">' + html + "</div>";
  let plateN = 0;
  const plate = (x, y, _, inRow) => {
    const n = plateN, d = DISHES[plateN++ % DISHES.length];
    if (!inRow) { y = 67 + ((n * 37) % 12); x = x + ((n * 53) % 7) - 3; } // scattered front-to-back on the table
    const rot = inRow ? 0 : ((n * 29) % 24) - 12;
    const art = d.startsWith("img:") ? '<span class="dish-img" style="--rot:' + rot + 'deg"><img src="assets/illustrations/' + d.slice(4) + '.png" alt="" draggable="false"></span>' : sketchPlate(SKETCH[+d.slice(3)], rot);
    return '<button class="k-plate" style="left:calc(' + x + ' * var(--u));top:' + y + '%;z-index:' + (6 + Math.round(y)) + '" data-plate aria-label="Bon appétit">' + art + '<span class="yum">+1 bon appétit</span></button>';
  };
  const sign = (x, y, w, html, cls) => '<div class="k-sign ' + (cls || "") + '" style="left:calc(' + x + ' * var(--u));top:' + y + "%;width:calc(" + w + ' * var(--u))">' + html + "</div>";
  const hanging = (x, w, kind, color, inner, extra) => '<button class="k-pan" style="left:calc(' + x + ' * var(--u));width:calc(' + w + ' * var(--u))" ' + (extra || "data-clang") + ' aria-label="Pan">' + pan(kind, color, inner) + "</button>";
  const legs = (w) => '<span class="k-leg" style="left:calc(4 * var(--u))"></span><span class="k-leg" style="left:calc(' + (w - 7) + ' * var(--u))"></span>';
  const img = () => "";
  /* wall cabinets (between the rail and the counter) */
  const ci = (cls, label) => '<button class="cab-item ' + cls + '" data-dish aria-label="' + label + '"></button>';
  const cabInside = '<div class="cab-in"><div class="cab-shelf">' + ci("plate-stack", "Plates") + ci("plate-stack", "Plates") + ci("bowl", "Bowl") + '</div><div class="cab-shelf">' + ci("glass", "Glass") + ci("glass", "Glass") + ci("glass", "Glass") + ci("mug", "Mug") + ci("mug", "Mug") + "</div></div>";
  const cabinet = (x, w) => '<div class="k-cab" style="left:calc(' + x + ' * var(--u));width:calc(' + w + ' * var(--u))">' + cabInside + '<button class="cab-door l" data-cab aria-label="Open cabinet"></button><button class="cab-door r" data-cab aria-label="Open cabinet"></button></div>';
  /* things standing on the counter (bottom at the worktop line) */
  const onCounter = (x, w, html, attrs) => '<button class="k-counter-it" style="left:calc(' + x + ' * var(--u));width:calc(' + w + ' * var(--u))" ' + (attrs || "") + ">" + html + "</button>";

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
        hanging(76, 10, "skillet", "#481D24", "#5e2d35") + hanging(89, 5, "spoon") + hanging(97, 6, "ladle") + hanging(106, 6, "whisk") + hanging(115, 13, "wok", "#2b1215", "#3d2226") + hanging(132, 10, "pot", "#d9d9d9", "#481D24") +
        onCounter(70, 11, coffee, 'data-coffee aria-label="Coffee machine"') + onCounter(86, 6, jar, 'data-clang aria-label="Utensils"') + onCounter(96, 14, chopBoard, 'data-chop aria-label="Chop the tomato"') + onCounter(112, 7, veg("lemons"), 'data-veg aria-label="Lemons"') +
        onCounter(136, 8, flower, 'data-flower aria-label="Flowers"') +
        plate(16, 70, img(0)) + plate(62, 71, img(1)) + plate(110, 69, img(2))
    },
    {
      key: "how", name: "How it works", w: 140,
      html: () =>
        sign(8, 13, 44, '<div class="k-l">How it works</div><h3>Cook. Share. Repeat.</h3><p>We don’t need more recipes. We need motivation.</p>', "pin") +
        hanging(60, 10, "skillet", "#6d5a5c", "#481D24") + hanging(73, 6, "spatula") + hanging(81, 5, "spoon") + cabinet(96, 34) +
        onCounter(64, 12, toaster, 'data-toaster aria-label="Toaster"') + onCounter(84, 7, blender, 'data-blender aria-label="Blender"') + onCounter(100, 7, veg("tomatoes"), 'data-veg aria-label="Tomatoes"') + onCounter(110, 9, veg("bread"), 'data-veg aria-label="Bread"') +
        '<div class="k-card" style="left:calc(8 * var(--u));top:52%"><b>01</b><h3>Cook anything</h3><p>A feast or toast for one. It all counts.</p></div>' +
        '<div class="k-card" style="left:calc(46 * var(--u));top:54%;--rot:1deg"><b>02</b><h3>Share it</h3><p>Post your plate, collect bon appétits from your pals.</p></div>' +
        '<div class="k-card" style="left:calc(84 * var(--u));top:52%;--rot:-1deg"><b>03</b><h3>Keep your streak</h3><p>Set a weekly goal and watch your progress grow.</p></div>' +
        plate(116, 73, img(5))
    },
    {
      key: "titles", name: "Pick a pan", w: 176,
      html: () =>
        sign(6, 9, 34, '<div class="k-l">Which pan are you?</div><h3>Pick a pan, then cook.</h3><div data-cook-ui><p>Tap a pan on the wall. We won’t judge. Much.</p></div>', "pin cook-sign") +
        TITLES.map((t, i) => '<button class="k-pan" style="left:calc(' + (46 + i * 19) + ' * var(--u));width:calc(' + (t.kind === "wok" ? 14 : 12) + ' * var(--u))" data-title="' + i + '" aria-label="' + t.name + '">' + pan(t.kind, t.color, t.inner) +
          '<span class="k-pan-tag">' + t.name + "<small>" + t.range + "</small></span></button>").join("") +
        onCounter(104, 18, sink, 'data-sink aria-label="Sink"') + onCounter(150, 8, veg("eggplant"), 'data-veg aria-label="Eggplant"') + '<div class="k-stove" style="left:calc(130 * var(--u))" data-stove><span class="hob"></span><span class="hob"></span><span class="flame"></span><span class="on-stove"></span><span class="knob"></span><span class="knob"></span></div>' +
        plate(20, 70, img(6)) + plate(80, 71, img(7))
    },
    {
      key: "team", name: "Team", w: Math.max(110, 16 + (TEAM.length + 2) * 19),
      html: (st) => {
        let h = sign(6, 9, 40, '<div class="k-l">Our team</div><h3>The pals behind the pans</h3><p>Tap someone to say hi.</p><a class="btn btn--small" href="about.html#team">Meet everyone</a>', "pin");
        const seats = TEAM.map((m, i) => ({ m, i })).concat([{ empty: true }, { empty: true }]);
        seats.forEach((s, k) => {
          const x = 8 + k * 19;
          if (s.empty) {
            h += '<button class="k-person empty" style="left:calc(' + x + ' * var(--u))" data-seat aria-label="Empty seat"><span class="chair">' + chair + '</span></button>';
          } else {
            h += '<button class="k-person" style="left:calc(' + x + ' * var(--u));--c:' + peopleColors[k % peopleColors.length] + '" data-person="' + s.i + '" aria-label="' + esc(s.m.name) + '"><span class="chair">' + chair + '</span><span class="body"></span><span class="head">' + photo(s.m.photo, s.m.name) + "</span></button>" +
              '<span class="k-nametag" style="left:calc(' + (x + 8) + ' * var(--u))"><b>' + esc(s.m.name) + "</b><span>" + esc(s.m.handle || "@") + "</span></span>" +
              plate(x + 0.5, 70.5, "", true);
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
        hanging(92, 11, "skillet", "#481D24", "#5e2d35") + hanging(100, 5, "board") + onCounter(96, 7, veg("fruit"), 'data-veg aria-label="Fruit"') +
        '<button class="k-book" style="left:calc(30 * var(--u));top:70%" data-href="thesis.html" aria-label="Open the thesis"><span class="l"><i style="top:30%"></i><i style="top:50%"></i><i style="top:70%"></i></span><span class="r"><i style="top:30%"></i><i style="top:50%"></i><i style="top:70%"></i></span></button>' +
        plate(70, 71, img(1))
    },
    {
      key: "fridge", name: "News", w: 128,
      html: () =>
        '<div class="k-fridge" style="left:calc(8 * var(--u))" data-fridge>' +
          '<div class="inside"><span class="bulb"></span>' + [0, 1, 2].map((r) => '<div class="shelf">' + NEWS.slice(r * 2, r * 2 + 2).map((n, k) => {
              const href = n.slug ? "article.html?a=" + encodeURIComponent(n.slug) : n.url || "news.html";
              const kind = ["jar", "box", "bottle", "bowl", "carton", "jar"][(r * 2 + k) % 6];
              return '<a class="food ' + kind + '" href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") + ' data-food>' +
                '<span class="pack">' + (n.image ? '<img src="' + esc(n.image) + '" alt="">' : "") + "</span>" +
                '<span class="lbl"><b>' + esc(n.platform === "substack" ? "Editorial" : (window.PP_SOCIAL_NAMES || {})[n.platform] || (n.platform === "event" ? "Meetup" : "News")) + "</b>" + esc(n.title) + "</span></a>";
            }).join("") + "</div>").join("") +
            '<div class="crisper"><span>Fresh news inside</span></div></div>' +
          '<button class="door" data-open-fridge aria-label="Open the fridge"><span class="door-front"><span class="k-magnet">News</span><span class="k-magnet alt">Tap to open</span></span><span class="door-back"><span class="door-shelf"></span><span class="door-shelf"></span><span class="door-shelf"></span></span></button>' +
          '<button class="k-fridge-close" data-close-fridge aria-label="Close the fridge">Close</button>' +
        "</div>" +
        sign(44, 13, 44, '<div class="k-l">What’s in the fridge</div><h3>Fresh from the table.</h3><p>Our editorial, our socials and a little magazine we made.</p><div class="cta-row"><a class="btn btn--small" href="news.html">All news</a><a class="btn btn--small btn--soft" href="news.html#magazine">Read the magazine</a></div>', "pin") +
        '<button class="k-mag" style="left:calc(62 * var(--u));top:63%" data-href="news.html#magazine" aria-label="Read our magazine"><img src="assets/brand/wordmark.png" alt=""></button>' +
        plate(84, 71, img(3)) +
        cabinet(96, 26) + onCounter(100, 9, kettle, 'data-kettle aria-label="Kettle"') + onCounter(112, 7, veg("tomatoes"), 'data-veg aria-label="Tomatoes"')
    },
    {
      key: "about", name: "About", w: 104,
      html: () =>
        sign(8, 13, 50, '<div class="k-l">About</div><h3>A behavioural scientist, an engineer and an architect walk into a kitchen…</h3><p>…and build an app for themselves and their friends. Then people sent it to other people.</p><a class="btn btn--small" href="about.html">Read our story</a>', "pin") +
        hanging(66, 12, "wok", "#481D24", "#5e2d35") + hanging(81, 6, "ladle") + hanging(89, 5, "whisk") + onCounter(64, 14, chopBoard, 'data-chop aria-label="Chop the tomato"') + onCounter(82, 6, jar, 'data-clang aria-label="Utensils"') + onCounter(90, 7, veg("lemons"), 'data-veg aria-label="Lemons"') +
        '<button class="k-letter" style="left:calc(34 * var(--u));top:69%" data-href="about.html" aria-label="Read our letter"></button>' +
        plate(70, 71, img(4))
    },
    {
      key: "join", name: "Your seat", w: 150,
      html: () =>
        sign(8, 10, 54,
          '<div class="k-l">Your seat is ready</div><h2>Come sit with us.</h2><p>Free on the App Store. Android is almost here.</p>' +
          '<div class="cta-row">' + window.PP_APPSTORE() + "</div>" +
          '<form class="form" data-kwait style="margin-top:calc(1.2 * var(--u))"><div class="form-row"><input class="field" type="email" placeholder="Email for the Android waitlist" aria-label="Email" required><button class="btn" type="submit">Notify me</button></div><p class="form-msg" role="status"></p></form>') +
        [74, 94, 114].map((x) => '<button class="k-person empty" style="left:calc(' + x + ' * var(--u))" data-seat aria-label="Empty seat"><span class="chair">' + chair + '</span></button>').join("") +
        plate(74.5, 70.5, img(0)) + plate(114.5, 70.5, img(2)) +
        hanging(132, 10, "skillet", "#481D24", "#5e2d35") + hanging(124, 5, "spoon") + onCounter(118, 9, veg("bread"), 'data-veg aria-label="Bread"') + onCounter(130, 7, veg("fruit"), 'data-veg aria-label="Fruit"')
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
  K.insertAdjacentHTML("beforeend", '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="k-hand" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter></svg>');

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
    '<button class="k-rank" aria-live="polite" aria-label="Show your progress"></button>' +
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

  /* ---------- XP: the app's cooking titles are the levels ---------- */
  let hudRankClick = null;
  const LEVELS = [[0, "Prep Chef"], [60, "Line Chef"], [160, "Sous Chef"], [320, "Head Chef"]];
  let xp = 0, seen = new Set(), got = new Set();
  try { xp = +sessionStorage.getItem("pp-xp") || 0; seen = new Set(JSON.parse(sessionStorage.getItem("pp-seen") || "[]")); got = new Set(JSON.parse(sessionStorage.getItem("pp-got") || "[]")); } catch (e) {}
  const levelOf = (v) => { let i = 0; LEVELS.forEach(([min], k) => { if (v >= min) i = k; }); return i; };
  function renderRank() {
    const i = levelOf(xp), next = LEVELS[i + 1];
    hud.querySelector(".k-rank").innerHTML = LEVELS[i][1] + "<small>" + xp + " XP" + (next ? " · " + (next[0] - xp) + " to " + next[1] : "") + "</small>";
    hud.querySelectorAll(".k-stop").forEach((b) => b.classList.toggle("seen", seen.has(b.dataset.stop)));
  }
  const EARN = [
    ["Visit every stop along the table", "+10 each", () => seen.size + "/" + STATIONS.length],
    ["Give a plate a bon appétit", "+5", null],
    ["Say hi to someone at the table", "+5", null],
    ["Pick a pan", "+10", () => got.has("pan")],
    ["Add ingredients and cook a dish", "+5 each, +30", null],
    ["Share your dish on PanPals", "+50", () => got.has("shared")],
    ["Open the fridge and the cabinets", "+10, +5", () => got.has("fridge")],
    ["Play with the kitchen: chop, brew, toast, blend", "+5 each", null]
  ];
  const panel = document.createElement("div");
  panel.className = "k-progress";
  document.body.appendChild(panel);
  function renderPanel() {
    const i = levelOf(xp), cur = LEVELS[i], next = LEVELS[i + 1];
    const pct = next ? Math.round(((xp - cur[0]) / (next[0] - cur[0])) * 100) : 100;
    panel.innerHTML = '<div class="k-prog-card"><button class="k-prog-close" aria-label="Close">' + (I.close || "×") + "</button>" +
      "<small>Your kitchen title</small><h3>" + cur[1] + "</h3>" +
      '<div class="k-prog-bar"><span style="width:' + pct + '%"></span></div>' +
      '<p class="k-prog-next">' + xp + " XP" + (next ? " · " + (next[0] - xp) + " XP to " + next[1] : " · top of the kitchen!") + "</p>" +
      '<ol class="k-levels">' + LEVELS.map((l, k) => '<li class="' + (k < i ? "done" : k === i ? "on" : "") + '"><b>' + l[1] + "</b><span>" + l[0] + " XP</span></li>").join("") + "</ol>" +
      "<small>How to earn XP</small><ul class=\"k-earn\">" + EARN.map((e) => { const st = e[2] ? e[2]() : null; const done = st === true; return '<li class="' + (done ? "done" : "") + '"><span>' + e[0] + "</span><em>" + (typeof st === "string" ? st + " · " : "") + e[1] + "</em></li>"; }).join("") + "</ul>" +
      '<p class="k-prog-foot">Same titles as in the app: set your weekly goal in PanPals and climb from Prep Chef to Head Chef for real.</p></div>';
  }
  hudRankClick = () => { renderPanel(); panel.classList.add("open"); sfx("tick"); };
  panel.addEventListener("click", (e) => { if (e.target === panel || e.target.closest(".k-prog-close")) panel.classList.remove("open"); });

  function floatXP(n, el) {
    const f = document.createElement("span");
    f.className = "k-xp";
    f.textContent = "+" + n + " XP";
    const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    f.style.left = r.left + r.width / 2 + "px";
    f.style.top = r.top + "px";
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1200);
  }
  function addXP(n, el, onceKey) {
    if (onceKey) { if (got.has(onceKey)) return; got.add(onceKey); }
    const before = levelOf(xp);
    xp += n;
    try { sessionStorage.setItem("pp-xp", xp); sessionStorage.setItem("pp-got", JSON.stringify([...got])); } catch (e) {}
    floatXP(n, el);
    const after = levelOf(xp);
    if (after > before) { setTimeout(() => { toast("Promoted to " + LEVELS[after][1] + "!"); sfx("ding"); }, 400); }
    renderRank();
    if (panel.classList.contains("open")) renderPanel();
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
  let touching = false, settleT = null;
  K.addEventListener("touchstart", () => { touching = true; }, { passive: true });
  K.addEventListener("touchend", () => { touching = false; }, { passive: true });
  function onScroll() {
    if (touching || matchMedia("(pointer: coarse)").matches) {
      clearTimeout(settleT);
      settleT = setTimeout(() => { if (!touching) wrap(); }, 180);  // phones: loop only after the swipe has stopped
    } else wrap();
    const mid = K.scrollLeft + K.clientWidth / 2;
    let found = null;
    for (const el of track.children) { if (el.offsetLeft <= mid && el.offsetLeft + el.offsetWidth > mid) { found = el.dataset.key; break; } }
    if (found && found !== current) {
      current = found;
      hud.querySelectorAll(".k-stop").forEach((b) => b.classList.toggle("on", b.dataset.stop === found));
      const onBtn = hud.querySelector(".k-stop.on");
      if (onBtn) onBtn.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (!seen.has(found)) {
        seen.add(found);
        try { sessionStorage.setItem("pp-seen", JSON.stringify([...seen])); } catch (e) {}
        addXP(10, hud.querySelector(".k-rank"));
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
    const st = e.target.closest("[data-stop]"); if (st) { goTo(st.dataset.stop); sfx("tick"); return; }
    if (e.target.closest(".k-rank") && hudRankClick) hudRankClick();
  });

  /* Mouse drag */
  let drag = false, moved = false, sx = 0, ss = 0;
  K.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.target.closest("a,input,button:not(.k-person):not(.k-plate):not(.k-pan):not(.k-counter-it),textarea,.k-fridge.open .inside")) return;
    drag = true; moved = false; sx = e.clientX; ss = K.scrollLeft; cancelAnimationFrame(tween);
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const d = e.clientX - sx;
    if (Math.abs(d) > 5) { moved = true; K.classList.add("dragging"); }
    K.scrollLeft = ss - d; ss += wrap();
  });
  window.addEventListener("pointerup", () => { if (!drag) return; drag = false; K.classList.remove("dragging"); setTimeout(() => (moved = false), 0); });

  /* ---------- Cooking: pick a pan, add ingredients, cook, share on PanPals ---------- */
  const RECIPES = [
    { ing: ["eggs", "tomatoes", "peppers"], dish: "Shakshuka", img: "assets/feed/post2.jpg", cap: "midnight shakshuka, straight from the skillet" },
    { ing: ["veggies", "soy sauce", "sesame"], dish: "Stir-fry bowl", img: "assets/feed/mag-cfw-bowl.jpg", cap: "fridge clean-out stir fry, accidentally gorgeous" },
    { ing: ["chickpeas", "garlic", "lemon"], dish: "A slow Sunday spread", img: "assets/feed/mag-epine-mezze.jpg", cap: "slow sunday, everybody’s invited" },
    { ing: ["dough", "tomato", "cheese"], dish: "Cast iron pizza", img: "assets/feed/mag-greta-pizza.jpg", cap: "cast iron pizza night, grandma’s plates out" }
  ];
  let cook = null;
  const sheet = document.createElement("div");
  sheet.className = "k-cook-sheet";
  sheet.innerHTML = '<button class="k-sheet-close" aria-label="Close">' + (I.close || "×") + '</button><div data-cook-ui></div>';
  K.appendChild(sheet);
  sheet.querySelector(".k-sheet-close").addEventListener("click", () => sheet.classList.remove("open"));
  const ui = () => K.querySelectorAll("[data-cook-ui]");
  const setUI = (h) => ui().forEach((u) => (u.innerHTML = h));
  const stoves = () => track.querySelectorAll("[data-stove]");
  function startCooking(i) {
    const r = RECIPES[i], tt = TITLES[i];
    sheet.classList.add("open");
    cook = { i, added: new Set(), done: false };
    stoves().forEach((st) => { st.classList.remove("hot", "done"); st.querySelector(".on-stove").innerHTML = sidePan(tt.kind, tt.color); });
    setUI('<p><strong>' + tt.name + ".</strong> " + tt.says + '</p><p class="step">It’s on the stove. Add the ingredients:</p><div class="ings">' +
      r.ing.map((g) => '<button class="ing" data-ing="' + g + '">' + g + "</button>").join("") + "</div>");
  }
  function addIngredient(el) {
    if (!cook || cook.done) return;
    const g = el.dataset.ing;
    if (cook.added.has(g)) return;
    cook.added.add(g);
    ui().forEach((u) => u.querySelectorAll('[data-ing="' + g + '"]').forEach((b) => b.classList.add("in")));
    sfx("pop"); addXP(5, el);
    if (cook.added.size === RECIPES[cook.i].ing.length) {
      ui().forEach((u) => { if (!u.querySelector("[data-heat]")) u.insertAdjacentHTML("beforeend", '<button class="btn btn--small" data-heat>Turn on the heat</button>'); });
    }
  }
  function heatUp() {
    if (!cook || cook.cooking) return;
    cook.cooking = true;
    stoves().forEach((st) => st.classList.add("hot"));
    setUI('<p class="step">Sizzling…</p><div class="cook-bar"><span></span></div>');
    sfx("clang");
    const wasAmb = window.PP_SOUND && window.PP_SOUND.enabled;
    if (wasAmb) window.PP_SOUND.ambient(true);
    setTimeout(() => {
      const r = RECIPES[cook.i];
      cook.done = true;
      stoves().forEach((st) => { st.classList.remove("hot"); st.classList.add("done"); });
      sfx("ding"); addXP(30, track.querySelector("[data-stove]"));
      setUI('<div class="dish"><img src="' + r.img + '" alt=""><div><b>' + r.dish + '</b><small>Ready! Now share it with your pals.</small></div></div>' +
        '<div class="cta-row"><button class="btn btn--small" data-share-dish>Share it on PanPals</button><button class="btn btn--small btn--soft" data-recook="' + cook.i + '">Cook again</button></div>');
    }, 3000);
  }
  /* The real prototype phone opens over the kitchen */
  const modal = document.createElement("div");
  modal.className = "k-phone-modal";
  modal.innerHTML = '<div class="k-phone-box"><button class="k-phone-close" aria-label="Close">' + (I.close || "×") + '</button><p class="k-phone-tip">Add a caption if you like, then tap <b>Share</b>.</p><div class="k-phone-slot"></div></div>';
  document.body.appendChild(modal);
  let phoneHome = null;
  function openPhone() {
    const ph = document.getElementById("phone");
    if (!ph || !window.PP_PHONE || !cook) return;
    if (!phoneHome) phoneHome = { parent: ph.parentNode, next: ph.nextSibling };
    modal.querySelector(".k-phone-slot").appendChild(ph);
    modal.classList.add("open");
    const r = RECIPES[cook.i];
    window.PP_PHONE.compose(r.img, r.cap);
  }
  function closePhone() {
    const ph = document.getElementById("phone");
    modal.classList.remove("open");
    if (ph && phoneHome) { phoneHome.parent.insertBefore(ph, phoneHome.next); window.PP_PHONE && window.PP_PHONE.feed(); }
  }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".k-phone-close")) closePhone(); });
  document.addEventListener("pp:shared", () => {
    if (!modal.classList.contains("open")) return;
    addXP(50, modal.querySelector(".k-phone-box"), "shared");
    modal.querySelector(".k-phone-tip").innerHTML = "<b>Shared!</b> That’s how it feels on PanPals. Bon appétit.";
    setTimeout(closePhone, 2600);
  });
  function petals(el) {
    const r = el.getBoundingClientRect();
    for (let k = 0; k < 7; k++) {
      const p = document.createElement("span");
      p.className = "k-petal";
      p.style.left = r.left + r.width * (0.2 + Math.random() * 0.6) + "px";
      p.style.top = r.top + 10 + "px";
      p.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      p.style.animationDelay = k * 60 + "ms";
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }

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
    if ((el = t.closest("[data-plate]"))) { el.classList.remove("ate"); void el.offsetWidth; el.classList.add("ate"); sfx("pop"); addXP(5, el, "plate:" + [...track.querySelectorAll(".k-plate")].indexOf(el) % 20); return; }
    if ((el = t.closest("[data-title]"))) {
      const i = +el.dataset.title, tt = TITLES[i];
      track.querySelectorAll("[data-title]").forEach((p) => p.classList.toggle("sel", p.dataset.title === el.dataset.title));
      el.classList.remove("swing"); void el.offsetWidth; el.classList.add("swing");
      sfx("clang"); addXP(10, el, "pan");
      startCooking(i);
      return;
    }
    if ((el = t.closest("[data-ing]"))) { addIngredient(el); return; }
    if ((el = t.closest("[data-heat]"))) { heatUp(); return; }
    if ((el = t.closest("[data-share-dish]"))) { openPhone(); return; }
    if ((el = t.closest("[data-recook]"))) { cook = null; startCooking(+el.dataset.recook); return; }
    if ((el = t.closest("[data-flower]"))) { el.classList.remove("wiggle"); void el.offsetWidth; el.classList.add("wiggle"); petals(el); sfx("pop"); addXP(5, el, "flower"); showBubble(el, "Fresh from the market", "Someone always brings flowers to the table."); return; }
    if ((el = t.closest("[data-kettle]"))) { el.classList.toggle("boil"); sfx("tick"); addXP(5, el, "kettle"); if (el.classList.contains("boil")) showBubble(el, "Kettle’s on", "Tea while the oven does the work?"); return; }
    if ((el = t.closest("[data-dish]"))) { el.classList.remove("clink"); void el.offsetWidth; el.classList.add("clink"); sfx("tick"); setTimeout(() => sfx("tick"), 90); addXP(2, el, "dish:" + el.getAttribute("aria-label")); return; }
    if ((el = t.closest("[data-cab]"))) { const c = el.closest(".k-cab"); c.classList.toggle("open"); sfx("door"); addXP(5, c, "cab"); return; }
    if ((el = t.closest("[data-chop]"))) { el.classList.toggle("chopped"); el.classList.remove("chop"); void el.offsetWidth; el.classList.add("chop"); sfx("knock"); setTimeout(() => sfx("knock"), 120); setTimeout(() => sfx("knock"), 240); addXP(5, el, "chop"); return; }
    if ((el = t.closest("[data-veg]"))) { el.classList.remove("wiggle"); void el.offsetWidth; el.classList.add("wiggle"); sfx("pop"); addXP(2, el, "veg:" + el.getAttribute("aria-label")); return; }
    if ((el = t.closest("[data-sink]"))) { el.classList.toggle("running"); sfx("tick"); addXP(3, el, "sink"); return; }
    if ((el = t.closest("[data-coffee]"))) { el.classList.toggle("brew"); sfx("tick"); addXP(5, el, "coffee"); if (el.classList.contains("brew")) showBubble(el, "Brewing", "Coffee first, cooking second."); return; }
    if ((el = t.closest("[data-toaster]"))) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); sfx("pop"); addXP(5, el, "toaster"); return; }
    if ((el = t.closest("[data-blender]"))) { el.classList.remove("blend"); void el.offsetWidth; el.classList.add("blend"); sfx("clang"); addXP(5, el, "blender"); return; }
    if ((el = t.closest("[data-board]"))) { el.classList.remove("chop"); void el.offsetWidth; el.classList.add("chop"); sfx("knock"); setTimeout(() => sfx("knock"), 140); addXP(5, el, "board"); return; }
    if ((el = t.closest("[data-clang]"))) { el.classList.remove("swing"); void el.offsetWidth; el.classList.add("swing"); sfx("clang"); addXP(2, el, "clang"); return; }
    if ((el = t.closest("[data-person]"))) {
      const m = TEAM[+el.dataset.person];
      const facts = (m.funFacts || []).filter((f) => !/^TODO/.test(f));
      showBubble(el.querySelector(".head"), (m.handle || "@") + (m.noApp ? "" : " (" + m.name + ")"), facts.length ? facts[Math.floor(Math.random() * facts.length)] : m.role);
      sfx("pop"); addXP(5, el, "hi:" + m.name);
      return;
    }
    if ((el = t.closest("[data-seat]"))) { showBubble(el, "This seat is saved for you", "Download PanPals and pull up a chair."); sfx("knock"); addXP(5, el, "seat"); return; }
    if ((el = t.closest("[data-open-fridge]"))) { el.closest(".k-fridge").classList.add("open"); sfx("door"); addXP(10, el, "fridge"); return; }
    if ((el = t.closest("[data-close-fridge]"))) { el.closest(".k-fridge").classList.remove("open"); sfx("door"); return; }
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
