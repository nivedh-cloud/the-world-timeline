import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
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

const SIDEBAR_WIDTH = 80
const SECONDARY_DRAWER_WIDTH = 300

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

export default function DesktopSidebar({ onMenuItemClick, onOpenFilters }) {
  const [selectedMenu, setSelectedMenu] = useState('timeline')
  const [expandedAccordion, setExpandedAccordion] = useState('timeline-view')

  const handleMainMenuClick = (menuId) => {
    setSelectedMenu(menuId)
    setExpandedAccordion(`${menuId}-view`)
    
    // Navigate to main menu
    if (menuId !== 'settings') {
      onMenuItemClick(menuId)
    }
  }

  const handleSubItemClick = (itemId, menuId) => {
    // Handle filters separately
    if (itemId === 'timeline-filters') {
      onOpenFilters?.()
      return
    }
    
    // Handle settings items
    if (menuId === 'settings') {
      console.log(`Settings option clicked: ${itemId}`)
      return
    }
    
    // Navigate to sub-item
    onMenuItemClick(itemId)
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false)
  }

  const currentMenu = menuItems.find(m => m.id === selectedMenu)

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Left Drawer - Main Navigation */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          backgroundColor: '#fff',
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 2,
          pb: 2,
          overflowY: 'auto',
          height: 'calc(100vh - 64px)',
          flexShrink: 0,
        }}
      >
        <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {menuItems.map((menu) => (
            <Tooltip key={menu.id} title={menu.label} placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMainMenuClick(menu.id)}
                  sx={{
                    width: 60,
                    height: 60,
                    mx: 'auto',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    backgroundColor: selectedMenu === menu.id ? '#e3f2fd' : 'transparent',
                    border: selectedMenu === menu.id ? '2px solid #2196f3' : '2px solid transparent',
                    color: selectedMenu === menu.id ? '#2196f3' : '#666',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      color: '#2196f3',
                    },
                  }}
                >
                  <Box sx={{ fontSize: '24px', display: 'flex' }}>{menu.icon}</Box>
                  <Typography sx={{ fontSize: '10px', fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                    {menu.label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Right Drawer - Submenus */}
      {currentMenu && (
        <Box
          sx={{
            width: SECONDARY_DRAWER_WIDTH,
            backgroundColor: '#fafafa',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            height: 'calc(100vh - 64px)',
            flexShrink: 0,
            p: 2,
          }}
        >
          {/* Secondary Drawer Header */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: '#2196f3',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {currentMenu.label}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Submenus in Accordion */}
          {currentMenu.subItems.map((subItem) => (
            <Accordion
              key={subItem.id}
              expanded={expandedAccordion === subItem.id}
              onChange={handleAccordionChange(subItem.id)}
              sx={{
                '&::before': {
                  display: 'none',
                },
                mb: 0.5,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                backgroundColor: expandedAccordion === subItem.id ? '#e3f2fd' : '#fff',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  py: 0.5,
                  px: 2,
                  minHeight: 'auto',
                  '& .MuiAccordionSummary-content': {
                    my: 1,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: '#2196f3', display: 'flex', fontSize: '18px' }}>
                    {subItem.icon}
                  </Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                    {subItem.label}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, pb: 1 }}>
                <List sx={{ p: 0 }}>
                  {/* Placeholder for nested items or actions */}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSubItemClick(subItem.id, currentMenu.id)}
                      sx={{
                        pl: 5,
                        py: 1,
                        fontSize: '12px',
                        '&:hover': {
                          backgroundColor: '#e8f4f8',
                        },
                      }}
                    >
                      <ListItemText
                        primary={`Open ${subItem.label}`}
                        primaryTypographyProps={{
                          fontSize: '12px',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  )
}
