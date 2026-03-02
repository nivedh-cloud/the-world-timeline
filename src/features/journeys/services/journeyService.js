/**
 * Journey service - handles loading journey and marker data
 */

const journeyMap = {
  'journeys-abraham': {
    name: 'Abraham: Ur to Canaan',
    file: 'AbrahamsJourneyMarkers.json',
  },
  'journeys-jacob': {
    name: 'Jacob: Journey to Haran',
    file: 'JacobsJourneyMarkers.json',
  },
  'journeys-joseph': {
    name: 'Joseph: Journey to Egypt',
    file: 'JosephsJourneyMarkers.json',
  },
  'journeys-exodus': {
    name: 'The Exodus: Egypt to Sinai',
    file: 'ExodusJourneyMarkers.json',
  },
  'journeys-wilderness': {
    name: '40 Years in the Wilderness',
    file: 'WildernessJourneyMarkers.json',
  },
  'journeys-joshua': {
    name: "Joshua's Conquest Routes",
    file: 'JoshuaJourneyMarkers.json',
  },
  'journeys-jesus-birth': {
    name: 'Birth & Flight to Egypt',
    file: 'JesusBirthFlightMarkers.json',
  },
  'journeys-jesus-ministry': {
    name: 'Ministry in Galilee',
    file: 'JesusMinistryMarkers.json',
  },
  'journeys-jesus-passion': {
    name: 'The Passion Week (Jerusalem)',
    file: 'JesusPassionMarkers.json',
  },
  'journeys-paul1': {
    name: '1st Missionary Journey',
    file: 'Paul1stMissionaryMarkers.json',
  },
  'journeys-paul2': {
    name: '2nd Missionary Journey',
    file: 'Paul2ndMissionaryMarkers.json',
  },
  'journeys-paul3': {
    name: '3rd Missionary Journey',
    file: 'Paul3rdMissionaryMarkers.json',
  },
  'journeys-rome': {
    name: 'Voyage to Rome',
    file: 'PaulVoyageToRomeMarkers.json',
  },
}

/**
 * Fetch journey markers data
 * @param {string} journeyId - The journey identifier
 * @returns {Promise<Array>} - Array of journey markers with coordinates
 */
export async function fetchJourneyMarkers(journeyId) {
  try {
    const journey = journeyMap[journeyId]
    if (!journey) {
      console.error(`Journey not found: ${journeyId}`)
      return []
    }

    const filePath = `/assets/Journeys/${journey.file}`
    const response = await fetch(filePath)

    if (!response.ok) {
      console.warn(`Journey markers file not found: ${filePath}`)
      return []
    }

    const data = await response.json()

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.warn(`Invalid journey data format in ${filePath}`)
      return []
    }

    return data
  } catch (error) {
    console.error(`Error fetching journey markers for ${journeyId}:`, error)
    return []
  }
}

/**
 * Get journey name from ID
 * @param {string} journeyId - The journey identifier
 * @returns {string} - Journey name
 */
export function getJourneyName(journeyId) {
  return journeyMap[journeyId]?.name || ''
}

/**
 * Get journey file name from ID
 * @param {string} journeyId - The journey identifier
 * @returns {string} - Journey file name
 */
export function getJourneyFileName(journeyId) {
  return journeyMap[journeyId]?.file || ''
}
