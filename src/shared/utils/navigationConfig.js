/**
 * Navigation configuration for all app sections
 * Icons are referenced by name to avoid JSX in JS files
 * Icons are rendered in components that import them
 */
export const navigationConfig = {
  timeline: {
    title: 'Timeline',
    iconName: 'TimelineIcon',
    items: [
      {
        id: 'timeline-main',
        label: 'Timeline View',
        iconName: 'TimelineIcon',
        hasPage: true,
      },
      {
        id: 'timeline-filters',
        label: 'Filter Events',
        iconName: 'FilterListIcon',
        hasPage: false,
      },
    ],
  },

  genealogy: {
    title: 'Genealogy',
    iconName: 'FamilyRestroomIcon',
    items: [
      {
        id: 'genealogy-main',
        label: 'Family Tree',
        iconName: 'FamilyRestroomIcon',
        hasPage: true,
      },
      {
        id: 'genealogy-search',
        label: 'Search Genealogy',
        iconName: 'TimelineIcon',
        hasPage: false,
      },
    ],
  },

  journeys: {
    title: 'Journeys',
    iconName: 'FlightIcon',
    items: [
      {
        id: 'journeys',
        label: 'View All Journeys',
        iconName: 'FlightIcon',
        hasPage: true,
      },
      {
        id: 'journeys-map',
        label: 'Journey Map',
        iconName: 'TimelineIcon',
        hasPage: false,
      },
    ],
  },

  places: {
    title: 'Places',
    iconName: 'LocationOnIcon',
    items: [
      {
        id: 'places-main',
        label: 'Places Map',
        iconName: 'LocationOnIcon',
        hasPage: true,
      },
      {
        id: 'places-search',
        label: 'Search Places',
        iconName: 'FilterListIcon',
        hasPage: false,
      },
    ],
  },

  settings: {
    title: 'Settings',
    iconName: 'SettingsIcon',
    items: [
      {
        id: 'settings-main',
        label: 'General Settings',
        iconName: 'SettingsIcon',
        hasPage: true,
      },
      {
        id: 'settings-language',
        label: 'Language',
        iconName: 'LanguageIcon',
        hasPage: false,
      },
      {
        id: 'settings-theme',
        label: 'Theme (Dark/Light)',
        iconName: 'TuneIcon',
        hasPage: false,
      },
      {
        id: 'settings-units',
        label: 'Measurement Units',
        iconName: 'TuneIcon',
        hasPage: false,
      },
    ],
  },
}

/**
 * Get navigation items for a specific section
 * @param {string} section - Section name (timeline, genealogy, journeys, places, settings)
 * @returns {Array} - Array of menu items for that section
 */
export function getNavigationItems(section) {
  return navigationConfig[section]?.items || []
}

/**
 * Get all section names
 * @returns {Array} - Array of section names
 */
export function getAllSections() {
  return Object.keys(navigationConfig)
}
