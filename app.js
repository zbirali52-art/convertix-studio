// Convertix Studio Interactive Client App & Unified 60fps Tracking Engine

// State configuration
let currentCurrency = 'INR'; // 'INR' or 'USD'
const agencyPhone = '917410123901'; // User WhatsApp / Phone
const agencyEmail = 'zabir.ali.52@gmail.com'; // User Contact Email

// DOM Elements
const currencyInrBtn = document.getElementById('currency-inr');
const currencyUsdBtn = document.getElementById('currency-usd');
const leadsSlider = document.getElementById('leads-range');
const leadsSliderVal = document.getElementById('slider-leads-val');
const calcLostRevenue = document.getElementById('calc-lost-revenue');
const chatBox = document.getElementById('chat-box');

// Pricing dictionary
const PRICING = {
  INR: {
    symbol: '₹',
    corePrice: '₹1,000',
    coreNumber: 1000,
    aiBundlePrice: '₹2,499',
    avgTicket: 1500,
    headerText: 'Get Site for ₹1,000',
    btnText: '₹1,000',
    agencyCompare: '₹25,000 – ₹50,000'
  },
  USD: {
    symbol: '$',
    corePrice: '$15',
    coreNumber: 15,
    aiBundlePrice: '$39',
    avgTicket: 75,
    headerText: 'Get Site for $15',
    btnText: '$15',
    agencyCompare: '$500 – $1,000'
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupCurrencyListeners();
  setupSliderListener();
  setupUnifiedTrackingEngine();
  updateCalculator();
});

// ================= UNIFIED 60FPS TRACKING ENGINE =================
function setupUnifiedTrackingEngine() {
  // Skip on touch-only devices to preserve 100/100 mobile scrolling performance
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const root = document.documentElement;
  const cards = document.querySelectorAll('.track-card');
  const magnetics = document.querySelectorAll('.track-magnetic');
  const subs = document.querySelectorAll('.track-sub');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ticking = false;

  function updateTracking() {
    // 1. Whole-Website Global Coordinates
    root.style.setProperty('--gx', `${mouseX}px`);
    root.style.setProperty('--gy', `${mouseY}px`);

    // 2. Card Proximity & 3D Tilt Tracking
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      // Skip offscreen cards
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      card.style.setProperty('--cx', `${x}px`);
      card.style.setProperty('--cy', `${y}px`);

      // If cursor is directly inside the card, apply subtle 3D tilt
      const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      if (isInside) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3.2; // Max ~3deg tilt
        const rotateY = ((x - centerX) / centerX) * 3.2;
        card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      } else {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      }
    });

    // 3. Sub-Element Micro-Tracking (Highlight on hover)
    subs.forEach(sub => {
      const rect = sub.getBoundingClientRect();
      if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
        sub.style.setProperty('--sx', `${mouseX - rect.left}px`);
        sub.style.setProperty('--sy', `${mouseY - rect.top}px`);
      }
    });

    ticking = false;
  }

  window.addEventListener('pointermove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      window.requestAnimationFrame(updateTracking);
      ticking = true;
    }
  }, { passive: true });

  // 4. Magnetic CTA Pull Tracking for Buttons
  magnetics.forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pullX = ((x - rect.width / 2) / (rect.width / 2)) * 7; // Max 7px pull
      const pullY = ((y - rect.height / 2) / (rect.height / 2)) * 5;

      btn.style.setProperty('--bx', `${x}px`);
      btn.style.setProperty('--by', `${y}px`);
      btn.style.setProperty('--mx', `${pullX.toFixed(1)}px`);
      btn.style.setProperty('--my', `${pullY.toFixed(1)}px`);
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}

// Setup Currency Switcher
function setupCurrencyListeners() {
  if (currencyInrBtn && currencyUsdBtn) {
    currencyInrBtn.addEventListener('click', () => setCurrency('INR'));
    currencyUsdBtn.addEventListener('click', () => setCurrency('USD'));
  }
}

function setCurrency(curr) {
  currentCurrency = curr;
  const p = PRICING[curr];

  if (curr === 'INR') {
    currencyInrBtn.className = 'px-2.5 py-1 rounded-full transition-all duration-200 bg-emerald-500 text-black font-bold shadow-sm';
    currencyUsdBtn.className = 'px-2.5 py-1 rounded-full transition-all duration-200 text-slate-300 hover:text-white';
  } else {
    currencyUsdBtn.className = 'px-2.5 py-1 rounded-full transition-all duration-200 bg-emerald-500 text-black font-bold shadow-sm';
    currencyInrBtn.className = 'px-2.5 py-1 rounded-full transition-all duration-200 text-slate-300 hover:text-white';
  }

  // Update all elements with class 'price-tag'
  document.querySelectorAll('.price-tag').forEach(el => {
    el.textContent = p.corePrice;
  });

  // Update header text
  document.querySelectorAll('.price-header-text').forEach(el => {
    el.textContent = p.headerText;
  });

  // Update button texts
  document.querySelectorAll('.price-btn-text').forEach(el => {
    el.textContent = p.btnText;
  });

  // Update AI bundle price
  document.querySelectorAll('.ai-bundle-price').forEach(el => {
    el.textContent = p.aiBundlePrice;
  });

  updateCalculator();
}

