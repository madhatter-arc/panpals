/* ==========================================================================
   PANPALS · KITCHEN SOUNDS
   Ses dosyası yok: bütün sesler tarayıcıda (Web Audio) üretilir.
   Varsayılan olarak KAPALI. Game Mode'daki hoparlör düğmesiyle açılır.
   ========================================================================== */

(function () {
  let ctx = null, master = null, amb = null;
  let enabled = false;
  try { enabled = localStorage.getItem("pp-sound") === "on"; } catch (e) {}

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noiseBuffer(sec) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function tone(freq, dur, type, gain, when) {
    const t = ctx.currentTime + (when || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }

  const SFX = {
    tick() { tone(1700, 0.04, "triangle", 0.08); },
    pop() {
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(620, t); o.frequency.exponentialRampToValueAtTime(260, t + 0.09);
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.15);
    },
    ding() { tone(1318, 0.9, "sine", 0.12); tone(2637, 0.6, "sine", 0.04); tone(1976, 0.5, "sine", 0.03, 0.01); },
    clang() { [420, 1133, 1887, 2840, 3910].forEach((f, i) => tone(f * (0.98 + Math.random() * 0.04), 1.3 - i * 0.18, "sine", 0.07 / (i * 0.6 + 1))); },
    knock() {
      const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noiseBuffer(0.08); f.type = "lowpass"; f.frequency.value = 600;
      g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      s.connect(f).connect(g).connect(master); s.start(t);
      tone(140, 0.08, "sine", 0.12);
    },
    page() {
      const t = ctx.currentTime, src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = noiseBuffer(0.35); f.type = "bandpass"; f.Q.value = 0.8; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(600, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      src.connect(f).connect(g).connect(master); src.start(t);
    },
    door() {
      const t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noiseBuffer(0.4); f.type = "bandpass"; f.frequency.setValueAtTime(300, t); f.frequency.linearRampToValueAtTime(900, t + 0.3);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.12, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      s.connect(f).connect(g).connect(master); s.start(t);
    }
  };

  /* Ambient: soft sizzle with little crackles */
  function startAmbient() {
    if (amb || !ensure()) return;
    const src = ctx.createBufferSource(); src.buffer = noiseBuffer(3); src.loop = true;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7000;
    const g = ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.011, ctx.currentTime + 1.5);
    src.connect(hp).connect(lp).connect(g).connect(master); src.start();
    const crackle = setInterval(() => {
      if (!ctx) return;
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const t = ctx.currentTime + Math.random() * 0.3, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), cg = ctx.createGain();
        s.buffer = noiseBuffer(0.02); f.type = "highpass"; f.frequency.value = 3000 + Math.random() * 3000;
        cg.gain.setValueAtTime(0.01 + Math.random() * 0.015, t); cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
        s.connect(f).connect(cg).connect(master); s.start(t);
      }
    }, 520);
    amb = { src, g, crackle };
  }
  function stopAmbient() {
    if (!amb) return;
    const a = amb; amb = null;
    clearInterval(a.crackle);
    a.g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => a.src.stop(), 500);
  }

  window.PP_SOUND = {
    get enabled() { return enabled; },
    set(on) {
      enabled = !!on;
      try { localStorage.setItem("pp-sound", enabled ? "on" : "off"); } catch (e) {}
      if (enabled) { ensure(); SFX.ding(); } else stopAmbient();
      document.dispatchEvent(new CustomEvent("pp:sound", { detail: enabled }));
    },
    toggle() { this.set(!enabled); },
    play(name) { if (!enabled || !SFX[name] || !ensure()) return; SFX[name](); },
    ambient(on) { if (on && enabled) startAmbient(); else stopAmbient(); }
  };
})();
