import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export default function PlacesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-4">
              Places
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Discover historical locations, landmarks, and geographical points of interest throughout history.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-3">
              Features
            </Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>Interactive Places Map</li>
              <li>Location Finder and Explorer</li>
              <li>Historical Place Information</li>
              <li>Geographic Timeline</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
