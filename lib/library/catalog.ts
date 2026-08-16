export type LibraryChapter = { title: string; ncertUrl?: string };
export type LibrarySubject = { name: string; icon: string; chapters: LibraryChapter[] };

const ncert = (book: string) => `https://ncert.nic.in/textbook.php`;

export const libraryCatalog: Record<string, LibrarySubject[]> = {
  '6': [
    { name: 'Mathematics', icon: '∑', chapters: ['Knowing Our Numbers','Whole Numbers','Playing with Numbers','Basic Geometrical Ideas','Understanding Elementary Shapes','Integers','Fractions','Decimals','Data Handling','Mensuration','Algebra','Ratio and Proportion','Symmetry','Practical Geometry'].map(title => ({ title, ncertUrl: ncert('math') })) },
    { name: 'Science', icon: '⚗', chapters: ['Food','Components of Food','Fibre to Fabric','Sorting Materials','Separation of Substances','Changes Around Us','Getting to Know Plants','Body Movements','Living Organisms','Motion and Measurement','Light, Shadows and Reflections','Electricity and Circuits','Fun with Magnets','Water','Air Around Us','Garbage In, Garbage Out'].map(title => ({ title, ncertUrl: ncert('science') })) },
  ],
  '7': [
    { name: 'Mathematics', icon: '∑', chapters: ['Integers','Fractions and Decimals','Data Handling','Simple Equations','Lines and Angles','The Triangle and Its Properties','Comparing Quantities','Rational Numbers','Perimeter and Area','Algebraic Expressions','Exponents and Powers','Symmetry','Visualising Solid Shapes'].map(title => ({ title, ncertUrl: ncert('math') })) },
    { name: 'Science', icon: '⚗', chapters: ['Nutrition in Plants','Nutrition in Animals','Heat','Acids, Bases and Salts','Physical and Chemical Changes','Respiration in Organisms','Transportation in Animals and Plants','Reproduction in Plants','Motion and Time','Electric Current and Its Effects','Light','Forests','Wastewater Story'].map(title => ({ title, ncertUrl: ncert('science') })) },
  ],
  '8': [
    { name: 'Mathematics', icon: '∑', chapters: ['Rational Numbers','Linear Equations','Understanding Quadrilaterals','Practical Geometry','Data Handling','Squares and Square Roots','Cubes and Cube Roots','Comparing Quantities','Algebraic Expressions','Visualising Solid Shapes','Mensuration','Exponents and Powers','Direct and Inverse Proportions','Factorisation','Introduction to Graphs'].map(title => ({ title, ncertUrl: ncert('math') })) },
    { name: 'Science', icon: '⚗', chapters: ['Crop Production','Microorganisms','Coal and Petroleum','Combustion and Flame','Conservation of Plants','Cell','Reproduction in Animals','Force and Pressure','Friction','Sound','Chemical Effects of Electric Current','Some Natural Phenomena','Light','Stars and Solar System','Pollution'].map(title => ({ title, ncertUrl: ncert('science') })) },
  ],
  '9': [
    { name: 'Mathematics', icon: '∑', chapters: ['Number Systems','Polynomials','Coordinate Geometry','Linear Equations','Introduction to Euclid Geometry','Lines and Angles','Triangles','Quadrilaterals','Circles','Heron’s Formula','Surface Areas and Volumes','Statistics','Probability'].map(title => ({ title, ncertUrl: ncert('math') })) },
    { name: 'Science', icon: '⚗', chapters: ['Matter in Our Surroundings','Is Matter Around Us Pure','Atoms and Molecules','Structure of the Atom','Cell','Tissues','Motion','Force and Laws of Motion','Gravitation','Work and Energy','Sound','Improvement in Food Resources'].map(title => ({ title, ncertUrl: ncert('science') })) },
  ],
  '10': [
    { name: 'Mathematics', icon: '∑', chapters: ['Real Numbers','Polynomials','Pair of Linear Equations','Quadratic Equations','Arithmetic Progressions','Triangles','Coordinate Geometry','Introduction to Trigonometry','Applications of Trigonometry','Circles','Areas Related to Circles','Surface Areas and Volumes','Statistics','Probability'].map(title => ({ title, ncertUrl: ncert('math') })) },
    { name: 'Science', icon: '⚗', chapters: ['Chemical Reactions','Acids Bases and Salts','Metals and Non-metals','Carbon Compounds','Life Processes','Control and Coordination','Reproduction','Heredity','Light','Human Eye','Electricity','Magnetic Effects','Our Environment'].map(title => ({ title, ncertUrl: ncert('science') })) },
  ],
  '11': [
    { name: 'Physics', icon: 'Φ', chapters: ['Units and Measurements','Motion in a Straight Line','Motion in a Plane','Laws of Motion','Work Energy and Power','System of Particles','Rotational Motion','Gravitation','Mechanical Properties','Thermal Properties','Thermodynamics','Kinetic Theory','Oscillations','Waves'].map(title => ({ title, ncertUrl: ncert('physics') })) },
    { name: 'Chemistry', icon: '⚗', chapters: ['Basic Concepts','Structure of Atom','Classification of Elements','Chemical Bonding','Thermodynamics','Equilibrium','Redox Reactions','Organic Chemistry Basics','Hydrocarbons'].map(title => ({ title, ncertUrl: ncert('chemistry') })) },
    { name: 'Biology', icon: '⌁', chapters: ['The Living World','Biological Classification','Plant Kingdom','Animal Kingdom','Morphology of Flowering Plants','Anatomy of Flowering Plants','Structural Organisation','Cell','Biomolecules','Cell Cycle','Transport in Plants','Mineral Nutrition','Photosynthesis','Respiration','Plant Growth','Digestion','Breathing','Body Fluids','Excretory Products','Locomotion','Neural Control','Chemical Coordination'].map(title => ({ title, ncertUrl: ncert('biology') })) },
  ],
  '12': [
    { name: 'Physics', icon: 'Φ', chapters: ['Electric Charges and Fields','Electrostatic Potential','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics','Wave Optics','Dual Nature','Atoms','Nuclei','Semiconductor Electronics'].map(title => ({ title, ncertUrl: ncert('physics') })) },
    { name: 'Chemistry', icon: '⚗', chapters: ['Solutions','Electrochemistry','Chemical Kinetics','d and f Block','Coordination Compounds','Haloalkanes','Alcohols Phenols Ethers','Aldehydes Ketones Acids','Amines','Biomolecules'].map(title => ({ title, ncertUrl: ncert('chemistry') })) },
    { name: 'Biology', icon: '⌁', chapters: ['Reproduction','Sexual Reproduction','Human Reproduction','Reproductive Health','Inheritance','Molecular Basis','Evolution','Human Health','Microbes','Biotechnology','Organisms and Populations','Ecosystem','Biodiversity'].map(title => ({ title, ncertUrl: ncert('biology') })) },
  ],
};
