import React from 'react';
import BoardPaperClient from './BoardPaperClient';

// 1. DYNAMIC METADATA (Server-Side)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { year, subject } = resolvedParams;
  
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
  
  return {
    title: `Maharashtra SSC ${subjectName} Board Paper ${year} PDF Download`,
    description: `Download the official ${subjectName} question paper and answer key for the ${year} Maharashtra Board Exam. Complete solutions and analysis.`,
    keywords: [`${subjectName} board paper ${year}`, `SSC ${subjectName} paper solution`, `Maharashtra board ${year}`, `${subjectName} answer key ${year}`],
    openGraph: {
      title: `${subjectName} Board Question Paper ${year} - PDF & Solution`,
      description: `Live Updates: Download SSC ${subjectName} ${year} PDF and check Answer Key.`,
      type: 'article',
    }
  };
}

// 2. THE PAGE LOADER (Server Component)
export default async function BoardPaperPage({ params }) {
  const resolvedParams = await params;
  
  return (
    <BoardPaperClient params={resolvedParams} />
  );
}
