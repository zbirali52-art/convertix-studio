# Wix Template 3299 ("Datox - AI Tech Company") — Background & Display Architecture

**Source:** Wix Studio Template 3299 (`https://www.wix.com/website-template/view/html/3299`)  
**Live Demo:** `https://www.wix.com/demone2/ws-datox`  
**Target Platform:** Convertix Studio (`/home/zab/Desktop/stargate/agency-website`)  
**Design DNA:** Chromatic AI Void, High-Energy Neon Refraction, Multi-Layer Floating Displays, Specular Edge Glare.

---

## 1. The Wix 3299 Background Architecture

The iconic visual hallmark of Wix 3299 (Datox) is its **high-energy chromatic atmosphere** combined with an ultra-deep void:

### 1.1 Signature Color System
- **Void Base:** Deep Obsidian Black (`#07080D` / `#0A0B10`)
- **Primary Energy Gradient:** `linear-gradient(90deg, #7A64FF 0%, #FF337A 100%)`
  - Electric Violet / Indigo: `#7A64FF` (`rgb(122, 100, 255)`)
  - Cyber Neon Pink / Rose: `#FF337A` (`rgb(255, 51, 122)`)
  - Electric Cyan / Cobalt: `#5E97FF` (`rgb(94, 151, 255)`)
- **Card Surfaces:**
  - Base Glass: `rgba(15, 18, 30, 0.75)` with `backdrop-filter: blur(20px)`
  - Elevated Card: `rgba(22, 27, 46, 0.85)`
  - Specular Hairline: `1px solid rgba(255, 255, 255, 0.08)`
  - High-Gloss Border: `linear-gradient(135deg, rgba(122, 100, 255, 0.4), rgba(255, 51, 122, 0.25), transparent)`

