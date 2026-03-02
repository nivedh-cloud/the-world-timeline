import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

const DRAWER_WIDTH = 250

const mainMenus = [
  {
    id: 'timeline',
    label: 'Timeline',
    subItems: [
      { id: 'timeline-view', label: 'Timeline View' },
      { id: 'timeline-events', label: 'Events' },
      { id: 'timeline-filters', label: 'Filters' },
    ],
  },
  {
    id: 'genealogy',
    label: 'Genealogy',
    subItems: [
      { id: 'genealogy-tree', label: 'Family Tree' },
      { id: 'genealogy-persons', label: 'Persons' },
      { id: 'genealogy-relationships', label: 'Relationships' },
    ],
  },
  {
    id: 'journeys',
    label: 'Journeys',
    subItems: [
      // The Patriarchs
      { id: 'journeys-abraham', label: 'Abraham: Ur to Canaan' },
      { id: 'journeys-jacob', label: 'Jacob: Journey to Haran' },
      { id: 'journeys-joseph', label: 'Joseph: Journey to Egypt' },
      // The Exodus & Conquest
      { id: 'journeys-exodus', label: 'The Exodus: Egypt to Sinai' },
      { id: 'journeys-wilderness', label: '40 Years in the Wilderness' },
      { id: 'journeys-joshua', label: "Joshua's Conquest Routes" },
      // Life of Jesus
      { id: 'journeys-jesus-birth', label: 'Birth & Flight to Egypt' },
      { id: 'journeys-jesus-ministry', label: 'Ministry in Galilee' },
      { id: 'journeys-jesus-passion', label: 'The Passion Week (Jerusalem)' },
      // The Apostles (Paul's Travels)
      { id: 'journeys-paul1', label: '1st Missionary Journey' },
      { id: 'journeys-paul2', label: '2nd Missionary Journey' },
      { id: 'journeys-paul3', label: '3rd Missionary Journey' },
      { id: 'journeys-rome', label: 'Voyage to Rome' },
    ],
  },
  {
    id: 'places',
    label: 'Places',
    subItems: [
      { id: 'places-map', label: 'Places Map' },
      { id: 'places-list', label: 'Places List' },
      { id: 'places-explore', label: 'Explore' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    subItems: [
      { id: 'settings-language', label: 'Language' },
      { id: 'settings-theme', label: 'Theme (Dark/Light)' },
      { id: 'settings-units', label: 'Measurement Units' },
    ],
  },
]

export default function Navigation({ open, onClose, activeMenu = 'timeline', onOpenFilters }) {
  const handleNavClick = (itemId) => {
    // Handle filters separately
    if (itemId === 'timeline-filters') {
      if (onOpenFilters) {
        onOpenFilters()
      }
      onClose()
      return
    }
    console.log(`Navigating to: ${itemId}`)
    onClose()
  }

  const currentMenu = mainMenus.find((menu) => menu.id === activeMenu)

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div className="p-4">
        <h3 className="text-xl font-bold" style={{ margin: '15px 0 5px 20px' }}>
          World Timeline
        </h3>
      </div>

      <Divider />

      {/* Main content - submenus */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
          {currentMenu && currentMenu.subItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(item.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
    </Drawer>
  )
}
