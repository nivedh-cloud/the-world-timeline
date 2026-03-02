import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

export default function EventFiltersDrawer({
  open,
  onClose,
  selectedCategories,
  onCategoryChange,
}) {
  const categories = [
    { 
      id: 'Bible', 
      label: 'Bible Events', 
      markerColor: '#9C27B0',
      clusterColor: '#9C27B0'
    },
    { 
      id: 'World', 
      label: 'World Events', 
      markerColor: '#FF9800',
      clusterColor: '#FF9800'
    },
  ]

  const handleCategoryToggle = (categoryId) => {
    console.log(`[CHECKBOX] Toggling ${categoryId}`)
    console.log(`[CHECKBOX] Current selectedCategories:`, selectedCategories)
    if (selectedCategories.includes(categoryId)) {
      const newCategories = selectedCategories.filter(cat => cat !== categoryId)
      console.log(`[CHECKBOX] Removing ${categoryId}, calling onCategoryChange with:`, newCategories)
      onCategoryChange(newCategories)
    } else {
      const newCategories = [...selectedCategories, categoryId]
      console.log(`[CHECKBOX] Adding ${categoryId}, calling onCategoryChange with:`, newCategories)
      onCategoryChange(newCategories)
    }
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterAltIcon sx={{ color: '#2196f3' }} />
            <Typography variant="h6" component="div">
              Event Filters
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Category Checkboxes */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Event Categories
          </Typography>
          {categories.map((category) => (
            <Box key={category.id} sx={{ mb: 2.5 }}>
              {/* Category with checkbox */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      sx={{
                        '&.Mui-checked': {
                          color: category.markerColor,
                        },
                      }}
                    />
                  }
                  label={category.label}
                  sx={{
                    flex: 1,
                    margin: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>

              {/* Color legend */}
              <Box sx={{ display: 'flex', gap: 1.5, pl: 4, mb: 0.5 }}>
                {/* Marker color */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: category.markerColor,
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.8rem', color: '#666' }}>
                    Markers
                  </Typography>
                </Box>

                {/* Cluster color */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: category.clusterColor,
                      border: '2px solid white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.8rem', color: '#666' }}>
                    Clusters
                  </Typography>
                </Box>
              </Box>

              {category.id !== 'World' && <Divider sx={{ my: 1.5 }} />}
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Info Section */}
        <Box sx={{ backgroundColor: '#f5f5f5', p: 1.5, borderRadius: '8px' }}>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
            <strong>Selected:</strong> {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'None'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
            Pink clusters = Mixed events (Bible + World)
          </Typography>
        </Box>
      </Box>
    </Drawer>
  )
}
