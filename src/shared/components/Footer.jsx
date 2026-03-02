import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 2,
        px: 2,
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2026 New World Timeline App. Built with React, Material UI, Tailwind CSS, and Bootstrap.
      </Typography>
    </Box>
  )
}
