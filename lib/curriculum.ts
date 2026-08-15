export type CurriculumTrack = 'NCERT' | 'JEE Main' | 'JEE Advanced' | 'NEET UG';

export type Chapter = { id: string; title: string; topics: string[]; priority?: 'high' | 'medium' | 'normal' };
export type Subject = { id: string; title: string; chapters: Chapter[] };
export type ClassCurriculum = { classNo: string; subjects: Subject[] };

// Curated curriculum map for the core exam-preparation classes. The app should
// always link students to official NCERT/NTA material for the authoritative edition/syllabus.
export const curriculum: ClassCurriculum[] = [
  { classNo: '9', subjects: [
    { id: 'maths', title: 'Mathematics', chapters: [
      { id: 'number-systems', title: 'Number Systems', topics: ['Irrational numbers', 'Real numbers', 'Laws of exponents'] },
      { id: 'polynomials', title: 'Polynomials', topics: ['Zeros', 'Remainder theorem', 'Factor theorem'] },
      { id: 'linear-equations', title: 'Linear Equations in Two Variables', topics: ['Solutions', 'Graphs', 'Coordinate interpretation'] },
      { id: 'quadrilaterals', title: 'Quadrilaterals', topics: ['Parallelograms', 'Mid-point theorem', 'Properties'] },
      { id: 'statistics', title: 'Statistics', topics: ['Data representation', 'Mean', 'Median', 'Mode'] },
    ]},
    { id: 'science', title: 'Science', chapters: [
      { id: 'matter', title: 'Matter in Our Surroundings', topics: ['States of matter', 'Evaporation', 'Temperature'] },
      { id: 'atoms', title: 'Atoms and Molecules', topics: ['Laws of chemical combination', 'Mole concept', 'Formulae'] },
      { id: 'motion', title: 'Motion', topics: ['Distance and displacement', 'Velocity', 'Acceleration', 'Graphs'] },
      { id: 'force', title: 'Force and Laws of Motion', topics: ['Newton laws', 'Momentum', 'Inertia'] },
      { id: 'gravitation', title: 'Gravitation', topics: ['Universal law', 'Free fall', 'Buoyancy'] },
    ]},
  ]},
  { classNo: '10', subjects: [
    { id: 'maths', title: 'Mathematics', chapters: [
      { id: 'real-numbers', title: 'Real Numbers', topics: ['Euclid algorithm', 'HCF/LCM', 'Irrationality'] },
      { id: 'polynomials', title: 'Polynomials', topics: ['Zeros', 'Relations between zeros and coefficients'] },
      { id: 'pair-linear', title: 'Pair of Linear Equations in Two Variables', topics: ['Graphical solution', 'Substitution', 'Elimination'] },
      { id: 'quadratic', title: 'Quadratic Equations', topics: ['Roots', 'Discriminant', 'Quadratic formula'] },
      { id: 'trigonometry', title: 'Introduction to Trigonometry', topics: ['Ratios', 'Identities', 'Heights and distances'] },
    ]},
    { id: 'science', title: 'Science', chapters: [
      { id: 'chemical-reactions', title: 'Chemical Reactions and Equations', topics: ['Balancing', 'Reaction types', 'Oxidation-reduction'] },
      { id: 'acids-bases', title: 'Acids, Bases and Salts', topics: ['pH', 'Indicators', 'Salts'] },
      { id: 'life-processes', title: 'Life Processes', topics: ['Nutrition', 'Respiration', 'Transport', 'Excretion'] },
      { id: 'light', title: 'Light – Reflection and Refraction', topics: ['Mirrors', 'Lenses', 'Ray diagrams'] },
      { id: 'electricity', title: 'Electricity', topics: ['Current', 'Potential difference', 'Resistance', 'Power'] },
    ]},
  ]},
  { classNo: '11', subjects: [
    { id: 'physics', title: 'Physics', chapters: [
      { id: 'units', title: 'Units and Measurements', topics: ['SI units', 'Dimensions', 'Errors'] },
      { id: 'kinematics', title: 'Motion in a Straight Line', topics: ['Position', 'Velocity', 'Acceleration', 'Graphs'] },
      { id: 'laws-motion', title: 'Laws of Motion', topics: ['Newton laws', 'Friction', 'Circular dynamics'] },
      { id: 'work-energy', title: 'Work, Energy and Power', topics: ['Work-energy theorem', 'Potential energy', 'Power'] },
      { id: 'thermodynamics', title: 'Thermodynamics', topics: ['Zeroth law', 'First law', 'Processes'] },
    ]},
    { id: 'chemistry', title: 'Chemistry', chapters: [
      { id: 'basic-concepts', title: 'Some Basic Concepts of Chemistry', topics: ['Mole concept', 'Stoichiometry', 'Concentration'] },
      { id: 'structure-atom', title: 'Structure of Atom', topics: ['Bohr model', 'Quantum numbers', 'Electronic configuration'] },
      { id: 'periodicity', title: 'Classification of Elements and Periodicity', topics: ['Periodic trends', 'Electronic configuration'] },
      { id: 'bonding', title: 'Chemical Bonding and Molecular Structure', topics: ['Lewis structures', 'VSEPR', 'Hybridisation'] },
    ]},
    { id: 'maths', title: 'Mathematics', chapters: [
      { id: 'sets', title: 'Sets', topics: ['Operations', 'Venn diagrams', 'Relations'] },
      { id: 'trigonometric-functions', title: 'Trigonometric Functions', topics: ['Identities', 'Equations', 'Graphs'] },
      { id: 'complex-numbers', title: 'Complex Numbers', topics: ['Argand plane', 'Modulus', 'Algebra'] },
      { id: 'permutations', title: 'Permutations and Combinations', topics: ['Counting principle', 'Permutations', 'Combinations'] },
    ]},
    { id: 'biology', title: 'Biology', chapters: [
      { id: 'cell', title: 'Cell: The Unit of Life', topics: ['Cell organelles', 'Membranes', 'Cell cycle'] },
      { id: 'biomolecules', title: 'Biomolecules', topics: ['Proteins', 'Carbohydrates', 'Lipids', 'Nucleic acids'] },
      { id: 'plant-physiology', title: 'Plant Physiology', topics: ['Photosynthesis', 'Respiration', 'Transport'] },
    ]},
  ]},
  { classNo: '12', subjects: [
    { id: 'physics', title: 'Physics', chapters: [
      { id: 'electric-charges', title: 'Electric Charges and Fields', topics: ['Coulomb law', 'Electric field', 'Gauss law'], priority: 'high' },
      { id: 'electrostatic-potential', title: 'Electrostatic Potential and Capacitance', topics: ['Potential', 'Capacitors', 'Dielectrics'], priority: 'high' },
      { id: 'current-electricity', title: 'Current Electricity', topics: ['Drift velocity', 'Ohm law', 'Kirchhoff laws', 'Wheatstone bridge'], priority: 'high' },
      { id: 'moving-charges', title: 'Moving Charges and Magnetism', topics: ['Lorentz force', 'Biot-Savart law', 'Ampere law'] },
      { id: 'electromagnetic-induction', title: 'Electromagnetic Induction', topics: ['Faraday law', 'Lenz law', 'Inductance'] },
      { id: 'ray-optics', title: 'Ray Optics and Optical Instruments', topics: ['Refraction', 'Lenses', 'Optical instruments'] },
      { id: 'dual-nature', title: 'Dual Nature of Radiation and Matter', topics: ['Photoelectric effect', 'de Broglie wavelength'] },
      { id: 'atoms-nuclei', title: 'Atoms and Nuclei', topics: ['Atomic models', 'Nuclear physics', 'Radioactivity'] },
      { id: 'semiconductor', title: 'Semiconductor Electronics', topics: ['Diodes', 'Transistors', 'Logic gates'] },
    ]},
    { id: 'chemistry', title: 'Chemistry', chapters: [
      { id: 'solutions', title: 'Solutions', topics: ['Concentration', 'Raoult law', 'Colligative properties'] },
      { id: 'electrochemistry', title: 'Electrochemistry', topics: ['Cell potential', 'Nernst equation', 'Conductance'], priority: 'high' },
      { id: 'kinetics', title: 'Chemical Kinetics', topics: ['Rate law', 'Order', 'Arrhenius equation'] },
      { id: 'coordination', title: 'Coordination Compounds', topics: ['Nomenclature', 'Isomerism', 'Bonding'] },
      { id: 'haloalkanes', title: 'Haloalkanes and Haloarenes', topics: ['SN1', 'SN2', 'Reactions'] },
      { id: 'alcohols', title: 'Alcohols, Phenols and Ethers', topics: ['Preparation', 'Reactions', 'Acidity'] },
    ]},
    { id: 'maths', title: 'Mathematics', chapters: [
      { id: 'relations-functions', title: 'Relations and Functions', topics: ['Relations', 'Functions', 'Inverse functions'] },
      { id: 'matrices', title: 'Matrices', topics: ['Operations', 'Determinants', 'Inverse'] },
      { id: 'calculus', title: 'Continuity and Differentiability', topics: ['Limits', 'Continuity', 'Differentiation'], priority: 'high' },
      { id: 'integrals', title: 'Integrals', topics: ['Indefinite integrals', 'Definite integrals', 'Area under curves'], priority: 'high' },
      { id: 'differential-equations', title: 'Differential Equations', topics: ['Order and degree', 'Solutions', 'Applications'] },
      { id: 'probability', title: 'Probability', topics: ['Conditional probability', 'Bayes theorem', 'Random variables'] },
    ]},
    { id: 'biology', title: 'Biology', chapters: [
      { id: 'reproduction', title: 'Reproduction', topics: ['Human reproduction', 'Reproductive health', 'Plant reproduction'], priority: 'high' },
      { id: 'genetics', title: 'Principles of Inheritance and Variation', topics: ['Mendelian genetics', 'Linkage', 'Chromosomal disorders'], priority: 'high' },
      { id: 'molecular-basis', title: 'Molecular Basis of Inheritance', topics: ['DNA replication', 'Transcription', 'Translation'] },
      { id: 'evolution', title: 'Evolution', topics: ['Evidence', 'Natural selection', 'Human evolution'] },
      { id: 'ecology', title: 'Ecology', topics: ['Populations', 'Ecosystem', 'Biodiversity'] },
    ]},
  ]},
];

export const competitiveTracks = {
  'JEE Main': { subjects: ['Physics', 'Chemistry', 'Mathematics'], levels: ['JEE Main Foundation', 'JEE Main', 'JEE Main Challenge'] },
  'JEE Advanced': { subjects: ['Physics', 'Chemistry', 'Mathematics'], levels: ['Advanced Concept', 'JEE Advanced', 'Challenge'] },
  'NEET UG': { subjects: ['Physics', 'Chemistry', 'Biology'], levels: ['NEET Foundation', 'NEET', 'NEET Challenge'] },
};

export function getCurriculum(classNo: string, subject?: string) {
  const c = curriculum.find(x => x.classNo === classNo);
  if (!c) return [];
  return subject ? c.subjects.filter(s => s.title === subject) : c.subjects;
}

export const officialLinks = {
  ncert: 'https://ncert.nic.in/textbook.php',
  jee: 'https://jeemain.nta.nic.in/',
  neet: 'https://neet.nta.nic.in/',
};
