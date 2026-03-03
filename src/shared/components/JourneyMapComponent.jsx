import { useRef, useState, useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Card, Button, Drawer, useTheme, useMediaQuery } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useLanguage } from '../context/useLanguage'
import { getLocalizedName, getLocalizedDescription } from '../utils/languageUtils'

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

export default function JourneyMapComponent({ 
  markers, 
  loading = false 
}) {
  const mapRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { language } = useLanguage()

  // Create polyline coordinates from markers
  const polylineCoords = markers.map(m => [m.coords[0], m.coords[1]])
  const mapCenter = markers.length > 0 
    ? [markers[0].coords[0], markers[0].coords[1]]
    : [35, 40]

  // Fit bounds when map loads or markers change
  useEffect(() => {
    if (mapRef.current && markers.length > 0) {
      const map = mapRef.current
      const coordinates = markers.map(m => [m.coords[0], m.coords[1]])
      const bounds = L.latLngBounds(coordinates)
      
      // Use longer timeout for mobile to ensure map is fully rendered
      const timeoutId = setTimeout(() => {
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 12
        })
      }, isMobile ? 300 : 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [markers, isMobile])

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
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Journey Path - Thick Line */}
          {polylineCoords.length > 1 && (
            <>
              {/* Main path line - thicker (5px) */}
              <Polyline 
                positions={polylineCoords}
                color="#FF6B6B"
                weight={5}
                opacity={0.6}
              />
              
              {/* Arrow decorations */}
              {createArrowDecorations(polylineCoords).map((arrow, index) => {
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
                          color: #FF6B6B;
                          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
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

      {/* Button below map */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Button 
          variant="contained" 
          fullWidth
          sx={{ 
            bgcolor: '#FF6B6B',
            '&:hover': { bgcolor: '#FF5252' },
            textTransform: 'none',
            fontSize: '15px',
            py: 1.2,
          }}
          onClick={() => setDrawerOpen(true)}
        >
          Journey Routes
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
                    borderLeft: `4px solid ${marker.isMajorStop ? '#FF6B6B' : '#4ECDC4'}`,
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
                      bgcolor: marker.isMajorStop ? '#FF6B6B' : '#4ECDC4',
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
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#FF6B6B', fontWeight: 600 }}>
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
