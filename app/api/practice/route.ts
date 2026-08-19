import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function looksOffSubject(q: any, subject: string) {
  const text = `${String(q?.question || '')} ${Array.isArray(q?.options) ? q.options.join(' ') : ''}`.toLowerCase();
  const forbidden: Record<string, string[]> = {
    Mathematics: ['resistance of the', 'resistor', 'voltage across', 'current through', 'current electricity', 'circuit', 'ohm\'s law', 'magnetic flux', 'ammeter', 'voltmeter', 'lens formula', 'mole concept', 'chemical reaction', 'enzyme', 'dna replication', 'photosynthesis'],
    Physics: ['mitosis', 'meiosis', 'dna replication', 'photosynthesis', 'digestion', 'respiration in plants', 'amino acid sequence', 'organic reaction mechanism'],
    Chemistry: ['velocity-time graph', 'newton\'s law', 'projectile motion', 'resistance of a resistor', 'magnetic flux', 'mitosis', 'meiosis', 'neural control'],
    Biology: ['ohm\'s law', 'resistance of a resistor', 'kirchhoff', 'electromagnetic induction', 'projectile motion', 'quadratic equation', 'determinant', 'chemical equilibrium calculation'],
  };
  return (forbidden[subject] || []).some(term => text.includes(term));
}

function cleanQuestion(q: any, index: number, subject: string) {
  const options = Array.isArray(q?.options) ? q.options.map((x: any) => String(x).trim()).filter(Boolean).slice(0, 4) : [];
  const answerRaw = String(q?.answer ?? '').trim().toUpperCase();
  const matchingIndex = options.findIndex((x: string) => x.toLowerCase() === answerRaw.toLowerCase());
  const answer = /^[A-D]$/.test(answerRaw)
    ? answerRaw
    : matchingIndex >= 0 ? String.fromCharCode(65 + matchingIndex) : '';

  if (!q?.question || options.length !== 4 || !answer) return null;
  if (new Set(options.map((x: string) => x.toLowerCase())).size !== 4) return null;
  if (looksOffSubject(q, subject)) return null;

  return {
    id: String(q.id || `q${index + 1}`),
    question: String(q.question).trim(),
    options,
    answer,
    explanation: String(q.explanation || 'The correct option follows from the stated concept and conditions.').trim(),
    difficulty: ['Easy', 'Medium', 'Hard'].includes(String(q.difficulty)) ? String(q.difficulty) : 'Medium',
    type: 'objective_mcq',
  };
}

function mathematicsFallback(topic: string, total: number) {
  const t = topic.toLowerCase();
  if (!t.includes('relation') && !t.includes('function')) return [];
  const bank = [
    ['If A = {1,2,3}, how many ordered pairs are in A × A?', ['3','6','9','12'], 'C', 'For sets with 3 elements, |A × A| = 3 × 3 = 9.'],
    ['Which relation on a set is reflexive?', ['Every element is related to itself','No element is related to itself','Only one element is related to itself','Exactly two elements are related to themselves'], 'A', 'A relation is reflexive when every element is related to itself.'],
    ['If f(x) = 2x + 3, what is f(4)?', ['7','8','11','14'], 'C', 'Substituting x = 4 gives f(4) = 8 + 3 = 11.'],
    ['If f(x) = x², which value is f(-3)?', ['-9','-6','6','9'], 'D', 'f(-3) = (-3)² = 9.'],
    ['A function from A to B assigns each element of A to:', ['At least two elements of B','Exactly one element of B','No element of B','Exactly two elements of B'], 'B', 'A function assigns every element of its domain exactly one image in the codomain.'],
    ['Which of the following is a one-one function on R?', ['f(x)=x²','f(x)=|x|','f(x)=2x+1','f(x)=5'], 'C', 'A non-zero linear function f(x)=ax+b is one-one when a is non-zero.'],
    ['If f(x)=x+5 and g(x)=2x, what is (g∘f)(3)?', ['8','11','16','21'], 'C', 'f(3)=8 and g(8)=16.'],
    ['If f: A→B is onto, then every element of B has:', ['No preimage','Exactly one preimage','At least one preimage','Exactly two preimages'], 'C', 'Onto means every codomain element has at least one preimage.'],
    ['For f(x)=1/x, the domain over real numbers is:', ['All real numbers','All real numbers except 0','Only positive real numbers','Only integers'], 'B', 'Division by zero is undefined, so x cannot be 0.'],
    ['If n(A)=2 and n(B)=3, the number of functions from A to B is:', ['5','6','8','9'], 'C', 'Each of the 2 elements of A has 3 choices, giving 3² = 9.'],
    ['If f(x)=3x-2, which value of x gives f(x)=10?', ['2','3','4','6'], 'B', '3x - 2 = 10 gives 3x = 12 and x = 4.'],
    ['Which statement is true for an equivalence relation?', ['It is reflexive, symmetric and transitive','It is only reflexive','It is only symmetric','It is only transitive'], 'A', 'An equivalence relation must satisfy reflexivity, symmetry and transitivity.'],
  ];
  return bank.slice(0, total).map((x, i) => ({ id: `fallback-${i + 1}`, question: x[0], options: x[1], answer: x[2], explanation: x[3], difficulty: i < 4 ? 'Easy' : 'Medium', type: 'objective_mcq' }));
}

