/* Convertix Studio — Production Client Engine & Theme Architecture
   Pure Vanilla JS. 60fps requestAnimationFrame tracking. Zero external dependencies. */
(() => {
  'use strict';

  const AGENCY_PHONE = '917410123901';
  const AGENCY_EMAIL = 'zabir.ali.52@gmail.com';

  const PRICING = {
    INR: {
      corePrice: '₹1,000',
      btnText: '₹1,000',
      headerText: 'Get Site for ₹1,000',
      avgTicket: 1500
    },
    USD: {
      corePrice: '$15',
      btnText: '$15',
      headerText: 'Get Site for $15',
      avgTicket: 75
    }
  };

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  let currentCurrency = 'INR';
  let currentTheme = 'obsidian';

  /* ---------------- 1. Theme Engine ---------------- */

  const THEME_CHORDS = {
    obsidian: [440, 660],
    midnight: [523.25, 783.99],
    emerald: [587.33, 880]
  };

  window.setTheme = function(themeName, silent = false) {
    currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);

    $$('.theme-btn').forEach(btn => {
      const isActive = btn.dataset.themeChoice === themeName;
      btn.classList.toggle('bg-white/20', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-slate-400', !isActive);
    });

    if (window.ambientCanvas) {
      window.ambientCanvas.setTheme(themeName);
    }

    if (!silent && window.soundEngine) {
      window.soundEngine.playChord(THEME_CHORDS[themeName] || [440, 660], 0.08);
    }

    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: themeName } }));

    try {
      localStorage.setItem('convertix-theme', themeName);
    } catch (_) {}
  };

  function initTheme() {
    let saved = 'obsidian';
    try {
      saved = localStorage.getItem('convertix-theme') || 'obsidian';
    } catch (_) {}
    window.setTheme(saved, true);
  }

  /* ---------------- 2. Currency Engine ---------------- */

  window.setCurrency = function(currency) {
    if (!PRICING[currency]) return;
    currentCurrency = currency;
    const p = PRICING[currency];

    $$('.price-tag').forEach(el => { el.textContent = p.corePrice; });
    $$('.price-btn-text').forEach(el => { el.textContent = p.btnText; });
    $$('.price-header-text').forEach(el => { el.textContent = p.headerText; });

    $$('[data-currency]').forEach(btn => {
      const active = btn.dataset.currency === currency;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('bg-emerald-500', active);
      btn.classList.toggle('text-slate-950', active);
      btn.classList.toggle('font-bold', active);
      btn.classList.toggle('text-slate-300', !active);
    });

    updateRoiCalculator();

    try {
      localStorage.setItem('convertix-currency', currency);
    } catch (_) {}
  };

  function initCurrency() {
    let saved = 'INR';
    try {
      saved = localStorage.getItem('convertix-currency') || 'INR';
    } catch (_) {}
    window.setCurrency(saved);
  }

  /* ---------------- 3. Interactive Demo Modal & Viewports ---------------- */

  const DEMO_MAP = {
    dental: {
      title: 'me.aid Dental & Implant Care (Healthcare Demo)',
      url: 'demos/dental.html',
      msg: 'Hi, I want a website like the me.aid Dental clinic demo for ₹1,000.'
    },
    trucking: {
      title: 'T.ROAD Heavy Freight & Logistics Demo',
      url: 'demos/trucking.html',
      msg: 'Hi, I want a website like the T.ROAD Freight Logistics demo for ₹1,000.'
    },
    cafe: {
      title: 'T.ROAD Freight & Logistics Demo (Legacy Cafe Mirror)',
      url: 'demos/trucking.html',
      msg: 'Hi, I want a website like the T.ROAD Freight Logistics demo for ₹1,000.'
    },
    restaurant: {
      title: 'Chix Kitchen Gourmet Fast Food Diner Demo',
      url: 'demos/restaurant.html',
      msg: 'Hi, I want a website like the Chix Kitchen Fast Food demo for ₹1,000.'
    },
    interiors: {
      title: 'Chix Kitchen Diner Demo (Legacy Interiors Mirror)',
      url: 'demos/restaurant.html',
      msg: 'Hi, I want a website like the Chix Kitchen Fast Food demo for ₹1,000.'
    },
    // Open Source Modules
    bookings: {
      title: 'OpenBook — Open-Source Calendar Booking App',
      url: 'modules/bookings.html',
      msg: 'Hi, I want the Open-Source Bookings module integrated into my website.'
    },
    forms: {
      title: 'OpenForms — Open-Source Multi-Step Intake Engine',
      url: 'modules/forms.html',
      msg: 'Hi, I want the Open-Source Multi-Step Forms module integrated into my website.'
    },
    store: {
      title: 'OpenStore — Open-Source E-Commerce & WhatsApp Cart',
      url: 'modules/store.html',
      msg: 'Hi, I want the Open-Source E-Commerce Store module integrated into my website.'
    },
    blog: {
      title: 'OpenBlog — Open-Source Markdown Publishing Engine',
      url: 'modules/blog.html',
      msg: 'Hi, I want the Open-Source Blog module integrated into my website.'
    },
    events: {
      title: 'OpenEvents — Open-Source Ticketing & RSVP Engine',
      url: 'modules/events.html',
      msg: 'Hi, I want the Open-Source Event Ticketing module integrated into my website.'
    }
  };

  const demoModal = $('#demo-modal');
  const demoIframe = $('#demo-iframe');
  const demoTitle = $('#demo-modal-title');
  const demoLink = $('#demo-external-link');
  const demoOrder = $('#demo-order-btn');
  const frameWrapper = $('#demo-frame-wrapper');
  const btnMob = $('#view-mobile');
  const btnDesk = $('#view-desktop');

  window.openDemoModal = function(key) {
    const item = DEMO_MAP[key];
    if (!item || !demoModal || !demoIframe) return;

    if (demoTitle) demoTitle.textContent = item.title;
    demoIframe.src = item.url;
    if (demoLink) demoLink.href = item.url;
    if (demoOrder) {
      demoOrder.href = `https://wa.me/${AGENCY_PHONE}?text=${encodeURIComponent(item.msg)}`;
    }

    demoModal.classList.remove('hidden');
    demoModal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (window.soundEngine) {
      window.soundEngine.playSweep(true);
    }
  };

  window.closeDemoModal = function() {
    if (!demoModal) return;
    demoModal.classList.add('hidden');
    demoModal.classList.remove('flex');
    if (demoIframe) demoIframe.src = 'about:blank';
    document.body.style.overflow = '';

    if (window.soundEngine) {
      window.soundEngine.playSweep(false);
    }
  };

  window.setDemoViewport = function(mode) {
    if (!frameWrapper) return;
    if (mode === 'mobile') {
      frameWrapper.className = 'w-full max-w-[390px] h-[95%] rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden bg-slate-900 transition-all duration-300';
      if (btnMob) btnMob.className = 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm';
      if (btnDesk) btnDesk.className = 'px-2.5 py-1 rounded-lg text-slate-300 hover:text-white font-medium text-xs';
    } else {
      frameWrapper.className = 'w-full h-full max-w-full rounded-xl overflow-hidden border border-white/10 shadow-inner bg-slate-900 transition-all duration-300';
      if (btnDesk) btnDesk.className = 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm';
      if (btnMob) btnMob.className = 'px-2.5 py-1 rounded-lg text-slate-300 hover:text-white font-medium text-xs';
    }
  };

  // Bind click handlers
  $$('[data-open-demo]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      window.openDemoModal(el.dataset.openDemo);
    });
  });

  if (demoModal) {
    demoModal.addEventListener('click', e => {
      if (e.target === demoModal) window.closeDemoModal();
    });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && demoModal && !demoModal.classList.contains('hidden')) {
      window.closeDemoModal();
    }
  });

  // Inline Card Viewport Switcher (Desktop / Mobile)
  $$('.preview-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetKey = btn.getAttribute('data-preview-target');
      const mode = btn.getAttribute('data-preview-mode');
      const group = btn.closest('[role="group"]');
      if (group) {
        group.querySelectorAll('.preview-toggle').forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
      }
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const shell = document.querySelector(`[data-preview-shell="${targetKey}"]`);
      if (shell) {
        if (mode === 'mobile') {
          shell.classList.add('is-mobile');
        } else {
          shell.classList.remove('is-mobile');
        }
      }
      if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
        window.soundEngine.playClick();
      }
    });
  });

  /* ---------------- 4. Lost Revenue ROI Calculator ---------------- */

  const leadsSlider = $('#leads-range');
  const sliderVal = $('#slider-leads-val');
  const lostRevDisplay = $('#calc-lost-revenue');

  function updateRoiCalculator() {
    if (!leadsSlider || !lostRevDisplay) return;
    const leads = Number.parseInt(leadsSlider.value, 10) || 20;
    if (sliderVal) sliderVal.textContent = leads;

    const p = PRICING[currentCurrency];
    const monthlyLeads = leads * 4;
    // 60% missed, 20% would have converted
    const lost = Math.round(monthlyLeads * 0.6 * 0.2 * p.avgTicket);

    lostRevDisplay.textContent = currentCurrency === 'INR'
      ? `₹${lost.toLocaleString('en-IN')} / mo`
      : `$${lost.toLocaleString('en-US')} / mo`;
  }

  if (leadsSlider) {
    leadsSlider.addEventListener('input', updateRoiCalculator);
  }

  /* ---------------- 5. 24/7 AI Chat Simulator ---------------- */

  const chatMessages = $('#chat-messages');
  const chatInput = $('#chat-user-input');

  const SIMULATED_RESPONSES = {
    'emergency': 'We treat toothache emergencies immediately! Dr. Sharma has open slots today at 2:30 PM and 5:00 PM. Would you like me to book your name right now?',
    'price': 'Our transparent fee starts at ₹200 for full consultation & digital X-ray. Teeth cleaning is ₹800. What treatment are you inquiring about?',
    'hours': 'The clinic is open 7 days a week from 9:00 AM to 8:30 PM. Would you like to reserve a slot?',
    'default': 'Hello! Thanks for reaching out to Apex Dental. Dr. Sharma is currently in surgery, but I can answer questions or confirm your appointment instantly. What is your name?'
  };

  window.simulateChatMessage = function(promptText) {
    if (!chatMessages) return;
    if (!promptText || !promptText.trim()) return;
    promptText = promptText.trim();

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'flex justify-end';
    userMsg.innerHTML = `<div class="bg-indigo-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs max-w-[80%]">${promptText}</div>`;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Show Typing Indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'flex justify-start items-center gap-1.5 p-2 text-slate-400 text-xs';
    typingIndicator.innerHTML = `<span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span><span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0.15s"></span><span class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style="animation-delay:0.3s"></span>`;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingIndicator.remove();
      let reply = SIMULATED_RESPONSES.default;
      const lower = promptText.toLowerCase();
      if (lower.includes('emergency') || lower.includes('pain') || lower.includes('urgent')) reply = SIMULATED_RESPONSES.emergency;
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('fee')) reply = SIMULATED_RESPONSES.price;
      else if (lower.includes('hour') || lower.includes('timing') || lower.includes('open')) reply = SIMULATED_RESPONSES.hours;

      const botMsg = document.createElement('div');
      botMsg.className = 'flex justify-start';
      botMsg.innerHTML = `<div class="bg-slate-800 text-slate-200 border border-white/10 px-3.5 py-2 rounded-2xl rounded-tl-sm text-xs max-w-[85%] leading-relaxed">${reply}</div>`;
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 900);
  };

  window.submitChatMessage = function() {
    const chatInput = document.getElementById('chat-user-input');
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;
    window.simulateChatMessage(text);
    chatInput.value = '';
  };

  /* ---------------- 6. Advanced Project Intake Form ---------------- */

  const leadForm = $('#lead-form');
  const leadStatus = $('#lead-status');
  const leadBtn = $('#lead-submit-btn');

  if (leadForm) {
    leadForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!leadForm.checkValidity()) {
        leadForm.reportValidity();
        return;
      }

      const p = PRICING[currentCurrency];
      const bizName = $('#intake-biz-name')?.value.trim() || '';
      const category = $('#intake-category')?.value || '';
      const city = $('#intake-city')?.value.trim() || '';
      const phone = $('#intake-phone')?.value.trim() || '';
      const details = $('#intake-details')?.value.trim() || 'Standard 1-page high-converting website';

      const whatsappMsg = [
        '*New Website Project Request (Convertix Studio)* 🚀',
        '',
        `• *Business Name:* ${bizName}`,
        `• *Category:* ${category}`,
        `• *Location:* ${city}`,
        `• *WhatsApp/Phone:* ${phone}`,
        `• *Project Specifications:* ${details}`,
        `• *Terms:* ${p.corePrice} (Pay 100% AFTER Delivery)`,
        '',
        'Hi, please review my project requirements and build my live preview!'
      ].join('\n');

      if (leadBtn) leadBtn.disabled = true;
      if (leadStatus) leadStatus.textContent = 'Opening WhatsApp…';

      const waUrl = `https://wa.me/${AGENCY_PHONE}?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(waUrl, '_blank', 'noopener');

      // Netlify Form background capture
      const formData = new FormData(leadForm);
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
      } catch (_) {}

      if (leadStatus) {
        leadStatus.textContent = 'WhatsApp opened! If not opened, contact zabir.ali.52@gmail.com directly.';
      }
      if (leadBtn) leadBtn.disabled = false;
    });
  }

  /* ---------------- 7. Fluid Aurora Ambient Canvas Engine ---------------- */

  const THEME_AURORA_PALETTES = {
    obsidian: [
      { r: 122, g: 100, b: 255, a: 0.38, rx: 0.30, ry: 0.26, speedX: 0.0006, speedY: 0.0008, phaseX: 0, phaseY: 1.2, baseX: 0.25, baseY: 0.3 },
      { r: 255, g: 51, b: 122, a: 0.32, rx: 0.28, ry: 0.30, speedX: 0.0007, speedY: 0.0005, phaseX: 2.1, phaseY: 0.5, baseX: 0.75, baseY: 0.35 },
      { r: 94, g: 151, b: 255, a: 0.28, rx: 0.32, ry: 0.24, speedX: 0.0005, speedY: 0.0009, phaseX: 4.2, phaseY: 3.1, baseX: 0.65, baseY: 0.75 },
      { r: 16, g: 185, b: 129, a: 0.22, rx: 0.24, ry: 0.26, speedX: 0.0008, speedY: 0.0006, phaseX: 1.5, phaseY: 4.5, baseX: 0.3, baseY: 0.7 }
    ],
    midnight: [
      { r: 29, g: 78, b: 216, a: 0.40, rx: 0.28, ry: 0.24, speedX: 0.0006, speedY: 0.0008, phaseX: 0, phaseY: 1.2, baseX: 0.25, baseY: 0.3 },
      { r: 56, g: 189, b: 248, a: 0.35, rx: 0.26, ry: 0.28, speedX: 0.0007, speedY: 0.0005, phaseX: 2.1, phaseY: 0.5, baseX: 0.75, baseY: 0.35 },
      { r: 67, g: 56, b: 202, a: 0.30, rx: 0.30, ry: 0.22, speedX: 0.0005, speedY: 0.0009, phaseX: 4.2, phaseY: 3.1, baseX: 0.65, baseY: 0.75 },
      { r: 147, g: 197, b: 253, a: 0.25, rx: 0.24, ry: 0.26, speedX: 0.0008, speedY: 0.0006, phaseX: 1.5, phaseY: 4.5, baseX: 0.3, baseY: 0.7 }
    ],
    emerald: [
      { r: 52, g: 211, b: 153, a: 0.35, rx: 0.28, ry: 0.24, speedX: 0.0006, speedY: 0.0008, phaseX: 0, phaseY: 1.2, baseX: 0.25, baseY: 0.3 },
      { r: 5, g: 150, b: 105, a: 0.35, rx: 0.26, ry: 0.28, speedX: 0.0007, speedY: 0.0005, phaseX: 2.1, phaseY: 0.5, baseX: 0.75, baseY: 0.35 },
      { r: 16, g: 185, b: 129, a: 0.30, rx: 0.30, ry: 0.22, speedX: 0.0005, speedY: 0.0009, phaseX: 4.2, phaseY: 3.1, baseX: 0.65, baseY: 0.75 },
      { r: 20, g: 184, b: 166, a: 0.25, rx: 0.24, ry: 0.26, speedX: 0.0008, speedY: 0.0006, phaseX: 1.5, phaseY: 4.5, baseX: 0.3, baseY: 0.7 }
    ]
  };

  class AmbientCanvas {
    constructor(canvasId = 'ambient-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;

      this.theme = currentTheme || 'obsidian';
      this.running = false;
      this.rafId = null;
      this.width = 0;
      this.height = 0;

      // Cursor tracking with spring-damped lerp
      this.mouseX = 0.5;
      this.mouseY = 0.5;
      this.targetMouseX = 0.5;
      this.targetMouseY = 0.5;

      this.initEvents();
      this.resize();
      this.start();
    }

    setTheme(themeName) {
      if (THEME_AURORA_PALETTES[themeName]) {
        this.theme = themeName;
      }
    }

    resize() {
      if (!this.canvas) return;
      const maxW = Math.min(window.innerWidth, 1920);
      const maxH = Math.min(window.innerHeight, 1080);
      this.width = Math.max(320, Math.floor(maxW / 2));
      this.height = Math.max(240, Math.floor(maxH / 2));
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      window.addEventListener('pointermove', e => {
        if (window.innerWidth > 0 && window.innerHeight > 0) {
          this.targetMouseX = e.clientX / window.innerWidth;
          this.targetMouseY = e.clientY / window.innerHeight;
        }
      }, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        } else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          this.start();
        }
      });

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      motionQuery.addEventListener('change', e => {
        if (e.matches) {
          this.stop();
          this.renderFrame(0);
        } else {
          this.start();
        }
      });

      window.addEventListener('themechange', e => {
        if (e.detail?.theme) this.setTheme(e.detail.theme);
      });
    }

    start() {
      if (this.running) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.renderFrame(0);
        return;
      }
      this.running = true;
      const loop = (timestamp) => {
        if (!this.running) return;
        this.renderFrame(timestamp);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    renderFrame(time) {
      const { ctx, width: w, height: h } = this;
      if (!ctx || w === 0 || h === 0) return;

      this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const palette = THEME_AURORA_PALETTES[this.theme] || THEME_AURORA_PALETTES.obsidian;
      const attract = 0.22;

      // 1. Base Aurora Mesh Pass
      ctx.globalCompositeOperation = 'source-over';
      palette.forEach(node => {
        const thetaX = time * node.speedX + node.phaseX;
        const thetaY = time * node.speedY + node.phaseY;
        const orbitX = Math.sin(thetaX) * node.rx * w;
        const orbitY = Math.cos(thetaY) * node.ry * h;
        const pullX = (this.mouseX * w - node.baseX * w) * attract;
        const pullY = (this.mouseY * h - node.baseY * h) * attract;

        const cx = node.baseX * w + orbitX + pullX;
        const cy = node.baseY * h + orbitY + pullY;
        const radius = Math.max(w, h) * 0.45;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${node.r}, ${node.g}, ${node.b}, ${node.a})`);
        grad.addColorStop(0.5, `rgba(${node.r}, ${node.g}, ${node.b}, ${node.a * 0.4})`);
        grad.addColorStop(1, `rgba(${node.r}, ${node.g}, ${node.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // 2. Additive Chromatic Refraction Pass (Screen blend mode with alternating spatial dispersion)
      ctx.globalCompositeOperation = 'screen';
      palette.forEach((node, i) => {
        const thetaX = time * node.speedX + node.phaseX;
        const thetaY = time * node.speedY + node.phaseY;
        const shiftX = (i % 2 === 0 ? 4 : -4);
        const shiftY = (i % 2 === 0 ? -3 : 3);

        const cx = node.baseX * w + Math.sin(thetaX) * node.rx * w + (this.mouseX * w - node.baseX * w) * attract + shiftX;
        const cy = node.baseY * h + Math.cos(thetaY) * node.ry * h + (this.mouseY * h - node.baseY * h) * attract + shiftY;
        const radius = Math.max(w, h) * 0.35;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${node.r}, ${node.g}, ${node.b}, ${node.a * 0.35})`);
        grad.addColorStop(0.7, `rgba(${node.r}, ${node.g}, ${node.b}, ${node.a * 0.08})`);
        grad.addColorStop(1, `rgba(${node.r}, ${node.g}, ${node.b}, 0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.globalCompositeOperation = 'source-over';
    }
  }

  /* ---------------- 8. Pure Oscillator Sound Engine ---------------- */

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.masterGain = null;
      this.lastHoverTime = 0;
      this.initFromStorage();
    }

    initFromStorage() {
      try {
        this.enabled = localStorage.getItem('convertix-sound') === 'true';
      } catch (_) {
        this.enabled = false;
      }
      this.updateUI();
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.enabled ? 0.15 : 0;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggle() {
      this.enabled = !this.enabled;
      try {
        localStorage.setItem('convertix-sound', String(this.enabled));
      } catch (_) {}

      const ctx = this.ensureContext();
      if (this.masterGain && ctx) {
        this.masterGain.gain.setValueAtTime(this.enabled ? 0.15 : 0, ctx.currentTime);
      }
      this.updateUI();
      if (this.enabled) {
        this.playChord([523.25, 659.25, 783.99], 0.08); // C-Major chime on enable
      }
    }

    updateUI() {
      const btn = document.getElementById('sound-toggle-btn');
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = this.enabled ? '🔊' : '🔇';
      if (btn) {
        btn.setAttribute('aria-pressed', String(this.enabled));
        btn.classList.toggle('border-emerald-500/40', this.enabled);
        btn.classList.toggle('text-emerald-400', this.enabled);
      }
    }

    playClick() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.022);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.025);
    }

    playHover() {
      if (!this.enabled) return;
      const now = performance.now();
      if (now - this.lastHoverTime < 55) return;
      this.lastHoverTime = now;

      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1250, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.015);
    }

    playChord(freqs, duration = 0.07) {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return;

      const t = ctx.currentTime;
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12 / freqs.length, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + duration);
      });
    }

    playSweep(open = true) {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx || !this.masterGain) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'triangle';
      if (open) {
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(560, t + 0.05);
      } else {
        osc.frequency.setValueAtTime(560, t);
        osc.frequency.exponentialRampToValueAtTime(260, t + 0.05);
      }

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.055);
    }
  }

  /* ---------------- 9. Scoped Pointer Tracking & Parallax ---------------- */

  function setupUnifiedTracking() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = null;

    const cards = $$('.track-card');
    const magneticElements = $$('.track-magnetic');
    const heroStage = $('.hero-mockup-stage');

    let heroRect = null;
    const updateHeroRect = () => {
      if (heroStage) heroRect = heroStage.getBoundingClientRect();
    };
    window.addEventListener('resize', updateHeroRect, { passive: true });
    window.addEventListener('scroll', updateHeroRect, { passive: true });
    updateHeroRect();

    // Scoped per-card pointer tracking (eliminates 19-card layout thrashing)
    cards.forEach(card => {
      let cardRect = null;
      const getRect = () => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        return cardRect;
      };

      card.addEventListener('pointerenter', () => {
        cardRect = card.getBoundingClientRect();
        if (window.soundEngine) window.soundEngine.playHover();
      }, { passive: true });

      card.addEventListener('pointermove', e => {
        const rect = getRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 180).toFixed(1);

        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--specular-angle', `${angle}deg`);

        const rotX = ((dy / cy) * -5).toFixed(2);
        const rotY = ((dx / cx) * 5).toFixed(2);
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`;
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        cardRect = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }, { passive: true });
    });

    window.addEventListener('scroll', () => {
      cards.forEach(c => { c._rect = null; });
    }, { passive: true });

    // Global pointer tracking for background aura, hero gyroscopic tilt, and magnetic buttons
    window.addEventListener('pointermove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updatePhysics);
      }
    }, { passive: true });

    function updatePhysics() {
      // 1. Ambient Background Position
      document.documentElement.style.setProperty('--gx', `${mouseX}px`);
      document.documentElement.style.setProperty('--gy', `${mouseY}px`);

      // 2. Hero Section 3D Gyroscopic Parallax
      if (heroStage && heroRect) {
        const heroCx = heroRect.left + heroRect.width / 2;
        const heroCy = heroRect.top + heroRect.height / 2;
        const tiltY = ((mouseX - heroCx) / (window.innerWidth / 2)) * 5;
        const tiltX = ((mouseY - heroCy) / (window.innerHeight / 2)) * -5;
        heroStage.style.setProperty('--hero-tilt-x', `${tiltX.toFixed(2)}deg`);
        heroStage.style.setProperty('--hero-tilt-y', `${tiltY.toFixed(2)}deg`);
      }

      // 3. Magnetic Button Attraction
      magneticElements.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const distThreshold = 90;
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const deltaX = mouseX - btnCenterX;
        const deltaY = mouseY - btnCenterY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < distThreshold) {
          const pullX = (deltaX / distThreshold) * 8;
          const pullY = (deltaY / distThreshold) * 8;
          btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
          btn.style.setProperty('--mag-x', `${pullX * 2}px`);
          btn.style.setProperty('--mag-y', `${pullY * 2}px`);
        } else {
          btn.style.transform = 'translate3d(0, 0, 0)';
        }
      });

      rafId = null;
    }
  }

  function setupSoundInteractions() {
    // Click feedback for interactive elements
    $$('.track-magnetic, button, .theme-btn, [data-currency], [data-open-demo], a[href^="#"], a[href^="http"]').forEach(el => {
      el.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
      }, { passive: true });
    });

    // Hover feedback for nav links and buttons
    $$('header a, .theme-btn, [data-currency], #sound-toggle-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (window.soundEngine) window.soundEngine.playHover();
      }, { passive: true });
    });
  }

  /* ---------------- Init ---------------- */
  window.soundEngine = new SoundEngine();
  window.toggleSound = () => window.soundEngine.toggle();

  window.ambientCanvas = new AmbientCanvas('ambient-canvas');

  initTheme();
  initCurrency();
  setupUnifiedTracking();
  setupSoundInteractions();

  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

})();
