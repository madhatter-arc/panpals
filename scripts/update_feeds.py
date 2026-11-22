#!/usr/bin/env python3
"""
PanPals news updater.
Reads data/sources.json, fetches Substack RSS, Instagram (via Behold.so JSON) and TikTok (oEmbed),
then writes data/feeds.js (list) and data/articles/<slug>.js (full Substack articles, readable on the site).
No third-party packages needed. Run locally:  python3 scripts/update_feeds.py
"""
import json, os, re, html, hashlib, urllib.request, urllib.parse, email.utils, datetime
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
ART = os.path.join(DATA, "articles")
MEDIA = os.path.join(ROOT, "assets", "news", "auto")
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
      "Accept": "application/rss+xml, application/xml, application/json, text/html;q=0.9, */*;q=0.8"}


def get(url, binary=False):
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            return data if binary else data.decode("utf-8", "replace")
        except Exception as e:
            last = e
            import time; time.sleep(3 * (attempt + 1))
    raise last


def iso(d):
    try:
        return email.utils.parsedate_to_datetime(d).date().isoformat()
    except Exception:
        try:
            return datetime.datetime.fromisoformat(d.replace("Z", "+00:00")).date().isoformat()
        except Exception:
            return datetime.date.today().isoformat()


def text(h, n=200):
    t = re.sub(r"<[^>]+>", " ", h or "")
    t = re.sub(r"\s+", " ", html.unescape(t)).strip()
    return (t[: n - 1] + "…") if len(t) > n else t


def direct(url):
    """substackcdn.com/image/fetch/<opts>/<encoded original> -> the original image URL (hotlink-safe)."""
    m = re.match(r"https://substackcdn\.com/image/fetch/[^/]+/(https?%3A%2F%2F.+)$", url or "")
    return urllib.parse.unquote(m.group(1)) if m else url


def clean(h):
    h = re.sub(r"(?is)<(script|style|form|button)[^>]*>.*?</\1>", "", h or "")
    h = re.sub(r'(?is)<div class="(subscription-widget-wrap[^"]*|button-wrapper[^"]*|share-dialog[^"]*)".*?</div>\s*</div>', "", h)
    h = re.sub(r'(?is)<img[^>]+src="data:[^"]*"[^>]*>', "", h)
    h = re.sub(r'(src|href)="(https://substackcdn\.com/image/fetch/[^"]+)"', lambda m: m.group(1) + '="' + direct(html.unescape(m.group(2))) + '"', h)
    h = re.sub(r'(?is)<svg.*?</svg>', "", h)
    h = re.sub(r'\s(on\w+|style|srcset|sizes|width|height|data-attrs|data-component-name)="[^"]*"', "", h)
    return h


def save_media(url, key):
    """Covers are linked straight to the original image (Substack S3 / Behold / TikTok CDN).
    Nothing is downloaded, so data/feeds.js alone is enough to update the site."""
    return url or ""

def substack(src, limit):
    out = []
    xml = get(src["feed"])
    root = ET.fromstring(xml)
    ns = {"content": "http://purl.org/rss/1.0/modules/content/", "dc": "http://purl.org/dc/elements/1.1/"}
    for it in root.iter("item"):
        link = (it.findtext("link") or "").strip()
        slug = re.sub(r"[^a-z0-9-]", "", link.rstrip("/").split("/")[-1].lower())[:80] or hashlib.md5(link.encode()).hexdigest()[:10]
        enc = it.find("enclosure")
        content = it.findtext("content:encoded", default="", namespaces=ns)
        item = {
            "platform": "substack",
            "source": src.get("label", "Substack"),
            "title": html.unescape(it.findtext("title") or ""),
            "excerpt": text(it.findtext("description") or content, 220),
            "date": iso(it.findtext("pubDate") or ""),
            "url": link,
            "image": save_media(direct(enc.get("url")), "ss" + link) if enc is not None else "",
            "image_remote": direct(enc.get("url")) if enc is not None else "",
            "author": it.findtext("dc:creator", default="", namespaces=ns),
            "slug": slug,
        }
        with open(os.path.join(ART, slug + ".js"), "w", encoding="utf-8") as f:
            f.write("window.PANPALS_ARTICLE = " + json.dumps(dict(item, content=clean(content)), ensure_ascii=False) + ";\n")
        out.append(item)
        if len(out) >= limit:
            break
    return out


