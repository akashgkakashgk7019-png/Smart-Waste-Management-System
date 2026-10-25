import { Router, Response } from 'express';
import { getDatabase, saveDatabase, QuizAttempt } from '../db.js';
import { authenticate, optionalAuthenticate, AuthenticatedRequest } from '../auth.js';

const router = Router();

// 10 Comprehensive Karnataka Segregation Quiz Questions
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'In Karnataka municipal corporations (e.g. BBMP, MCC), which color bin is designated for wet/organic kitchen waste?',
    options: ['Blue Bin', 'Green Bin', 'Red Bin', 'Black Bin'],
    correctIndex: 1,
    explanation: 'Green bins are used for organic/wet waste such as fruit peels, leftover cooked food, tea leaves, and garden leaves.'
  },
  {
    id: 2,
    question: 'How should used pizza boxes with oily cheese stains be disposed of?',
    options: [
      'Clean dry recyclable paper bin',
      'Compostable wet waste bin or non-recyclable reject waste (if heavy grease prevents recycling)',
      'E-Waste collection centre',
      'Hazardous waste bin'
    ],
    correctIndex: 1,
    explanation: 'Paper fibers soaked with grease and oil cannot be separated during the dry paper recycling process and should be composted if unprinted or disposed of as reject waste.'
  },
  {
    id: 3,
    question: 'Which of the following belongs strictly to the Domestic Hazardous Waste category?',
    options: ['Old newspapers', 'Expired medicines & mercury thermometers', 'Banana peels', 'Aluminium beverage cans'],
    correctIndex: 1,
    explanation: 'Expired medications, paints, pesticide containers, and mercury thermometers are domestic hazardous waste that require separate secure treatment.'
  },
  {
    id: 4,
    question: 'What is the correct way to dispose of sanitary pads and diapers in Karnataka municipal guidelines?',
    options: [
      'Mix with regular wet food waste',
      'Wrap securely in newspaper/paper bag marked with a red cross (X) and hand over to sanitary waste collector',
      'Flush down the toilet drain',
      'Throw into dry plastic recycling bins'
    ],
    correctIndex: 1,
    explanation: 'Sanitary waste must always be securely wrapped in newspaper or biodegradable bags marked with a red cross (X) to protect the health and dignity of sanitation workers.'
  },
  {
    id: 5,
    question: 'Which item is considered E-Waste and should NEVER be dumped with household trash?',
    options: ['Glass pickle jar', 'Dead smartphone batteries and charger cords', 'Coconut shells', 'Cardboard packaging'],
    correctIndex: 1,
    explanation: 'Batteries, chargers, and circuit boards contain toxic heavy metals (lead, cadmium, mercury) that poison soil and groundwater if not sent to authorized e-waste recyclers.'
  },
  {
    id: 6,
    question: 'What is the primary benefit of segregating wet waste at source for home composting?',
    options: [
      'It creates nutrient-rich soil manure and reduces landfill methane emissions by up to 60%',
      'It increases plastic production',
      'It consumes high electrical energy',
      'It pollutes neighborhood water bodies'
    ],
    correctIndex: 0,
    explanation: 'Wet organic waste decomposes aeratedly into rich compost, eliminating foul odors, leachates, and methane generation at city landfills.'
  },
  {
    id: 7,
    question: 'Before throwing a plastic milk pouch or curd container into the Dry Recyclable bin, what must you do?',
    options: [
      'Fill it with vegetable scraps',
      'Rinse it lightly with water and let it dry',
      'Burn it in the backyard',
      'Crush it with kitchen oil'
    ],
    correctIndex: 1,
    explanation: 'Rinsing and drying plastic packets prevents fungal growth, foul odor, and contamination of dry paper and cardboard recyclables.'
  },
  {
    id: 8,
    question: 'Which waste category includes broken ceramic coffee mugs, porcelain plates, and mirrors?',
    options: ['Dry recyclable glass', 'Non-recyclable / Reject waste', 'Biodegradable wet waste', 'Garden green waste'],
    correctIndex: 1,
    explanation: 'Ceramics, Pyrex, and mirrored glass have different melting temperatures from container glass (bottles/jars) and cannot be recycled in standard glass furnaces.'
  },
  {
    id: 9,
    question: 'What is the penalty/consequence of mixing hazardous biomedical waste with municipal garbage?',
    options: [
      'It poses severe biological infection hazards to sanitation workers and violates the Solid Waste Management Rules',
      'It speeds up composting',
      'It is legally permitted in all wards',
      'There is no effect'
    ],
    correctIndex: 0,
    explanation: 'Biomedical and infectious waste requires high-temperature incineration by authorized biomedical treatment facilities (CBWTF).'
  },
  {
    id: 10,
    question: 'Under Karnataka municipal 2-Bin-1-Bag / 3-Stream guidelines, what are the three primary streams?',
    options: [
      'Wet Waste, Dry Waste, and Sanitary/Hazardous Waste',
      'Wood, Cloth, and Mud',
      'Morning Waste, Afternoon Waste, and Evening Waste',
      'Small, Medium, and Large'
    ],
    correctIndex: 0,
    explanation: 'Karnataka solid waste rules mandate 3-way segregation: Green for Wet Biodegradable, Blue or Bag for Dry Recyclables, and Red/Wrapped for Sanitary & Hazardous Waste.'
  }
];

// GET questions (excluding correctIndex for client test)
router.get('/questions', (req, res): void => {
  const safeQuestions = QUIZ_QUESTIONS.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  res.json({ questions: safeQuestions });
});

// POST submit quiz answers and calculate real score
router.post('/submit', optionalAuthenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { answers } = req.body; // Record<questionId, selectedIndex>
    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ error: 'Answers must be provided as a question-index map.' });
      return;
    }

    let score = 0;
    const review = QUIZ_QUESTIONS.map(q => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        selectedIndex,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = QUIZ_QUESTIONS.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    let badgeAwarded: string | null = null;
    let pointsAwarded = score * 5;

    const db = getDatabase();

    if (req.user) {
      const user = db.users.find(u => u.id === req.user!.id);
      if (user) {
        user.points = (user.points || 0) + pointsAwarded;

        if (percentage >= 80 && !user.badges.includes('Segregation Master')) {
          user.badges.push('Segregation Master');
          badgeAwarded = 'Segregation Master';
        } else if (percentage >= 50 && !user.badges.includes('Green Citizen')) {
          user.badges.push('Green Citizen');
          badgeAwarded = 'Green Citizen';
        }

        const attempt: QuizAttempt = {
          id: `QZ-${Date.now()}`,
          userId: user.id,
          score,
          totalQuestions,
          percentage,
          completedAt: new Date().toISOString()
        };
        db.quizAttempts.unshift(attempt);

        saveDatabase(db);
      }
    }

    res.json({
      score,
      totalQuestions,
      percentage,
      pointsAwarded,
      badgeAwarded,
      review
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit quiz.' });
  }
});

export default router;
