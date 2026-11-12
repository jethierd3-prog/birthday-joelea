/* ============================================================
   ✏️  CHANGE THE BIRTHDAY DATE & TIME HERE (the only place)
   Format: "YYYY-MM-DDTHH:MM:SS+08:00"
   +08:00 = Philippine Time. Change it if her timezone differs.
   ============================================================ */
   const BIRTHDAY_TARGET = "2026-11-21T00:00:00+08:00";   // <-- placeholder, set the real date!

/* ✏️ Messages revealed when she touches a flower (edit freely) */
const TULIP_MESSAGES = [
  "Happy birthday, Joelea! I hope this new year brings you peace, joy, good health, and many reasons to smile.",
  "May you keep growing into the person God created you to be.",
  "Even on ordinary days, remember that your life has value.",
  "Your kindness matters, and you are appreciated more than you know.",
  "May God guide your steps and strengthen your faith.",
  "Keep shining in your own gentle way.",
  "Here's to meaningful memories, answered prayers, and beautiful new beginnings."
];
const LILY_MESSAGES = [
  "Thank you for being you.",
  "May your days be filled with people and moments that bring you closer to Him.",
  "You are loved, Joelea. 💜",
  "A whole year of reasons to smile is waiting for you.",
  "This birthday is the beginning of something beautiful."
];

const $ = (id) => document.getElementById(id);
const target = new Date(BIRTHDAY_TARGET).getTime();
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let unlocked = false, timer = null;

