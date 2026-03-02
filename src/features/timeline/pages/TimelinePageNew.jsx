import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme, useMediaQuery } from '@mui/material'

// Generate year options from 3000 BCE to 2000 AD with interval of 10 years
const generateYearOptions = () => {
  const years = []
  for (let year = -3000; year <= 2000; year += 10) {
    const label = year < 0 ? `${Math.abs(year)} BCE` : `${year} AD`
    years.push({ value: year, label })
  }
  return years
}

// Mock function to fetch timeline events for a given year
const fetchTimelineEvents = async (year) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data - showing different events for different year ranges
      const mockEvents = []
      const baseEvents = [
        { lat: 20.5937, lng: 78.9629, title: 'India', year },
        { lat: 35.8617, lng: 104.1954, title: 'China', year },
        { lat: 51.5074, lng: -0.1278, title: 'London', year },
        { lat: 40.7128, lng: -74.006, title: 'New York', year },
        { lat: -33.8688, lng: 151.2093, title: 'Sydney', year },
      ]
      
      // Randomly select 2-4 events for variation
      const numEvents = Math.floor(Math.random() * 3) + 2
      for (let i = 0; i < numEvents; i++) {
        mockEvents.push({
          ...baseEvents[i],
          description: `Event in ${baseEvents[i].title} in ${year < 0 ? Math.abs(year) + ' BCE' : year + ' AD'}`,
        })
      }
      
      resolve(mockEvents)
    }, 500)
  })
}

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState(0)
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventsDrawerOpen, setEventsDrawerOpen] = useState(false)
  const [mapKey] = useState('AIzaSyC5R-s5hJKFKlYNNxHVJXzk5FxD6gGqG7Y') // Replace with your actual API key
  const [yearOptions] = useState(generateYearOptions())
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  
  // Load timeline events when year changes
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const events = await fetchTimelineEvents(selectedYear)
      setMarkers(events)
      setLoading(false)
    }
    
    loadEvents()
  }, [selectedYear])

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const handleOpenEventsDrawer = () => {
    setEventsDrawerOpen(true)
  }

  const handleCloseEventsDrawer = () => {
    setEventsDrawerOpen(false)
  }

  const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629,
  }

  const selectedYearLabel = selectedYear < 0 ? `${Math.abs(selectedYear)} BCE` : `${selectedYear} AD`

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Desktop: Year Selector at Top */}
      {!isMobile && (
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Select Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                label="Select Year"
              >
                {yearOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2196f3' }}>
              Selected: {selectedYearLabel}
            </Typography>
            {markers.length > 0 && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleOpenEventsDrawer}
              >
                View Events ({markers.length})
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Map Area - Takes All Available Space */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          p: isMobile ? 0.5 : 1,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <LoadScript googleMapsApiKey={mapKey}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={defaultCenter}
                zoom={3}
              >
                {markers.map((marker, index) => (
                  <MarkerF
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.title}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </Box>
        )}
      </Box>

      {/* Mobile: Year Selector at Bottom */}
      {isMobile && (
        <Box sx={{ p: 2, borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: 'column' }}>
            <FormControl sx={{ minWidth: '100%' }}>
              <InputLabel>Select Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                label="Select Year"
              >
                {yearOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2196f3', width: '100%', textAlign: 'center' }}>
              Selected: {selectedYearLabel}
            </Typography>
            {markers.length > 0 && (
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={handleOpenEventsDrawer}
              >
                View Events ({markers.length})
              </Button>
            )}
          </Box>
        </Box>
      )}

      {/* Events Drawer */}
      <Drawer
        anchor="right"
        open={eventsDrawerOpen}
        onClose={handleCloseEventsDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '400px',
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div">
              Events in {selectedYearLabel}
            </Typography>
            <IconButton
              onClick={handleCloseEventsDrawer}
              sx={{ p: 0 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {markers.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No events found for {selectedYearLabel}
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {markers.map((marker, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      borderLeft: '4px solid #2196f3',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {marker.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {marker.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
