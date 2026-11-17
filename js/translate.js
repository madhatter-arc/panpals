/* ==========================================================================
   PANPALS · TRANSLATE TO ENGLISH
   Türkçe bir paylaşımda "Translate to English" düğmesi çıkar.
   Önce elle yazılmış İngilizceyi (title_en / caption_en) kullanır, yoksa
   ücretsiz Google Translate uç noktasıyla otomatik çevirir.
   ========================================================================== */

(function () {
  const TR = /[çğıöşüÇĞİÖŞÜ]|\b(ve|bir|bu|için|gibi|çok|ama|daha|olan|ile)\b/;
  window.PP_IS_TURKISH = (t) => {
    const m = String(t || "").match(new RegExp(TR.source, "g"));
    return !!m && m.length >= 2;
  };
  const cache = {};
  async function one(text) {
    if (!text.trim()) return text;
    if (cache[text]) return cache[text];
    const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + encodeURIComponent(text);
    const r = await fetch(url);
    if (!r.ok) throw new Error("translate failed");
    const j = await r.json();
    return (cache[text] = (j[0] || []).map((x) => x[0]).join(""));
  }
  /* Translates long text in chunks (keeps line breaks) */
  window.PP_TRANSLATE = async function (text) {
    const parts = String(text).split(/(\n+)/);
    const out = [];
    let buf = "";
    const flush = async () => { if (buf) { out.push(await one(buf)); buf = ""; } };
    for (const p of parts) {
      if (/^\n+$/.test(p)) { await flush(); out.push(p); continue; }
      if ((buf + p).length > 1500) await flush();
      buf += p;
    }
    await flush();
    return out.join("");
  };
  /* Translates every text block inside an element (article reader) */
  window.PP_TRANSLATE_EL = async function (root) {
    const blocks = [...root.querySelectorAll("p, h1, h2, h3, h4, li, blockquote, figcaption")].filter((el) => !el.querySelector("p, li") && el.textContent.trim());
    for (const el of blocks) {
      if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
      el.textContent = await window.PP_TRANSLATE(el.textContent);
    }
  };
  window.PP_RESTORE_EL = function (root) {
    root.querySelectorAll("[data-orig]").forEach((el) => { el.innerHTML = el.dataset.orig; });
  };
})();
