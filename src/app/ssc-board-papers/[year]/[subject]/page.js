import React from 'react';
import BoardPaperClient from './BoardPaperClient';

export const revalidate = 60; // ISR: Enable caching for high performance

// 1. DYNAMIC METADATA (Server-Side)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { year, subject } = resolvedParams;
  
  // Specific SEO requirements for Hindi 2026
  if (subject === 'ssc-board-hindi-question-paper-2026-with-solutions' || (subject === 'hindi' && year === '2026')) {
    const canonicalUrl = `https://scifun.in/ssc-board-papers/2026/ssc-board-hindi-question-paper-2026-with-solutions`;
    return {
      title: "SSC Board Hindi Question Paper 2026 With Solutions | Maharashtra 10th PDF",
      description: "Download SSC Board Hindi Question Paper 2026 with complete solutions. Maharashtra 10th Board paper PDF, answer key, grammar solutions updated live on March 4 at 1:15 PM.",
      keywords: "SSC board Hindi question paper 2026 with solutions, Maharashtra 10th Hindi paper 2026, ssc hindi paper 2026 answer key",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: 'SSC Hindi Paper 2026 With Solutions | SciFun.in',
        description: 'Complete Maharashtra 10th Hindi Board paper with answers. Updated live on March 4.',
        url: canonicalUrl,
        siteName: 'SciFun',
        images: [{ url: 'https://scifun.in/og-hindi-2026.jpg', width: 1200, height: 630 }],
        locale: 'hi_IN',
        type: 'article',
      },
      robots: { index: true, follow: true },
    };
  }

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
  const canonicalUrl = `https://scifun.in/ssc-board-papers/${year}/${subject}`;
  
  return {
    title: `Maharashtra SSC ${subjectName} Board Paper ${year} PDF Download`,
    description: `Download the official ${subjectName} question paper and answer key for the ${year} Maharashtra Board Exam. Complete solutions and analysis.`,
    keywords: [`${subjectName} board paper ${year}`, `SSC ${subjectName} paper solution`, `Maharashtra board ${year}`, `${subjectName} answer key ${year}`],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: `${subjectName} Board Question Paper ${year} - PDF & Solution`,
      description: `Live Updates: Download SSC ${subjectName} ${year} PDF and check Answer Key.`,
      type: 'article',
    }
  };
}

// 2. THE PAGE LOADER (Server Component)
export default async function BoardPaperPage({ params }) {
  const resolvedParams = await params;
  const { year, subject } = resolvedParams;
  const isHindi2026 = subject === 'ssc-board-hindi-question-paper-2026-with-solutions' || (subject === 'hindi' && year === '2026');

  return (
    <>
      {isHindi2026 && (
        <>
          <link rel="preload" as="image" href="/logobg.png" />
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
