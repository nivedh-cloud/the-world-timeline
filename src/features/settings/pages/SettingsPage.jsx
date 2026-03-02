import { Box, Typography, Paper, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material'
import { useLanguage } from '../../../shared/context/useLanguage'

export default function SettingsPage() {
  const { language, changeLanguage, SUPPORTED_LANGUAGES, LANGUAGE_NAMES } = useLanguage()

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
            Language
          </FormLabel>
          <Divider sx={{ mb: 2 }} />
          
          <RadioGroup
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <FormControlLabel
              value={SUPPORTED_LANGUAGES.ENGLISH}
              control={<Radio />}
              label={LANGUAGE_NAMES.en}
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.05)',
                  borderColor: '#2196F3',
                },
                ...(language === SUPPORTED_LANGUAGES.ENGLISH && {
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  borderColor: '#2196F3',
                }),
              }}
            />
            <FormControlLabel
              value={SUPPORTED_LANGUAGES.TELUGU}
              control={<Radio />}
              label={LANGUAGE_NAMES.te}
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: '1px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.05)',
                  borderColor: '#2196F3',
                },
                ...(language === SUPPORTED_LANGUAGES.TELUGU && {
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  borderColor: '#2196F3',
                }),
              }}
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          ℹ️ About Language Selection
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Your language preference is automatically saved. All journey routes, locations, and descriptions will be displayed in your selected language.
        </Typography>
      </Paper>
    </Box>
  )
}
