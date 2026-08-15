export const studyflowCurriculum = {
  classes: Array.from({ length: 12 }, (_, i) => i + 1),
  streams: ['School', 'JEE', 'NEET'],
  ncert: {
    officialPortal: 'https://ncert.nic.in/textbook.php',
    booksPortal: 'https://ncertbooks.ncert.gov.in/',
    note: 'Use official NCERT pages as the source of truth for textbook availability and chapter links.'
  },
  competitive: {
    jee: ['Physics', 'Chemistry', 'Mathematics'],
    neet: ['Physics', 'Chemistry', 'Biology']
  }
} as const;

export const sampleChapters = {
  '12': {
    Physics: ['Electric Charges and Fields','Electrostatic Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Electromagnetic Induction','Alternating Current','Ray Optics','Wave Optics','Dual Nature','Atoms','Nuclei','Semiconductor Electronics'],
    Chemistry: ['Solutions','Electrochemistry','Chemical Kinetics','d- and f-Block Elements','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols Phenols and Ethers','Aldehydes Ketones and Carboxylic Acids','Amines','Biomolecules'],
    Mathematics: ['Relations and Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity and Differentiability','Application of Derivatives','Integrals','Application of Integrals','Differential Equations','Vector Algebra','Three Dimensional Geometry','Probability'],
    Biology: ['Reproduction','Genetics and Evolution','Biology and Human Welfare','Biotechnology','Ecology']
  }
} as const;
