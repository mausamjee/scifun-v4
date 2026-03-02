import React from 'react';
import BoardPaperClient from './BoardPaperClient';

export const revalidate = 60; // ISR: Revalidate every 60 seconds for performance

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
  const canonicalUrl = `https://scifun.in/${board}/${tier}/${slug}`;
  
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
  const slug = resolvedParams['exam-slug'];
  const isHindi2026 = slug === "hindi-question-paper-2026-answer-key";

  return (
    <>
      {isHindi2026 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LearningResource",
                "name": "SSC Board Hindi Question Paper 2026 With Solutions",
                "description": "Maharashtra 10th Standard Hindi Board Exam 2026 question paper with complete solutions",
                "educationalLevel": "Class 10",
                "learningResourceType": "Exam",
                "inLanguage": "hi",
                "datePublished": "2026-03-04",
                "publisher": {
                  "@type": "Organization",
                  "name": "SciFun",
                  "url": "https://scifun.in"
                },
                "about": {
                  "@type": "EducationalOccupationalCredential",
                  "name": "Maharashtra SSC Board Examination"
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is the SSC Hindi Board Exam 2026 postponed due to Holi?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "There are rumors about the SSC Hindi exam being postponed since Holi (Dhulivandan) falls on March 3, just a day before the exam. As of now, the exam is scheduled for March 4, 2026. However, any official change from MSBSHSE regarding postponement will be updated here instantly."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Was the SSC Hindi 2026 paper harder than previous years?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, many students found the 2026 Hindi paper harder and more time-consuming than the 2025 paper. The Grammar section was particularly tricky this year."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Are there any wrong questions or free marks in the Hindi 2026 paper?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We are currently checking the paper for errors. If there's a wrong question, students will get 1-2 bonus marks. Check our 'Wrong Question Tracker' on SciFun.in for the latest updates."
                    }
                  }
                ]
              })
            }}
          />
        </>
      )}
      <BoardPaperClient params={resolvedParams} />
    </>
  );
}
