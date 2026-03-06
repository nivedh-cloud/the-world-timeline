import { useState, useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Card, Button, Drawer, useTheme, useMediaQuery, Slider } from '@mui/material'
import { Close as CloseIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material'
import { useLanguage } from '../context/useLanguage'
import { getLocalizedName, getLocalizedDescription } from '../utils/languageUtils'

// Journey color mapping by category
const getJourneyColor = (journeyId) => {
  const colorMap = {
    // Blue for Patriarchal journeys
    'journeys-abraham': '#2196F3',
    'journeys-jacob': '#2196F3',
    'journeys-joseph': '#2196F3',
    
    // Red for Exodus/Wilderness
    'journeys-exodus': '#FF6B6B',
    'journeys-wilderness': '#FF6B6B',
    
    // Gold for Royal journeys
    'journeys-sheba-queen': '#FFD700',
    
    // Yellowish Green for Ruth & Naomi
    'journeys-ruth-naomi': '#9ACD32',
    
    // Teal for Sacred journeys (Ark)
    'journeys-ark': '#14B8A6',
    
    // Indigo for Prophetic journeys (Elijah)
    'journeys-elijah': '#4F46E5',
    
    // Purple for Apostolic journeys
    'journeys-paul1': '#9C27B0',
    'journeys-paul2': '#9C27B0',
    'journeys-paul3': '#9C27B0',
    'journeys-rome': '#9C27B0',
    'journeys-philip': '#9C27B0',
    
    // Green for Joshua's conquest
    'journeys-joshua': '#4CAF50',
    
    // Cyan for Jesus journeys
    'journeys-jesus-birth': '#00BCD4',
    'journeys-jesus-ministry': '#00BCD4',
    'journeys-jesus-passion': '#00BCD4',
  }
  
  return colorMap[journeyId] || '#FF6B6B'
}

// Custom AnimatedPolyline component that draws the path
const AnimatedPolyline = ({ positions, animationProgress, color = '#FF6B6B', weight = 5, opacity = 0.6 }) => {
  if (positions.length < 2) return null
  
  // Calculate how many segments to show based on animation progress
  const totalSegments = positions.length - 1
  const visibleSegments = Math.ceil((animationProgress / 100) * totalSegments)
  
  if (visibleSegments === 0) return null
  
  // Get the segments to display
  const segmentsToShow = positions.slice(0, visibleSegments + 1)
  
  return (
    <Polyline 
      positions={segmentsToShow}
      color={color}
      weight={weight}
      opacity={opacity}
    />
  )
}

const createJourneyMarkerIcon = (isMajorStop, size = 25) => {
  const color = isMajorStop ? '#FF6B6B' : '#4ECDC4'
  
  return L.divIcon({
    className: 'journey-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: ${size > 25 ? '11px' : '9px'};
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

// Function to create arrow decorations on polyline
const createArrowDecorations = (polylineCoords) => {
  if (polylineCoords.length < 2) return []

  const arrows = []
  const segmentCount = polylineCoords.length - 1
  
  // Place arrows at intervals along the path
  for (let i = 0; i < segmentCount; i += Math.ceil(segmentCount / 5)) {
    if (i < segmentCount) {
      arrows.push({
        start: polylineCoords[i],
        end: polylineCoords[i + 1],
      })
    }
  }

  return arrows
}

// Component to handle map bounds fitting
function MapBoundsFitter({ markers }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length > 0) {
      try {
        const coordinates = markers.map(m => [m.coords[0], m.coords[1]])
        const bounds = L.latLngBounds(coordinates)
        
        // Wait a bit for the map to fully render
        setTimeout(() => {
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 10,
            animate: true,
            duration: 0.5
          })
        }, 200)
      } catch (error) {
        console.error('Error fitting bounds:', error)
      }
    }
  }, [markers, map])

  return null
}

