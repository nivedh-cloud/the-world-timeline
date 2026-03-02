import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme, useMediaQuery } from '@mui/material'
import 'leaflet/dist/leaflet.css'
import { fetchTimelineEvents } from '../services/timelineService'

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Generate year options from 3000 BCE to 2000 AD with interval of 10 years
const generateYearOptions = () => {
  const years = []
  for (let year = -3000; year <= 2000; year += 10) {
    const label = year < 0 ? `${Math.abs(year)} BCE` : `${year} AD`
    years.push({ value: year, label })
  }
  return years
}

// Create custom icons for different event categories
const createMarkerIcon = (category) => {
  const cat = String(category).trim()
  let color = '#FF9800' // Default orange
  
  console.log(`[DEBUG] createMarkerIcon called with category: "${category}" (trimmed: "${cat}")`)
  
  if (cat === 'Bible') {
    color = '#9C27B0' // Purple for Bible events
  } else if (cat === 'World') {
    color = '#FF9800' // Orange for World events
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

// Create custom cluster icons
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount()
  
  // Determine color based on child markers
  let bibleCount = 0
  let worldCount = 0
  
  cluster.getAllChildMarkers().forEach(marker => {
    const icon = marker.options.icon
    if (icon && icon.options && icon.options.html) {
      if (icon.options.html.includes('#9C27B0')) {
        bibleCount++
      } else if (icon.options.html.includes('#FF9800')) {
        worldCount++
      }
    }
  })
  
  // Choose cluster color based on content
  let clusterColor = '#FF9800' // Default to world orange
  if (bibleCount > 0 && worldCount === 0) {
    // Bible only - use purple
    clusterColor = '#9C27B0'
  } else if (worldCount > 0 && bibleCount === 0) {
    // World only - use orange
    clusterColor = '#FF9800'
  } else if (bibleCount > 0 && worldCount > 0) {
    // Mixed content - use pink/magenta
    clusterColor = '#E91E63'
  }

  return L.divIcon({
    html: `
      <div style="
        background-color: ${clusterColor};
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 16px;
      ">${count}</div>
    `,
    className: 'cluster-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

export default function TimelinePage({ selectedCategories = ['World'] }) {
  const [selectedYear, setSelectedYear] = useState(0)
  const [yearInputValue, setYearInputValue] = useState('0')
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventsDrawerOpen, setEventsDrawerOpen] = useState(false)
  const [clusterInfoOpen, setClusterInfoOpen] = useState(false)
  const [clusterEvents, setClusterEvents] = useState([])
  const [yearOptions] = useState(generateYearOptions())
  const mapRef = useRef(null)
  const markerClusterGroupRef = useRef(null)
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Log selectedCategories changes
  useEffect(() => {
    console.log(`[DEBUG] TimelinePage received selectedCategories:`, selectedCategories)
  }, [selectedCategories])

  // Set up cluster click handler
  useEffect(() => {
    if (!markerClusterGroupRef.current) return

    const clusterGroup = markerClusterGroupRef.current
    
    // Attach cluster click event listener
    const handleClusterClickEvent = (event) => {
      const cluster = event.cluster
      if (!cluster) return
      
      // Get all child markers
      const childMarkers = cluster.getAllChildMarkers()
      
      // Map markers to events
      const events = childMarkers.map(marker => {
        const latLng = marker.getLatLng()
        return markers.find(m => 
          Math.round(m.lat * 10000) === Math.round(latLng.lat * 10000) &&
          Math.round(m.lng * 10000) === Math.round(latLng.lng * 10000)
        )
      }).filter(e => e !== undefined)

      setClusterEvents(events)
      setClusterInfoOpen(true)
    }

    clusterGroup.on('clusterclick', handleClusterClickEvent)

    return () => {
      clusterGroup.off('clusterclick', handleClusterClickEvent)
    }
  }, [markers])

  
  // Load timeline events when year or selected categories change
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      let allMarkers = []
      
      // Fetch events for each selected category
      for (const category of selectedCategories) {
        console.log(`[DEBUG] Loading events for category: "${category}"`)
        const events = await fetchTimelineEvents(selectedYear, category)
        console.log(`[DEBUG] Loaded ${events.length} events for category "${category}"`)
        const eventsWithCategory = events.map(event => ({
          ...event,
          category,
        }))
        allMarkers = [...allMarkers, ...eventsWithCategory]
      }
      
      console.log(`[DEBUG] Total markers to display: ${allMarkers.length}`)
      console.log(`[DEBUG] Marker categories:`, allMarkers.map(m => m.category))
      setMarkers(allMarkers)
      setLoading(false)
    }
    
    loadEvents()
  }, [selectedYear, selectedCategories])

  const handleYearChange = (event) => {
    const year = event.target.value
    setSelectedYear(year)
    setYearInputValue(year.toString())
  }

  const handleYearInputChange = (event) => {
    const value = event.target.value
    setYearInputValue(value)
    
    // Allow empty input while typing
    if (value === '' || value === '-') {
      return
    }
    
    const year = parseInt(value, 10)
    
    // Validate: year must be between -3000 and 2000
    if (!isNaN(year) && year >= -3000 && year <= 2000) {
      setSelectedYear(year)
    }
  }

  const handleYearInputBlur = () => {
    // If input is empty or invalid, reset to current year
    if (yearInputValue === '' || yearInputValue === '-') {
      setYearInputValue(selectedYear.toString())
    }
  }

  const handleOpenEventsDrawer = () => {
    setEventsDrawerOpen(true)
  }

  const handleCloseEventsDrawer = () => {
    setEventsDrawerOpen(false)
  }

  const handleZoomToEvent = (event) => {
    if (mapRef.current) {
      const map = mapRef.current
      // Zoom to the specific location with an offset padding
      map.setView([event.lat, event.lng], 12, {
        animate: true,
        duration: 0.5,
      })
    }
    setClusterInfoOpen(false)
  }

  const defaultCenter = [20.5937, 78.9629]

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
            <TextField
              label="Or enter year"
              type="number"
              size="small"
              value={yearInputValue}
              onChange={handleYearInputChange}
              onBlur={handleYearInputBlur}
              helperText="e.g., -2000 for 2000 BCE or 1000 for 1000 AD"
              sx={{ width: 200 }}
            />
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
          position: 'relative',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ width: '100%', height: '100%' }}>
            <MapContainer
              center={defaultCenter}
              zoom={3}
              style={{ width: '100%', height: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerClusterGroup 
                ref={markerClusterGroupRef}
                iconCreateFunction={createClusterIcon}
              >
                {markers.map((marker, index) => (
                  <Marker
                    key={index}
                    position={[marker.lat, marker.lng]}
                    icon={createMarkerIcon(marker.category)}
                  >
                    <Popup>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {marker.title}
                      </Typography>
                      <Typography variant="body2">
                        {marker.description}
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
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
            <TextField
              label="Or enter year"
              type="number"
              size="small"
              fullWidth
              value={yearInputValue}
              onChange={handleYearInputChange}
              onBlur={handleYearInputBlur}
              helperText="e.g., -2000 for 2000 BCE or 1000 for 1000 AD"
            />
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

      {/* Cluster Info Dialog */}
      <Dialog
        open={clusterInfoOpen}
        onClose={() => setClusterInfoOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">Events in this Area</Typography>
            <Typography variant="caption" color="textSecondary">
              {clusterEvents.length} event(s)
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setClusterInfoOpen(false)}
            sx={{ p: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {clusterEvents.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No events found
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {clusterEvents.map((event, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => handleZoomToEvent(event)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                      borderLeft: `4px solid ${event.category === 'Bible' ? '#9C27B0' : '#FF9800'}`,
                      pl: 2,
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="textSecondary" display="block">
                            {event.description}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#2196f3', fontWeight: 500 }}>
                            Click to zoom
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'subtitle2', sx: { fontWeight: 600 } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}

