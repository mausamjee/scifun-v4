export default function sitemap() {
  const baseUrl = 'https://scifun.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/login',
    '/cbsi',
    '/privacy-policy',
    '/terms',
    '/book-demo',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Board Paper Routes
  const subjects = ['marathi', 'english', 'hindi', 'math', 'science'];
  const years = ['2025', '2026'];

  const paperRoutes = [];

  years.forEach((year) => {
    subjects.forEach((subject) => {
      let finalSlug = subject;
      const isHindi2026 = year === '2026' && subject === 'hindi';
      
      // Use specific high-performing slug for Hindi 2026
      if (isHindi2026) {
        finalSlug = 'ssc-board-hindi-question-paper-2026-with-solutions';
      }
      
      const isMath1 = year === '2026' && subject === 'math';
      if (isMath1) {
        finalSlug = 'ssc-maths-part1-algebra-question-paper-2026-with-solutions';
      }

      paperRoutes.push({
        url: `${baseUrl}/ssc-board-papers/${year}/${finalSlug}`,
        lastModified: new Date(),
        changeFrequency: (isHindi2026 || isMath1) ? 'hourly' : 'daily',
        priority: (isHindi2026 || isMath1) ? 1.0 : 0.9,
      });
    });
  });

  return [...staticRoutes, ...paperRoutes];
}
