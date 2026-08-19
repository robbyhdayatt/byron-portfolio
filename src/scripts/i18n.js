/**
 * i18n.js — Language switcher module
 * Handles switching between Indonesian and English
 */
import { translations } from '../data/translations.js';

let currentLang = localStorage.getItem('byron-lang') || 'id';

/**
 * Get current language
 */
export function getLang() {
  return currentLang;
}

/**
 * Get a translation string
 */
export function t(key) {
  return translations[currentLang]?.[key] || translations.id[key] || key;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (!value) return;

    // Check if it's an attribute target
    const attr = el.getAttribute('data-i18n-attr');
    if (attr === 'placeholder') {
      el.placeholder = value;
    } else if (attr === 'aria-label') {
      el.setAttribute('aria-label', value);
    } else {
      // Default: set innerHTML (supports <strong> etc.)
      el.innerHTML = value;
    }
  });

  // Update lang attribute on html element
  document.documentElement.lang = currentLang;

  // Update the switch button text
  const switchBtn = document.querySelector('.lang-switch-text');
  if (switchBtn) {
    switchBtn.textContent = t('lang_switch');
  }
}

/**
 * Toggle between languages
 */
export function toggleLang() {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('byron-lang', currentLang);
  applyTranslations();

  // Dispatch event so other modules can react
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
}

/**
 * Initialize i18n system
 */
export function init() {
  // Apply initial translations
  applyTranslations();

  // Bind language switch button
  const switchBtn = document.querySelector('.lang-switch');
  if (switchBtn) {
    switchBtn.addEventListener('click', toggleLang);
  }
}