def substack_note(src):
    """Latest Substack Note (a post outside articles) of a profile."""
    prof = json.loads(get("https://substack.com/api/v1/user/" + src["handle"] + "/public_profile"))
    feed = json.loads(get("https://substack.com/api/v1/reader/feed/profile/" + str(prof["id"]) + "?types%5B%5D=note"))
    notes = [x.get("comment") for x in feed.get("items", []) if x.get("type") == "comment" and x.get("comment")]
    notes = [n for n in notes if (n.get("body") or "").strip()]
    if not notes:
        return []
    n = max(notes, key=lambda c: c.get("date", ""))
    img = next((a.get("imageUrl") for a in (n.get("attachments") or []) if a.get("imageUrl")), "")
    body = n.get("body", "").strip()
    return [{
        "platform": "substack", "source": src.get("label", "Substack") + " · Note", "title": text(body, 90),
        "caption": body, "date": iso(n.get("date", "")), "cta": "Open on Substack",
        "url": "https://substack.com/@" + src["handle"] + "/note/c-" + str(n.get("id")),
        "image": save_media(img, "note" + str(n.get("id"))) if img else "",
        "image_remote": img,
    }]


def instagram(url, limit):
    data = json.loads(get(url))
    posts = data.get("posts", data) if isinstance(data, dict) else data
    out = []
    for p in posts[:limit]:
        video = p.get("mediaType") == "VIDEO" or bool(p.get("isReel"))
        sizes = p.get("sizes") or {}
        img = (sizes.get("large") or sizes.get("medium") or {}).get("mediaUrl") or p.get("thumbnailUrl") or p.get("mediaUrl")
        cap = p.get("prunedCaption") or p.get("caption") or ""
        out.append({
            "platform": "instagram", "title": text(cap, 90) or "On Instagram", "caption": cap,
            "date": iso(p.get("timestamp", "")), "url": p.get("permalink", ""),
            "image": save_media(img, "ig" + str(p.get("id", img))), "image_remote": img, "video": bool(video),
        })
    return out


def tiktok(urls):
    out = []
    for u in urls:
        try:
            j = json.loads(get("https://www.tiktok.com/oembed?url=" + urllib.parse.quote(u, safe="")))
            out.append({
                "platform": "tiktok", "title": text(j.get("title", ""), 90) or "On TikTok", "caption": j.get("title", ""),
                "date": datetime.date.today().isoformat(), "url": u,
                "image": save_media(j.get("thumbnail_url"), "tt" + u), "video": True,
            })
        except Exception as e:
            print("  tiktok failed", u, e)
    return out


def first_img(h):
    m = re.search(r'<img[^>]+src="([^"]+)"', h or "")
    return m.group(1) if m else ""


def generic_rss(src, limit):
    """Any RSS/Atom feed (e.g. made with rss.app for X or Threads)."""
    root = ET.fromstring(get(src["feed"]))
    media = "{http://search.yahoo.com/mrss/}"
    atom = "{http://www.w3.org/2005/Atom}"
    entries = list(root.iter("item")) or list(root.iter(atom + "entry"))
    if src["platform"] == "x":
        entries = [e for e in entries if not re.match(r"^(RT by|R to)\b", (e.findtext("title") or "").strip())]
    out = []
    for it in entries[:limit]:
        title = it.findtext("title") or it.findtext(atom + "title") or ""
        desc = it.findtext("description") or it.findtext(atom + "content") or it.findtext(atom + "summary") or ""
        link = it.findtext("link") or ""
        if not link:
            l = it.find(atom + "link")
            link = l.get("href") if l is not None else ""
        img = ""
        for tag in (media + "content", media + "thumbnail", "enclosure"):
            el = it.find(tag)
            if el is not None and el.get("url"):
                img = el.get("url"); break
        img = img or first_img(desc)
        cap = text(desc, 600) or text(title, 600)
        if src["platform"] == "x":
            cap = re.sub(r"\s*\u2014\s*[^\u2014]*?@\w+\)?\s+\w{3} \d{1,2}, \d{4}\s*$", "", cap).strip()
        cap = re.sub(r"\s*\ufffc\s*", " ", cap).strip()
        out.append({
            "platform": src["platform"], "title": text(cap or title, 90) or src["platform"], "caption": cap,
            "date": iso(it.findtext("pubDate") or it.findtext(atom + "published") or it.findtext(atom + "updated") or ""),
            "url": link, "image": save_media(img, src["platform"] + link) if img else "",
            "video": src["platform"] == "tiktok",
        })
    return out