// Setup ROI Calculator
function setupSliderListener() {
  if (leadsSlider) {
    leadsSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      if (leadsSliderVal) {
        leadsSliderVal.textContent = `${val} leads`;
      }
      updateCalculator();
    });
  }
}

function updateCalculator() {
  if (!leadsSlider || !calcLostRevenue) return;
  const leadsPerWeek = parseInt(leadsSlider.value, 10);
  const p = PRICING[currentCurrency];
  
  // Estimation formula:
  // 60% of missed leads * weekly leads * 4 weeks * 20% conversion * avg ticket
  const monthlyLeads = leadsPerWeek * 4;
  const missedOpportunities = monthlyLeads * 0.60;
  const lostRevenue = Math.round(missedOpportunities * 0.20 * p.avgTicket);

  if (currentCurrency === 'INR') {
    calcLostRevenue.textContent = `₹${lostRevenue.toLocaleString('en-IN')} / mo`;
  } else {
    calcLostRevenue.textContent = `$${lostRevenue.toLocaleString('en-US')} / mo`;
  }
}

// Interactive AI Chat Simulation
const AI_RESPONSES = {
  'Book slot at 5:00 PM please': {
    reply: "Done! I have reserved 5:00 PM tomorrow for you. Could you please provide your full name and phone number to confirm the booking?",
    followUp: "I will also send an instant reminder to your WhatsApp 2 hours before your appointment! 📅"
  },
  'What is your clinic address?': {
    reply: "We are located at 2nd Floor, Metro Plaza, MG Road (Near City Centre Metro Station).",
    followUp: "Here is the direct Google Maps navigation link: https://maps.google.com 📍"
  },
  'Can you send details on WhatsApp?': {
    reply: `Absolutely! I can also forward our full service brochure directly to your WhatsApp or email (${agencyEmail}). 📲`,
    followUp: ""
  }
};

function simulateMessage(userText) {
  if (!chatBox) return;

  // Append user message
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'flex items-start justify-end gap-2 animate-fadeIn';
  userMsgEl.innerHTML = `
    <div class="bg-emerald-600 text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] text-xs shadow-sm">
      ${userText}
    </div>
  `;
  chatBox.appendChild(userMsgEl);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Append typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'flex items-center gap-2 text-slate-400 text-[11px] typing-indicator';
  typingIndicator.innerHTML = `
    <div class="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold">AI</div>
    <div class="bg-[#172238] px-3 py-2 rounded-xl border border-white/5 flex gap-1 items-center">
      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
  `;
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate response after 600ms
  setTimeout(() => {
    typingIndicator.remove();
    const responseData = AI_RESPONSES[userText] || {
      reply: "Thank you for asking! Our system captures your request instantly and routes it to our team in real-time.",
      followUp: ""
    };

    const botMsgEl = document.createElement('div');
    botMsgEl.className = 'flex items-start gap-2 animate-fadeIn';
    botMsgEl.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] shrink-0 font-bold">AI</div>
      <div class="bg-[#172238] text-slate-200 p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-white/5 space-y-1">
        <p>${responseData.reply}</p>
        ${responseData.followUp ? `<p class="text-emerald-400 font-semibold">${responseData.followUp}</p>` : ''}
      </div>
    `;
    chatBox.appendChild(botMsgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);
}

// WhatsApp Lead Form Handler
function handleFormSubmit(e) {
  e.preventDefault();

  const businessName = document.getElementById('business-name')?.value || '';
  const businessType = document.getElementById('business-type')?.value || '';
  const businessCity = document.getElementById('business-city')?.value || '';
  const packageChoice = document.getElementById('package-choice')?.value || '';

  const price = PRICING[currentCurrency].corePrice;

  const message = `*New Website Inquiry (Convertix Studio)* 🚀\n\n` +
    `• *Business Name:* ${businessName}\n` +
    `• *Category:* ${businessType}\n` +
    `• *City/Location:* ${businessCity}\n` +
    `• *Package Desired:* ${packageChoice} (${price})\n` +
    `• *Terms:* Pay 100% AFTER website completion\n\n` +
    `Hi, please build my website preview!`;

  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/${agencyPhone}?text=${encoded}`;

  window.open(waUrl, '_blank');
}
