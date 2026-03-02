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
      'Abraham: Ur to Canaan',
      'Jacob: Journey to Haran',
      'Joseph: Journey to Egypt',
    ],
  },
  {
    title: 'The Exodus & Conquest',
    journeys: [
      'The Exodus: Egypt to Sinai',
      '40 Years in the Wilderness',
      "Joshua's Conquest Routes",
    ],
  },
  {
    title: 'Life of Jesus',
    journeys: [
      'Birth & Flight to Egypt',
      'Ministry in Galilee',
      'The Passion Week (Jerusalem)',
    ],
  },
  {
    title: 'The Apostles (Paul\'s Travels)',
    journeys: [
      '1st Missionary Journey',
      '2nd Missionary Journey',
      '3rd Missionary Journey',
      'Voyage to Rome',
    ],
  },
]

export default function JourneysPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
                      {journey}
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
