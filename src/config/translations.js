import { tamil } from './languages/ta';
import { tanglish } from './languages/tg';
import { english } from './languages/en';

/**
 * Translations for the Elvan Kananam Billing App
 * 
 * Supports: 
 * 1. ta_mixed (Tamil + English)
 * 2. tg_mixed (Tanglish + English)
 * 3. ta_only (Tamil Only)
 * 4. en_only (English Only)
 */

export const translations = {
    ta_mixed: tamil,
    tg_mixed: tanglish,
    ta_only: tamil,
    en_only: english
};

// Aliases for backward compatibility or simpler logic
translations.ta = tamil;
translations.en = english;

export const DEFAULT_LANGUAGE = 'ta_mixed';

/**
 * Helper to determine if subtitles should be shown based on language mode
 */
export const showSubtitles = (lang) => {
    return lang === 'ta_mixed';
};

export const getTranslation = (lang) => translations[lang] || translations[DEFAULT_LANGUAGE];

export default translations;
