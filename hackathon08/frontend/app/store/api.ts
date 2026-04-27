import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface PdfDoc {
  _id: string;
  filename: string;
  originalName: string;
  documentType?: string;
  sections?: string[];
  themes?: string[];
  entities?: string[];
  summary?: string;
  highlights?: string[];
  status: string;
  createdAt: string;
}

export interface AskResponse {
  answer: string;
  agentUsed: string;
}

export interface SummaryResponse {
  summary: string;
  highlights: string[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    listDocuments: builder.query<PdfDoc[], void>({
      query: () => '/documents',
      providesTags: ['Document'],
    }),
    getDocument: builder.query<PdfDoc, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Document', id }],
    }),
    uploadDocument: builder.mutation<PdfDoc, FormData>({
      query: (formData) => ({
        url: '/documents/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Document'],
    }),
    summarizeDocument: builder.mutation<SummaryResponse, string>({
      query: (id) => ({ url: `/documents/${id}/summarize`, method: 'POST' }),
      invalidatesTags: (_r, _e, id) => [{ type: 'Document', id }],
    }),
    askQuestion: builder.mutation<AskResponse, { id: string; question: string }>({
      query: ({ id, question }) => ({
        url: `/documents/${id}/ask`,
        method: 'POST',
        body: { question },
      }),
    }),
  }),
});

export const {
  useListDocumentsQuery,
  useGetDocumentQuery,
  useUploadDocumentMutation,
  useSummarizeDocumentMutation,
  useAskQuestionMutation,
} = api;
