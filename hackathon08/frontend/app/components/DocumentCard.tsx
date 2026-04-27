'use client';
import { Box, Chip, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { PdfDoc } from '../store/api';

interface Props {
  doc: PdfDoc;
  selected: boolean;
  onClick: () => void;
}

const statusColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  analyzed: 'success',
  pending: 'warning',
  blocked: 'error',
};

export function DocumentCard({ doc, selected, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'grey.800',
        bgcolor: selected ? 'rgba(99,102,241,0.12)' : 'transparent',
        transition: 'all 0.15s',
        '&:hover': { borderColor: 'primary.light', bgcolor: 'rgba(99,102,241,0.07)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ArticleIcon sx={{ color: 'primary.main', fontSize: 26, flexShrink: 0 }} />
        <Typography variant="body1" noWrap sx={{ fontWeight: 600, flex: 1, fontSize: '0.97rem' }}>
          {doc.originalName}
        </Typography>
        <Chip
          label={doc.status}
          size="medium"
          color={statusColor[doc.status] || 'default'}
          sx={{ fontSize: '0.78rem' }}
        />
      </Box>
      {doc.documentType && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, display: 'block', fontSize: '0.88rem' }}>
          {doc.documentType}
        </Typography>
      )}
    </Box>
  );
}
