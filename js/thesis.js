/* PANPALS · THESIS PAGE
   Bilgiler data/config.js -> thesis. Tez PDF olarak değil, sayfa görselleri olarak
   gösterilir; indirme düğmesi yoktur. Görseller: assets/thesis/pages/t-01.jpg ... */
(function () {
  const T = (window.PANPALS_CONFIG || {}).thesis || {};
  const esc = window.PP_ESC;
  const meta = document.getElementById("thesis-meta");
  if (meta) meta.innerHTML = [["Title", T.title], ["Author", T.author], ["Programme", [T.program, T.university].filter(Boolean).join(", ")], ["Year", T.year]]
    .map(([k, v]) => "<div><small>" + k + "</small><b>" + esc(v || "-") + "</b></div>").join("");
  const box = document.getElementById("thesis-pages");
  if (!box) return;
  document.getElementById("reader-title").textContent = T.title || "Thesis";
  const n = +T.pages || 0;
  document.getElementById("reader-count").textContent = n ? n + " pages" : "";
  const pad = (i) => (i < 10 ? "0" + i : "" + i);
  let html = "";
  for (let i = 1; i <= n; i++) html += '<div class="tp"><img src="assets/thesis/pages/t-' + pad(i) + '.jpg" alt="Thesis page ' + i + '" loading="lazy" draggable="false"></div>';
  box.innerHTML = html || '<div class="reader-fallback">The full thesis is on its way to the table.</div>';
  box.addEventListener("contextmenu", (e) => e.preventDefault());
  box.addEventListener("dragstart", (e) => e.preventDefault());
})();
