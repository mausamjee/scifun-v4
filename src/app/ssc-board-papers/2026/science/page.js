'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectScience() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ssc-board-papers/2026/maharashtra-ssc-science-1-question-paper-2026-with-solutions');
  }, [router]);

  return null;
}

