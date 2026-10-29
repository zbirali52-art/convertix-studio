/* Convertix Studio — progressive enhancement
   No third-party dependencies. Safe to load deferred. */
(() => {
  'use strict';

  const AGENCY_PHONE = '917410123901';
  const AGENCY_EMAIL = 'zabir.ali.52@gmail.com';

  const PRICING = {
    INR: {
      corePrice: '₹1,000',
      aiBundlePrice: '₹2,499',
      headerText: 'Get Site for ₹1,000',
      btnText: '₹1,000',
      avgTicket: 1500
    },
    USD: {
      corePrice: '$15',
      aiBundlePrice: '$39',
      headerText: 'Get Site for $15',
      btnText: '$15',
      avgTicket: 75
    }
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentCurrency = 'INR';

  /* ---------------- Currency ---------------- */

  const currencyButtons = $$('[data-currency]');

  function readStoredCurrency() {
    try {
      const stored = window.localStorage.getItem('convertix-currency');
      if (stored === 'USD' || stored === 'INR') return stored;
    } catch (_) { /* storage can be blocked */ }
    return 'INR';
  }

  function setCurrency(currency, persist = true) {
    if (!PRICING[currency]) return;
    currentCurrency = currency;
    const p = PRICING[currency];

    // Bilingual price strings, e.g. <span data-inr="₹25,000" data-usd="$500">
    $$('[data-inr]').forEach(el => {
      const value = currency === 'INR' ? el.dataset.inr : el.dataset.usd;
      if (value) el.textContent = value;
    });

    $$('.price-tag').forEach(el => { el.textContent = p.corePrice; });
    $$('.price-header-text').forEach(el => { el.textContent = p.headerText; });
    $$('.price-btn-text').forEach(el => { el.textContent = p.btnText; });
    $$('.ai-bundle-price').forEach(el => { el.textContent = p.aiBundlePrice; });

    currencyButtons.forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.currency === currency));
    });

    $$('#package-choice option').forEach(option => {
      const label = currency === 'INR' ? option.dataset.inrLabel : option.dataset.usdLabel;
      if (label) option.textContent = label;
    });

    document.documentElement.dataset.currency = currency;
    updateCalculator();

    if (persist) {
      try { window.localStorage.setItem('convertix-currency', currency); } catch (_) { /* ignore */ }
    }
  }

  currencyButtons.forEach(button => {
    button.addEventListener('click', () => setCurrency(button.dataset.currency));
  });

  /* ---------------- ROI calculator ---------------- */

  const leadsSlider = $('#leads-range');
  const leadsSliderValue = $('#slider-leads-val');
  const lostRevenue = $('#calc-lost-revenue');

  function updateCalculator() {
    if (!leadsSlider || !lostRevenue) return;
    const leadsPerWeek = Number.parseInt(leadsSlider.value, 10) || 0;
    const p = PRICING[currentCurrency];

    // 60% of enquiries missed, 20% of those would have converted.
    const monthlyLeads = leadsPerWeek * 4;
    const lost = Math.round(monthlyLeads * 0.6 * 0.2 * p.avgTicket);

    lostRevenue.textContent = currentCurrency === 'INR'
      ? `₹${lost.toLocaleString('en-IN')} / mo`
      : `$${lost.toLocaleString('en-US')} / mo`;
  }

  if (leadsSlider) {
    leadsSlider.addEventListener('input', event => {
      if (leadsSliderValue) leadsSliderValue.textContent = `${event.target.value} leads`;
      updateCalculator();
    });
  }

  /* ---------------- Mobile navigation ---------------- */

  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const menuIconOpen = $('#menu-icon-open');
  const menuIconClose = $('#menu-icon-close');

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (menuIconOpen) menuIconOpen.classList.toggle('hidden', open);
    if (menuIconClose) menuIconClose.classList.toggle('hidden', !open);
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    $$('a', mobileMenu).forEach(link => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) setMenu(false);
    }, { passive: true });
  }

  /* ---------------- Scroll spy ---------------- */

  const navLinks = $$('.nav-link');
  const sections = $$('main section[id]');

  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const linkFor = new Map();
    navLinks.forEach(link => linkFor.set(link.getAttribute('href').slice(1), link));

    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.removeAttribute('aria-current'));
        const active = linkFor.get(entry.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => {
      if (linkFor.has(section.id)) spy.observe(section);
    });
  }

  /* ---------------- Cursor / magnetic tracking ---------------- */

  function setupTracking() {
    if (reduceMotion.matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const root = document.documentElement;
    const cards = $$('.track-card');
    const magnetics = $$('.track-magnetic');
    const subs = $$('.track-sub');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let queued = false;

    function render() {
      root.style.setProperty('--gx', `${mouseX}px`);
      root.style.setProperty('--gy', `${mouseY}px`);

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        card.style.setProperty('--cx', `${x}px`);
        card.style.setProperty('--cy', `${y}px`);

        const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
        if (inside) {
          const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3.2;
          const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3.2;
          card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
          card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
        } else {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        }
      });

      subs.forEach(sub => {
        const rect = sub.getBoundingClientRect();
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          sub.style.setProperty('--sx', `${mouseX - rect.left}px`);
          sub.style.setProperty('--sy', `${mouseY - rect.top}px`);
        }
      });

      queued = false;
    }

    window.addEventListener('pointermove', event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!queued) {
        window.requestAnimationFrame(render);
        queued = true;
      }
    }, { passive: true });

    magnetics.forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pullX = ((x - rect.width / 2) / (rect.width / 2)) * 7;
        const pullY = ((y - rect.height / 2) / (rect.height / 2)) * 5;

        button.style.setProperty('--bx', `${x}px`);
        button.style.setProperty('--by', `${y}px`);
        button.style.setProperty('--mx', `${pullX.toFixed(1)}px`);
        button.style.setProperty('--my', `${pullY.toFixed(1)}px`);
      });

      button.addEventListener('pointerleave', () => {
        button.style.setProperty('--mx', '0px');
        button.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------------- AI chat demo ---------------- */

  const chatBox = $('#chat-box');

  const AI_RESPONSES = {
    'Book slot at 5:00 PM please': {
      reply: 'Done! I have reserved 5:00 PM tomorrow for you. Could you please provide your full name and phone number to confirm the booking?',
      followUp: 'I will also send an instant reminder to your WhatsApp 2 hours before your appointment!'
    },
    'What is your clinic address?': {
      reply: 'We are located at 2nd Floor, Metro Plaza, MG Road (near City Centre Metro Station).',
      followUp: 'Here is the direct Google Maps navigation link: https://maps.google.com'
    },
    'Can you send details on WhatsApp?': {
      reply: `Absolutely! I can also forward our full service brochure directly to your WhatsApp or email (${AGENCY_EMAIL}).`
    }
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function appendBubble(message, fromUser) {
    const row = element('div', `flex items-start gap-2 ${fromUser ? 'justify-end' : ''} animate-fadeIn`);

    if (!fromUser) {
      row.appendChild(element('div', 'w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] shrink-0 font-bold', 'AI'));
    }

    const bubble = element('div', fromUser
      ? 'bg-emerald-600 text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] text-xs shadow-sm'
      : 'bg-[#172238] text-slate-200 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-white/5 space-y-1 text-xs',
      message);

    row.appendChild(bubble);
    chatBox.appendChild(row);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function simulateMessage(userText) {
    if (!chatBox) return;

    appendBubble(userText, true);

    const typing = element('div', 'flex items-center gap-2 text-slate-400 text-[11px]');
    typing.innerHTML = `
      <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold">AI</div>
      <div class="bg-[#172238] px-3 py-2 rounded-xl border border-white/5 flex gap-1 items-center">
        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>`;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    window.setTimeout(() => {
      typing.remove();
      const data = AI_RESPONSES[userText] || {
        reply: 'Thank you for asking! Your request is captured instantly and routed to the team in real time.'
      };
      appendBubble(data.reply, false);

      if (data.followUp) {
        const follow = element('p', 'text-emerald-400 font-semibold', data.followUp);
        chatBox.lastElementChild.lastElementChild.appendChild(follow);
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, reduceMotion.matches ? 0 : 600);
  }

  $$('[data-chat-prompt]').forEach(button => {
    button.addEventListener('click', () => simulateMessage(button.dataset.chatPrompt));
  });

  /* ---------------- Lead form ---------------- */

  const form = $('#lead-form');
  const formStatus = $('#form-status');
  const submitButton = $('#lead-submit');

  function buildWhatsAppMessage() {
    const p = PRICING[currentCurrency];
    const businessName = $('#business-name')?.value.trim() || '';
    const businessType = $('#business-type')?.value || '';
    const city = $('#business-city')?.value.trim() || '';
    const packageSelect = $('#package-choice');
    const packageChoice = packageSelect?.selectedOptions[0]?.textContent.trim() || '';

    return [
      '*New Website Inquiry (Convertix Studio)*',
      '',
      `• *Business Name:* ${businessName}`,
      `• *Category:* ${businessType}`,
      `• *City/Location:* ${city}`,
      `• *Package Desired:* ${packageChoice}`,
      `• *Displayed Price:* ${p.corePrice} core / ${p.aiBundlePrice} with AI`,
      '• *Terms:* Pay 100% after website completion',
      '',
      'Hi, please build my website preview!'
    ].join('\n');
  }

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot: silently stop obvious bots.
      const formData = new FormData(form);
      if (formData.get('bot-field')) return;

      if (submitButton) submitButton.disabled = true;
      if (formStatus) formStatus.textContent = 'Opening WhatsApp…';

      const whatsappUrl = `https://wa.me/${AGENCY_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage())}`;

      // Open synchronously so browsers count it as part of the user gesture.
      window.open(whatsappUrl, '_blank', 'noopener');

      // Keep a copy of the lead in Netlify Forms as a fallback.
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
      } catch (_) { /* never block the WhatsApp hand-off */ }

      if (formStatus) {
        formStatus.textContent = 'WhatsApp should be open. If it did not open, tap the Email button instead.';
      }
      if (submitButton) submitButton.disabled = false;
    });
  }

  /* ---------------- Interactive Demo Modal ---------------- */

  const DEMO_CONFIG = {
    dental: {
      title: 'Apex Dental & Implant Care (Multi-Speciality Clinic)',
      url: 'demos/dental.html',
      whatsappText: 'Hi, I want a website like the Apex Dental clinic demo for ₹1,000.'
    },
    cafe: {
      title: 'Urban Crust Artisan Cafe (Wood-Fired Pizza & Coffee)',
      url: 'demos/cafe.html',
      whatsappText: 'Hi, I want a website like the Urban Crust Cafe demo for ₹1,000.'
    },
    interiors: {
      title: 'Vesta Living Interiors (Turnkey Modular Home Design)',
      url: 'demos/interiors.html',
      whatsappText: 'Hi, I want a website like the Vesta Living Interiors demo for ₹1,000.'
    }
  };

  const demoModal = $('#demo-modal');
  const demoIframe = $('#demo-iframe');
  const demoModalTitle = $('#demo-modal-title');
  const demoExternalLink = $('#demo-external-link');
  const demoOrderBtn = $('#demo-order-btn');
  const demoFrameWrapper = $('#demo-frame-wrapper');
  const viewMobileBtn = $('#view-mobile');
  const viewDesktopBtn = $('#view-desktop');

  window.openDemoModal = function(demoKey) {
    const config = DEMO_CONFIG[demoKey];
    if (!config || !demoModal || !demoIframe) return;

    if (demoModalTitle) demoModalTitle.textContent = config.title;
    demoIframe.src = config.url;
    if (demoExternalLink) demoExternalLink.href = config.url;
    if (demoOrderBtn) {
      demoOrderBtn.href = `https://wa.me/${AGENCY_PHONE}?text=${encodeURIComponent(config.whatsappText)}`;
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

  window.setDemoViewport = function(viewport) {
    if (!demoFrameWrapper) return;

    if (viewport === 'mobile') {
      demoFrameWrapper.className = 'w-full max-w-[390px] h-[96%] rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden bg-slate-900 transition-all duration-300';
      if (viewMobileBtn) {
        viewMobileBtn.className = 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white transition-colors flex items-center gap-1 font-bold shadow-sm';
      }
      if (viewDesktopBtn) {
        viewDesktopBtn.className = 'px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-medium';
      }
    } else {
      demoFrameWrapper.className = 'w-full h-full max-w-full rounded-xl overflow-hidden border border-white/10 shadow-inner bg-slate-900 transition-all duration-300';
      if (viewDesktopBtn) {
        viewDesktopBtn.className = 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white transition-colors flex items-center gap-1 font-bold shadow-sm';
      }
      if (viewMobileBtn) {
        viewMobileBtn.className = 'px-2.5 py-1 rounded-lg text-slate-300 hover:text-white transition-colors flex items-center gap-1 font-medium';
      }
    }
  };

  // Wire up data-open-demo buttons
  $$('[data-open-demo]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const demoKey = trigger.dataset.openDemo;
      window.openDemoModal(demoKey);
    });
  });

  // Close modal when backdrop is clicked
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        window.closeDemoModal();
      }
    });
  }

  // Close modal on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal && !demoModal.classList.contains('hidden')) {
      window.closeDemoModal();
    }
  });

  /* ---------------- Misc ---------------- */

  const year = $('#footer-year');
  if (year) year.textContent = String(new Date().getFullYear());

  document.documentElement.classList.add('js');

  // Apply the saved/last-used currency once everything is wired up.
  setCurrency(readStoredCurrency(), false);
  setupTracking();
})();
