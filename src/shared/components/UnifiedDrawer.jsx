import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TimelineIcon from '@mui/icons-material/Timeline'
import SettingsIcon from '@mui/icons-material/Settings'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import FlightIcon from '@mui/icons-material/Flight'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FilterListIcon from '@mui/icons-material/FilterList'
import LanguageIcon from '@mui/icons-material/Language'
import TuneIcon from '@mui/icons-material/Tune'
import { navigationConfig } from '../utils/navigationConfig'

/**
 * Map icon names to icon components
 */
const iconMap = {
  TimelineIcon,
  SettingsIcon,
  FamilyRestroomIcon,
  FlightIcon,
  LocationOnIcon,
  FilterListIcon,
  LanguageIcon,
  TuneIcon,
}

/**
 * Helper function to get icon component by name
 */
const getIconComponent = (iconName) => {
  const IconComponent = iconMap[iconName]
  return IconComponent ? <IconComponent /> : <ExpandMoreIcon />
}

/**
 * UnifiedDrawer - Single reusable drawer component
 * Can display on left or right side with dynamic content based on activeMenu
 */
export default function UnifiedDrawer({
  open,
  onClose,
  position = 'left', // 'left' or 'right'
  activeMenu = 'timeline', // Currently active menu (timeline, genealogy, journeys, places, settings)
  onMenuItemClick, // Callback when menu item is clicked
  onOpenFilters, // Callback for opening filters
  onOpenJourneysDrawer, // Callback to open journeys drawer
}) {
  // If journeys is the active menu, open the journeys drawer instead
  useEffect(() => {
    if (open && activeMenu === 'journeys' && onOpenJourneysDrawer) {
      onClose()
      onOpenJourneysDrawer()
    }
  }, [open, activeMenu, onOpenJourneysDrawer, onClose])

  const [expanded, setExpanded] = useState(activeMenu)

  const config = navigationConfig[activeMenu]
  if (!config) {
    return null
  }

  const handleAccordionChange = (menu) => (event, isExpanded) => {
    setExpanded(isExpanded ? menu : false)
    if (isExpanded && onMenuItemClick) {
      onMenuItemClick(menu)
    }
  }

  const handleSubItemClick = (itemId) => {
    // Handle filters separately
    if (itemId === 'timeline-filters' || itemId === 'places-search') {
      if (onOpenFilters) {
        onOpenFilters()
      }
      return
    }
    if (onMenuItemClick) {
      onMenuItemClick(itemId)
    }
  }

  return (
    <Drawer
      anchor={position}
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2196f3' }}>
            {config.title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu Items List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
          }}
        >
          {config.items.length > 0 ? (
            <List sx={{ p: 0 }}>
              {config.items.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => handleSubItemClick(item.id)}
                    sx={{
                      pl: 2,
                      py: 1.2,
                      borderRadius: '8px',
                      backgroundColor:
                        activeMenu === item.id ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: activeMenu === item.id ? '#2196f3' : '#666',
                      }}
                    >
                      {getIconComponent(item.iconName)}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: {
                          fontWeight: activeMenu === item.id ? 600 : 500,
                          color: activeMenu === item.id ? '#2196f3' : '#333',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2 }}>
              No menu items available
            </Typography>
          )}
        </Box>

        {/* Drawer Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #ddd',
            backgroundColor: '#fafafa',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption">
            Tap an item to navigate
          </Typography>
        </Box>
      </Box>
    </Drawer>
  )
}
