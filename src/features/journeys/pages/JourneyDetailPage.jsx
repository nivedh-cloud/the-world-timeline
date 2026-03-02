import { useEffect, useState } from 'react'
import { Box, Typography, IconButton, CircularProgress } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import JourneyMapComponent from '../../../shared/components/JourneyMapComponent'
import { fetchJourneyMarkers, getJourneyName } from '../services/journeyService'

export default function JourneyDetailPage({ journeyId, onBack }) {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)
  const journeyName = getJourneyName(journeyId)

  useEffect(() => {
    const loadJourneyData = async () => {
      setLoading(true)
      const journeyMarkers = await fetchJourneyMarkers(journeyId)
      setMarkers(journeyMarkers)
      setLoading(false)
    }

    loadJourneyData()
  }, [journeyId])

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      bgcolor: '#f5f5f5',
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#2196f3', 
        color: 'white', 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <IconButton 
          onClick={onBack}
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">{journeyName}</Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flex: 1,
          flexDirection: 'column',
          gap: 2,
        }}>
          <CircularProgress sx={{ color: '#2196f3' }} />
          <Typography>Loading journey data...</Typography>
        </Box>
      )}

      {/* Journey Map Component */}
      {!loading && (
        <JourneyMapComponent 
          markers={markers}
          loading={false}
        />
      )}
    </Box>
  )
}
