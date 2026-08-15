export type ExamTrack = 'NCERT' | 'JEE Main' | 'NEET UG';

export const officialSources = {
  ncertTextbooks: 'https://ncert.nic.in/textbook.php',
  ncertBooks: 'https://ncertbooks.ncert.gov.in/',
  jeeSyllabus: 'https://jeemain.nta.nic.in/document/syllabus-2026/',
  jeeBulletin: 'https://jeemain.nta.nic.in/information-bulletin/',
  neetHome: 'https://neet.nta.nic.in/',
  neetDocuments: 'https://neet.nta.nic.in/documents/'
} as const;

export const classes = Array.from({ length: 12 }, (_, i) => String(i + 1));

export const schoolSubjects: Record<string, string[]> = {
  '1': ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  '2': ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  '3': ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  '4': ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  '5': ['Mathematics', 'English', 'Hindi', 'Environmental Studies'],
  '6': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '7': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '8': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '9': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '10': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '11': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
  '12': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English']
};

// Chapter names below are curriculum metadata, not a copy of textbook content.
// Official NCERT pages remain the source of truth for the current book/edition.
export const chapters: Record<string, Record<string, string[]>> = {
  '9': {
    Mathematics: ['Number Systems','Polynomials','Coordinate Geometry','Linear Equations in Two Variables','Introduction to Euclid’s Geometry','Lines and Angles','Triangles','Quadrilaterals','Circles','Heron’s Formula','Surface Areas and Volumes','Statistics','Probability'],
    Science: ['Matter in Our Surroundings','Is Matter Around Us Pure','Atoms and Molecules','Structure of the Atom','The Fundamental Unit of Life','Tissues','Motion','Force and Laws of Motion','Gravitation','Work and Energy','Sound','Improvement in Food Resources']
  },
  '10': {
    Mathematics: ['Real Numbers','Polynomials','Pair of Linear Equations in Two Variables','Quadratic Equations','Arithmetic Progressions','Triangles','Coordinate Geometry','Introduction to Trigonometry','Some Applications of Trigonometry','Circles','Areas Related to Circles','Surface Areas and Volumes','Statistics','Probability'],
    Science: ['Chemical Reactions and Equations','Acids Bases and Salts','Metals and Non-metals','Carbon and Its Compounds','Life Processes','Control and Coordination','How Do Organisms Reproduce','Heredity','Light – Reflection and Refraction','Human Eye and the Colourful World','Electricity','Magnetic Effects of Electric Current','Our Environment']
  },
  '11': {
    Physics: ['Units and Measurements','Motion in a Straight Line','Motion in a Plane','Laws of Motion','Work Energy and Power','System of Particles and Rotational Motion','Gravitation','Mechanical Properties of Solids','Mechanical Properties of Fluids','Thermal Properties of Matter','Thermodynamics','Kinetic Theory','Oscillations','Waves'],
    Chemistry: ['Some Basic Concepts of Chemistry','Structure of Atom','Classification of Elements and Periodicity','Chemical Bonding and Molecular Structure','Thermodynamics','Equilibrium','Redox Reactions','Organic Chemistry – Basic Principles','Hydrocarbons'],
    Mathematics: ['Sets','Relations and Functions','Trigonometric Functions','Principle of Mathematical Induction','Complex Numbers and Quadratic Equations','Linear Inequalities','Permutations and Combinations','Binomial Theorem','Sequences and Series','Straight Lines','Conic Sections','Introduction to Three Dimensional Geometry','Limits and Derivatives','Statistics','Probability'],
    Biology: ['The Living World','Biological Classification','Plant Kingdom','Animal Kingdom','Morphology of Flowering Plants','Anatomy of Flowering Plants','Structural Organisation in Animals','Cell: The Unit of Life','Biomolecules','Cell Cycle and Cell Division','Transport in Plants','Mineral Nutrition','Photosynthesis in Higher Plants','Respiration in Plants','Plant Growth and Development','Digestion and Absorption','Breathing and Exchange of Gases','Body Fluids and Circulation','Excretory Products and Elimination','Locomotion and Movement','Neural Control and Coordination','Chemical Coordination and Integration']
  },
  '12': {
    Physics: ['Electric Charges and Fields','Electrostatic Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics and Optical Instruments','Wave Optics','Dual Nature of Radiation and Matter','Atoms','Nuclei','Semiconductor Electronics'],
    Chemistry: ['Solutions','Electrochemistry','Chemical Kinetics','d- and f-Block Elements','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols Phenols and Ethers','Aldehydes Ketones and Carboxylic Acids','Amines','Biomolecules'],
    Mathematics: ['Relations and Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity and Differentiability','Applications of Derivatives','Integrals','Applications of Integrals','Differential Equations','Vector Algebra','Three Dimensional Geometry','Linear Programming','Probability'],
    Biology: ['Reproduction','Genetics and Evolution','Biology and Human Welfare','Biotechnology and its Applications','Ecology and Environment']
  }
};

export const competitiveTracks = {
  'JEE Main': { subjects: ['Physics', 'Chemistry', 'Mathematics'], officialSyllabus: officialSources.jeeSyllabus },
  'NEET UG': { subjects: ['Physics', 'Chemistry', 'Biology'], officialSyllabus: officialSources.neetHome }
} as const;

export const studyflowCurriculum = {
  classes,
  streams: ['NCERT', 'JEE Main', 'NEET UG'] as const,
  schoolSubjects,
  chapters,
  competitiveTracks,
  officialSources
} as const;
