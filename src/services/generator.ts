import {
  Question,
  SectionType,
  Difficulty,
  GeneratedPaper,
  GenerationConfig,
  PaperSection,
  BlueprintRule
} from '../types';

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getAlternativeQuestion = (currentQuestion: Question, pool: Question[], excludeIds: string[]): Question | null => {
  const filteredPool = pool.filter(q =>
    q.chapter === currentQuestion.chapter &&
    q.type === currentQuestion.type &&
    !excludeIds.includes(q.id) &&
    q.id !== currentQuestion.id
  );

  if (filteredPool.length === 0) return null;
  return filteredPool[getRandomInt(filteredPool.length)];
};

export const generatePaper = (config: GenerationConfig, pool: Question[]): GeneratedPaper => {
  const { totalMarks, blueprint: customBlueprint } = config;

  // IMPORTANT: For Past Year Papers, we basically just want to show ALL fetched questions.
  // The 'pool' already contains only the filtered questions.
  // We can group them by type for display.
  if (config.mode === 'past_year') {
    // For Past Year, we create sections based on question types to keep it organized
    const types = [SectionType.MCQ, SectionType.VSA, SectionType.SA_2, SectionType.SA_3, SectionType.LA_4];
    const sections: PaperSection[] = [];

    types.forEach(type => {
      const typeQuestions = pool.filter(q => q.type === type);
      if (typeQuestions.length > 0) {
        sections.push({
          name: `${type} Section`,
          type: type,
          description: `Questions from ${config.selectedYear}`,
          marksPerQuestion: typeQuestions[0].marks || 1, // best guess or data
          requiredCount: typeQuestions.length,
          totalPoolCount: typeQuestions.length,
          questions: typeQuestions
        });
      }
    });

    return {
      id: `PAPER_${Date.now()}`,
      title: config.headerTitle,
      subject: config.subject,
      date: config.testDate,
      totalMarks: pool.reduce((sum, q) => sum + (q.marks || 0), 0),
      timeAllowed: config.timeAllowed,
      sections: sections
    };
  }

  // --- GENERATOR A (CUSTOM BLUEPRINT) ---
  if (customBlueprint && customBlueprint.length > 0) {
    const paperSections: PaperSection[] = [];
    const usedIds = new Set<string>();

    customBlueprint.forEach(rule => {
      // Filter pool based on Rule (Type AND Chapter if specified)
      const rulePool = pool.filter(q => {
        const typeMatch = q.type === rule.type;
        const chapterMatch = rule.chapterFilter && rule.chapterFilter !== 'All'
          ? q.chapter === rule.chapterFilter
          : true;
        return typeMatch && chapterMatch && !usedIds.has(q.id);
      });

      const countToPick = rule.requiredCount;
      const picked: Question[] = [];
      const s = shuffle(rulePool);

      for (let i = 0; i < Math.min(countToPick, s.length); i++) {
        picked.push({ ...s[i], marks: rule.marksPerQuestion });
        usedIds.add(s[i].id);
      }

      paperSections.push({
        name: rule.name,
        type: rule.type,
        description: `Attempt ${rule.requiredCount} questions.`,
        marksPerQuestion: rule.marksPerQuestion,
        requiredCount: rule.requiredCount,
        totalPoolCount: picked.length,
        questions: picked
      });
    });

    return {
      id: `PAPER_${Date.now()}`,
      title: config.headerTitle,
      subject: config.subject,
      date: config.testDate,
      totalMarks: config.totalMarks, // Or calculated from actual questions
      timeAllowed: config.timeAllowed,
      sections: paperSections
    };
  }

  // --- GENERATOR B (LEGACY / DEFAULT BLUEPRIMT) ---
  if (pool.length < 5) {
    // warning but proceed if we can? No, standard logic fails.
    // throw new Error("Insufficient questions in selected chapters to generate a paper.");
  }

  const blueprint: Record<number, any[]> = {
    20: [
      { name: 'Section A', desc: 'MCQs & VSA (All questions compulsory)', type: [SectionType.MCQ, SectionType.VSA], req: 6, poolMult: 1, marks: 1 },
      { name: 'Section B', desc: 'Short Answer I (Attempt any 2)', type: [SectionType.SA_2], req: 2, poolMult: 1.5, marks: 2 },
      { name: 'Section C', desc: 'Short Answer II (Attempt any 2)', type: [SectionType.SA_3], req: 2, poolMult: 1.5, marks: 3 },
      { name: 'Section D', desc: 'Long Answer (Attempt any 1)', type: [SectionType.LA_4], req: 1, poolMult: 2, marks: 4 },
    ],
    40: [
      { name: 'Section A', desc: 'MCQs & VSA (All questions compulsory)', type: [SectionType.MCQ, SectionType.VSA], req: 12, poolMult: 1, marks: 1 },
      { name: 'Section B', desc: 'Short Answer I (Attempt any 4)', type: [SectionType.SA_2], req: 4, poolMult: 1.5, marks: 2 },
      { name: 'Section C', desc: 'Short Answer II (Attempt any 4)', type: [SectionType.SA_3], req: 4, poolMult: 1.5, marks: 3 },
      { name: 'Section D', desc: 'Long Answer (Attempt any 2)', type: [SectionType.LA_4], req: 2, poolMult: 2, marks: 4 },
    ],
    80: [
      {
        name: 'SECTION - A',
        isSubQuestionGroup: true,
        subSections: [
          { name: 'Q.1', desc: 'Select and write the correct answer for the following multiple choice type of questions:', type: [SectionType.MCQ], req: 8, poolMult: 1, marks: 2 },
          { name: 'Q.2', desc: 'Answer the following questions:', type: [SectionType.VSA], req: 4, poolMult: 1, marks: 1 },
        ]
      },
      { name: 'SECTION - B', desc: 'Attempt any EIGHT of the following questions:', type: [SectionType.SA_2], req: 8, poolMult: 1.5, marks: 2 },
      { name: 'SECTION - C', desc: 'Attempt any EIGHT of the following questions:', type: [SectionType.SA_3], req: 8, poolMult: 1.5, marks: 3 },
      { name: 'SECTION - D', desc: 'Attempt any FIVE of the following questions:', type: [SectionType.LA_4], req: 5, poolMult: 1.6, marks: 4 },
    ]
  };

  const sectionsBlueprint = blueprint[totalMarks] || blueprint[80];
  const paperSections: PaperSection[] = [];
  const usedIds = new Set<string>();

  const pickQuestionsForBlueprint = (secDef: any) => {
    const secPool = pool.filter(q => secDef.type.includes(q.type) && !usedIds.has(q.id));
    const countToPick = Math.ceil(secDef.req * (secDef.poolMult || 1));

    const picked: Question[] = [];
    const s = shuffle(secPool);
    for (let i = 0; i < Math.min(countToPick, s.length); i++) {
      // if hardcoded marks in blueprint, use them, else keep original
      picked.push({ ...s[i], marks: secDef.marks });
      usedIds.add(s[i].id);
    }
    return picked;
  };

  sectionsBlueprint.forEach(secDef => {
    if (secDef.isSubQuestionGroup) {
      secDef.subSections.forEach((sub: any) => {
        const questions = pickQuestionsForBlueprint(sub);
        paperSections.push({
          name: sub.name,
          type: sub.type.length === 1 ? sub.type[0] : undefined,
          description: sub.desc,
          marksPerQuestion: sub.marks,
          requiredCount: sub.req,
          totalPoolCount: questions.length,
          questions: questions,
          isSubQuestionGroup: true
        });
      });
    } else {
      const questions = pickQuestionsForBlueprint(secDef);
      paperSections.push({
        name: secDef.name,
        type: secDef.type.length === 1 ? secDef.type[0] : undefined,
        description: secDef.desc,
        marksPerQuestion: secDef.marks,
        requiredCount: secDef.req,
        totalPoolCount: questions.length,
        questions: questions
      });
    }
  });

  return {
    id: `PAPER_${Date.now()}`,
    title: config.headerTitle,
    subject: config.subject,
    date: config.testDate,
    totalMarks: config.totalMarks,
    timeAllowed: config.timeAllowed,
    sections: paperSections
  };
};
