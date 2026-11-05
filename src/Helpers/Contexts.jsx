import { createContext } from "react";

export const MIN_WAEC_QUESTIONS = 2;

export const ExamStateContext = createContext({

   examState: "menu",
  setExamState: () => {},
  score: 0,
  setScore: () => {},
  detailedResults: { breakdown: {}, totals: {} },
  setDetailedResults: () => {},
  reviewData: [],
  setReviewData: () => {},
  showLoginModal: false,
  setShowLoginModal: () => {},
  showWaecLoginModal: false,
  setShowWaecLoginModal: () => {},
  handleExamEntry: () => {},
  handleWaecEntry: () => {},

  selectedSubjects: [],
  setSelectedSubjects: () => {},
  config: { duration: 30, numQuestions: 20 },
  setConfig: () => {},

  userName: "",
  setUserName: () => {},

   waecUserName: "",
  setWaecUserName: () => {},
  waecSelectedSubjects: [],
  setWaecSelectedSubjects: () => {},
  waecConfig: { duration: 45, numQuestions: MIN_WAEC_QUESTIONS, examType: 'waec' },
  setWaecConfig: () => {},

  activeExam: 'jamb',
  switchExam: () => {},
});