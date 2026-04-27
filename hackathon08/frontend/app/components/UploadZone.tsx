'use client';
import { useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUploadDocumentMutation } from '../store/api';

interface Props {
  onUploaded: (id: string) => void;
}

export function UploadZone({ onUploaded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploadDoc, { isLoading, error }] = useUploadDocumentMutation();

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.pdf')) return;
      const form = new FormData();
      form.append('file', file);
      const result = await uploadDoc(form).unwrap();
      onUploaded(result._id);
    },
    [uploadDoc, onUploaded],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Box>
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('pdf-input')?.click()}
        sx={{
          border: '2px dashed',
          borderColor: dragging ? 'primary.main' : 'grey.700',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          bgcolor: dragging ? 'rgba(99,102,241,0.1)' : 'transparent',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(99,102,241,0.06)' },
        }}
      >
        <input
          id="pdf-input"
          type="file"
          accept=".pdf"
          hidden
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {isLoading ? (
          <Box>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 500 }}>
              Uploading & analyzing...
            </Typography>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
            <Typography variant="body1" sx={{ fontWeight: 700 }}>Drop PDF here</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              or click to browse
            </Typography>
          </Box>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 1.5, fontSize: '0.85rem' }}>
          Upload failed. Check your backend connection.
        </Alert>
      )}
    </Box>
  );
}
