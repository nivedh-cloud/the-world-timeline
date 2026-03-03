import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useLanguage } from '../../../shared/context/useLanguage'

export default function GenealogyModal({ open, onClose, person }) {
  const { language } = useLanguage()

  if (!person) return null

  const getName = () => {
    if (language === 'te' && person.nameTe) return person.nameTe
    return person.nameEn || person.name || 'Unknown'
  }

  const getSpouseName = () => {
    if (language === 'te' && person.spouseTe) return person.spouseTe
    return person.spouseEn || person.spouse || ''
  }

  const getDetail = () => {
    if (language === 'te' && person.detailTe) return person.detailTe
    return person.detailEn || person.detail || ''
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '20px', fontWeight: 600, color: '#2196f3' }}>
        {getName()}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 600, color: '#666' }}>
              {language === 'te' ? 'ప్రాథమిక సమాచారం' : 'Basic Information'}
            </Typography>

            {person.class && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {language === 'te' ? 'వర్గము' : 'Class'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {person.class}
                </Typography>
              </Box>
            )}

            {person.birth && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {language === 'te' ? 'జన్మ' : 'Birth'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {person.birth}
                </Typography>
              </Box>
            )}

            {person.death && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {language === 'te' ? 'మరణం' : 'Death'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {person.death}
                </Typography>
              </Box>
            )}

            {person.age && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {language === 'te' ? 'వయస్సు' : 'Age'}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {person.age} {language === 'te' ? 'సంవత్సరాలు' : 'years'}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Family Information */}
          {(getSpouseName() || (person.children && person.children.length > 0)) && (
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 600, color: '#666' }}>
                {language === 'te' ? 'కుటుంబ సమాచారం' : 'Family Information'}
              </Typography>

              {getSpouseName() && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {language === 'te' ? 'భార్య/భర్త' : 'Spouse'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {getSpouseName()}
                  </Typography>
                </Box>
              )}

              {person.children && person.children.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {language === 'te' ? 'సంతానం' : 'Children'} ({person.children.length})
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {person.children.map((child, idx) => (
                      <Typography key={idx} variant="body2" sx={{ fontWeight: 500 }}>
                        • {language === 'te' && child.nameTe ? child.nameTe : child.nameEn || child.name}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          <Divider />

          {/* Details */}
          {getDetail() && (
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 600, color: '#666' }}>
                {language === 'te' ? 'వివరాలు' : 'Details'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, lineHeight: 1.6, color: '#444' }}>
                {getDetail()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          {language === 'te' ? 'మూసివేయు' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