/* ---------- night sky ---------- */
(function makeSky() {
  const sky = $("sky"), n = innerWidth < 600 ? 55 : 110;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    const big = Math.random() < 0.12;
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;` +
      `width:${big ? 3 : 1 + Math.random()*1.5}px;height:${big ? 3 : 1 + Math.random()*1.5}px;` +
      `animation-delay:${Math.random()*6}s;animation-duration:${3 + Math.random()*4}s`;
    if (big) s.className = "glow";
    sky.appendChild(s);
  }
  if (reduceMotion) return;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement("b");
    p.textContent = "✦";
    p.style.cssText = `left:${Math.random()*100}%;font-size:${8 + Math.random()*8}px;` +
      `animation-delay:${-Math.random()*20}s;animation-duration:${16 + Math.random()*14}s`;
    sky.appendChild(p);
  }
})();

/* ---------- countdown ---------- */
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const diff = target - Date.now();          // recalculated from the real clock every time,
  if (isNaN(target) || diff <= 0) {          // so refreshing or a sleeping tab is always correct
    clearInterval(timer);
    showUnlock();
    return;
  }
  const t = Math.floor(diff / 1000);
  $("d").textContent = pad(Math.floor(t / 86400));
  $("h").textContent = pad(Math.floor(t % 86400 / 3600));
  $("m").textContent = pad(Math.floor(t % 3600 / 60));
  $("s").textContent = pad(t % 60);
}

function showUnlock() {
  ["d", "h", "m", "s"].forEach((k) => ($(k).textContent = "00"));
  $("clock").classList.add("done");
  $("hint").textContent = "The moment is here.";
  const b = $("unlock");
  b.hidden = false;
  requestAnimationFrame(() => b.classList.add("show"));
}

$("unlock").addEventListener("click", () => {
  if (Date.now() < target) return;           // re-check the clock: no skipping
  openGarden();
});

timer = setInterval(tick, 1000);
tick();

/* ---------- page 2 (built only after unlock) ---------- */
function openGarden() {
  if (unlocked) return;
  unlocked = true;
  const page = $("countdown-page"), garden = $("garden-page");
  garden.appendChild($("garden-tpl").content.cloneNode(true));
  buildTulips(); buildLilies(); setupEnvelope(); setupEnding();
  page.classList.add("leaving");
  setTimeout(() => {
    page.hidden = true;
    garden.hidden = false;
    document.body.classList.add("in-garden");
    scrollTo(0, 0);
    requestAnimationFrame(() => garden.classList.add("shown"));
  }, reduceMotion ? 0 : 900);
}

function setupEnvelope() {
  const env = $("envelope"), paper = $("paper");
  env.addEventListener("click", () => {
    const open = env.classList.toggle("open");
    paper.classList.toggle("open", open);
    env.setAttribute("aria-expanded", open);
    if (open) setTimeout(() => paper.scrollIntoView({ behavior: "smooth", block: "center" }), 700);
  });
}

function showMessage(btn, row, out, text) {
  row.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
  btn.classList.add("on");
  out.classList.remove("pop");
  void out.offsetWidth;
  out.textContent = text;
  out.classList.add("pop");
}

const TULIP_COLORS = [
  ["#c9a4ff", "#8a4fd6", "#b98bff"], ["#ffb8dc", "#e0529c", "#ff8fc7"], ["#ffffff", "#d9c8f5", "#efe6ff"],
  ["#b57edc", "#6d2fa8", "#a266e0"], ["#ffc9e6", "#f27bb7", "#ffa6d2"], ["#e6d6ff", "#a98be0", "#cdb4ff"], ["#d28bff", "#8a2be2", "#c070ff"]
];

function buildTulips() {
  const row = $("tulip-row"), out = $("tulip-msg");
  TULIP_MESSAGES.forEach((msg, i) => {
    const [c1, c2, g] = TULIP_COLORS[i % TULIP_COLORS.length];
    const b = document.createElement("button");
    b.type = "button"; b.className = "tulip";
    b.setAttribute("aria-label", `Tulip ${i + 1}: reveal a message`);
    b.style.cssText = `--c1:${c1};--c2:${c2};--g:${g};--h:${150 + (i * 37) % 60}px;--d:${-i * 0.9}s`;
    b.innerHTML = '<span class="stem"></span><span class="bloom"><span class="p1"></span><span class="p2"></span><span class="p3"></span></span>';
    b.addEventListener("click", () => showMessage(b, row, out, msg));
    row.appendChild(b);
  });
}

const LILY_COLORS = [["#fff", "#f3e8ff"], ["#e4d0ff", "#b794f4"], ["#ffd1e8", "#ff9ccd"], ["#fff", "#ffe0f0"], ["#efe0ff", "#c9a7ff"]];

function buildLilies() {
  const row = $("lily-row"), out = $("lily-msg");
  LILY_MESSAGES.forEach((msg, i) => {
    const [a, c] = LILY_COLORS[i % LILY_COLORS.length];
    const b = document.createElement("button");
    b.type = "button"; b.className = "lily";
    b.setAttribute("aria-label", `Lily ${i + 1}: reveal a message`);
    b.style.cssText = `--a:${a};--c:${c};--d:${-i * 1.3}s`;
    let petals = "";
    for (let k = 0; k < 6; k++) petals += `<span style="transform:rotate(${k * 60}deg)"></span>`;
    b.innerHTML = `<span class="lstem"></span><span class="lbloom">${petals}<em></em></span>`;
    b.addEventListener("click", () => showMessage(b, row, out, msg));
    row.appendChild(b);
  });
}

function setupEnding() {
  if (reduceMotion) return;
  const box = $("floaters"), icons = ["💜", "✦", "🌸", "💗", "✿"];
  const io = new IntersectionObserver(([e]) => {      // only animate while visible: keeps it light
    if (e.isIntersecting && !box.children.length) {
      for (let i = 0; i < 18; i++) {
        const f = document.createElement("span");
        f.textContent = icons[i % icons.length];
        f.style.cssText = `left:${Math.random()*100}%;font-size:${12 + Math.random()*14}px;` +
          `animation-delay:${-Math.random()*14}s;animation-duration:${10 + Math.random()*8}s`;
        box.appendChild(f);
      }
    }
    box.classList.toggle("run", e.isIntersecting);
  }, { threshold: 0.1 });
  io.observe($("ending"));
}
