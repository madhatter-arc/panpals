/* ==========================================================================
   PANPALS · ELLE EKLENEN HABERLER
   Substack, Instagram ve TikTok OTOMATİK gelir (data/sources.json).
   Buraya sadece otomatik gelmeyenleri ekle. X, LinkedIn, Threads ve TikTok için en çok
   etkileşim alan paylaşımlar SABİT olarak burada duruyor ve hiç yenilenmez.

   platform : "event" (IRL meetup) | "linkedin" | "threads" | "x" | "press" | "news" | "instagram" | "tiktok"
   date     : "YYYY-MM-DD"
   image    : kapak görseli (assets/news/ içine koy) ya da ""
   caption  : paylaşımın metni (tıklayınca sitede açılan önizlemede görünür)
   url      : paylaşımın linki ("Visit" düğmesi buraya gider)
   video    : true ise sadece kapak fotoğrafı ve oynat işareti görünür
   cta      : (isteğe bağlı) düğme yazısı, örn. "Join the waitlist"
   title_en / caption_en : (isteğe bağlı) Türkçe paylaşımın İngilizcesi. Yazmazsan
              "Translate to English" düğmesi otomatik çeviri dener.

   Örnek:
   {
     platform: "linkedin",
     title: "We are hiring our first community lead",
     caption: "Paylaşımın tam metni...",
     date: "2026-11-20",
     image: "assets/news/linkedin-hiring.jpg",
     url: "https://www.linkedin.com/posts/..."
   },
   ========================================================================== */

window.PANPALS_NEWS = [
  /* IRL MEETUP: tarihi geçince bu bloğu silebilir ya da yenisiyle değiştirebilirsin */
  {"platform": "event", "title": "PanPals Istanbul 3 🍳 IRL meetup", "excerpt": "Our third Istanbul meetup: hugs with old Pals, new Pals, little gifts and mini workshops. 26 December, 18:00, Beyoğlu.", "caption": "📅 26 December 2026, 18:00-20:00 (Istanbul)\n📍 Beyoğlu, Istanbul (exact place shared soon)\n\n“Bir sonraki buluşma ne zaman?”\n“Sadece dijitalde mi varsınız?”\n“Bu app’i kimler yapıyor?”\n“Bu sofradan tanıdığım insanları yüz yüze görsem nasıl olur?”\n“Babam böyle pasta yapmayı nereden öğrendi?”\n\ndiyen herkesi PanPals’ın üçüncü İstanbul buluşmasına bekliyoruz! 🍳\n\nEski Pal’larımıza yeniden sarılmak ve yeni Pal’larla tanışmak için sabırsızlanıyoruz. Hikâyemizi size anlatmak için de heyecanlıyız.\n\n✅ Artılar: biz, Pal’lar, küçük hediyeler ve mini workshop’lar (katılım zorunlu değil)\n❌ Eksiler: yok gibi\n\n(İstanbul'da olmayan Pal'larımız bizi affetsin, söz büyüyünce her yere geleceğiz!)\n\nİlk Pal’lar, Cansu, Arda, Gözde 🍳", "date": "2026-12-26", "url": "https://luma.com/v8htzr4z", "cta": "RSVP on Luma", "image": "assets/news/pinned/meetup-istanbul-3.jpg", "title_en": "PanPals Istanbul 3 🍳 IRL meetup", "caption_en": "📅 26 December 2026, 18:00-20:00 (Istanbul)\n📍 Beyoğlu, Istanbul (exact place shared soon)\n\n“When is the next meetup?”\n“Do you only exist online?”\n“Who is building this app?”\n“What would it be like to meet the people from this table face to face?”\n“Where did my dad learn to bake a cake like that?”\n\nIf you have ever said any of these, we’re waiting for you at PanPals’ third Istanbul meetup! 🍳\n\nWe can’t wait to hug our old Pals again and meet new ones. We’re excited to tell you our story too.\n\n✅ Pros: us, Pals, little gifts and mini workshops (joining is optional)\n❌ Cons: hardly any\n\n(To our Pals outside Istanbul: forgive us, we promise to come everywhere once we grow!)\n\nYour first Pals, Cansu, Arda, Gözde 🍳"},
  /* SABİT · x: En çok beğenilen paylaşım (4 beğeni; Cumhuriyet Bayramı paylaşımıyla eşit) */
  {"platform": "x", "title": "Yapay zeka yok. Algoritma yok. Kusursuz görünme derdi yok.", "caption": "Yapay zeka yok.\nAlgoritma yok. \nKusursuz görünme derdi yok.\n\nSadece gerçek insanların gerçek mutfakları var 🍳🤍", "date": "2026-11-09", "url": "https://x.com/panpals_app/status/2119756134269714618", "image": "assets/news/pinned/x.jpg", "title_en": "No AI. No algorithm. No pressure to look perfect.", "caption_en": "No AI.\nNo algorithm.\nNo pressure to look perfect.\n\nJust real people’s real kitchens 🍳🤍"},
  /* SABİT · linkedin: En çok etkileşim (4 tepki, 2 yorum) */
  {"platform": "linkedin", "title": "Back-to-back meetings probably drained your energy, but a real lunch can turn that curve right back up.", "caption": "Back-to-back meetings probably drained your energy, but a real lunch can turn that curve right back up.\nNever underestimate the power of a warm, homemade meal in the middle of a workday.\nHow’s your graph looking today?", "date": "2026-11-07", "url": "https://www.linkedin.com/feed/update/urn:li:activity:7524747010755674112", "image": "assets/news/pinned/linkedin.jpg"},
  /* SABİT · threads: TODO: Threads beğeni sayısını göstermiyor; en çok etkileşim alanı söyle, linkini değiştir */
  {"platform": "threads", "title": "PanPals’ta ilk 365 gün streak 🤯🤯🤯🤯  #yemek #tarif #sofra", "caption": "PanPals’ta ilk 365 gün streak 🤯🤯🤯🤯\n\n#yemek #tarif #sofra", "date": "2026-11-16", "url": "https://www.threads.net/@panpals.app/post/DfzDw7RDAB6", "image": "assets/news/pinned/threads.jpg", "title_en": "The first 365-day streak on PanPals 🤯🤯🤯🤯", "caption_en": "The first 365-day streak on PanPals 🤯🤯🤯🤯 #food #recipe #table"},
  /* SABİT · tiktok: En çok etkileşim (9.898 izlenme, 1.898 beğeni) */
  {"platform": "tiktok", "title": "All I want #homecooking #kitchen #pantry #dreamhome #fyp", "caption": "All I want #homecooking #kitchen #pantry #dreamhome #fyp  ♬ original sound - whatcowboylistens", "date": "2026-10-31", "url": "https://www.tiktok.com/@panpals.app/video/7702794542310903062", "image": "assets/news/pinned/tiktok.jpg", "video": true},
  {
    platform: "news",
    title: "PanPals for Android is almost here",
    caption: "We are putting the last plates on the table. Join the waitlist and we will tell you the day it lands.",
    date: "2026-10-05",
    url: "index.html#download",
    cta: "Join the waitlist",
    image: ""
  }
];