export async function POST(req: Request) {
  try {
    const {
      classNo = '12', subject = 'Physics', topic = 'Current Electricity', level = 'Exam', count = 10,
      track = 'NCERT', requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    } = await req.json();

    const token = process.env.HF_TOKEN;
    if (!token) return NextResponse.json({ error: 'Configure HF_TOKEN in Vercel to generate live questions.' }, { status: 503 });

    const safeClass = String(classNo).trim();
    const safeSubject = String(subject).trim();
    const safeTopic = String(topic).trim();
    const safeTrack = String(track).trim();
    const safeLevel = String(level).trim();
    const total = Math.min(Math.max(Number(count) || 10, 1), 20);
    const generationTotal = Math.min(total + 6, 20);
    const model = process.env.HF_MODEL || 'Qwen/Qwen2.5-7B-Instruct:fastest';
    const competitive = safeTrack === 'JEE Main' || safeTrack === 'NEET UG' || safeLevel === 'JEE / NEET';

    const subjectInstruction =
      safeSubject === 'Physics' ? 'Use ONLY physics laws, concepts, units, equations and numerical reasoning. Do not write biology, chemistry or mathematics questions.' :
      safeSubject === 'Chemistry' ? 'Use ONLY chemistry concepts, reactions, periodic trends, structures, equations and calculations. Do not write physics or biology questions.' :
      safeSubject === 'Mathematics' ? 'Use ONLY mathematics. Every question, option and calculation must be mathematical and directly related to the selected chapter/topic. Do not use physics, chemistry or biology scenarios. For Relations and Functions, use relations, functions, domain, range, composition, one-one/onto, inverse functions and related mathematical concepts.' :
      safeSubject === 'Biology' ? 'Use ONLY biology concepts, terminology, processes and NCERT-aligned factual reasoning. Do not write physics or mathematics questions.' :
      safeSubject === 'Science' ? 'Keep the question strictly within the selected school Science topic and age-appropriate scientific concepts.' :
      safeSubject === 'Social Science' ? 'Use history, geography, civics or economics only when supported by the selected topic.' :
      `Keep every question strictly within ${safeSubject} and the selected topic.`;

    const examInstruction = competitive
      ? `Create original ${safeTrack === 'NEET UG' ? 'NEET UG' : 'JEE Main'}-style practice. Use objective single-correct MCQs with four options. ${subjectInstruction} Do not reproduce copyrighted coaching or past-paper wording.`
      : `Create original Class ${safeClass} school practice at ${safeLevel} difficulty aligned strictly to ${safeSubject} and the selected chapter/topic. ${subjectInstruction}`;

    const system = `You are StudyFlow Practice Engine for Indian students. ${examInstruction}
Hard constraints: Class=${safeClass}; Subject=${safeSubject}; Chapter/topic=${safeTopic}; Track=${safeTrack}.
Never substitute another subject. If Subject is Mathematics, DO NOT mention resistance, voltage, current electricity, circuits, magnetic fields, chemical reactions, enzymes or DNA unless they are explicitly mathematical variables in an abstract mathematical question. Prefer direct mathematical questions.
Create exactly ${generationTotal} original objective single-correct MCQs. Each has exactly four plausible options A-D and one correct answer. Vary concepts, values, wording and distractors. Never repeat a question.
Return ONLY JSON: {"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"answer":"A","explanation":"...","difficulty":"Easy|Medium|Hard"}]}. No markdown and no extra text.`;

    const user = `Unique generation request: ${String(requestId)}\nGenerate ${generationTotal} fresh MCQs now. Class: ${safeClass}. Subject: ${safeSubject}. Chapter/topic: ${safeTopic}. Track: ${safeTrack}. Difficulty: ${safeLevel}. Return only questions from this exact subject and topic.`;

    const askAI = async (extra: string) => {
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: system + extra }, { role: 'user', content: user }],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: Math.max(3600, generationTotal * 380),
        }),
        cache: 'no-store',
      });
      const raw = await response.text();
      let data: any = null;
      try { data = JSON.parse(raw); } catch {}
      if (!response.ok) throw Error(`Hugging Face returned ${response.status}: ${String(data?.error?.message || data?.error || raw).slice(0, 500)}`);
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw Error('The AI provider returned no questions.');
      const cleaned = String(content).replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
      let parsed: any;
      try { parsed = JSON.parse(cleaned); } catch {
        const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}');
        if (start < 0 || end <= start) throw Error('The generated set was not valid JSON.');
        parsed = JSON.parse(cleaned.slice(start, end + 1));
      }
      if (!Array.isArray(parsed?.questions)) throw Error('The AI response did not contain a questions array.');
      return parsed.questions.map((q: any, i: number) => cleanQuestion(q, i, safeSubject)).filter(Boolean).slice(0, total);
    };

    let questions: any[] = [];
    let lastError = '';
    for (let attempt = 0; attempt < 2 && questions.length < total; attempt++) {
      try {
        const extra = attempt === 0 ? '' : `\nRETRY: The previous response contained invalid or off-subject items. This time make every item unmistakably ${safeSubject} and ${safeTopic}. For Mathematics, use direct symbolic/numerical mathematics only.`;
        questions = await askAI(extra);
      } catch (e: any) { lastError = e?.message || String(e); }
    }

    if (questions.length < total) {
      const fallback = safeSubject === 'Mathematics' ? mathematicsFallback(safeTopic, total) : [];
      if (fallback.length >= total) questions = fallback;
    }

    if (questions.length < total) {
      return NextResponse.json({ error: lastError || `The AI returned only ${questions.length} valid ${safeSubject} questions. Please generate a fresh set.` }, { status: 502 });
    }

    return NextResponse.json({ questions, track: safeTrack, classNo: safeClass, subject: safeSubject, topic: safeTopic, requestId });
  } catch (error) {
    console.error('StudyFlow practice error:', error);
    return NextResponse.json({ error: 'Practice generation failed. Check the Vercel deployment logs.' }, { status: 500 });
  }
}
