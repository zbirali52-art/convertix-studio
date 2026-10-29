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

  window.setTheme = function(themeName) {
    currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);

    $$('.theme-btn').forEach(btn => {
      const isActive = btn.dataset.themeChoice === themeName;
      btn.classList.toggle('bg-white/20', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-slate-400', !isActive);
    });

    try {
      localStorage.setItem('convertix-theme', themeName);
    } catch (_) {}
  };

  function initTheme() {
    let saved = 'obsidian';
    try {
      saved = localStorage.getItem('convertix-theme') || 'obsidian';
    } catch (_) {}
    window.setTheme(saved);
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
      title: 'Apex Dental & Implant Care (Healthcare Demo)',
      url: 'demos/dental.html',
      msg: 'Hi, I want a website like the Apex Dental clinic demo for ₹1,000.'
    },
    cafe: {
      title: 'Urban Crust Artisan Cafe (Food & QR Menu Demo)',
      url: 'demos/cafe.html',
      msg: 'Hi, I want a website like the Urban Crust Cafe demo for ₹1,000.'
    },
    interiors: {
      title: 'Vesta Living Interiors (Architecture & Estimator Demo)',
      url: 'demos/interiors.html',
      msg: 'Hi, I want a website like the Vesta Living Interiors demo for ₹1,000.'
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
  };

  window.closeDemoModal = function() {
    if (!demoModal) return;
    demoModal.classList.add('hidden');
    demoModal.classList.remove('flex');
    if (demoIframe) demoIframe.src = 'about:blank';
    document.body.style.overflow = '';
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

  /* ---------------- 7. Unified 60fps Cursor Tracking ---------------- */

  function setupUnifiedTracking() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let rafId = null;

    const cards = $$('.track-card');
    const magneticElements = $$('.track-magnetic');

    window.addEventListener('mousemove', e => {
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

      // 2. Card 3D Tilt & Specular Coordinates
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = mouseX - rect.left;
        const cardY = mouseY - rect.top;

        card.style.setProperty('--mouse-x', `${cardX}px`);
        card.style.setProperty('--mouse-y', `${cardY}px`);

        // Check if cursor is over or near card
        if (cardX >= -50 && cardX <= rect.width + 50 && cardY >= -50 && cardY <= rect.height + 50) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((cardY - centerY) / centerY) * -5;
          const rotateY = ((cardX - centerX) / centerX) * 5;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
      });

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

  /* ---------------- Init ---------------- */
  initTheme();
  initCurrency();
  setupUnifiedTracking();

  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

})();
