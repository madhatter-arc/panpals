/* PANPALS · THESIS PAGE
   Bilgiler data/config.js -> thesis. Tez sayfa görselleri olarak gösterilir, indirilemez.
   Görseller: assets/thesis/pages/t-01.jpg ... Sayfa silersen config.js -> thesis.skip listesine numarasını yaz. */
(function () {
  const T = (window.PANPALS_CONFIG || {}).thesis || {};
  const esc = window.PP_ESC;
  const meta = document.getElementById("thesis-meta");
  if (meta) meta.innerHTML = "<b>" + esc(T.title || "") + "</b><br>" + [T.author, T.program, T.university, T.year].filter(Boolean).map(esc).join(" · ");
  const box = document.getElementById("thesis-pages");
  if (!box) return;
  document.getElementById("reader-title").textContent = T.title || "Thesis";
  const skip = T.skip || [];
  const pad = (i) => (i < 10 ? "0" + i : "" + i);
  const list = [];
  for (let i = 1; i <= (+T.pages || 0); i++) if (skip.indexOf(i) < 0) list.push(i);
  document.getElementById("reader-count").textContent = list.length ? list.length + " pages" : "";
  box.innerHTML = list.map((i) => '<div class="tp"><img src="assets/thesis/pages/t-' + pad(i) + '.jpg" alt="Thesis page" loading="lazy" draggable="false"></div>').join("") || '<div class="reader-fallback">The full thesis is on its way to the table.</div>';
  box.addEventListener("contextmenu", (e) => e.preventDefault());
  box.addEventListener("dragstart", (e) => e.preventDefault());
})();
