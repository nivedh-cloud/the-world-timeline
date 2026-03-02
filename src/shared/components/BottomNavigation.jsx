import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import TimelineIcon from '@mui/icons-material/Timeline'
import SettingsIcon from '@mui/icons-material/Settings'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import FlightIcon from '@mui/icons-material/Flight'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const mainMenus = [
  {
    id: 'timeline',
    label: 'Timeline',
    icon: <TimelineIcon />,
  },
  {
    id: 'genealogy',
    label: 'Genealogy',
    icon: <FamilyRestroomIcon />,
  },
  {
    id: 'journeys',
    label: 'Journeys',
    icon: <FlightIcon />,
  },
  {
    id: 'places',
    label: 'Places',
    icon: <LocationOnIcon />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
]

export default function BottomNavigation({ activeMenu, onMenuClick, onSettingsClick }) {
  const handleMenuClick = (menuId) => {
    if (menuId === 'settings') {
      if (onSettingsClick) onSettingsClick()
      return
    }
    onMenuClick(menuId)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 0.5,
        px: 0.5,
        gap: 0,
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd',
        flexWrap: 'nowrap',
        width: '100%',
        flexShrink: 0,
        overflowX: 'auto',
        minHeight: '70px',
        maxHeight: '70px',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 101,
        boxSizing: 'border-box',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
    >
      {mainMenus.map((menu) => (
        <Tooltip key={menu.id} title={menu.label} placement="top">
          <Box
            onClick={() => handleMenuClick(menu.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.2,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              backgroundColor: activeMenu === menu.id ? '#2196f3' : 'transparent',
              color: activeMenu === menu.id ? 'white' : 'inherit',
              flex: 1,
              minWidth: 0,
              height: '100%',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: activeMenu === menu.id ? '#1976d2' : '#f0f0f0',
              },
            }}
          >
            <Box sx={{ display: 'flex', fontSize: '20px', lineHeight: 1 }}>{menu.icon}</Box>
            <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 500, lineHeight: 1.1 }}>
              {menu.label}
            </span>
          </Box>
        </Tooltip>
      ))}
    </Box>
  )
}
