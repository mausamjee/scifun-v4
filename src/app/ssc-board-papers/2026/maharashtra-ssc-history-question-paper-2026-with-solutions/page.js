'use client';

import React from 'react';
import BoardPaperClient from '@/app/[board]/[tier]/[exam-slug]/BoardPaperClient';

export default function HistoryBoardPaper2026() {
  const params = {
    board: 'maharashtra-board',
    tier: 'ssc',
    'exam-slug': 'maharashtra-ssc-history-question-paper-2026-with-solutions'
  };

  return <BoardPaperClient params={params} />;
}
