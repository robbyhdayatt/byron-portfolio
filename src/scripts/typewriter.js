/**
 * typewriter.js — Glitch-Free 2-Line Typographic Typewriter Engine
 * Persistent cursor nodes, perfectly synchronized lifecycle, and natural cadence.
 */

let typewriterTimeout = null;
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let phrases = ['Robby Hidayat', 'Software Developer'];
let isInitialized = false;

function splitIntoTwoLines(text) {
  if (!text) return { line1: '', line2: '' };
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) {
    return { line1: words[0], line2: '' };
  }
  if (words.length === 2) {
    return { line1: words[0], line2: words[1] };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' ')
  };
}

export function updateTypewriterPhrases(name, title) {
  if (name && title) {
    phrases = [name, title];
  } else if (name) {
    phrases = [name, 'Software Developer'];
  }
}

export function initTypewriter(prefersReducedMotion) {
  const text1El = document.querySelector('.tw-text-1');
  const text2El = document.querySelector('.tw-text-2');
  const cursor1El = document.querySelector('.tw-cursor-1');
  const cursor2El = document.querySelector('.tw-cursor-2');
  const heroNameEl = document.querySelector('.hero-big-name');

  if (!text1El || !text2El || !cursor1El || !cursor2El) return;

  const firstPhrase = splitIntoTwoLines(phrases[0]);

  if (prefersReducedMotion) {
    text1El.textContent = firstPhrase.line1;
    text2El.textContent = firstPhrase.line2;
    cursor1El.style.display = 'none';
    cursor2El.style.display = 'none';
    return;
  }

  if (heroNameEl) {
    heroNameEl.setAttribute('aria-label', phrases.join(' — '));
  }

  // Clear any existing timer
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }

  // Initialize with the full first phrase ("Robby Hidayat")
  text1El.textContent = firstPhrase.line1;
  text2El.textContent = firstPhrase.line2;
  cursor1El.style.display = 'none';
  cursor2El.style.display = 'inline-block';

  currentPhraseIndex = 0;
  currentCharIndex = firstPhrase.line1.length + firstPhrase.line2.length;
  isDeleting = true; // First action after reading pause will be deleting

  // Listen to preloader completion or start after a clean reading pause
  if (!isInitialized) {
    isInitialized = true;
    window.addEventListener('preloaderComplete', () => {
      startCycle(text1El, text2El, cursor1El, cursor2El);
    }, { once: true });

    // Fallback timer if preloader is already done
    typewriterTimeout = setTimeout(() => {
      startCycle(text1El, text2El, cursor1El, cursor2El);
    }, 2800);
  }
}

function startCycle(text1El, text2El, cursor1El, cursor2El) {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
  }
  // Allow user to appreciate "Robby Hidayat" for 2.2s after preloader finishes
  typewriterTimeout = setTimeout(() => {
    step(text1El, text2El, cursor1El, cursor2El);
  }, 2200);
}

function step(text1El, text2El, cursor1El, cursor2El) {
  const rawPhrase = phrases[currentPhraseIndex % phrases.length];
  const { line1, line2 } = splitIntoTwoLines(rawPhrase);
  const totalLength = line1.length + line2.length;

  if (isDeleting) {
    currentCharIndex--;
  } else {
    currentCharIndex++;
  }

  const currentStep = Math.max(0, Math.min(currentCharIndex, totalLength));

  if (currentStep <= line1.length) {
    // Current text is on Line 1
    text1El.textContent = line1.substring(0, currentStep);
    text2El.textContent = '';
    cursor1El.style.display = 'inline-block';
    cursor2El.style.display = 'none';
  } else {
    // Line 1 is fully rendered, text is on Line 2
    text1El.textContent = line1;
    text2El.textContent = line2.substring(0, currentStep - line1.length);
    cursor1El.style.display = 'none';
    cursor2El.style.display = 'inline-block';
  }

  let delay;

  if (!isDeleting) {
    // Typing forward (smooth 60–90ms)
    const isAtBoundary = currentStep === line1.length;
    delay = isAtBoundary ? 160 : 65 + Math.random() * 30;

    // Full word completed
    if (currentStep === totalLength) {
      delay = 2400; // Reading pause
      isDeleting = true;
    }
  } else {
    // Deleting backward (smooth accelerating backspace 28–48ms)
    const progress = currentStep / (totalLength || 1);
    delay = 26 + Math.round(progress * 22);

    // Fully deleted
    if (currentStep === 0) {
      isDeleting = false;
      currentPhraseIndex++;
      delay = 400; // Brief breather before next phrase
    }
  }

  typewriterTimeout = setTimeout(() => {
    step(text1El, text2El, cursor1El, cursor2El);
  }, delay);
}
