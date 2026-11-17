# PanPals website

Saf HTML + CSS + JavaScript. Build adımı yok. GitHub Pages'e olduğu gibi yüklenir.

## 1. Bilgisayarında görüntüleme

Terminalde klasöre gir ve küçük bir sunucu başlat:

```bash
cd ~/Desktop/panpals-website
```

```bash
python3 -m http.server 8000
```

Tarayıcıda **http://localhost:8000** aç. Durdurmak için `Ctrl + C`.

> `index.html`'e çift tıklayarak da açılır, ama **dergi okuyucusu ve Substack yazıları** sadece sunucuyla (yukarıdaki komut) çalışır.

Telefon/tablet görünümü için: Chrome'da `Cmd+Opt+I` → telefon ikonu.

## 2. İçerik: sadece `data/` klasörü

| Dosya | Ne var |
|---|---|
| `data/config.js` | App Store linki, mail, **6 sosyal hesap** (Instagram, TikTok, Substack, LinkedIn, Threads, X), Substack adresi, dergi, tez, Android waitlist |
| `data/team.js` | Ekip: isim, handle, rol, foto, bio, fun fact'ler |
| `data/news.js` | News sayfasındaki paylaşımlar |
| `data/feed.js` | Ana sayfadaki telefon prototipi: gönderiler + PalStats liderlik tablosu |
| `data/sources.json` | Otomatik News kaynakları (Substack, Instagram, TikTok) |

### Ekip (About & Team sayfası)
Fotoğrafı `assets/team/` içine koy (kare), `data/team.js`'te bir bloğu kopyala/sil. `signs` alanı isim altındaki üç küçük "mutfak burcu" (unvan, sevdiği tava, yemediği şey). Kurucuların fotoğrafları dergiden kırpıldı; daha iyileriyle değiştirebilirsin. Ekip Game Mode'da masada da oturuyor.

### News (otomatik güncellenir)
- Her kaynaktan **sadece en son paylaşım** gelir (`data/sources.json` → `per_source_limit`).
- **Substack:** iki yayın bağlı (`panpalsapp` ve `elsesinn`). Yazılar sitede, sitenin tasarımıyla okunur.
- **Instagram:** https://behold.so adresinde ücretsiz hesap aç, Instagram'ı bağla, verdiği **JSON feed** linkini `data/sources.json` → `instagram_behold_url` alanına yapıştır. Son paylaşımlar kapak fotoğrafı ve açıklamasıyla gelir. Videolarda sadece kapak görünür.
- **TikTok:** video linklerini `data/sources.json` → `tiktok_videos` listesine ekle. Kapak ve açıklama otomatik gelir.
- **X ve Threads:** rss.app gibi bir servisle hesabın için RSS linki oluştur, `data/sources.json` → `rss` içine yapıştır. Son paylaşım aynı formatta gelir.
- **LinkedIn ve basın:** `data/news.js`'e elle ekle (örneği dosyada var).
- Instagram, TikTok ve elle eklenen paylaşımlara tıklayınca önce **sitede bir önizleme** açılır, oradan "Visit on Instagram" gibi bir düğmeyle gerçek paylaşıma gidilir.

**Nasıl kendini yeniliyor?** `.github/workflows/update-feeds.yml` GitHub'da her gece `scripts/update_feeds.py`'ı çalıştırır, yeni paylaşımları `data/feeds.js` ve `data/articles/` dosyalarına yazar ve siteye kaydeder. GitHub'da repo → **Settings → Actions → General → Workflow permissions → "Read and write permissions"** seçili olmalı. Hemen güncellemek için: repo → **Actions → Update news feeds → Run workflow**. Bilgisayarında elle:

```bash
python3 scripts/update_feeds.py
```

