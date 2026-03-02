import React, { createContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  TELUGU: 'te',
}

const LANGUAGE_NAMES = {
  en: 'English',
  te: 'තେలుగు (Telugu)',
}

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Try to get from localStorage, default to English
    const saved = localStorage.getItem('app-language')
    return saved || SUPPORTED_LANGUAGES.ENGLISH
  })

  // Save to localStorage whenever language changes
  useEffect(() => {
    localStorage.setItem('app-language', language)
  }, [language])

  const changeLanguage = (newLanguage) => {
    if (Object.values(SUPPORTED_LANGUAGES).includes(newLanguage)) {
      setLanguage(newLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, SUPPORTED_LANGUAGES, LANGUAGE_NAMES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export { LanguageProvider, LanguageContext, SUPPORTED_LANGUAGES, LANGUAGE_NAMES }
