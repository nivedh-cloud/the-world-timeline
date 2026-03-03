import React from 'react'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TimelineIcon from '@mui/icons-material/Timeline'
import EventIcon from '@mui/icons-material/Event'
import FilterListIcon from '@mui/icons-material/FilterList'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import PersonIcon from '@mui/icons-material/Person'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import FlightIcon from '@mui/icons-material/Flight'
import MapIcon from '@mui/icons-material/Map'
import RouteIcon from '@mui/icons-material/Route'
import HistoryIcon from '@mui/icons-material/History'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PublicIcon from '@mui/icons-material/Public'
import ListIcon from '@mui/icons-material/List'
import ExploreIcon from '@mui/icons-material/Explore'
import SettingsIcon from '@mui/icons-material/Settings'
import TuneIcon from '@mui/icons-material/Tune'
import LanguageIcon from '@mui/icons-material/Language'
import NotificationsIcon from '@mui/icons-material/Notifications'

const SIDEBAR_WIDTH = 280

const menuItems = [
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <TimelineIcon />,
    hasPage: true,
    subItems: [
      { id: 'timeline-view', label: 'Timeline View', icon: <TimelineIcon /> },
      { id: 'timeline-events', label: 'Events', icon: <EventIcon /> },
      { id: 'timeline-filters', label: 'Filters', icon: <FilterListIcon /> },
    ],
  },
  {
    id: 'genealogy',
    label: 'Genealogy',
    icon: <FamilyRestroomIcon />,
    hasPage: true,
    subItems: [
      { id: 'genealogy-tree', label: 'Family Tree', icon: <FamilyRestroomIcon /> },
      { id: 'genealogy-persons', label: 'Persons', icon: <PersonIcon /> },
      { id: 'genealogy-relationships', label: 'Relationships', icon: <CompareArrowsIcon /> },
    ],
  },
  {
    id: 'journeys',
    label: 'Journeys',
    icon: <FlightIcon />,
    hasPage: false,
    subItems: [
      { id: 'journeys-view', label: 'View All Journeys', icon: <FlightIcon /> },
      { id: 'journeys-map', label: 'Journey Map', icon: <MapIcon /> },
    ],
  },
  {
    id: 'places',
    label: 'Places',
    icon: <LocationOnIcon />,
    hasPage: true,
    subItems: [
      { id: 'places-map', label: 'Places Map', icon: <PublicIcon /> },
      { id: 'places-list', label: 'Places List', icon: <ListIcon /> },
      { id: 'places-explore', label: 'Explore', icon: <ExploreIcon /> },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    hasPage: false,
    subItems: [
      { id: 'settings-language', label: 'Language', icon: <LanguageIcon /> },
      { id: 'settings-theme', label: 'Theme (Dark/Light)', icon: <TuneIcon /> },
      { id: 'settings-units', label: 'Measurement Units', icon: <TuneIcon /> },
    ],
  },
]

export default function DesktopSidebar({ activeMenu, onMenuItemClick, onOpenFilters }) {
  const [expanded, setExpanded] = React.useState('timeline')

  const handleAccordionChange = (menu) => (event, isExpanded) => {
    setExpanded(isExpanded ? menu.id : false)
    // If this menu has a page and is being expanded, navigate to it
    if (isExpanded && menu.hasPage) {
      onMenuItemClick(menu.id)
    }
    // If menu is journeys, open the journeys drawer
    if (isExpanded && menu.id === 'journeys') {
      onMenuItemClick('journeys')
    }
  }

  const handleSubItemClick = (itemId, menuId) => {
    // Handle filters separately
    if (itemId === 'timeline-filters') {
      if (onOpenFilters) {
        onOpenFilters()
      }
      return
    }
    // Settings sub-items are handled separately (for now, just log)
    if (menuId === 'settings') {
      console.log(`Settings option clicked: ${itemId}`)
      return
    }
    // For journeys, navigate to the main journeys page
    if (menuId === 'journeys') {
      onMenuItemClick('journeys')
      return
    }
    // Other sub-items navigate to pages
    console.log(`Navigating to: ${itemId}`)
    onMenuItemClick(itemId)
  }

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #ddd',
          backgroundColor: '#fff',
        }}
      >
        {/* <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2196f3' }}>
          World Timeline
        </h3> */}
      </Box>

      {/* Accordion Menus */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {menuItems.map((menu) => (
          <Accordion
            key={menu.id}
            expanded={expanded === menu.id}
            onChange={handleAccordionChange(menu)}
            sx={{
              '&::before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${menu.id}-content`}
              id={`${menu.id}-header`}
              sx={{
                backgroundColor: activeMenu === menu.id ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
                py: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ color: '#2196f3', display: 'flex' }}>{menu.icon}</Box>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{menu.label}</span>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                p: 0,
                backgroundColor: '#fafafa',
              }}
            >
              <List sx={{ py: 0 }}>
                {menu.subItems.map((subItem) => (
                  <ListItem key={subItem.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleSubItemClick(subItem.id, menu.id)}
                      sx={{
                        pl: 4,
                        py: 1,
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: '#666',
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: '13px',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