### 1.2 Multi-Orb Ambient Lighting Fields
The background creates depth through 3 out-of-phase ambient radial lighting fields:
1. **Top-Left Plasma Orb (Violet #7A64FF):**
   `radial-gradient(circle at 20% 15%, rgba(122, 100, 255, 0.25) 0%, transparent 60%)` with `filter: blur(140px);`
2. **Center-Right Plasma Orb (Neon Pink #FF337A):**
   `radial-gradient(circle at 80% 35%, rgba(255, 51, 122, 0.20) 0%, transparent 60%)` with `filter: blur(160px);`
3. **Bottom-Left Plasma Orb (Electric Blue #5E97FF):**
   `radial-gradient(circle at 30% 75%, rgba(94, 151, 255, 0.18) 0%, transparent 55%)` with `filter: blur(140px);`

### 1.3 Fine Cyber Coordinate Grid
An ethereal 48px coordinate grid overlay with radial vignette masking:
```css
.datox-grid-overlay {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%);
}
```

---

## 2. The Wix 3299 Display Architecture

The Datox template uses 3 core display concepts:

### 2.1 The 3D Floating Hero Showcase Display
- **Central Canvas / Console Display:**
  - Dark glass chassis with 20px rounded corners.
  - Specular top highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.2)`.
  - Perspective levitation: `perspective: 1200px; transform: rotateX(6deg) rotateY(-4deg);`.
- **Floating Satellite Metric Chips (Z-Layered):**
  - Chip 1 (Top Right): `+99.4% AI Accuracy` with emerald pulsing badge.
  - Chip 2 (Bottom Left): `24/7 Realtime Automation` with violet glow.
  - Chip 3 (Bottom Right): `₹1,000 Flat / $15 USD` with high-contrast gradient pill.

### 2.2 Asymmetric Bento Grid Displays ("All Your Data Needs in a Single Platform")
- **Card A (Span 2 / Wide Display):** Large interactive graph or simulator view with live data waveforms.
- **Card B (Feature Display):** Dark glass card with glowing icon pill, high-contrast headline, and technical benchmark footer.
- **Card C (Interactive Switcher Display):** Tabbed interface with smooth micro-haptic state transitions.

---

## 3. Reusable Implementation Code Snippets

### Snippet 1: The Datox Chromatic Background Canvas & CSS Layer
```html
<!-- Atmospheric Datox Canvas & Gradients -->
<div class="datox-bg-wrapper pointer-events-none fixed inset-0 z-0 overflow-hidden">
  <!-- Dynamic HTML5 Aurora Canvas -->
  <canvas id="ambient-canvas" class="absolute inset-0 h-full w-full"></canvas>
  
  <!-- Cyber Grid with Vignette Mask -->
  <div class="datox-grid absolute inset-0 opacity-40"></div>

  <!-- Radial Diffuse Orbs -->
  <div class="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-[#7A64FF]/25 blur-[160px]"></div>
  <div class="absolute -right-32 top-1/4 h-[650px] w-[650px] rounded-full bg-[#FF337A]/20 blur-[180px]"></div>
  <div class="absolute bottom-10 left-1/4 h-[550px] w-[550px] rounded-full bg-[#5E97FF]/18 blur-[150px]"></div>
</div>
```

### Snippet 2: The Datox 3D Hero Display Showcase
```html
<div class="datox-hero-display relative mx-auto mt-12 max-w-5xl [perspective:1400px]">
  <!-- Specular Outer Glow -->
  <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#7A64FF]/30 via-[#FF337A]/25 to-[#5E97FF]/25 blur-2xl opacity-60"></div>

  <!-- Main 3D Console Chassis -->
  <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f18]/90 p-3 shadow-2xl backdrop-blur-2xl transition-transform duration-500 [transform:rotateX(4deg)] hover:[transform:rotateX(0deg)]">
    <!-- Top Chrome / Hardware Bezel -->
    <div class="flex h-10 items-center justify-between border-b border-white/10 px-4 bg-white/[0.02]">
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
      </div>
      <div class="rounded-full border border-white/10 bg-black/40 px-4 py-1 text-[11px] font-mono text-zinc-400">
        convertix.studio/preview/apex-dental
      </div>
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live 100/100</span>
      </div>
    </div>

    <!-- Inner Interactive Viewport / Display -->
    <div class="relative min-h-[360px] sm:min-h-[460px] rounded-xl overflow-hidden bg-[#07080d]">
      <iframe src="/demos/dental.html" class="w-full h-full min-h-[460px] border-0" title="Hero Display Preview"></iframe>
    </div>

    <!-- Floating Satellite Metric Pill 1 (Top Right) -->
    <div class="absolute -right-4 top-12 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-[#131628]/95 px-4 py-3 shadow-2xl backdrop-blur-xl animate-float">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7A64FF] to-[#FF337A] text-white font-bold text-xs shadow-md">
        ⚡
      </div>
      <div>
        <div class="text-[11px] font-bold text-white">99.8% PageSpeed</div>
        <div class="text-[9px] font-medium text-emerald-400">Sub-second cold start</div>
      </div>
    </div>

    <!-- Floating Satellite Metric Pill 2 (Bottom Left) -->
    <div class="absolute -left-4 bottom-10 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-[#131628]/95 px-4 py-3 shadow-2xl backdrop-blur-xl animate-float [animation-delay:1.5s]">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md">
        ₹0
      </div>
      <div>
        <div class="text-[11px] font-bold text-white">₹0 Advance Required</div>
        <div class="text-[9px] font-medium text-zinc-400">Pay only after approval</div>
      </div>
    </div>
  </div>
</div>
```

### Snippet 3: The Datox High-Contrast Gradient Typography
```css
.datox-gradient-text {
  background: linear-gradient(90deg, #FFFFFF 0%, #E0D9FF 40%, #FF85B3 80%, #7A64FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.datox-sub-gradient {
  background: linear-gradient(90deg, #7A64FF 0%, #FF337A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4. Integration Blueprint for Convertix Studio

1. **Theme Integration:** Update the Obsidian theme in `styles.css` with the Datox electric violet (`#7A64FF`), cyber rose (`#FF337A`), and cobalt (`#5E97FF`) color tokens.
2. **Canvas Harmonization:** Add `#7A64FF` and `#FF337A` to `THEME_AURORA_PALETTES.obsidian` in `app.js` so the 2D harmonic wave engine projects this exact palette.
3. **Hero Display Stage:** Elevate the central hero showcase into the 3D Datox console chassis with floating satellite metric pills.
