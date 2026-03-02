import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import { useTheme, useMediaQuery } from '@mui/material'
import { Header, Footer, BottomNavigation, DesktopSidebar, UnifiedDrawer, EventFiltersDrawer } from './shared'
import { TimelinePage } from './features/timeline'
import { GenealogyPage } from './features/genealogy'
import { PlacesPage } from './features/places'
import { JourneysPage } from './features/journeys'
import { SettingsPage } from './features/settings'
import JourneyDetailPage from './features/journeys/pages/JourneyDetailPage'
import './App.css'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [eventFiltersDrawerOpen, setEventFiltersDrawerOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('timeline')
  const [selectedCategories, setSelectedCategories] = useState(['World'])
  const [selectedJourney, setSelectedJourney] = useState(null)
  
  // Log when selectedCategories changes
  useEffect(() => {
    console.log(`[APP STATE] selectedCategories updated:`, selectedCategories)
  }, [selectedCategories])
  
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleOpenDrawer = () => {
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleMenuClick = (menuId) => {
    // Handle timeline-filters separately
    if (menuId === 'timeline-filters') {
      // This will be handled by onOpenFilters callback
      return
    }
    
    // Set active menu and close drawer
    setActiveMenu(menuId)
    setDrawerOpen(false)
  }

  const handleOpenFilters = () => {
    // Show filters for timeline
    console.log('Opening filters...')
    // This can be expanded for different filter types based on activeMenu
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
        return <JourneysPage onSelectJourney={(journeyId, journeyLabel) => {
          console.log(`Journey selected: ${journeyLabel}`)
          setSelectedJourney(journeyId)
        }} />
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
        position: 'relative',
      }}
    >
      <Header onMenuClick={handleOpenDrawer} showMenuButton={!isDesktop} />
      
      <Box 
        sx={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          minHeight: 0, 
          width: '100%',
          position: 'relative',
          paddingBottom: !isDesktop ? '70px' : 0, // Space for bottom nav on mobile
        }}
      >
        {/* Desktop Sidebar - Hidden on mobile */}
        {isDesktop && (
          <DesktopSidebar 
            activeMenu={activeMenu} 
            onMenuItemClick={handleMenuClick}
            onOpenFilters={() => setEventFiltersDrawerOpen(true)}
          />
        )}
        
        {/* Mobile Drawer - Unified */}
        <UnifiedDrawer 
          open={drawerOpen} 
          onClose={handleCloseDrawer} 
          position="left"
          activeMenu={activeMenu}
          onMenuItemClick={handleMenuClick}
          onOpenFilters={handleOpenFilters}
        />
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderContent()}
        </Box>
      </Box>

      {/* Bottom Navigation - Fixed at bottom on mobile */}
      {!isDesktop && (
        <BottomNavigation 
          activeMenu={activeMenu} 
          onMenuClick={handleMenuClick}
        />
      )}
      
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