def previous_items():
    try:
        t = open(os.path.join(DATA, "feeds.js"), encoding="utf-8").read()
        return json.loads(t[t.index("["): t.rindex("]") + 1])
    except Exception:
        return []


def key(i):
    return i.get("platform", "") + "|" + i.get("source", "")


def main():
    os.makedirs(ART, exist_ok=True)
    prev = previous_items()
    with open(os.path.join(DATA, "sources.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    limit = int(cfg.get("per_source_limit", 8))
    items = []
    for src in cfg.get("substack", []):
        try:
            got = substack(src, limit); items += got; print("substack", src["feed"], len(got))
        except Exception as e:
            print("substack failed", src.get("feed"), e)
        if src.get("handle"):
            try:
                got = substack_note(src); items += got; print("substack note", src["handle"], len(got))
            except Exception as e:
                print("substack note failed", src["handle"], e)
    if cfg.get("instagram_behold_url"):
        try:
            got = instagram(cfg["instagram_behold_url"], limit); items += got; print("instagram", len(got))
        except Exception as e:
            print("instagram failed", e)
    if cfg.get("tiktok_videos"):
        items += tiktok(cfg["tiktok_videos"][-limit:])
    for src in cfg.get("rss", []):
        if not src.get("feed"):
            continue
        try:
            got = generic_rss(src, limit); items += got; print("rss", src["platform"], len(got))
        except Exception as e:
            print("rss failed", src.get("feed"), e)
    # A source that failed or stopped (e.g. an rss.app feed after the free trial)
    # keeps showing its last known post instead of disappearing.
    expected = set()
    for src in cfg.get("substack", []):
        expected.add("substack|" + src.get("label", "Substack"))
        if src.get("handle"):
            expected.add("substack|" + src.get("label", "Substack") + " · Note")
    if cfg.get("instagram_behold_url"):
        expected.add("instagram|")
    for src in cfg.get("rss", []):
        if src.get("feed"):
            expected.add(src["platform"] + "|")
    got = {key(i) for i in items}
    for k in expected - got:
        old = [i for i in prev if key(i) == k]
        if old:
            print("kept previous item for", k)
            items += old[:limit]
    # remove article files that are no longer listed
    keep = {i["slug"] + ".js" for i in items if i.get("slug")}
    for f in os.listdir(ART):
        if f.endswith(".js") and f not in keep:
            os.remove(os.path.join(ART, f))
    if os.path.isdir(MEDIA):  # old downloaded covers are no longer used
        for f in os.listdir(MEDIA):
            os.remove(os.path.join(MEDIA, f))
    items.sort(key=lambda x: x.get("date", ""), reverse=True)
    if not items and prev:
        print("nothing fetched at all; keeping the previous feeds.js")
        return
    with open(os.path.join(DATA, "feeds.js"), "w", encoding="utf-8") as f:
        f.write("/* AUTO-GENERATED by scripts/update_feeds.py. Do not edit by hand; edit data/news.js instead. */\n")
        f.write("window.PANPALS_FEEDS = " + json.dumps(items, ensure_ascii=False, indent=1) + ";\n")
    print("wrote", len(items), "items")


if __name__ == "__main__":
    main()
