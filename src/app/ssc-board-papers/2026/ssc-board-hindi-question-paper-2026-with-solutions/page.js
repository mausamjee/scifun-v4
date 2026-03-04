'use client';

import React from 'react';
import BoardPaperClient from '../../../[board]/[tier]/[exam-slug]/BoardPaperClient';

export default function HindiBoardPaperLongURL() {
  const params = {
    board: 'maharashtra-board',
    tier: 'ssc',
    'exam-slug': 'hindi-question-paper-2026-answer-key'
  };

  return <BoardPaperClient params={params} />;
}
