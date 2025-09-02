// Import data and render functions from other files
import { decks, entryContent, hubContent, ctaContent } from './data.js';
import { renderSlideContent } from './renderers.js';
import { initAnimatedBackground } from './animations.js';

// DOM Elements
const entryView = document.getElementById('entry-view');
const hubView = document.getElementById('hub-view');
const deckView = document.getElementById('deck-view');
const ctaView = document.getElementById('cta-view');

const presentationContainer = document.querySelector('.presentation-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressDotsContainer = document.getElementById('progress-dots');
const backToHubFromDeckBtn = document.getElementById('back-to-hub-from-deck');

let currentDeck = null;
let currentSlideIndex = 0;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- VIEW MANAGEMENT ---

function switchView(view) {
    [entryView, hubView, deckView, ctaView].forEach(v => v.classList.add('view-hidden'));
    
    let activeView = null;
    if (view === 'entry') activeView = entryView;
    else if (view === 'hub') activeView = hubView;
    else if (view === 'deck') activeView = deckView;
    else if (view === 'cta') activeView = ctaView;

    if (activeView) activeView.classList.remove('view-hidden');
}

// --- DECK & SLIDE LOGIC ---

function enterDeck(deckId) {
    const deckData = decks[deckId];
    if (!deckData) return;
    currentDeck = deckData;
    presentationContainer.innerHTML = currentDeck.map(slide => `<div class="slide">${renderSlideContent(slide)}</div>`).join('');
    switchView('deck');
    currentSlideIndex = -1;
    goToSlide(0);
}

function goToSlide(index) {
    if (!currentDeck || index < 0 || index >= currentDeck.length) return;
    
    currentSlideIndex = index;
    const slides = presentationContainer.querySelectorAll('.slide');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    updateControls();
    lucide.createIcons();
    // Add logic for interactive slides like the simulator if needed
}

function updateControls() {
    if (!currentDeck) return;
    progressDotsContainer.innerHTML = currentDeck.map((_, i) =>
        `<span class="dot ${i === currentSlideIndex ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === currentDeck.length - 1;
}

// --- INITIALIZATION ---

function initialize() {
    // Populate initial content
    entryView.innerHTML = entryContent;
    hubView.innerHTML = hubContent;
    ctaView.innerHTML = ctaContent;

    lucide.createIcons();
    initAnimatedBackground(prefersReduced);

    // Add all event listeners
    document.addEventListener('click', (e) => {
        if (e.target.closest('#enter-hub-btn')) switchView('hub');
        if (e.target.closest('#go-to-cta-btn')) switchView('cta');
        if (e.target.closest('#back-to-hub-from-cta')) switchView('hub');
        if (e.target.closest('button[data-target]')) {
            enterDeck(e.target.closest('button[data-target]').dataset.target);
        }
        if (e.target.matches('.dot')) {
            goToSlide(parseInt(e.target.dataset.index));
        }
        // Add CTA role button logic here
    });

    backToHubFromDeckBtn.addEventListener('click', () => switchView('hub'));
    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
    
    // Initial view
    switchView('entry');
}

document.addEventListener('DOMContentLoaded', initialize);
