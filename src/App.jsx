import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useTheme, useMediaQuery } from '@mui/material'
import { Header, Footer, Navigation, BottomNavigation, DesktopSidebar } from './shared'
import { TimelinePage } from './features/timeline'
import { GenealogyPage } from './features/genealogy'
import { PlacesPage } from './features/places'
import { JourneysPage } from './features/journeys'
import { SettingsPage } from './features/settings'
import JourneyDetailPage from './features/journeys/pages/JourneyDetailPage'
import JourneysDrawer from './shared/components/JourneysDrawer'
import EventFiltersDrawer from './shared/components/EventFiltersDrawer'
import './App.css'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMenu, setDrawerMenu] = useState('timeline')
  const [activeMenu, setActiveMenu] = useState('timeline')
  const [journeysDrawerOpen, setJourneysDrawerOpen] = useState(false)
  const [eventFiltersDrawerOpen, setEventFiltersDrawerOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(['World'])
  const [selectedJourney, setSelectedJourney] = useState(null)
  
  // Log when selectedCategories changes
  useEffect(() => {
    console.log(`[APP STATE] selectedCategories updated:`, selectedCategories)
  }, [selectedCategories])
  
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleOpenDrawer = () => {
    // If a journey is selected, open the JourneysDrawer instead of Navigation
    if (selectedJourney) {
      setJourneysDrawerOpen(true)
    } else {
      setDrawerOpen(true)
    }
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleMenuClick = (menuId) => {
    // If journeys is clicked, open journeys drawer and set active menu
    if (menuId === 'journeys') {
      setActiveMenu('journeys')
      setJourneysDrawerOpen(true)
      setDrawerOpen(false)
      return
    }
    
    setActiveMenu(menuId)
    setDrawerMenu(menuId)
    setDrawerOpen(false)
  }

  const handleSettingsClick = () => {
    setDrawerMenu('settings')
    setDrawerOpen(true)
  }

  const renderContent = () => {
    // If a journey is selected, show the journey detail page
    if (selectedJourney) {
      return (
        <JourneyDetailPage 
          journeyId={selectedJourney}
          onBack={() => setSelectedJourney(null)}
        />
      )
    }

    switch (activeMenu) {
      case 'timeline':
        return <TimelinePage selectedCategories={selectedCategories} />
      case 'genealogy':
        return <GenealogyPage />
      case 'journeys':
        return <JourneysPage />
      case 'places':
        return <PlacesPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <TimelinePage selectedCategories={selectedCategories} />
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Header onMenuClick={handleOpenDrawer} showMenuButton={!isDesktop} />
      
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Desktop Sidebar - Hidden on mobile */}
        {isDesktop && (
          <DesktopSidebar 
            activeMenu={activeMenu} 
            onMenuItemClick={handleMenuClick}
            onOpenFilters={() => setEventFiltersDrawerOpen(true)}
          />
        )}
        
        {/* Mobile Drawer */}
        <Navigation 
          open={drawerOpen} 
          onClose={handleCloseDrawer} 
          activeMenu={drawerMenu}
          onOpenFilters={() => {
            setEventFiltersDrawerOpen(true)
            setDrawerOpen(false)
          }}
        />
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: !isDesktop ? '70px' : 0, // Add padding for bottom nav on mobile
          }}
        >
          {renderContent()}
        </Box>
      </Box>

      {/* Bottom Navigation - Only on mobile */}
      {!isDesktop && (
        <BottomNavigation 
          activeMenu={activeMenu} 
          onMenuClick={handleMenuClick}
          onSettingsClick={handleSettingsClick}
        />
      )}
      
      {/* Journeys Drawer */}
      <JourneysDrawer 
        open={journeysDrawerOpen}
        onClose={() => setJourneysDrawerOpen(false)}
        onSelectJourney={(journeyId, journeyLabel) => {
          console.log(`Journey selected: ${journeyLabel}`)
          setSelectedJourney(journeyId)
          setDrawerMenu('journeys')
          setJourneysDrawerOpen(false)
        }}
      />
      
      {/* Event Filters Drawer */}
      <EventFiltersDrawer
        open={eventFiltersDrawerOpen}
        onClose={() => setEventFiltersDrawerOpen(false)}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
      />
      
      {/* Footer */}
      {/* <Footer /> */}
    </Box>
  )
}

export default App
