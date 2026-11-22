/* ==========================================================================
   PANPALS · PHONE PROTOTYPE DATA (ana sayfadaki telefon)
   Ekranlar app'in Kasım 2026 simulator görüntülerine göre yapıldı.
   title   : app'teki unvan (Prep Chef, Sous Chef ...)
   caption : fotoğrafın altındaki kalın açıklama
   ========================================================================== */

/* Profile sekmesinde gösterilen hesap */
window.PANPALS_ME = {
  user: "sarah__", avatar: "", title: "Prep Chef", city: "Vienna",
  meals: 259, followers: 5539, following: 5539,
  streak: "0 day", goal: "Prep Chef", achievement: "100 Club",
  week: "Week of 16.11 - 22.11", weekLine: "4 Meals, 1 Challenges, 1 Goals",
  posts: ["assets/feed/mag-bengi-eu.jpg", "assets/feed/post2.jpg", "assets/feed/post4.jpg", "assets/feed/mag-greta-pizza.jpg", "assets/feed/post1.jpg", "assets/feed/post5.jpg"]
};

/* Fotoğraflar PanPals Editorial dergisinden ve app'teki profillerden; unvan ve başlıklar dergidekiyle aynı */
window.PANPALS_FEED = [
  { user: "epine", avatar: "assets/feed/av-epine.jpg", title: "Head Chef", image: "assets/feed/mag-epine-mezze.jpg", caption: "date night but make it 6 mezes because we couldn’t decide 🫶", tag: { type: "listening", text: "norah jones" }, likes: 41, comments: 5, ago: "6 minutes ago", meals: 408, streak: 66 },
  { user: "cookingforwellbeing", avatar: "assets/feed/av-cfw.jpg", title: "Head Chef", image: "assets/feed/mag-cfw-bowl.jpg", caption: "fridge clean-out, accidentally gorgeous", likes: 33, comments: 3, ago: "25 minutes ago", meals: 366, streak: 170 },
  { user: "Eril", avatar: "assets/feed/avatar1.jpg", title: "Sous Chef", image: "assets/feed/post1.jpg", caption: "made these for the office, ate two before leaving the house", likes: 37, comments: 2, ago: "1 hour ago", meals: 152 },
  { user: "tural", avatar: "assets/feed/av-tural.jpg", title: "Line Chef", image: "assets/feed/mag-tural-lahmacun.jpg", caption: "first try at lahmacun. not round but who’s counting", tag: { type: "watching", text: "the bear s3" }, likes: 52, comments: 6, ago: "2 hours ago", meals: 265, streak: 17 },
  { user: "bengicokk", avatar: "assets/feed/avatar7.jpg", title: "Sous Chef", image: "assets/feed/mag-bengi-eu.jpg", caption: "EÜ season is officially open 🍞", likes: 38, comments: 4, ago: "3 hours ago", meals: 326 },
  { user: "littlesalior", avatar: "assets/feed/avatar5.jpg", title: "Prep Chef", image: "assets/feed/post5.jpg", caption: "MY 1st CAKE. please be nice", likes: 96, comments: 9, ago: "5 hours ago", meals: 9 },
  { user: "greta", avatar: "assets/feed/av-greta.jpg", title: "Sous Chef", image: "assets/feed/mag-greta-pizza.jpg", caption: "grandma’s plates only come out for homemade pizza", likes: 29, comments: 2, ago: "Yesterday", meals: 266, streak: 6 },
  { user: "aselsude", avatar: "assets/feed/av-aselsude.jpg", title: "Sous Chef", image: "assets/feed/mag-aselsude-cake.jpg", caption: "25 and still baking my own birthday cake 🎂", likes: 64, comments: 8, ago: "Yesterday", meals: 336, streak: 135 },
  { user: "merveevirgen", avatar: "assets/feed/av-merve.jpg", title: "Sous Chef", image: "assets/feed/mag-merve-nye.jpg", caption: "hosted 14 people, slept for 14 hours", likes: 58, comments: 5, ago: "2 days ago", meals: 289, streak: 34 },
  { user: "mgainkitchen", avatar: "assets/feed/avatar2.jpg", title: "Prep Chef", image: "assets/feed/post2.jpg", caption: "sunday breakfast for whoever wakes up first", tag: { type: "listening", text: "Taylor" }, likes: 52, comments: 4, ago: "3 days ago", meals: 81 },
  { user: "brendaoo", avatar: "assets/feed/avatar4.jpg", title: "Prep Chef", image: "assets/feed/post4.jpg", caption: "meze night. nobody left hungry, nobody left early", likes: 44, comments: 3, ago: "4 days ago", meals: 63 }
];

/* PalStats sekmesi */
window.PANPALS_PALSTATS = {
  fame: [
    { icon: "flame", label: "Highest Streak by:", who: "@ŞekerBademi", n: 367 },
    { icon: "cone", label: "Highest Weekly Meals by:", who: "@zilbasmis", n: 5 },
    { icon: "bowl", label: "Most Bon Appétits by:", who: "@salva", n: 76 },
    { icon: "glass", label: "Most Table Talks by:", who: "@umaysolpan", n: 28 },
    { icon: "gem", label: "Pal of the Week is:", who: "@hazalt", n: null }
  ],
  week: "16.11.26 - 22.11.26",
  top: [["zilbasmis", "5 meals"], ["selinlovestoeat", "5 meals"], ["şev", "4 meals"], ["ssudekurt", "4 meals"], ["ŞekerBademi", "4 meals"], ["gizemmercan", "4 meals"], ["rbsyda", "4 meals"], ["zeohablo", "3 meals"], ["cavdardan", "3 meals"], ["Buket", "3 meals"]],
  streak: [["ŞekerBademi", "367 days"], ["Beyzailcin", "338 days"], ["bengicokk", "326 days"], ["ayicikcadi", "171 days"], ["cookingforwellbeing", "120 days"], ["noasgard", "98 days"], ["şev", "86 days"], ["aylitt", "69 days"], ["Eril", "62 days"]],
  quote: "“No one is born a great cook. One learns by doing.”"
};
