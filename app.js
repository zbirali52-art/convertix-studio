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

  /* ---------------- 7. Exact Datox 3D Multi-Layered Sine-Ribbon Wave & Optical Flare Engine ---------------- */

  const THEME_AURORA_PALETTES = {
    obsidian: {
      strands: [
        { color: 'rgba(122, 100, 255, 0.72)', core: 'rgba(122, 100, 255, 0.95)', freq: 0.0018, speed: 0.0008, amp: 75, phase: 0.0, yOffset: 0.38, width: 28 },
        { color: 'rgba(255, 51, 122, 0.68)', core: 'rgba(255, 51, 122, 0.90)', freq: 0.0022, speed: 0.0011, amp: 85, phase: 1.8, yOffset: 0.45, width: 32 },
        { color: 'rgba(0, 242, 254, 0.65)', core: 'rgba(0, 242, 254, 0.90)', freq: 0.0015, speed: 0.0006, amp: 65, phase: 3.4, yOffset: 0.32, width: 24 }
      ],
      flareColor: 'rgba(122, 100, 255, 0.45)',
      ringColors: ['rgba(0, 242, 254, 0.35)', 'rgba(255, 51, 122, 0.3)', 'rgba(122, 100, 255, 0.25)']
    },
    midnight: {
      strands: [
        { color: 'rgba(59, 130, 246, 0.75)', core: 'rgba(96, 165, 250, 0.95)', freq: 0.0018, speed: 0.0008, amp: 75, phase: 0.0, yOffset: 0.38, width: 28 },
        { color: 'rgba(56, 189, 248, 0.68)', core: 'rgba(147, 197, 253, 0.90)', freq: 0.0022, speed: 0.0011, amp: 85, phase: 1.8, yOffset: 0.45, width: 32 },
        { color: 'rgba(99, 102, 241, 0.65)', core: 'rgba(129, 140, 248, 0.90)', freq: 0.0015, speed: 0.0006, amp: 65, phase: 3.4, yOffset: 0.32, width: 24 }
      ],
      flareColor: 'rgba(56, 189, 248, 0.45)',
      ringColors: ['rgba(59, 130, 246, 0.35)', 'rgba(99, 102, 241, 0.3)', 'rgba(56, 189, 248, 0.25)']
    },
    emerald: {
      strands: [
        { color: 'rgba(16, 185, 129, 0.75)', core: 'rgba(52, 211, 153, 0.95)', freq: 0.0018, speed: 0.0008, amp: 75, phase: 0.0, yOffset: 0.38, width: 28 },
        { color: 'rgba(52, 211, 153, 0.68)', core: 'rgba(110, 231, 183, 0.90)', freq: 0.0022, speed: 0.0011, amp: 85, phase: 1.8, yOffset: 0.45, width: 32 },
        { color: 'rgba(20, 184, 166, 0.65)', core: 'rgba(45, 212, 191, 0.90)', freq: 0.0015, speed: 0.0006, amp: 65, phase: 3.4, yOffset: 0.32, width: 24 }
      ],
      flareColor: 'rgba(52, 211, 153, 0.45)',
      ringColors: ['rgba(16, 185, 129, 0.35)', 'rgba(20, 184, 166, 0.3)', 'rgba(52, 211, 153, 0.25)']
    }
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

      // Cursor tracking with spring damping
      this.mouseX = 0.5;
      this.mouseY = 0.5;
      this.targetMouseX = 0.5;
      this.targetMouseY = 0.5;

      // Scroll velocity impulse
      this.scrollY = window.scrollY || 0;
      this.scrollVelocity = 0;
      this.lastScrollY = window.scrollY || 0;

      // Floating bokeh dust particles
      this.particles = [];
      for (let i = 0; i < 24; i++) {
        this.particles.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2.5 + 1,
          speedX: (Math.random() - 0.5) * 0.0003,
          speedY: -Math.random() * 0.0004 - 0.0001,
          alpha: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.002 + 0.001
        });
      }

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * dpr);
      this.canvas.height = Math.floor(this.height * dpr);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize(), { passive: true });

      window.addEventListener('pointermove', e => {
        if (window.innerWidth > 0 && window.innerHeight > 0) {
          this.targetMouseX = e.clientX / window.innerWidth;
          this.targetMouseY = e.clientY / window.innerHeight;
        }
      }, { passive: true });

      window.addEventListener('scroll', () => {
        const currentY = window.scrollY || 0;
        const delta = currentY - this.lastScrollY;
        this.lastScrollY = currentY;
        this.scrollVelocity = Math.max(-40, Math.min(40, delta));
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

      // Smooth mouse spring lerp
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

      // Scroll velocity decay
      this.scrollVelocity *= 0.92;

      // Pure jet-black void clear
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      const palette = THEME_AURORA_PALETTES[this.theme] || THEME_AURORA_PALETTES.obsidian;

      // Additive Screen Blending for luminous 3D chromatic ribbons
      ctx.globalCompositeOperation = 'screen';

      const mousePullX = (this.mouseX - 0.5) * 80;
      const mousePullY = (this.mouseY - 0.5) * 90;
      const scrollImpulse = this.scrollVelocity * 0.4;

      // 1. Render Multi-Strand Sine-Ribbon Waves
      palette.strands.forEach((strand, strandIdx) => {
        ctx.beginPath();
        const baseCy = h * strand.yOffset + mousePullY * (0.6 + strandIdx * 0.2);
        const dynamicAmp = strand.amp + Math.abs(scrollImpulse) * 0.8 + (1 - this.mouseY) * 20;
        const currentPhase = time * strand.speed + strand.phase + mousePullX * 0.01;

        // Draw top curve
        const step = Math.max(8, Math.floor(w / 120));
        const topPoints = [];
        const botPoints = [];

        for (let x = -40; x <= w + 40; x += step) {
          const harmonic1 = Math.sin(x * strand.freq + currentPhase);
          const harmonic2 = Math.cos(x * strand.freq * 1.8 - currentPhase * 0.6);
          const y = baseCy + (harmonic1 * 0.75 + harmonic2 * 0.25) * dynamicAmp;
          const ribbonThick = strand.width + Math.sin(x * 0.003 + currentPhase) * 12;

          topPoints.push({ x, y: y - ribbonThick * 0.5 });
          botPoints.push({ x, y: y + ribbonThick * 0.5 });
        }

        // Draw polygon ribbon band
        ctx.moveTo(topPoints[0].x, topPoints[0].y);
        for (let i = 1; i < topPoints.length; i++) {
          ctx.lineTo(topPoints[i].x, topPoints[i].y);
        }
        for (let i = botPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(botPoints[i].x, botPoints[i].y);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseCy - dynamicAmp, w, baseCy + dynamicAmp);
        grad.addColorStop(0, strand.color);
        grad.addColorStop(0.5, strand.core);
        grad.addColorStop(1, strand.color);
        ctx.fillStyle = grad;
        ctx.fill();

        // Delicate luminous filament line
        ctx.beginPath();
        for (let i = 0; i < topPoints.length; i++) {
          const midY = (topPoints[i].y + botPoints[i].y) * 0.5;
          if (i === 0) ctx.moveTo(topPoints[i].x, midY);
          else ctx.lineTo(topPoints[i].x, midY);
        }
        ctx.strokeStyle = strand.core;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // 2. Optical Lens Flare & Concentric Ring Emitter
      const flareCenterX = w * 0.72 + (this.mouseX - 0.5) * 120;
      const flareCenterY = h * 0.34 + (this.mouseY - 0.5) * 80;

      // Anamorphic horizontal flare streak
      const streakGrad = ctx.createLinearGradient(flareCenterX - 350, flareCenterY, flareCenterX + 350, flareCenterY);
      streakGrad.addColorStop(0, 'rgba(0,0,0,0)');
      streakGrad.addColorStop(0.3, palette.flareColor);
      streakGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
      streakGrad.addColorStop(0.7, palette.flareColor);
      streakGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = streakGrad;
      ctx.fillRect(flareCenterX - 350, flareCenterY - 1.5, 700, 3);

      // Concentric diffraction rings
      palette.ringColors.forEach((rc, ringIdx) => {
        const ringRadius = 45 + ringIdx * 35 + Math.sin(time * 0.0015 + ringIdx) * 6;
        ctx.beginPath();
        ctx.arc(flareCenterX, flareCenterY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = rc;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Central flare orb glow
      const orbGrad = ctx.createRadialGradient(flareCenterX, flareCenterY, 0, flareCenterX, flareCenterY, 140);
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      orbGrad.addColorStop(0.3, palette.flareColor);
      orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(flareCenterX, flareCenterY, 140, 0, Math.PI * 2);
      ctx.fill();

      // 3. Floating Bokeh Particles
      this.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const px = p.x * w;
        const py = p.y * h;
        const pAlpha = p.alpha * (0.6 + Math.sin(time * p.pulseSpeed) * 0.4);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
        ctx.fill();
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

  /* ---------------- 13. Interactive Business Apps Mini-Widgets ---------------- */
  let currentBookingDay = 'Today · Oct 29';
  let currentBookingSlot = '10:30 AM';

  window.selectBookingDay = function(btn, day) {
    currentBookingDay = day;
    document.querySelectorAll('.booking-day-btn').forEach(b => {
      b.className = 'booking-day-btn px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[10px] font-medium text-center';
    });
    btn.className = 'booking-day-btn px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold text-center';
    const label = document.getElementById('booking-live-date-label');
    if (label) label.textContent = day;
    updateBookingWhatsAppCta();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.selectBookingSlot = function(btn, slot) {
    currentBookingSlot = slot;
    document.querySelectorAll('.booking-slot-btn').forEach(b => {
      b.className = 'booking-slot-btn px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[10px] text-center font-medium';
    });
    btn.className = 'booking-slot-btn px-2 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] text-center';
    updateBookingWhatsAppCta();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  function updateBookingWhatsAppCta() {
    const cta = document.getElementById('booking-live-cta');
    if (!cta) return;
    const msg = encodeURIComponent(`Hi, I want to book an appointment for ${currentBookingDay} at ${currentBookingSlot} through Convertix Studio.`);
    cta.href = `https://wa.me/917410123901?text=${msg}`;
  }

  // Funnel
  let funnelBizType = 'Clinic / Doctor';
  let funnelTimeline = '24-48 Hours';
  let funnelCurrentStep = 1;

  window.selectFunnelType = function(btn, type) {
    funnelBizType = type;
    document.querySelectorAll('.funnel-type-btn').forEach(b => {
      b.className = 'funnel-type-btn px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[10px] font-medium text-left';
    });
    btn.className = 'funnel-type-btn px-2 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-[10px] font-bold text-left';
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.selectFunnelTimeline = function(btn, time) {
    funnelTimeline = time;
    document.querySelectorAll('.funnel-time-btn').forEach(b => {
      b.className = 'funnel-time-btn px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 text-[10px] font-medium text-left';
    });
    btn.className = 'funnel-time-btn px-2 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold text-left';
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.advanceFunnelStep = function() {
    if (funnelCurrentStep === 1) {
      funnelCurrentStep = 2;
      const step1 = document.getElementById('funnel-step-1');
      const step2 = document.getElementById('funnel-step-2');
      const label = document.getElementById('funnel-step-label');
      const prog = document.getElementById('funnel-progress-text');
      const bar = document.getElementById('funnel-progress-bar');
      const btn = document.getElementById('funnel-action-text');

      if (step1) step1.classList.add('hidden');
      if (step2) step2.classList.remove('hidden');
      if (label) label.textContent = 'Step 2 of 2: Launch Timeline';
      if (prog) prog.textContent = '100% Done';
      if (bar) bar.className = 'bg-emerald-500 h-full w-full transition-all duration-300';
      if (btn) btn.textContent = 'Get Instant Quote on WhatsApp →';
    } else {
      const msg = encodeURIComponent(`Hi, I completed the qualification funnel for my ${funnelBizType} business. Need launch timeline: ${funnelTimeline}.`);
      window.open(`https://wa.me/917410123901?text=${msg}`, '_blank');
    }
    if (window.soundEngine) window.soundEngine.playClick();
  };

  // Store Qty
  let storeQty = 1;
  const storeItemPrice = 499;
  window.adjustStoreQty = function(delta) {
    storeQty = Math.max(1, Math.min(10, storeQty + delta));
    const disp = document.getElementById('store-qty-display');
    const tot = document.getElementById('store-total-display');
    const link = document.getElementById('store-checkout-link');
    if (disp) disp.textContent = String(storeQty);
    if (tot) tot.textContent = `₹${storeQty * storeItemPrice} (0% Platform Fee)`;
    if (link) {
      const msg = encodeURIComponent(`Hi, I want to order ${storeQty}x Crispy Classic Bucket (Total: ₹${storeQty * storeItemPrice}) with 0% platform fee.`);
      link.href = `https://wa.me/917410123901?text=${msg}`;
    }
    if (window.soundEngine) window.soundEngine.playClick();
  };

  // Blog Filter
  const blogPosts = {
    all: { tag: '⚡ Local SEO Case Study', title: 'How Local Clinics Rank #1 on Google Maps Without Ads' },
    growth: { tag: '📈 Conversion Rate Optimization', title: 'Why WhatsApp Checkout Boosts Indian Orders by 240%' },
    seo: { tag: '⚡ Google PageSpeed 100/100', title: 'Zero Database Architecture: Why Static Sites Outrank WordPress' }
  };

  window.filterBlogTopic = function(topic, btn) {
    document.querySelectorAll('.blog-pill').forEach(b => {
      b.className = 'blog-pill px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 text-[9px]';
    });
    btn.className = 'blog-pill px-2 py-1 rounded-md bg-purple-500 text-white font-bold text-[9px]';
    const post = blogPosts[topic] || blogPosts.all;
    const tagEl = document.getElementById('blog-post-tag');
    const titleEl = document.getElementById('blog-post-title');
    if (tagEl) tagEl.textContent = post.tag;
    if (titleEl) titleEl.textContent = post.title;
    if (window.soundEngine) window.soundEngine.playClick();
  };

  // Event Pass
  let ticketQty = 1;
  window.adjustTicketQty = function(delta) {
    ticketQty = Math.max(1, Math.min(5, ticketQty + delta));
    const disp = document.getElementById('ticket-qty-display');
    if (disp) disp.textContent = String(ticketQty);
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.generateDemoPass = function() {
    const btn = document.getElementById('ticket-btn-text');
    if (btn) btn.textContent = `✓ ${ticketQty} VIP Pass(es) Generated! Added to iCal/Google`;
    if (window.soundEngine && typeof window.soundEngine.playSweep === 'function') {
      window.soundEngine.playSweep(true);
    }
    setTimeout(() => {
      if (btn) btn.textContent = 'Generate Instant Digital Pass 🎟️';
    }, 3500);
  };

  /* ---------------- 13. Interactive Client Showcase Sample Handlers ---------------- */
  let currentDentalDoctor = 'Dr. Amit Sharma (Lead Surgeon)';
  let currentDentalSlot = '11:00 AM';

  window.setDentalDoctor = function(btn, doctorName) {
    currentDentalDoctor = doctorName;
    const group = document.getElementById('dental-doctor-group');
    if (group) {
      group.querySelectorAll('.interactive-pill-btn').forEach(b => b.classList.remove('is-active'));
    }
    btn.classList.add('is-active');
    const label = document.getElementById('dental-doctor-label');
    if (label) label.textContent = doctorName;
    updateDentalToast();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.setDentalSlot = function(btn, slotTime) {
    currentDentalSlot = slotTime;
    const group = document.getElementById('dental-slots-group');
    if (group) {
      group.querySelectorAll('.interactive-pill-btn').forEach(b => b.classList.remove('is-active'));
    }
    btn.classList.add('is-active');
    updateDentalToast();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  function updateDentalToast() {
    const text = document.getElementById('dental-toast-text');
    if (text) text.textContent = `Selected: Today at ${currentDentalSlot} with ${currentDentalDoctor.split(' ')[1]}`;
    const cta = document.getElementById('dental-whatsapp-cta');
    if (cta) {
      const msg = encodeURIComponent(`Hi, I want to book a slot at Apex Dental for Today at ${currentDentalSlot} with ${currentDentalDoctor}.`);
      cta.href = `https://wa.me/${AGENCY_PHONE}?text=${msg}`;
    }
  }

  // Atra Elite Car Rentals
  let currentAtraVehicle = 'Aston Martin DBS';
  let currentAtraRate = 4500;

  window.setAtraVehicle = function(btn, vehicleName, rate) {
    currentAtraVehicle = vehicleName;
    currentAtraRate = rate;
    const group = document.getElementById('atra-vehicle-group');
    if (group) {
      group.querySelectorAll('.interactive-pill-btn').forEach(b => b.classList.remove('is-active'));
    }
    btn.classList.add('is-active');
    const badge = document.getElementById('atra-price-badge');
    if (badge) badge.textContent = `₹${rate.toLocaleString('en-IN')} / hr`;
    window.updateAtraEstimate();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.updateAtraEstimate = function() {
    const hoursSelect = document.getElementById('atra-hours-select');
    const locSelect = document.getElementById('atra-location-select');
    const hours = hoursSelect ? parseInt(hoursSelect.value, 10) : 4;
    const loc = locSelect ? locSelect.value : 'Beverly Hills Flagship';
    const total = currentAtraRate * hours;
    const totalEl = document.getElementById('atra-total-val');
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')} INR`;
    const cta = document.getElementById('atra-whatsapp-cta');
    if (cta) {
      const msg = encodeURIComponent(`Hi, I want to reserve the ${currentAtraVehicle} for ${hours} hours at ${loc} (Estimated Total: ₹${total.toLocaleString('en-IN')}).`);
      cta.href = `https://wa.me/${AGENCY_PHONE}?text=${msg}`;
    }
  };

  // Aura Botanicals
  let currentAuraVariant = '30ml Travel Size';
  let auraCartCount = 0;

  window.setAuraVariant = function(btn, variantName, usd, inr) {
    currentAuraVariant = variantName;
    const group = document.getElementById('aura-size-group');
    if (group) {
      group.querySelectorAll('.interactive-pill-btn').forEach(b => b.classList.remove('is-active'));
    }
    btn.classList.add('is-active');
    const disp = document.getElementById('aura-price-display');
    if (disp) disp.textContent = `$${usd} USD / ₹${inr.toLocaleString('en-IN')}`;
    const cta = document.getElementById('aura-whatsapp-cta');
    if (cta) {
      const msg = encodeURIComponent(`Hi, I want to order the Aura Botanicals ${variantName} ($${usd} / ₹${inr}).`);
      cta.href = `https://wa.me/${AGENCY_PHONE}?text=${msg}`;
    }
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.addToAuraCart = function() {
    auraCartCount++;
    const countEl = document.getElementById('aura-cart-count');
    if (countEl) countEl.textContent = `${auraCartCount} item${auraCartCount > 1 ? 's' : ''}`;
    const btn = document.getElementById('aura-add-btn');
    if (btn) {
      btn.textContent = 'Added ✓';
      setTimeout(() => { if (btn) btn.textContent = 'Add to Bag +'; }, 1500);
    }
    if (window.soundEngine && typeof window.soundEngine.playSweep === 'function') {
      window.soundEngine.playSweep(true);
    }
  };

  // Nocturne Dining
  let nocturneGuests = 2;
  window.stepNocturneGuests = function(delta) {
    nocturneGuests = Math.max(1, Math.min(12, nocturneGuests + delta));
    const disp = document.getElementById('nocturne-guests-val');
    if (disp) disp.textContent = `${nocturneGuests} Guest${nocturneGuests > 1 ? 's' : ''}`;
    window.updateNocturneZone();
    if (window.soundEngine) window.soundEngine.playClick();
  };

  window.updateNocturneZone = function() {
    const zoneSelect = document.getElementById('nocturne-zone-select');
    const zone = zoneSelect ? zoneSelect.value : "Chef's Counter (Omakase)";
    const label = document.getElementById('nocturne-hold-label');
    if (label) label.textContent = `Table held for ${nocturneGuests} guests at ${zone.split(' ')[0]}`;
    const cta = document.getElementById('nocturne-whatsapp-cta');
    if (cta) {
      const msg = encodeURIComponent(`Hi, I want to reserve a table for ${nocturneGuests} Guests at Nocturne (${zone}).`);
      cta.href = `https://wa.me/${AGENCY_PHONE}?text=${msg}`;
    }
  };

  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

})();
