/* ==========================================================================
   PANPALS · OUR TEAM (About sayfasında)
   Yeni kişi eklemek: bir { ... } bloğunu kopyala, virgülle listeye ekle.
   Kişi çıkarmak: o kişinin { ... } bloğunu sil. Sıra = sayfadaki sıra.

   name    : sadece ilk isim (kartta "@handle on PanPals (İsim)" olarak görünür)
   Boş bırakılan alanlar ("") sitede boş kalır; foto yoksa tek renk + baş harf görünür.
   handle  : PanPals'taki kullanıcı adı
   photo   : assets/team/ içindeki kare fotoğraf. Yoksa baş harfli daire görünür.
   signs   : isim altındaki üç küçük "mutfak burcu": app'teki unvanı, en sevdiği tava, asla yemediği şey
   bio     : kısa hikâye, yemek ve PanPals üzerine
   funFacts: Game Mode'da masada tıklayınca konuşma balonunda çıkar (yemek ve PanPals üzerine)
   ========================================================================== */

window.PANPALS_TEAM = [
  {
    name: "Cansu",
    handle: "@esincansu",
    role: "Co-founder",
    group: "founders",
    photo: "assets/team/cansu.jpg",
    signs: ["Head Chef", "Stainless steel pan", "Following recipes"],
    bio: "The one who came up with PanPals and turned it into her LSE dissertation, which is where the whole drill started. Had her first food over-indulgence at 4 on New Year’s Eve: she ate everything on the table and ended up in hospital. In love with potatoes in all forms and a frantic home cooker ever since. Lucky enough to call Arda and Gözde her besties since they were children.",
    funFacts: ["Ate everything on the New Year’s Eve table at 4 and ended up in hospital", "In love with potatoes in all forms", "Frantic home cooker", "PanPals started as her LSE dissertation"]
  },
  {
    name: "Arda",
    handle: "@Fiko",
    role: "Co-founder, developer",
    group: "founders",
    photo: "assets/team/arda.jpg",
    signs: ["Line Chef", "", ""],
    bio: "Builds the app every pal opens to post their plate. The fastest bug crusher we know and a brutal prioritisation machine: if a bon appétit ever fails to land, it is fixed before your dinner gets cold.",
    funFacts: ["The fastest bug crusher in the kitchen", "Fixes bugs before your pasta water boils", "Brutal prioritisation machine"]
  },
  {
    name: "Gözde",
    handle: "@Gözde2",
    role: "Co-founder, designer",
    group: "founders",
    photo: "assets/team/gozde.jpg",
    signs: ["Prep Chef", "Wok", "No tomatoes"],
    bio: "Loves pasta and cake like a 4-year-old kid, enjoys spending time baking but hates tomatoes. Here almost from the very beginning, right after Cansu and Arda, and since then obsessed with wok pans and oven-baked dishes. A Prep Chef from Vienna with 259 meals on PanPals and a spot in the 100 Club.",
    funFacts: ["Pasta and cake, like a 4-year-old", "Hates tomatoes", "259 meals and counting", "100 Club member"]
  },
  { name: "Esma", handle: "@sophieEsma21", role: "Social media", group: "team", photo: "assets/team/esma.jpg", signs: ["Prep Chef", "Wok (for the looks)", "Leeks and raw onion"], bio: "Picked the wok as her pan purely for its looks. Her grandma’s fries and, very specifically, her mum’s stuffed vine leaves are the dishes she feels a real bond with. Has never got along with leeks and can’t eat anything with raw onion. What she loves most is setting up a breakfast spread or a wine plate, and she is still not sure if that counts as cooking (it does).", funFacts: ["Chose the wok for its looks", "Her mum’s stuffed vine leaves, nothing else comes close", "Never got along with leeks", "No raw onion, ever", "Breakfast spreads and wine plates count as cooking"] },
  { name: "Özge", handle: "@ozzy", role: "Social media", group: "team", photo: "assets/team/ozzy.jpg", signs: ["Prep Chef", "Mini pans", "Long hours at the stove"], bio: "Her diet is mostly whatever is on a restaurant’s kids’ menu, plus artichokes, which are her very soft spot. Doesn’t know enough about pots and pans to have a favourite, but loves anything miniature, so she always cooks in tiny pans and tiny pots, and the portions never quite stretch far enough. Gets bored standing at the stove, so the oven does most of her cooking.", funFacts: ["Kids’ menu plus artichokes, that’s the diet", "Artichokes are her soft spot", "Only cooks in tiny pans, so portions always come up short", "Too bored for the stove, team oven"] },
  { name: "Pelin Duru", handle: "@ppelinkk", role: "Developer", group: "team", photo: "assets/team/pelin-duru.jpg", signs: ["Sous Chef", "Nonstick pan", "Washing dishes"], bio: "Wakes up for one reason: her yogurt bowl, made very specifically with pistachio protein kefir and chia seeds. Not a picky eater in sight, and anything that comes out of the sea gets her biggest appetite. Hates washing dishes, which makes her the biggest fan of nonstick pans and oven-baked dishes. A Sous Chef from Istanbul, currently studying in Turin, with 42 meals on PanPals.", funFacts: ["Wakes up for pistachio kefir yogurt bowls with chia", "Anything from the sea, biggest appetite", "Not a picky eater in sight", "Hates washing dishes, team nonstick"] },
  /* noApp: true → kartta sadece handle yazar ("on PanPals (İsim)" yazmaz) */
  { name: "Nedim", handle: "@nedim", noApp: true, role: "Go-to-market strategist (Android user)", group: "team", photo: "", signs: ["", "", ""], bio: "", funFacts: [] }
];
