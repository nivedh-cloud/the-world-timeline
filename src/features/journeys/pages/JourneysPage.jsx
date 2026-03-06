import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useTheme, useMediaQuery } from '@mui/material'

const journeyCategories = [
  {
    title: 'The Patriarchs',
    journeys: [
      { id: 'journeys-abraham', label: 'Abraham: Ur to Canaan' },
      { id: 'journeys-jacob', label: 'Jacob: Journey to Haran' },
      { id: 'journeys-joseph', label: 'Joseph: Journey to Egypt' },
    ],
  },
  {
    title: 'Kings & Rulers',
    journeys: [
      { id: 'journeys-sheba-queen', label: 'Queen of Sheba: Journey to Jerusalem' },
    ],
  },
  {
    title: 'The Exodus & Conquest',
    journeys: [
      { id: 'journeys-exodus', label: 'The Exodus: Egypt to Sinai' },
      { id: 'journeys-wilderness', label: '40 Years in the Wilderness' },
      { id: 'journeys-joshua', label: "Joshua's Conquest Routes" },
    ],
  },
  {
    title: 'Life of Jesus',
    journeys: [
      { id: 'journeys-jesus-birth', label: 'Birth & Flight to Egypt' },
      { id: 'journeys-jesus-ministry', label: 'Ministry in Galilee' },
      { id: 'journeys-jesus-passion', label: 'The Passion Week (Jerusalem)' },
    ],
  },
  {
    title: 'The Apostles (Paul\'s Travels)',
    journeys: [
      { id: 'journeys-paul1', label: '1st Missionary Journey' },
      { id: 'journeys-paul2', label: '2nd Missionary Journey' },
      { id: 'journeys-paul3', label: '3rd Missionary Journey' },
      { id: 'journeys-rome', label: 'Voyage to Rome' },
    ],
  },
]

export default function JourneysPage({ onSelectJourney }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleJourneyClick = (journey) => {
    if (onSelectJourney) {
      onSelectJourney(journey.id, journey.label)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header Card */}
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-4">
              Journeys
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Explore major journeys throughout biblical history from the Patriarchs to the Apostles.
            </Typography>
          </CardContent>
        </Card>

        {/* Journey Categories */}
        {journeyCategories.map((category, index) => (
          <Card key={index}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 600, color: '#2196f3' }}>
                {category.title}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 1.5 }}>
                {category.journeys.map((journey, jIndex) => (
                  <Box
                    key={jIndex}
                    onClick={() => handleJourneyClick(journey)}
                    sx={{
                      p: 1.5,
                      backgroundColor: '#f5f5f5',
                      borderLeft: '4px solid #2196f3',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {journey.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Info Card */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-3">
              About These Journeys
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click on any journey to view detailed maps, routes, and historical information. Each journey is tracked with geographic coordinates and timeline information to help you understand the travels of biblical figures and the expansion of early Christianity.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
