/* ==========================================================================
   PANPALS · TEAM RENDERER (About sayfası + ana sayfadaki yüzler)
   İçerik data/team.js'ten gelir. Bu dosyayı düzenlemene gerek yok.
   ========================================================================== */

(function () {
  const TEAM = window.PANPALS_TEAM || [];
  const esc = window.PP_ESC, photo = window.PP_PHOTO;
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-");
  const clean = (v) => v && !/^TODO/.test(v);

  const sIc = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13h8v6H8zM8 13c-2.2-.4-3.6-2.2-3-4.2.5-1.7 2.3-2.5 3.9-2C9.4 5.2 10.6 4 12 4s2.6 1.2 3.1 2.8c1.6-.5 3.4.3 3.9 2 .6 2-.8 3.8-3 4.2"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10" cy="12" r="6"/><path d="M16 12h6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M6.5 6.5l11 11"/></svg>'
  ];

  /* Home: founder faces */
  const faces = document.getElementById("team-faces");
  if (faces) faces.innerHTML = TEAM.map((m) => '<a class="face" href="about.html#' + slug(m.name) + '">' + photo(m.photo, m.name) + "<b>" + esc(m.name) + "</b><small>" + esc(m.handle || "@") + "</small></a>").join("");

  /* About: founder card */
  const fc = document.getElementById("founder-trio");
  if (fc) fc.innerHTML = TEAM.filter((m) => m.group === "founders").slice(0, 3).map((m) => photo(m.photo, m.name)).join("");

  /* About: index of names */
  const idx = document.getElementById("team-index");
  if (idx) idx.innerHTML = TEAM.map((m) => '<a href="#' + slug(m.name) + '"><b>' + esc(m.handle || "@") + "</b><small>" + esc(m.name) + (clean(m.role) ? ", " + esc(m.role) : "") + "</small></a>").join("") +
    '<a class="you" href="careers.html"><b>You?</b><small>See openings</small></a>';

  /* About: member cards with drawings between them */
  const crew = document.getElementById("crew");
  if (crew) {
    const art = ["fish-plate", "fork", "baguette", "olive-oil", "pasta-plate", "spoon", "knife", "fork-2"];
    crew.innerHTML = TEAM.map((m) =>
      '<article class="member reveal" id="' + slug(m.name) + '">' +
        '<div class="top">' + photo(m.photo, m.name) +
          '<div><div class="role">' + esc(clean(m.role) ? m.role : "") + "</div><h3>" + esc(m.handle || "@") + (m.noApp ? "</h3>" : ' <span class="on">on PanPals</span></h3><div class="real">(' + esc(m.name) + ")</div>") +
          '<div class="signs">' + [0, 1, 2].map((k) => { const v = (m.signs || [])[k]; return "<span>" + sIc[k] + (clean(v) ? esc(v) : "") + "</span>"; }).join("") + "</div></div>" +
        "</div>" +
        (clean(m.bio) ? "<p>" + esc(m.bio) + "</p>" : "") +
      "</article>").join("") +
      TEAM.map((m, i) => {
        const a = art[i % art.length];
        const left = i % 2 ? 62 + (i % 3) * 6 : 6 + (i % 3) * 8;
        const w = /plate/.test(a) ? 190 : /baguette|oil/.test(a) ? 120 : /spoon/.test(a) ? 170 : 60;
        return '<img class="drawing" data-par="' + (0.06 + (i % 3) * 0.04) + '" src="assets/illustrations/' + a + '.png" alt="" style="left:' + left + "%;top:" + (i * 13.5 + 3) + "%;width:" + w + "px;transform:rotate(" + ((i * 37) % 40 - 20) + 'deg)">';
      }).join("");
    window.PP_REVEAL(crew);
  }

  /* Gentle parallax for drawings (home and about) */
  const draws = [...document.querySelectorAll("[data-par]")];
  if (draws.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const base = draws.map((d) => d.style.transform || "");
    let tick = false;
    const run = () => {
      draws.forEach((d, i) => {
        const r = d.getBoundingClientRect();
        const off = (r.top + r.height / 2 - innerHeight / 2) * -(+d.dataset.par);
        d.style.transform = base[i] + " translateY(" + off.toFixed(1) + "px)";
      });
      tick = false;
    };
    addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }
})();
