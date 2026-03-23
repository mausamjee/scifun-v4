import { supabase } from '../lib/clients';

export const fetchQuestionsByChapters = async (chapters) => {
  const { data, error } = await supabase
    .from('class12')
    .select('*')
    .in('chapter', chapters);

  if (error) throw error;

  return data.map((q) => ({
    ...q,
    imageUrl: q.image_url,
    examYear: q.exam_year
  }));
};

export const fetchQuestions = async (
  mode,
  chapters,
  year,
  month
) => {
  let query = supabase.from('class12').select('*');

  if (mode === 'past_year' && year) {
    // Map "March" -> "M" and "July" -> "J" to match DB format (e.g., "2025 M")
    const session = month === 'March' ? 'M' : month === 'July' ? 'J' : '';
    const examYearQuery = session ? `%${year}%${session}%` : `%${year}%`;
    query = query.ilike('exam_year', examYearQuery);
  } else {
    // Normal Generator Mode
    if (chapters && chapters.length > 0) {
      query = query.in('chapter', chapters);
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((q) => ({
    ...q,
    imageUrl: q.image_url,
    examYear: q.exam_year
  }));
};
