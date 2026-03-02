/**
 * Language utility functions for translating content
 */

const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  TELUGU: 'te',
}

/**
 * Helper function to get translated text based on language
 * @param {object} data - Object with name_eng and name_tel properties
 * @param {string} language - Current language code
 * @returns {string} - Translated text
 */
export function getLocalizedName(data, language) {
  if (!data) return ''
  
  if (language === SUPPORTED_LANGUAGES.TELUGU) {
    return data.name_tel || data.name_eng || ''
  }
  
  return data.name_eng || data.name_tel || ''
}

/**
 * Helper function to get translated description
 * @param {object} data - Object with description property
 * @param {string} language - Current language code
 * @returns {string} - Translated description
 */
export function getLocalizedDescription(data, language) {
  if (!data) return ''
  
  if (language === SUPPORTED_LANGUAGES.TELUGU && data.description_tel) {
    return data.description_tel
  }
  
  return data.description || ''
}

export { SUPPORTED_LANGUAGES }
