'use client';

import React from 'react';
import BoardPaperClient from '../../[tier]/[exam-slug]/BoardPaperClient';

export default function HindiBoardPaper2026() {
  const params = {
    board: 'maharashtra-board',
    tier: 'ssc',
    'exam-slug': 'hindi-question-paper-2026-answer-key'
  };

  return <BoardPaperClient params={params} />;
}
