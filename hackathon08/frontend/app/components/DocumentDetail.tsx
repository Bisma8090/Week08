'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, Divider, CircularProgress,
  TextField, Paper, List, ListItem, ListItemText, Alert,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import {
  useGetDocumentQuery,
  useSummarizeDocumentMutation,
  useAskQuestionMutation,
} from '../store/api';

interface QA { question: string; answer: string; agent: string }

export function DocumentDetail({ docId }: { docId: string }) {
  const { data: doc, isLoading } = useGetDocumentQuery(docId);
  const [summarize, { isLoading: summarizing }] = useSummarizeDocumentMutation();
  const [ask, { isLoading: asking }] = useAskQuestionMutation();
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<QA[]>([]);
  const [summaryData, setSummaryData] = useState<{ summary: string; highlights: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSummaryData(null);
    setQaHistory([]);
    setQuestion('');
    setError(null);
  }, [docId]);

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
      <CircularProgress size={48} />
    </Box>
  );
  if (!doc) return null;

  const handleSummarize = async () => {
    setError(null);
    try {
      const result = await summarize(docId).unwrap();
      setSummaryData(result);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to generate summary. Please try again.');
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setError(null);
    try {
      const result = await ask({ id: docId, question }).unwrap();
      setQaHistory((prev) => [
        { question, answer: result.answer, agent: result.agentUsed },
        ...prev,
      ]);
      setQuestion('');
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to get an answer. Please try again.');
    }
  };

  const activeSummary = summaryData?.summary || doc.summary;
  const activeHighlights = summaryData?.highlights || doc.highlights;

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 4, fontSize: '1rem', borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
            lineHeight: 1.25,
            wordBreak: 'break-word',
            mb: 2.5,
          }}
        >
          {doc.originalName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label={doc.status}
            color={doc.status === 'analyzed' ? 'success' : 'warning'}
            sx={{ fontSize: '0.95rem', height: 36, px: 1 }}
          />
          {doc.documentType && (
            <Chip
              label={doc.documentType}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.95rem', height: 36, px: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* Metadata Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: { xs: 2, md: 3 },
          mb: 6,
        }}
      >
        {doc.sections && doc.sections.length > 0 && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.800' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2.5, letterSpacing: '0.12em', fontSize: '0.8rem' }}>
              Sections
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {doc.sections.map((s: string) => (
                <Chip key={s} label={s} variant="outlined" color="secondary" sx={{ fontSize: '0.9rem', height: 34 }} />
              ))}
            </Box>
          </Paper>
        )}

        {doc.themes && doc.themes.length > 0 && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.800' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2.5, letterSpacing: '0.12em', fontSize: '0.8rem' }}>
              Themes
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {doc.themes.map((t: string) => (
                <Chip key={t} label={t} sx={{ fontSize: '0.9rem', height: 34 }} />
              ))}
            </Box>
          </Paper>
        )}

        {doc.entities && doc.entities.length > 0 && (
          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'grey.800' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2.5, letterSpacing: '0.12em', fontSize: '0.8rem' }}>
              Key Entities
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {doc.entities.map((e: string) => (
                <Chip key={e} label={e} variant="outlined" sx={{ fontSize: '0.9rem', height: 34 }} />
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Summary Section */}
      <Box sx={{ mb: 7 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: { xs: 44, md: 52 },
              height: { xs: 44, md: 52 },
              borderRadius: 2.5,
              bgcolor: 'rgba(99,102,241,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SummarizeIcon sx={{ color: 'primary.main', fontSize: { xs: 24, md: 28 } }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
              Summary
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSummarize}
            disabled={summarizing}
            startIcon={summarizing ? <CircularProgress size={20} color="inherit" /> : <SummarizeIcon />}
            sx={{ px: { xs: 3, md: 4 }, py: 1.5, fontSize: { xs: '0.95rem', md: '1rem' }, borderRadius: 2 }}
          >
            {summarizing ? 'Generating...' : 'Generate Summary'}
          </Button>
        </Box>

        {activeSummary ? (
          <Paper elevation={0} sx={{
            p: { xs: 3, sm: 4, md: 5 },
            bgcolor: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 3,
          }}>
            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 2, fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {activeSummary}
            </Typography>
            {activeHighlights && activeHighlights.length > 0 && (
                <Box sx={{ mt: 4 }}>
                <Typography sx={{ color: 'primary.main', mb: 2, fontWeight: 700, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                  Highlights
                </Typography>
                <List dense disablePadding>
                  {activeHighlights.map((h: string, i: number) => (
                    <ListItem key={i} sx={{ py: 1, px: 0, alignItems: 'flex-start' }}>
                      <ListItemText
                        primary={`• ${h}`}
                        slotProps={{ primary: { sx: { lineHeight: 1.9, fontSize: { xs: '0.97rem', md: '1.05rem' } } } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        ) : (
          <Paper elevation={0} sx={{
            p: { xs: 4, md: 6 },
            border: '1px dashed', borderColor: 'grey.700', borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 140,
          }}>
            <Typography sx={{ color: 'text.disabled', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
              Click "Generate Summary" to analyze this document
            </Typography>
          </Paper>
        )}
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Q&A Section */}
      <Box sx={{ pb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{
            width: { xs: 44, md: 52 },
            height: { xs: 44, md: 52 },
            borderRadius: 2.5,
            bgcolor: 'rgba(99,102,241,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <QuestionAnswerIcon sx={{ color: 'primary.main', fontSize: { xs: 24, md: 28 } }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
            Ask the Document
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex', gap: 2, mb: 5,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-start' },
        }}>
          <TextField
            fullWidth
            placeholder="Ask anything about this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAsk()}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': { fontSize: { xs: '1rem', md: '1.05rem' }, borderRadius: 2 },
            }}
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleAsk}
            disabled={asking || !question.trim()}
            endIcon={asking ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{
              minWidth: { xs: '100%', sm: 130 },
              height: { sm: 60 },
              px: 3,
              fontSize: { xs: '0.95rem', md: '1rem' },
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            {asking ? 'Asking...' : 'Ask'}
          </Button>
        </Box>

        {qaHistory.length === 0 && (
          <Paper elevation={0} sx={{
            p: { xs: 4, md: 6 },
            border: '1px dashed', borderColor: 'grey.700', borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120,
          }}>
            <Typography sx={{ color: 'text.disabled', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
              Ask a question to get started
            </Typography>
          </Paper>
        )}

        {qaHistory.map((qa, i) => (
          <Paper key={i} elevation={0} sx={{
            p: { xs: 3, sm: 4, md: 5 },
            mb: 3,
            border: '1px solid', borderColor: 'grey.800', borderRadius: 3,
          }}>
            <Typography sx={{ color: 'primary.main', fontWeight: 700, mb: 2.5,
              lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.1rem' } }}>
              Q: {qa.question}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 2, fontSize: { xs: '0.97rem', md: '1.05rem' } }}>
              {qa.answer}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
              <SmartToyIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.82rem' }}>
                Handled by: {qa.agent}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
