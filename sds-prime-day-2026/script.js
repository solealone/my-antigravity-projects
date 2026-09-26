/* ═══════════════════════════════════════════════════════════════
   SDS PRIME DAY 2026 — Engine V4
   TTS Voiceover · Achievement Spotlight · Better Music · 2 min
   ═══════════════════════════════════════════════════════════════ */
;(() => {
  'use strict';

  const TOTAL = 120_000;
  const SCENES = [
    { id: 'scene-1', start: 0,       dur: 12_000 },
    { id: 'scene-2', start: 12_000,  dur: 14_000 },
    { id: 'scene-3', start: 26_000,  dur: 28_000 },
    { id: 'scene-4', start: 54_000,  dur: 12_000 },
    { id: 'scene-5', start: 66_000,  dur: 28_000 },
    { id: 'scene-6', start: 94_000,  dur: 12_000 },
    { id: 'scene-7', start: 106_000, dur: 8_000  },
    { id: 'scene-8', start: 114_000, dur: 6_000  },
  ];

  /* ── DOM ── */
  const container   = document.getElementById('video-container');
  const playOverlay = document.getElementById('play-overlay');
  const playBtn     = document.getElementById('play-btn');
  const progressBar = document.getElementById('progress-bar');
  const timeDisplay = document.getElementById('time-display');
  const muteBtn     = document.getElementById('mute-btn');
  const subtitleBar = document.getElementById('subtitle-bar');
  const particleCvs = document.getElementById('particle-canvas');
  const confettiCvs = document.getElementById('confetti-canvas');

  /* ── STATE ── */
  let playing = false, startT = 0, elapsed = 0, curScene = -1;
  let animDone = new Set(), countersDone = new Set();
  let muted = false, audioCtx = null, masterGain = null;
  let cultureTimer = null, cultureIdx = 0;
  let quoteTimer = null, quoteIdx = 0;
  let achTimer = null, achIdx = 0;
  let currentUtterance = null;

  /* ════════════════════════════════════════════════════════════
     TTS VOICEOVER — Emotional Phrase Queue Engine
     Short phrases · Varying pitch/rate · Dramatic pauses
     ════════════════════════════════════════════════════════════ */
  let voiceRef = null;
  let phraseQueue = [];
  let phrasePlaying = false;
  let phraseAbort = false;

  // Voice scripts per scene: array of { text, pitch, rate, pause (ms after) }
  // pitch 1.0 = normal, >1 = brighter/excited, <1 = deeper/gravitas
  // rate 0.85 = slow emphasis, 0.95 = natural, 1.0 = brisk
  const VO_SCRIPTS = {
    'scene-1': [
      { text: 'Prime Day...', pitch: 0.92, rate: 0.82, pause: 800 },
      { text: 'is more than a peak season.', pitch: 0.95, rate: 0.88, pause: 600 },
      { text: 'It is when dedication meets opportunity,', pitch: 1.0, rate: 0.90, pause: 400 },
      { text: 'challenges become achievements,', pitch: 1.05, rate: 0.92, pause: 400 },
      { text: 'and teams come together to deliver excellence.', pitch: 1.08, rate: 0.88, pause: 900 },
      { text: 'Welcome, to the story of the SDS Prime Team,', pitch: 1.0, rate: 0.90, pause: 400 },
      { text: 'at Sutherland, Kochi.', pitch: 0.95, rate: 0.85, pause: 0 },
    ],
    'scene-2': [
      { text: 'Supporting Selling Partners,', pitch: 1.0, rate: 0.90, pause: 400 },
      { text: 'across the United States, Canada, and the United Kingdom.', pitch: 1.02, rate: 0.92, pause: 700 },
      { text: 'Our SDS team serves as a trusted partner,', pitch: 1.0, rate: 0.90, pause: 400 },
      { text: 'in helping sellers succeed.', pitch: 1.05, rate: 0.88, pause: 700 },
      { text: 'Built on customer obsession.', pitch: 0.95, rate: 0.85, pause: 500 },
      { text: 'And operational excellence.', pitch: 0.92, rate: 0.82, pause: 0 },
    ],
    'scene-3': [
      { text: 'This Prime season,', pitch: 1.0, rate: 0.88, pause: 500 },
      { text: 'our team raised the bar.', pitch: 1.08, rate: 0.85, pause: 800 },
      { text: 'Through relentless focus, and ownership,', pitch: 1.02, rate: 0.90, pause: 500 },
      { text: 'we achieved, remarkable results.', pitch: 1.1, rate: 0.86, pause: 900 },
      { text: 'Let us walk through, our key milestones.', pitch: 0.98, rate: 0.88, pause: 0 },
    ],
    'scene-4': [
      { text: 'Together,', pitch: 0.95, rate: 0.82, pause: 600 },
      { text: 'we celebrated victories, both big, and small.', pitch: 1.02, rate: 0.88, pause: 700 },
      { text: 'Our team members earned recognition,', pitch: 1.05, rate: 0.90, pause: 400 },
      { text: 'for outstanding performance, and dedication.', pitch: 1.08, rate: 0.86, pause: 0 },
    ],
    'scene-5': [
      { text: 'Behind every achievement,', pitch: 0.95, rate: 0.85, pause: 600 },
      { text: 'is a culture built on trust, support, and teamwork.', pitch: 1.02, rate: 0.88, pause: 800 },
      { text: 'From cake cutting ceremonies,', pitch: 1.05, rate: 0.92, pause: 300 },
      { text: 'and biriyani feasts,', pitch: 1.08, rate: 0.90, pause: 300 },
      { text: 'to PS5 gaming tournaments!', pitch: 1.12, rate: 0.95, pause: 700 },
      { text: 'We strengthened the bonds, that make us one team.', pitch: 1.0, rate: 0.88, pause: 900 },
      { text: 'Because when people thrive,', pitch: 0.95, rate: 0.82, pause: 500 },
      { text: 'performance follows.', pitch: 0.92, rate: 0.80, pause: 0 },
    ],
    'scene-7': [
      { text: 'Happy Prime Day, Twenty Twenty Six!', pitch: 1.15, rate: 0.92, pause: 800 },
      { text: 'One Team.', pitch: 1.05, rate: 0.82, pause: 500 },
      { text: 'One Goal.', pitch: 1.08, rate: 0.82, pause: 500 },
      { text: 'One Prime!', pitch: 1.15, rate: 0.80, pause: 0 },
    ],
    'scene-8': [
      { text: 'Thank you, Atlantic Team.', pitch: 1.0, rate: 0.85, pause: 800 },
      { text: 'Together we support.', pitch: 1.02, rate: 0.85, pause: 400 },
      { text: 'Together we succeed.', pitch: 1.05, rate: 0.85, pause: 400 },
      { text: 'Together, we Prime.', pitch: 1.1, rate: 0.80, pause: 0 },
    ],
  };

  function getVoice() {
    if (voiceRef) return voiceRef;
    const voices = window.speechSynthesis.getVoices();
    voiceRef = voices.find(v => v.name.includes('Samantha')) ||
               voices.find(v => v.name.includes('Google UK English Female')) ||
               voices.find(v => v.name.includes('Karen')) ||
               voices.find(v => v.name.includes('Moira')) ||
               voices.find(v => v.name.includes('Google US English')) ||
               voices.find(v => v.name.includes('Daniel')) ||
               voices.find(v => v.lang.startsWith('en') && v.localService) ||
               voices.find(v => v.lang.startsWith('en'));
    return voiceRef;
  }

  function speakPhrases(sceneId) {
    const script = VO_SCRIPTS[sceneId];
    if (!script || !('speechSynthesis' in window)) return;
    stopSpeech();
    phraseAbort = false;
    phraseQueue = [...script];
    speakNext();
  }

  function speakNext() {
    if (phraseAbort || !phraseQueue.length || !playing) {
      phrasePlaying = false;
      subtitleBar.classList.remove('visible');
      return;
    }
    phrasePlaying = true;
    const phrase = phraseQueue.shift();

    const u = new SpeechSynthesisUtterance(phrase.text);
    u.rate   = phrase.rate || 0.90;
    u.pitch  = phrase.pitch || 1.0;
    u.volume = muted ? 0 : 0.95;
    const v = getVoice();
    if (v) u.voice = v;

    // Show subtitle with the phrase
    subtitleBar.textContent = phrase.text.replace(/,/g, '');
    subtitleBar.classList.add('visible');

    u.onend = () => {
      currentUtterance = null;
      if (phraseAbort) { subtitleBar.classList.remove('visible'); return; }
      // Pause before next phrase for dramatic effect
      const pause = phrase.pause || 300;
      if (pause > 200) subtitleBar.classList.remove('visible');
      setTimeout(speakNext, pause);
    };
    u.onerror = () => {
      currentUtterance = null;
      subtitleBar.classList.remove('visible');
      setTimeout(speakNext, 300);
    };

    currentUtterance = u;
    window.speechSynthesis.speak(u);
  }

  function stopSpeech() {
    phraseAbort = true;
    phraseQueue = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    subtitleBar.classList.remove('visible');
    currentUtterance = null;
    phrasePlaying = false;
  }

  // Pre-load voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { voiceRef = null; window.speechSynthesis.getVoices(); };
  }

  /* ════════════════════════════════════════════════════════════
     MUSIC ENGINE  (Web Audio API — 105 BPM Upbeat Corporate)
     ════════════════════════════════════════════════════════════ */
  const BPM = 105, BEAT = 60/BPM, BAR = BEAT*4;
  const CHORDS    = [[130.8,164.8,196],[110,130.8,164.8],[87.3,110,130.8],[98,123.5,146.8]];
  const ARP_NOTES = [[261.6,329.6,392,523.3],[220,261.6,329.6,440],[174.6,220,261.6,349.2],[196,246.9,293.7,392]];
  const BASS      = [130.8, 110, 87.3, 98];

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.25; // Lower so TTS is clear
    masterGain.connect(audioCtx.destination);
  }

  function playPad(freq, t, dur, vol) {
    for (const det of [-5, 5]) {
      const o = audioCtx.createOscillator();
      o.type = 'sine'; o.frequency.value = freq; o.detune.value = det;
      const lp = audioCtx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.7;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.8);
      g.gain.setValueAtTime(vol, t + dur - 1);
      g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(lp); lp.connect(g); g.connect(masterGain);
      o.start(t); o.stop(t + dur + 0.1);
    }
  }

  function playNote(freq, t, dur, vol) {
    const o = audioCtx.createOscillator();
    o.type = 'triangle'; o.frequency.value = freq;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function playBass(freq, t, dur, vol) {
    const o = audioCtx.createOscillator();
    o.type = 'sine'; o.frequency.value = freq;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.2);
    g.gain.setValueAtTime(vol, t + dur - 0.3);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function playKick(t, vol) {
    const o = audioCtx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(60, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.1);
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.2);
  }

  function playHihat(t, vol) {
    const len = ~~(audioCtx.sampleRate * 0.05);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = audioCtx.createBufferSource(); n.buffer = buf;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 8000; bp.Q.value = 2;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(bp); bp.connect(g); g.connect(masterGain);
    n.start(t); n.stop(t + 0.06);
  }

  // Soft snare on beat 3 for groove
  function playSnare(t, vol) {
    const len = ~~(audioCtx.sampleRate * 0.08);
    const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = audioCtx.createBufferSource(); n.buffer = buf;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 1;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    n.connect(bp); bp.connect(g); g.connect(masterGain);
    n.start(t); n.stop(t + 0.12);
  }

  function buildMusic() {
    const t0 = audioCtx.currentTime + 0.1;
    const totalBars = Math.ceil(TOTAL / 1000 / BAR);

    for (let bar = 0; bar < totalBars; bar++) {
      const bs = t0 + bar * BAR;
      const ci = bar % 4;
      const progress = bar / totalBars;
      const padVol = 0.05 + progress * 0.06;

      // Pads — always
      CHORDS[ci].forEach(f => playPad(f, bs, BAR + 0.3, padVol));

      // Bass — from bar 2
      if (bar >= 2) playBass(BASS[ci], bs, BAR, progress > 0.5 ? 0.10 : 0.07);

      // Arpeggios — from bar 4
      if (bar >= 4) {
        const arpVol = progress > 0.5 ? 0.05 : 0.035;
        for (let n = 0; n < 4; n++) playNote(ARP_NOTES[ci][n], bs + n * BEAT, BEAT * 0.8, arpVol);
      }

      // Kick — from bar 4 (1,3); from bar 8 (all 4)
      if (bar >= 4) {
        const beats = bar >= 8 ? [0, 1, 2, 3] : [0, 2];
        beats.forEach(b => playKick(bs + b * BEAT, 0.12));
      }

      // Snare on beat 3 — from bar 6
      if (bar >= 6) playSnare(bs + 2 * BEAT, 0.06);

      // Hi-hat — from bar 6
      if (bar >= 6) {
        for (let b = 0; b < 4; b++) {
          playHihat(bs + b * BEAT + BEAT * 0.5, 0.035);
          if (bar >= 10) playHihat(bs + b * BEAT, 0.02);
        }
      }
    }

    // Final 6s fade
    const fadeStart = t0 + (TOTAL / 1000) - 6;
    masterGain.gain.setValueAtTime(0.25, fadeStart);
    masterGain.gain.linearRampToValueAtTime(0, t0 + TOTAL / 1000);
  }

  /* ════════════════════════════════════════════════════════════
     PARTICLES & CONFETTI
     ════════════════════════════════════════════════════════════ */
  class Particles {
    constructor(cvs) {
      this.cvs = cvs; this.ctx = cvs.getContext('2d'); this.pts = [];
      this.resize(); window.addEventListener('resize', () => this.resize());
    }
    resize() { this.w = this.cvs.width = innerWidth; this.h = this.cvs.height = innerHeight; }
    init(n = 50) {
      this.pts = Array.from({ length: n }, () => ({
        x: Math.random() * this.w, y: Math.random() * this.h,
        vx: (Math.random() - .5) * .25, vy: -(Math.random() * .35 + .08),
        r: Math.random() * 1.8 + .4, a: Math.random() * .35 + .06,
        hue: 25 + Math.random() * 28, ph: Math.random() * Math.PI * 2, ps: Math.random() * .015 + .004,
      }));
    }
    draw() {
      const c = this.ctx; c.clearRect(0, 0, this.w, this.h);
      for (const p of this.pts) {
        p.x += p.vx; p.y += p.vy; p.ph += p.ps;
        if (p.y < -10) p.y = this.h + 10;
        if (p.x < -10) p.x = this.w + 10;
        if (p.x > this.w + 10) p.x = -10;
        const a = p.a * (.55 + .45 * Math.sin(p.ph));
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = `hsla(${p.hue},90%,58%,${a})`; c.fill();
        c.beginPath(); c.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        c.fillStyle = `hsla(${p.hue},90%,58%,${a * .15})`; c.fill();
      }
    }
  }

  class Confetti {
    constructor(cvs) {
      this.cvs = cvs; this.ctx = cvs.getContext('2d'); this.pcs = []; this.on = false;
      this.resize(); window.addEventListener('resize', () => this.resize());
    }
    resize() { this.w = this.cvs.width = innerWidth; this.h = this.cvs.height = innerHeight; }
    fire(n = 220) {
      this.on = true; this.pcs = [];
      const cols = ['#FF9900','#FFD700','#FF6B35','#146EB4','#69F0AE','#fff','#FF4081','#AB47BC'];
      for (let i = 0; i < n; i++) this.pcs.push({
        x: this.w*.5+(Math.random()-.5)*this.w*.4, y: this.h*.35,
        vx: (Math.random()-.5)*14, vy: -(Math.random()*16+5),
        w: Math.random()*10+4, h: Math.random()*6+3,
        rot: Math.random()*360, rv: (Math.random()-.5)*14,
        col: cols[~~(Math.random()*cols.length)], g: .14+Math.random()*.1, dr: .98+Math.random()*.015,
      });
    }
    draw() {
      if (!this.on) return;
      const c = this.ctx; c.clearRect(0, 0, this.w, this.h);
      let alive = 0;
      for (const p of this.pcs) {
        p.vy += p.g; p.vx *= p.dr; p.x += p.vx; p.y += p.vy; p.rot += p.rv;
        if (p.y > this.h + 50) continue; alive++;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot * Math.PI / 180);
        c.fillStyle = p.col; c.fillRect(-p.w/2, -p.h/2, p.w, p.h); c.restore();
      }
      if (!alive) this.on = false;
    }
  }

  /* ════════════════════════════════════════════════════════════
     COUNTER ANIMATION
     ════════════════════════════════════════════════════════════ */
  function animCounter(el) {
    const tgt = parseFloat(el.dataset.target);
    const from = parseFloat(el.dataset.start || '0');
    const sfx = el.dataset.suffix || '';
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1200;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = (from + (tgt - from) * e).toFixed(dec) + sfx;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ════════════════════════════════════════════════════════════
     ACHIEVEMENT SPOTLIGHT (Scene 3 — one by one)
     ════════════════════════════════════════════════════════════ */
  const ACH_INTERVAL = 4300; // ms per achievement

  function startAchievements() {
    const slides = document.querySelectorAll('.ach-slide');
    const dots   = document.querySelectorAll('.ach-dot');
    if (!slides.length) return;
    achIdx = 0;
    showAch(slides, dots, 0);
    achTimer = setInterval(() => {
      achIdx = (achIdx + 1) % slides.length;
      showAch(slides, dots, achIdx);
    }, ACH_INTERVAL);
  }

  function showAch(slides, dots, idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    // Trigger counter on the newly active slide
    const activeSlide = slides[idx];
    activeSlide.querySelectorAll('.counter').forEach(c => {
      if (!countersDone.has(c)) { countersDone.add(c); setTimeout(() => animCounter(c), 300); }
    });
  }

  function stopAchievements() { clearInterval(achTimer); achTimer = null; }

  /* ════════════════════════════════════════════════════════════
     CULTURE SLIDESHOW (Scene 5)
     ════════════════════════════════════════════════════════════ */
  function startCulture() {
    const slides = document.querySelectorAll('.culture-slide');
    if (!slides.length) return;
    cultureIdx = 0;
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    cultureTimer = setInterval(() => {
      slides[cultureIdx].classList.remove('active');
      cultureIdx = (cultureIdx + 1) % slides.length;
      slides[cultureIdx].classList.add('active');
    }, 6500);
  }
  function stopCulture() { clearInterval(cultureTimer); cultureTimer = null; }

  /* ════════════════════════════════════════════════════════════
     QUOTE CAROUSEL (Scene 6)
     ════════════════════════════════════════════════════════════ */
  function startQuotes() {
    const cards = document.querySelectorAll('.quote-card');
    if (!cards.length) return;
    quoteIdx = 0;
    cards.forEach((c, i) => c.classList.toggle('active', i === 0));
    quoteTimer = setInterval(() => {
      cards[quoteIdx].classList.remove('active');
      quoteIdx = (quoteIdx + 1) % cards.length;
      cards[quoteIdx].classList.add('active');
    }, 2800);
  }
  function stopQuotes() { clearInterval(quoteTimer); quoteTimer = null; document.querySelectorAll('.quote-card').forEach(c => c.classList.remove('active')); }

  /* ════════════════════════════════════════════════════════════
     SCENE MANAGEMENT
     ════════════════════════════════════════════════════════════ */
  let voSpoken = new Set(); // Track which scene VO has been spoken

  function goScene(idx) {
    if (idx === curScene) return;
    // Deactivate previous
    if (curScene >= 0) {
      const prev = document.getElementById(SCENES[curScene].id);
      if (prev) prev.classList.remove('active');
      if (SCENES[curScene].id === 'scene-3') stopAchievements();
      if (SCENES[curScene].id === 'scene-5') stopCulture();
      if (SCENES[curScene].id === 'scene-6') stopQuotes();
    }
    curScene = idx;
    const el = document.getElementById(SCENES[idx].id);
    if (el) el.classList.add('active');

    // Scene-specific hooks
    if (SCENES[idx].id === 'scene-3') setTimeout(startAchievements, 1200);
    if (SCENES[idx].id === 'scene-5') setTimeout(startCulture, 600);
    if (SCENES[idx].id === 'scene-6') setTimeout(startQuotes, 500);
    if (SCENES[idx].id === 'scene-7') setTimeout(() => confetti.fire(220), 400);

    // Speak voiceover phrases for this scene (once)
    if (!voSpoken.has(idx)) {
      voSpoken.add(idx);
      const sceneId = SCENES[idx].id;
      if (VO_SCRIPTS[sceneId]) {
        setTimeout(() => {
          if (playing) speakPhrases(sceneId);
        }, 1200); // 1.2s delay for scene to settle before VO starts
      }
    }
  }

  function processAnims(sceneId, sElapsed) {
    const sel = document.getElementById(sceneId);
    if (!sel) return;

    sel.querySelectorAll('[data-anim]').forEach(el => {
      if (animDone.has(el)) return;
      const delay = parseInt(el.dataset.delay || '0', 10);
      if (sElapsed < delay) return;
      animDone.add(el);

      const type = el.dataset.anim;
      if (type === 'staggerIn') {
        el.style.opacity = '1';
        Array.from(el.children).forEach((ch, i) => {
          ch.style.opacity = '0'; ch.style.transform = 'translateY(18px)';
          setTimeout(() => {
            ch.style.transition = 'opacity .55s var(--ease-expo), transform .55s var(--ease-expo)';
            ch.style.opacity = '1'; ch.style.transform = 'translateY(0)';
          }, i * 200);
        });
      } else {
        el.classList.add('anim-' + type);
      }

      // Counters inside
      el.querySelectorAll('.counter').forEach(c => {
        if (!countersDone.has(c)) { countersDone.add(c); setTimeout(() => animCounter(c), 200); }
      });
    });
  }

  /* ════════════════════════════════════════════════════════════
     MAIN LOOP
     ════════════════════════════════════════════════════════════ */
  const particles = new Particles(particleCvs);
  const confetti  = new Confetti(confettiCvs);
  particles.init(50);

  function tick() {
    requestAnimationFrame(tick);
    particles.draw();
    confetti.draw();
    if (!playing) return;

    elapsed = performance.now() - startT;
    if (elapsed >= TOTAL) { elapsed = TOTAL; playing = false; container.classList.remove('playing'); stopSpeech(); }

    progressBar.style.width = (elapsed / TOTAL * 100) + '%';
    const sec = ~~(elapsed / 1000), m = ~~(sec / 60), s = sec % 60;
    timeDisplay.textContent = `${m}:${String(s).padStart(2,'0')} / 2:00`;

    for (let i = SCENES.length - 1; i >= 0; i--) {
      if (elapsed >= SCENES[i].start) {
        goScene(i);
        processAnims(SCENES[i].id, elapsed - SCENES[i].start);
        break;
      }
    }
  }

  /* ════════════════════════════════════════════════════════════
     CONTROLS
     ════════════════════════════════════════════════════════════ */
  function play() {
    playOverlay.classList.add('hidden');
    playing = true;
    startT  = performance.now() - elapsed;
    container.classList.add('playing');
    document.querySelectorAll('.letterbox').forEach(b => b.classList.add('open'));

    if (!audioCtx) { initAudio(); buildMusic(); }
    else if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  playBtn.addEventListener('click', play);
  // Don't auto-play on overlay click — let buttons handle it
  playOverlay.addEventListener('click', (e) => {
    if (e.target === playOverlay || e.target.closest('.play-overlay__inner') && !e.target.closest('#record-btn')) play();
  });

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.25;
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!playing && elapsed === 0) play();
      else if (playing) {
        playing = false; container.classList.remove('playing');
        if (audioCtx) audioCtx.suspend();
        stopSpeech();
      } else {
        playing = true; startT = performance.now() - elapsed;
        container.classList.add('playing');
        if (audioCtx) audioCtx.resume();
      }
    }
    if (e.code === 'KeyM') muteBtn.click();
  });

  /* ════════════════════════════════════════════════════════════
     SCREEN RECORDING & DOWNLOAD
     ════════════════════════════════════════════════════════════ */
  const recordBtn    = document.getElementById('record-btn');
  const recIndicator = document.getElementById('rec-indicator');
  let mediaRecorder  = null;
  let recordedChunks = [];

  async function startRecording() {
    try {
      // Capture the current tab (screen + tab audio)
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,               // Capture tab audio (music)
        preferCurrentTab: true,     // Chrome 109+ — prefer this tab
        selfBrowserSurface: 'include',
      });

      // If Web Audio is running, mix it in via destination stream
      let combinedStream = displayStream;
      if (audioCtx && audioCtx.state === 'running') {
        const dest = audioCtx.createMediaStreamDestination();
        masterGain.connect(dest);
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length && !displayStream.getAudioTracks().length) {
          audioTracks.forEach(t => combinedStream.addTrack(t));
        }
      }

      recordedChunks = [];
      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : 'video/webm',
        videoBitsPerSecond: 5_000_000,
      });

      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };

      mediaRecorder.onstop = () => {
        recIndicator.classList.remove('visible');
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'SDS_Prime_Day_2026.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);

        // Clean up tracks
        combinedStream.getTracks().forEach(t => t.stop());
      };

      // Stop when user ends share
      displayStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      };

      mediaRecorder.start(1000); // chunk every second
      recIndicator.classList.add('visible');

      // Start the presentation
      play();

      // Auto-stop after presentation ends + 2s buffer
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      }, TOTAL + 2000);

    } catch (err) {
      console.warn('Recording cancelled or failed:', err);
      alert('Recording was cancelled. To record:\n\n1. Click "Record & Download"\n2. In the popup, select this tab\n3. Check "Share tab audio"\n4. Click Share\n\nThe presentation will play and auto-download when done.');
    }
  }

  if (recordBtn) recordBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startRecording();
  });

  // Also stop recording when presentation finishes
  const origTick = tick;
  const endCheck = () => {
    if (elapsed >= TOTAL && mediaRecorder && mediaRecorder.state === 'recording') {
      setTimeout(() => mediaRecorder.stop(), 1500);
    }
  };

  tick();
})();
