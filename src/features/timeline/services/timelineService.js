/**
 * Determine the 100-year range file name for a given year
 * @param {number} year - The year (negative for BCE, positive for AD)
 * @param {string} category - The category (Bible or World)
 * @returns {string} - The file name for that year range
 */
function getFileName(year, category = 'World') {
  // Calculate the range start and end for 100-year intervals
  let rangeStart, rangeEnd
  
  if (year >= 0) {
    // For positive years (AD/CE)
    rangeStart = Math.floor(year / 100) * 100
    rangeEnd = rangeStart + 100
    return `${rangeStart}To${rangeEnd}-${category}Events.json`
  } else {
    // For negative years (BCE)
    rangeStart = Math.ceil(year / 100) * 100
    rangeEnd = rangeStart - 100
    return `${rangeEnd}To${rangeStart}-${category}Events.json`
  }
}

/**
 * Transform raw event data from JSON to component format
 * @param {object} rawEvent - Raw event from JSON
 * @returns {object} - Transformed event object
 */
function transformEventData(rawEvent) {
  return {
    title: rawEvent.name_en || rawEvent.name || 'Unnamed Event',
    description: rawEvent.desc_en || rawEvent.description || '',
    year: rawEvent.year,
    lat: rawEvent.location?.lat || 0,
    lng: rawEvent.location?.lng || 0,
    // Keep original data for reference
    original: rawEvent,
  }
}

/**
 * Fetch timeline events for a specific year
 * @param {number} year - The year to fetch events for
 * @param {string} category - The category (Bible or World)
 * @returns {Promise<Array>} - Array of transformed events
 */
export async function fetchTimelineEvents(year, category = 'World') {
  try {
    // Determine the file name based on year and category
    const fileName = getFileName(year, category)
    const baseUrl = import.meta.env.BASE_URL || '/'
    const filePath = `${baseUrl}assets/${category}/${fileName}`
    
    console.log(`[DEBUG] Fetching events - Year: ${year}, Category: "${category}", File: ${filePath}`)
    
    const response = await fetch(filePath)
    
    if (!response.ok) {
      console.warn(`File not found: ${filePath}`)
      return []
    }
    
    const data = await response.json()
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.warn(`Invalid data format in ${filePath}`)
      return []
    }
    
    // Transform all events to component format
    const transformedEvents = data.map(transformEventData)
    return transformedEvents
  } catch (error) {
    console.error(`Error fetching timeline events for year ${year}:`, error)
    return []
  }
}

/**
 * Fetch events from the main events.json file
 * @returns {Promise<Array>} - Array of all events
 */
export async function fetchAllEvents() {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${baseUrl}assets/events.json`)
    
    if (!response.ok) {
      console.warn('Could not fetch main events file')
      return []
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching all events:', error)
    return []
  }
}

/**
 * Fetch biblical places data
 * @returns {Promise<Array>} - Array of biblical places
 */
export async function fetchBiblicalPlaces() {
  try {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const response = await fetch(`${baseUrl}assets/biblical_OldNew_places.json`)
    
    if (!response.ok) {
      console.warn('Could not fetch biblical places')
      return []
    }
    
    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching biblical places:', error)
    return []
  }
}

/**
 * Convert a year value to display format
 * @param {number} year - The year value
 * @returns {string} - Formatted year string (e.g., "2000 BCE" or "1000 AD")
 */
export function formatYear(year) {
  if (year < 0) {
    return `${Math.abs(year)} BCE`
  } else if (year === 0) {
    return '0 AD'
  } else {
    return `${year} AD`
  }
}
