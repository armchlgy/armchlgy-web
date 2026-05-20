const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

// Replace product-hero-section to showcase layout
const newHeroCSS = `
/* ── HERO — HYDROFLOW PRODUCT SHOWCASE ────────────────────── */
.product-hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #070707;
    overflow: hidden;
    padding-top: 80px;
    padding-bottom: 2rem;
}

#hero-canvas {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    pointer-events: none;
}

.product-hero-top {
    position: relative; z-index: 2;
    padding: 0 4vw;
    max-width: 1600px; margin: 0 auto 2rem; width: 100%;
    text-align: center;
}

.hero-eyebrow {
    font-size: 0.65rem; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin-bottom: 1.5rem;
}

.product-hero-headline {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 6vw, 5rem);
    line-height: 1.1; color: #fff; font-weight: 400; letter-spacing: 0.02em;
}

.product-hero-headline .word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; line-height: 1.15; }
.product-hero-headline .word-inner { display: inline-block; transform: translateY(110%); margin-right: 0.28em; }
.product-hero-headline .italic-word .word-inner { font-style: italic; color: rgba(255,255,255,0.8); }

/* 3-COLUMN SHOWCASE (PERFECT ALIGNMENT) */
.product-hero-showcase {
    position: relative; z-index: 2;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 5vw;
    align-items: center;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 4vw;
}

.showcase-left { 
    display: flex; flex-direction: column; gap: 2.5rem; 
    justify-self: end; 
    text-align: right; 
}
.spec-group { display: flex; flex-direction: column; gap: 0.4rem; }
.spec-label { font-size: 0.58rem; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
.spec-value { font-family: var(--font-heading); font-size: 1.05rem; color: rgba(255,255,255,0.85); letter-spacing: 0.05em; font-style: italic; }

/* THE PRODUCT */
.showcase-center { 
    justify-self: center; 
    position: relative; 
}
.product-img-container { 
    position: relative; 
    height: 60vh; /* Lock height to viewport for neatness */
    display: flex;
    align-items: center;
    justify-content: center;
}
.product-hero-img {
    height: 100%; 
    width: auto; 
    object-fit: contain;
    filter: contrast(1.1) brightness(0.95);
    will-change: transform;
    animation: bottleFloat 6s ease-in-out infinite;
}
@keyframes bottleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

.bottle-glow {
    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; height: 100px;
    background: radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 60%);
    filter: blur(25px); pointer-events: none;
}
.smoke-overlay {
    position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
    width: 120%; height: 120%;
    background: radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    animation: smokeRise 5s ease-in-out infinite alternate;
}
@keyframes smokeRise { 0% { opacity: 0.5; transform: translateX(-50%) translateY(0); } 100% { opacity: 0.2; transform: translateX(-50%) translateY(-15px); } }

.product-rotate-hint { 
    position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
    font-size: 0.55rem; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.25); white-space: nowrap; 
}

.showcase-right { 
    display: flex; flex-direction: column; gap: 2rem; 
    justify-self: start; 
    text-align: left; 
}
.showcase-desc { font-size: 0.9rem; line-height: 2; color: rgba(255,255,255,0.45); max-width: 280px; }
.showcase-cta { 
    display: inline-flex; align-items: center; gap: 0.8rem; 
    color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; 
    border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 0.5rem; width: fit-content; transition: color 0.4s, border-color 0.4s; 
}
.showcase-cta:hover { color: #fff; border-color: rgba(255,255,255,0.6); }

/* Bottom bar */
.product-hero-bottom { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; padding: 0 4vw 2rem; }
`;

// Replace from '/* ── HERO — HYDROFLOW PRODUCT SHOWCASE ────────────────────── */' to '/* ── PHILOSOPHY SECTION (WHITE) ──────────────────────────── */'
const startIndex = css.indexOf('/* ── HERO — HYDROFLOW PRODUCT SHOWCASE ────────────────────── */');
const endIndex = css.indexOf('/* ── PHILOSOPHY SECTION (WHITE) ──────────────────────────── */');

if(startIndex !== -1 && endIndex !== -1) {
    const startStr = css.substring(0, startIndex);
    const endStr = css.substring(endIndex);
    fs.writeFileSync('style.css', startStr + newHeroCSS + endStr);
    console.log("Patched successfully");
} else {
    console.log("Could not find markers");
}
