import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import D3Chart from '../components/D3Chart'

export default function GenealogyPage() {
  const [genealogyData, setGenealogyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGenealogyData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/'
        const response = await fetch(`${baseUrl}assets/Geneallogy/genealogy-bilingual-improved.json`)
        const data = await response.json()
        setGenealogyData(data)
      } catch (error) {
        console.error('Error loading genealogy data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGenealogyData()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 3, pb: '90px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" className="mb-4" sx={{ fontWeight: 600, color: '#2196f3' }}>
              Family Tree - Genealogy
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Explore interactive family trees and genealogical connections throughout biblical history. 
              Search by name, zoom and pan to navigate, and click on individuals to view their details.
            </Typography>
          </CardContent>
        </Card>

        {/* D3 Chart */}
        <D3Chart genealogyData={genealogyData} loading={loading} />

        {/* Features */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-3" sx={{ fontWeight: 600 }}>
              Features
            </Typography>
            <ul className="list-disc list-inside space-y-2">
              <li>Interactive D3.js Family Tree Visualization</li>
              <li>Bilingual Support (English & Telugu)</li>
              <li>Search by Name (Cross-language)</li>
              <li>Pan and Zoom Controls</li>
              <li>Click Individuals to View Details</li>
              <li>Toggle Between Vertical and Horizontal Layouts</li>
              <li>Download Tree as Image</li>
              <li>Responsive Design (Desktop & Mobile)</li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
