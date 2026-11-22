/* ==========================================================================
   PANPALS · ARTICLE READER
   article.html?a=<slug> → data/articles/<slug>.js dosyasını yükler ve yazıyı
   sitenin tasarımıyla gösterir. Dosyaları scripts/update_feeds.py üretir.
   ========================================================================== */

(function () {
  const esc = window.PP_ESC, I = window.PP_ICONS;
  const slug = (new URLSearchParams(location.search).get("a") || "").replace(/[^a-z0-9-]/gi, "");
  const head = document.getElementById("article-head");
  const hero = document.getElementById("article-hero");
  const body = document.getElementById("article-body");
  const fmt = (d) => { const x = new Date(d); return isNaN(x) ? "" : x.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); };

  function fail() {
    head.innerHTML = '<a class="back-link" href="news.html">' + I.arrow + 'All news</a><h1 style="margin-top:20px">This story is still in the oven.</h1>';
    body.innerHTML = '<div class="prose"><p>We couldn’t find it. <a href="news.html">Back to all news</a>.</p></div>';
  }
  function show(a) {
    document.title = a.title + " · PanPals";
    head.innerHTML = '<a class="back-link" href="news.html">' + I.arrow + "All news</a>" +
      '<span class="label" style="margin-top:20px">' + esc(a.source || "Editorial") + "</span><h1>" + esc(a.title) + "</h1>" +
      '<div class="meta">' + (a.author ? "<span>" + esc(a.author) + "</span>" : "") + "<span>" + esc(fmt(a.date)) + "</span></div>";
    hero.innerHTML = "";
    const d = document.createElement("div");
    d.className = "prose";
    /* Substack's resized-image links can refuse other sites; use the original image instead */
    d.innerHTML = (a.content || "").replace(/https:\/\/substackcdn\.com\/image\/fetch\/[^\/"]+\/(https?%3A%2F%2F[^"\s]+)/g, (m, enc) => { try { return decodeURIComponent(enc); } catch (e) { return m; } });
    d.querySelectorAll("a").forEach((x) => { x.target = "_blank"; x.rel = "noopener"; });
    d.querySelectorAll('img[src^="data:"], svg, button, .image-link-expand, .restack-image, .view-image').forEach((x) => x.remove());
    d.querySelectorAll("img").forEach((x) => { x.loading = "lazy"; x.onerror = () => x.closest("figure, a, picture") ? x.closest("figure, a, picture").remove() : x.remove(); });
    body.innerHTML = "";
    body.appendChild(d);
    if (window.PP_IS_TURKISH(d.textContent.slice(0, 2000))) {
      const tb = document.createElement("button");
      tb.className = "btn btn--soft btn--small tr-float";
      tb.textContent = "Translate to English";
      let en = false;
      tb.addEventListener("click", async () => {
        if (en) { window.PP_RESTORE_EL(d); tb.textContent = "Translate to English"; en = false; return; }
        tb.textContent = "Translating…";
        try { await window.PP_TRANSLATE_EL(d); tb.textContent = "Show original"; en = true; } catch (e) { tb.textContent = "Couldn’t translate"; }
      });
      head.querySelector(".meta").appendChild(tb);
    }
    body.insertAdjacentHTML("beforeend", '<div class="article-foot"><span>Enjoyed this? Get the next one in your inbox.</span><div class="cta-row"><a class="btn btn--small" href="' + esc(a.url) + '" target="_blank" rel="noopener">Subscribe on Substack</a><a class="btn btn--small btn--soft" href="news.html">More news</a></div></div>');
  }
  if (!slug) return fail();
  const s = document.createElement("script");
  s.src = "data/articles/" + slug + ".js";
  s.onload = () => (window.PANPALS_ARTICLE ? show(window.PANPALS_ARTICLE) : fail());
  s.onerror = fail;
  document.body.appendChild(s);
})();
