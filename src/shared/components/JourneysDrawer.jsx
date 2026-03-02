import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import RouteIcon from '@mui/icons-material/Route'
import Divider from '@mui/material/Divider'
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

export default function JourneysDrawer({ open, onClose, onSelectJourney }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleJourneyClick = (journeyId, journeyLabel) => {
    console.log(`Selected journey: ${journeyLabel}`)
    onSelectJourney(journeyId, journeyLabel)
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : '350px',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Journeys
          </Typography>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Content */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {journeyCategories.map((category, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {/* Category Title */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#2196f3',
                  pl: 2,
                  mb: 1,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}
              >
                {category.title}
              </Typography>

              {/* Journey Items */}
              <List sx={{ p: 0 }}>
                {category.journeys.map((journey) => (
                  <ListItem key={journey.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleJourneyClick(journey.id, journey.label)}
                      sx={{
                        pl: 3,
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: '#2196f3' }}>
                        <RouteIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={journey.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {index < journeyCategories.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  )
}
