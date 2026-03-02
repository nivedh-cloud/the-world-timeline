import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export default function GenealogyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-4">
              Genealogy
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Explore family trees, relationships, and genealogical connections throughout history.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-3">
              Features
            </Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>Interactive Family Tree View</li>
              <li>Person Profiles and Relationships</li>
              <li>Genealogical Timeline</li>
              <li>Connection Discovery</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
