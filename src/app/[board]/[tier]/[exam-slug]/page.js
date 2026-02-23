import React from 'react';
import BoardPaperClient from './BoardPaperClient';

// app/[board]/[tier]/[exam-slug]/page.js

/**
 * Capitalize first letter of each word in a string joined by hyphens
 */
const formatSlug = (slug) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const board = resolvedParams.board;
  const tier = resolvedParams.tier;
  const slug = resolvedParams['exam-slug'];
  
  const displayTitle = formatSlug(slug);
  const canonicalUrl = `https://www.scifun.in/${board}/${tier}/${slug}`;
  
  return {
    title: `${displayTitle} PDF with Answer Key`,
    description: `Download the official ${displayTitle} question paper PDF for the Maharashtra Board examination. Expert-verified answer keys for English medium students.`,
    alternates: {
      canonical: canonicalUrl, // MUST MATCH the actual URL exactly
    },
    openGraph: {
      url: canonicalUrl,
      type: "article",
      title: displayTitle,
      description: `Active Live Blog: ${displayTitle} Answer Key and Analysis`,
    }
  };
}

export default async function BoardPaperPage({ params }) {
  const resolvedParams = await params;
  
  return (
    <BoardPaperClient params={resolvedParams} />
  );
}
