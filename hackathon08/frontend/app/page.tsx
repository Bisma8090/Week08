'use client';
import { useState } from 'react';
import {
  Box, Typography, CircularProgress, Drawer, IconButton,
  useMediaQuery, useTheme, AppBar, Toolbar,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuIcon from '@mui/icons-material/Menu';
import { UploadZone } from './components/UploadZone';
import { DocumentCard } from './components/DocumentCard';
import { DocumentDetail } from './components/DocumentDetail';
import { useListDocumentsQuery } from './store/api';

const SIDEBAR = 380;

function SidebarContent({
  docs,
  isLoading,
  selectedId,
  onSelect,
  onUploaded,
}: {
  docs: any[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUploaded: (id: string) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.800' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>
              PDF Intelligence
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Multi-Agent AI Platform
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Document List */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ px: 1, py: 1, display: 'block', letterSpacing: '0.1em' }}
        >
          DOCUMENTS
        </Typography>
        {isLoading && <CircularProgress size={22} sx={{ m: 2 }} />}
        {docs?.map((doc) => (
          <Box key={doc._id} sx={{ mb: 1 }}>
            <DocumentCard
              doc={doc}
              selected={selectedId === doc._id}
              onClick={() => onSelect(doc._id)}
            />
          </Box>
        ))}
        {!isLoading && !docs?.length && (
          <Typography variant="body2" color="text.disabled" sx={{ px: 1, mt: 1 }}>
            No documents yet
          </Typography>
        )}
      </Box>

      {/* Agent Legend */}
      <Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'grey.800' }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ display: 'block', mb: 1.5, letterSpacing: '0.1em' }}
        >
          ACTIVE AGENTS
        </Typography>
        {['Router', 'Analyzer', 'Summary', 'Q&A'].map((a) => (
          <Box key={a} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{a} Agent</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: docs = [], isLoading } = useListDocumentsQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleUploaded = (id: string) => {
    setSelectedId(id);
    setMobileOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileOpen(false);
  };

  const sidebarProps = { docs, isLoading, selectedId, onSelect: handleSelect, onUploaded: handleUploaded };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.800', boxShadow: 'none' }}
        >
          <Toolbar sx={{ gap: 1.5 }}>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
            <AutoAwesomeIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>
              PDF Intelligence
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{ paper: { sx: { width: SIDEBAR, bgcolor: 'background.paper' } } }}
        >
          <SidebarContent {...sidebarProps} />
        </Drawer>
      ) : (
        /* Desktop Sidebar */
        <Box
          sx={{
            width: SIDEBAR,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'grey.800',
            height: '100vh',
            position: 'fixed',
            overflow: 'hidden',
          }}
        >
          <SidebarContent {...sidebarProps} />
        </Box>
      )}

      {/* Main Content */}
      <Box
        sx={{
          ml: isMobile ? 0 : `${SIDEBAR}px`,
          flex: 1,
          width: isMobile ? '100%' : `calc(100% - ${SIDEBAR}px)`,
          p: { xs: 2.5, sm: 4, md: 5 },
          pt: isMobile ? '80px' : { xs: 4, md: 5 },
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        {selectedId ? (
          <DocumentDetail docId={selectedId} />
        ) : (
          <Box
            sx={{
              height: '100%',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 3,
              px: 2,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: { xs: 56, md: 80 }, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '2rem' } }}>
              Upload a PDF to get started
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
              The multi-agent system will analyze, summarize, and answer questions about your document.
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 480 }}>
              <UploadZone onUploaded={handleUploaded} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}