### Dergi
`assets/magazine/p-01.jpg … p-62.jpg` (PanPals Editorial, PDF'ten çevrildi). News sayfasının sonunda kitap gibi açılır. Yeni sayı için görselleri değiştir ve `config.js` → `magazine.count`'u güncelle. PDF'ten görsel üretmek için:

```bash
pdftoppm -scale-to-x 1500 -scale-to-y -1 -jpeg -jpegopt quality=72 dergi.pdf assets/magazine/p
```

### Tez
Tez sitede **indirilemez** şekilde, sayfa görselleri olarak okunur (`assets/thesis/pages/t-01.jpg …`). PDF sitede yok, indirme düğmesi yok, sağ tık kapalı. Not: ekran görüntüsü almayı hiçbir site tamamen engelleyemez. Yeni sürüm için:

```bash
pdftoppm -scale-to-x 1000 -scale-to-y -1 -jpeg -jpegopt quality=68 tez.pdf assets/thesis/pages/t
```

Sonra `config.js` → `thesis.pages` sayısını güncelle.

### Android waitlist
https://formspree.io'da ücretsiz form aç, adresini `config.js` → `waitlistEndpoint`'e yapıştır. Boşsa form ziyaretçinin mail uygulamasını açar.

## 3. Pro mode ve Game mode

Sağ üstteki küçük ikonlu düğme; üzerine gelince ismi görünür. İsimler `config.js` → `modeNames`.

- **Pro mode:** site + kullanılabilen telefon prototipi (Feed, Post, PalStats, Profile).
- **Game Mode:** ana sayfa yatay kayan, sonsuz döngüde uzayan tek uzun masaya dönüşür. Duvarda asılı tavalar, arkada tezgah, buzdolabı (açınca News), masada oturan ekip, boş sandalyeler (Your seat → indirme). Fare tekerleği / kaydırma / ok tuşları / alttaki menü ile gezilir. Durak gezdikçe Guest → Pal → Regular → Family olunur.
  - **Ses:** varsayılan kapalı, alttaki hoparlörle açılır. Ses dosyası yok, sesler tarayıcıda üretiliyor (`js/sound.js`).
  - Duraklardaki yazılar: `js/kitchen.js` → `STATIONS`.

Renkler `css/style.css` en üstünde (`--wine: #481D24`, `--grey: #d9d9d9`, kırık beyazlar `--paper`, `--soft`). Tek font: Roboto.

## 4. Menü, footer, sayfalar
- Menü linkleri: `js/site.js` → `NAV`
- Footer: `js/site.js` (tek yerden, tüm sayfalarda aynı)
- Yeni sayfa: `about.html`'i kopyala, `<body data-page="...">` ve `<main>` içini değiştir.

## 5. GitHub'a yükleme

```bash
cd ~/Desktop/panpals-website
```

```bash
git init && git add . && git commit -m "New PanPals website"
```

```bash
git remote add origin https://github.com/KULLANICI_ADIN/REPO_ADIN.git
```

```bash
git push -u origin main --force
```

> `--force` eski sitenin yerine bunu koyar; önce eski repoyu yedekle. `CNAME` (`www.panpals.cc`) klasörde var, domain korunur.

## Klasörler

```
index.html            ana sayfa (Sleek + Game Mode)
about (about + team) thesis news article careers contact privacy terms .html  (team.html → about.html#team)
css/style.css         genel stil      css/phone.css   telefon prototipi
css/kitchen.css       Game Mode sahnesi
js/site.js            header, footer, formlar, mod geçişi
js/phone.js           telefon prototipi     js/kitchen.js  Game Mode
js/sound.js           mutfak sesleri        js/news.js     News feed
js/article.js         yazı okuyucu          js/magazine.js dergi
data/                 DÜZENLEYECEĞİN DOSYALAR
assets/app            app ikonu
assets/illustrations  dergideki el çizimleri (bordo ve renkli)
assets/magazine       dergi sayfaları
scripts/update_feeds.py  News güncelleyici  ·  .github/workflows  otomatik çalıştırma
assets/brand          logo, wordmark
assets/feed           telefondaki gönderi fotoğrafları
assets/team  assets/thesis  assets/magazine  assets/news
```

## 6. Telefon prototipini app'in kendisinden yapmak (Xcode Simulator)

1. Xcode → app'i bir iPhone simulator'ında çalıştır.
2. Her ekranda `Cmd + S` (File → Save Screen): PNG masaüstüne kaydedilir. Feed, bir gönderi, beğenilmiş hali, Post, PalStats, Profile, başka birinin profili, yorumlar.
3. Kaydırma ve geçişler için: File → Record Screen (video).
4. Bu görselleri Claude'a gönder; prototip (`js/phone.js`, `css/phone.css`) birebir onlara göre yeniden yapılır ve tıklanabilir kalır.
