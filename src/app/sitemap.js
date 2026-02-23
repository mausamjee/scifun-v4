export default function sitemap() {
const baseUrl = 'https://www.scifun.in'; // ✅ CORRECT  const baseUrl = 'https://www.scifun.com';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Board Paper Routes
  // Hardcoded for now as per requirements
  const subjects = ['marathi', 'english', 'hindi', 'math', 'science'];
  const years = ['2025', '2026'];

  const paperRoutes = [];

  years.forEach((year) => {
    subjects.forEach((subject) => {
      paperRoutes.push({
        url: `${baseUrl}/ssc-board-papers/${year}/${subject}`,
        lastModified: new Date(),
        changeFrequency: 'daily', // High frequency for exam season
        priority: 0.9,
      });
    });
  });

  return [...staticRoutes, ...paperRoutes];
}
