import { Question, ResultCategory } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Where do tasks most often slow down or pile up in your department?",
    options: [
      {
        id: '1a',
        text: "During hand-offs between different teams or workflow stages.",
        category: ResultCategory.PROCESS
      },
      {
        id: '1b',
        text: "When waiting for specific individuals to make decisions or approve items.",
        category: ResultCategory.ROLE
      },
      {
        id: '1c',
        text: "We often don't realize things are stuck until a deadline is missed.",
        category: ResultCategory.VISIBILITY
      }
    ]
  },
  {
    id: 2,
    text: "How clear are roles and responsibilities across your team?",
    options: [
      {
        id: '2a',
        text: "Roles are defined, but the workflow processes themselves are clunky.",
        category: ResultCategory.PROCESS
      },
      {
        id: '2b',
        text: "There is frequent overlap or confusion about who owns what.",
        category: ResultCategory.ROLE
      },
      {
        id: '2c',
        text: "Everyone knows their job, but we lack data on actual output quality.",
        category: ResultCategory.VISIBILITY
      }
    ]
  },
  {
    id: 3,
    text: "Which of these issues shows up most frequently?",
    options: [
      {
        id: '3a',
        text: "Recurring errors or inefficiencies in execution steps.",
        category: ResultCategory.PROCESS
      },
      {
        id: '3b',
        text: "Disputes over tasks not being in someone's job description.",
        category: ResultCategory.ROLE
      },
      {
        id: '3c',
        text: "Surprise operational failures that we didn't see coming.",
        category: ResultCategory.VISIBILITY
      }
    ]
  },
  {
    id: 4,
    text: "When performance drops, how confident are you that you know why?",
    options: [
      {
        id: '4a',
        text: "I know where the process breaks, but fixing the workflow is difficult.",
        category: ResultCategory.PROCESS
      },
      {
        id: '4b',
        text: "Unsure, because it often depends on which individual is handling the task.",
        category: ResultCategory.ROLE
      },
      {
        id: '4c',
        text: "I usually only find out about the drop after the fact, so root cause is hard to trace.",
        category: ResultCategory.VISIBILITY
      }
    ]
  }
];

export const calculateResult = (answers: Record<number, ResultCategory>): ResultCategory => {
  const counts = {
    [ResultCategory.PROCESS]: 0,
    [ResultCategory.ROLE]: 0,
    [ResultCategory.VISIBILITY]: 0,
  };

  Object.values(answers).forEach((category) => {
    counts[category]++;
  });

  // Sort by count descending
  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  
  // Return the category with highest count, default to Process if tie/error
  return (sorted[0][0] as ResultCategory) || ResultCategory.PROCESS;
};

export const getResultDescription = (result: ResultCategory): string => {
  switch (result) {
    case ResultCategory.PROCESS:
      return "Your department likely suffers from inefficient workflows or friction at key hand-off points. The talent is there, but the system is slowing them down.";
    case ResultCategory.ROLE:
      return "Your team faces ambiguity in ownership. When 'everyone' is responsible, no one is. This leads to decision fatigue and bottlenecks at leadership levels.";
    case ResultCategory.VISIBILITY:
      return "You are operating with blind spots. Without real-time insight into performance metrics, you are reacting to fires rather than preventing them.";
    default:
      return "";
  }
};