export default function JourneyMapComponent({ 
  markers, 
  journeyId,
  loading = false 
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { language } = useLanguage()
  
  // Get the color for this journey
  const journeyColor = getJourneyColor(journeyId)

  // Create polyline coordinates from markers
  const polylineCoords = markers.map(m => [m.coords[0], m.coords[1]])
  const mapCenter = markers.length > 0 
    ? [markers[0].coords[0], markers[0].coords[1]]
    : [35, 40]

  // Animation effect - auto-play when markers load or replay is triggered
  useEffect(() => {
    if (markers.length > 1 && isAnimating) {
      let startTime = null
      const animationDuration = 5000 // 5 seconds for slower animation
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min((elapsed / animationDuration) * 100, 100)
        
        setAnimationProgress(progress)
        
        if (progress < 100) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      const animationId = requestAnimationFrame(animate)
      
      return () => cancelAnimationFrame(animationId)
    }
  }, [markers.length, isAnimating])

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography>Loading journey data...</Typography>
      </Box>
    )
  }

  if (markers.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1,
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography>No journey data found</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflow: 'hidden' }}>
      {/* Map Section */}
      <Box sx={{ 
        overflow: 'hidden', 
        position: 'relative', 
        flex: 1,
        height: isMobile ? 'calc(100vh - 280px)' : 'auto',
        maxHeight: isMobile ? 'calc(100vh - 280px)' : 'none',
      }}>
        <MapContainer 
          center={mapCenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <MapBoundsFitter markers={markers} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Journey Path - Animated Line */}
          {polylineCoords.length > 1 && (
            <>
              {/* Animated path line */}
              <AnimatedPolyline 
                positions={polylineCoords}
                animationProgress={animationProgress}
                color={journeyColor}
                weight={5}
                opacity={0.6}
              />
              
              {/* Arrow decorations - appear as animation completes segments */}
              {createArrowDecorations(polylineCoords).map((arrow, index) => {
                // Only show arrow if animation has reached this segment
                const segmentProgress = (animationProgress / 100) * (polylineCoords.length - 1)
                if (segmentProgress < index * Math.ceil((polylineCoords.length - 1) / 5)) return null
                
                const [lat1, lng1] = arrow.start
                const [lat2, lng2] = arrow.end
                
                // Calculate angle for arrow rotation
                const angle = Math.atan2(lat2 - lat1, lng2 - lng1) * 180 / Math.PI
                
                return (
                  <Marker
                    key={`arrow-${index}`}
                    position={[(lat1 + lat2) / 2, (lng1 + lng2) / 2]}
                    icon={L.divIcon({
                      className: 'arrow-marker',
                      html: `
                        <div style="
                          width: 20px;
                          height: 20px;
                          transform: rotate(${angle}deg);
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 20px;
                          color: ${journeyColor};
                          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                          animation: fadeIn 0.3s ease-in;
                        ">
                          ▼
                        </div>
                      `,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })}
                  />
                )
              })}
            </>
          )}
          
          {/* Markers */}
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              position={[marker.coords[0], marker.coords[1]]}
              icon={createJourneyMarkerIcon(marker.isMajorStop, 22)}
            >
              <Popup>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {index + 1}. {getLocalizedName(marker, language)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                    {language === 'en' ? marker.name_tel : marker.name_eng}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {getLocalizedDescription(marker, language)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {marker.isMajorStop ? '★ Major Stop' : 'Minor stop'}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>

      {/* Animation Control Panel */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0', 
        bgcolor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={() => {
              setIsAnimating(false)
              setAnimationProgress(0)
              setTimeout(() => {
                setIsAnimating(true)
              }, 10)
            }}
            variant="contained"
            sx={{
              width: 40,
              height: 40,
              minWidth: 40,
              p: 0,
              borderRadius: '50%',
              bgcolor: journeyColor,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: journeyColor,
                opacity: 0.8,
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 20 }} />
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1 }}>
              Path Animation ({Math.round(animationProgress)}%)
            </Typography>
            <Slider
              value={animationProgress}
              onChange={(e, newValue) => {
                setAnimationProgress(newValue)
                setIsAnimating(false)
              }}
              min={0}
              max={100}
              step={1}
              sx={{
                '& .MuiSlider-thumb': {
                  backgroundColor: journeyColor,
                },
                '& .MuiSlider-track': {
                  backgroundColor: journeyColor,
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ccc',
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Button below animation controls */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Button 
          variant="contained" 
          fullWidth
          sx={{ 
            bgcolor: journeyColor,
            '&:hover': { bgcolor: journeyColor, opacity: 0.8 },
            textTransform: 'none',
            fontSize: '15px',
            py: 1.2,
          }}
          onClick={() => setDrawerOpen(true)}
        >
          Journey Routes Details
        </Button>
      </Box>

      {/* Right Drawer with Routes List */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : 380,
            boxSizing: 'border-box',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Journey Route ({markers.length} stops)
            </Typography>
            <Button 
              onClick={() => setDrawerOpen(false)}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <CloseIcon />
            </Button>
          </Box>

          {/* Routes List */}
          <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {markers.map((marker, index) => (
                <Card 
                  key={marker.id}
                  sx={{
                    p: 1.5,
                    borderLeft: `4px solid ${journeyColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: journeyColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}>
                      {index + 1}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {getLocalizedName(marker, language)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                        {language === 'en' ? marker.name_tel : marker.name_eng}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        {getLocalizedDescription(marker, language)}
                      </Typography>
                      {marker.isMajorStop && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: journeyColor, fontWeight: 600 }}>
                          ★ Major Stop
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
