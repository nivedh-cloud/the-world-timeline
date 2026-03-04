import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function PlacesPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [map, setMap] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/'
        const response = await fetch(`${baseUrl}assets/biblical_OldNew_places.json`)
        const data = await response.json()
        setPlaces(data)
      } catch (error) {
        console.error('Error loading places data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPlaces()
  }, [])

  // Initialize map when drawer opens or selected place changes
  useEffect(() => {
    if (drawerOpen && selectedPlace && !map) {
      setTimeout(() => {
        const mapContainer = document.getElementById('place-map')
        if (mapContainer && mapContainer.children.length === 0) {
          const [lat, lng] = selectedPlace['Lat, Lng'].split(',').map(v => parseFloat(v.trim()))
          
          const leafletMap = L.map('place-map', {
            zoomControl: true,
          }).setView([lat, lng], 10)

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
          }).addTo(leafletMap)

          L.marker([lat, lng]).addTo(leafletMap)
            .bindPopup(`<strong>${selectedPlace['Biblical Name English']}</strong><br/>${selectedPlace['Modern Name English']}`)
            .openPopup()

          setMap(leafletMap)
        }
      }, 100)
    }
  }, [drawerOpen, selectedPlace, map])

  const handlePlaceClick = (place) => {
    setSelectedPlace(place)
    setMap(null)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    if (map) {
      map.remove()
      setMap(null)
    }
  }

  // Filter places based on search term
  const filteredPlaces = places.filter(place => {
    const searchLower = searchTerm.toLowerCase()
    return (
      place['Biblical Name English']?.toLowerCase().includes(searchLower) ||
      place['Modern Name English']?.toLowerCase().includes(searchLower) ||
      place['Location Country']?.toLowerCase().includes(searchLower) ||
      place['Bible Reference']?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress sx={{ color: '#2196f3' }} />
          <Typography>Loading places data...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: '90px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header Card */}
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-4">
              Biblical Places
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Click on a place name to view it on the map.
            </Typography>
            <TextField
              placeholder="Search places by name, country, or bible reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Data Grid Table */}
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#2196f3' }}>
                <TableCell sx={{ fontWeight: 600, color: 'white', backgroundColor: '#2196f3' }}>Biblical Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'white', backgroundColor: '#2196f3' }}>Modern Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'white', backgroundColor: '#2196f3' }}>Country</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'white', backgroundColor: '#2196f3' }}>Importance</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'white', backgroundColor: '#2196f3' }}>Bible Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPlaces.map((place, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
                    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                  }}
                >
                  <TableCell 
                    sx={{ fontWeight: 600, color: '#2196f3', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    {place['Biblical Name English']}
                  </TableCell>
                  <TableCell>
                    {place['Modern Name English']}
                  </TableCell>
                  <TableCell>
                    {place['Location Country']}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', maxWidth: '200px' }}>
                    {place['Importance (English)']}
                  </TableCell>
                  <TableCell sx={{ color: '#2196f3', fontWeight: 500 }}>
                    {place['Bible Reference']}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Card>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {searchTerm ? (
                <>
                  Found: <strong>{filteredPlaces.length}</strong> of <strong>{places.length}</strong> places
                </>
              ) : (
                <>
                  Total Places: <strong>{places.length}</strong>
                </>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Right Drawer with Map */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        slotProps={{
          backdrop: {
            sx: {
              zIndex: 99,
            },
          },
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '400px', md: '500px' },
            boxSizing: 'border-box',
            zIndex: 100,
            maxHeight: { xs: 'calc(100vh - 90px)', sm: '100vh', md: '100vh' },
            top: { xs: 0, sm: 0, md: 0 },
            height: { xs: 'calc(100vh - 90px)', sm: '100vh', md: '100vh' },
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2196f3' }}>
              {selectedPlace?.['Biblical Name English']}
            </Typography>
            <IconButton onClick={handleCloseDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Place Details */}
          {selectedPlace && (
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Modern Name:</strong> {selectedPlace['Modern Name English']}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Country:</strong> {selectedPlace['Location Country']}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Bible Reference:</strong> {selectedPlace['Bible Reference']}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: '#555' }}>
                <strong>Significance:</strong> {selectedPlace['Importance (English)']}
              </Typography>
            </Box>
          )}

          {/* Map Container - Responsive Height */}
          <Box
            id="place-map"
            sx={{
              flex: 1,
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid #ddd',
              minHeight: { xs: '200px', sm: '400px', md: '500px' },
            }}
          />
        </Box>
      </Drawer>
    </Container>
  )
}
