// hooks/UseExamLogic.js
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ExamStateContext } from "../Helpers/Contexts";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";
import {
  fetchPracticeQuestions,
  pickBalancedQuestions,
  shuffle,
} from "../Helpers/questionBank";

const SESSION_PREFIX = "jamb_exam_session_";
const PRACTICE_PREFIX = "jamb_practice_";

const getAttemptId = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem("jamb_exam_session") || "{}",
    );
    return session.attemptId ?? null;
  } catch (error) {
    console.error("Failed to read the current exam attempt:", error);
    return null;
  }
};

export const useExam = (subjectId, options = {}) => {
  const { mode = "exam", practiceConfig: practiceConfigProp = null } = options;

  const {
    userName,
    setScore,
    selectedSubjects,
    config,
    setDetailedResults,
    setReviewData,
    practiceConfig: contextPracticeConfig,
  } = useContext(ExamStateContext);

  // Practice mode is driven by the shared practice config (set on the subject
  // selection screen). An explicit `mode` prop still wins when provided.
  const practiceConfig = practiceConfigProp ?? contextPracticeConfig;
  const isPractice = mode === "practice" || Boolean(practiceConfig?.subject);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isFinishing, setIsFinishing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchPremium = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();
      setIsPremium(data?.is_premium || false);
    };
    fetchPremium();
  }, [user?.id]);

  const isFinishingRef = useRef(false);
  const saveTimerRef = useRef(null);
  const pendingAnswersRef = useRef(new Map());

  // Normalize IDs (e.g., "Use of English" -> "english")
  const normalizedSelected = useMemo(() => {
    // Practice mode is a single-subject drill, so the "exam" is just that subject.
    if (isPractice) {
      return subjectId ? [subjectId.toLowerCase().trim()] : [];
    }

    return (
      selectedSubjects?.map((sub) => {
        const lower = sub.toLowerCase();
        if (lower.includes("english")) return "english";
        return lower.split(" ")[0];
      }) || []
    );
  }, [selectedSubjects, isPractice, subjectId]);

  const currentSubjectIndex = normalizedSelected.indexOf(
    subjectId?.toLowerCase().trim(),
  );
  const nextSubjectId = normalizedSelected[currentSubjectIndex + 1];
  const isLastSubject = !nextSubjectId;

  const currentSubjectKey = subjectId
    ? `${isPractice ? PRACTICE_PREFIX : SESSION_PREFIX}${subjectId.toLowerCase().trim()}`
    : "";

  // Question Loading Logic
  useEffect(() => {
    if (!subjectId) return;

    let isActive = true;

    const loadQuestions = async () => {
      setIsLoading(true);
      setLoadError("");
      const normalizedId = subjectId.toLowerCase().trim();
      const saved = JSON.parse(
        localStorage.getItem(
          `${isPractice ? PRACTICE_PREFIX : SESSION_PREFIX}${normalizedId}`,
        ),
      );

      // A practice drill must match the current topic/difficulty/count,
      // otherwise a stale drill from a previous setup would be restored.
      const savedMatchesPractice =
        !isPractice ||
        (saved?.practiceConfig?.topic === (practiceConfig?.topic || "") &&
          saved?.practiceConfig?.difficulty === (practiceConfig?.difficulty || "") &&
          saved?.practiceConfig?.numQuestions ===
            (Number(practiceConfig?.numQuestions) || 10));

      if (saved?.questions?.length > 0 && savedMatchesPractice) {
        setQuestions(saved.questions);
        setAnswers(saved.answers || {});
        setFlagged(saved.flagged || []);
        setCurrentQuestion(saved.currentQuestion || 0);
        setSelectedOption(saved.answers?.[saved.currentQuestion] ?? null);
        setIsLoading(false);
        return;
      }

      setQuestions([]);
      setAnswers({});
      setFlagged([]);
      setCurrentQuestion(0);
      setSelectedOption(null);

      try {
        // --- PRACTICE MODE: topic / difficulty drill ---
        if (isPractice) {
          const { data, error } = await fetchPracticeQuestions({
            examType: "jamb",
            subject: normalizedId,
            topic: practiceConfig?.topic || undefined,
            difficulty: practiceConfig?.difficulty || undefined,
          });

          if (!isActive) return;

          if (error) {
            console.error("Failed to load practice questions:", error);
            setLoadError(
              "Could not load questions for this practice session. Please try again later.",
            );
            return;
          }

          const practiceCount = Number(practiceConfig?.numQuestions) || 10;
          const picked = shuffle(data ?? [])
            .slice(0, practiceCount)
            .map((q) => ({
              ...q,
              prompt: q.prompt ?? q.question_text ?? q.question ?? "",
              subjectKey: normalizedId,
            }));

          setQuestions(picked);
          return;
        }

        // --- MOCK EXAM MODE (unchanged behaviour) ---
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .eq("exam_type", "jamb")
          .eq("subject", normalizedId)
          .eq("status", "approved");

        if (!isActive) return;

        if (error) {
          console.error("Failed to load JAMB questions:", error);
          setLoadError(
            "Could not load questions for this subject. Please try again later.",
          );
          return;
        }

        const rawPool = data ?? [];
        // Determine count based on Mode and Subject
        const isFull = config.duration === 120;
        const isEnglish = normalizedId === "english";
        const count = isEnglish ? (isFull ? 20 : 10) : isFull ? 10 : 5;
        const finalCount = isPremium ? count : Math.min(10, count);

        // Balanced mock: 30% easy / 50% medium / 20% hard when the
        // `difficulty` column is populated, otherwise a plain shuffle.
        const hasDifficultyData = rawPool.some((q) => q.difficulty);
        const selected = hasDifficultyData
          ? pickBalancedQuestions(rawPool, finalCount)
          : shuffle(rawPool).slice(0, finalCount);

        const shuffled = selected.map((q) => ({
          ...q,
          prompt: q.prompt ?? q.question_text ?? q.question ?? "",
          subjectKey: normalizedId,
        }));

        setQuestions(shuffled);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load JAMB questions:", error);
        setLoadError(
          "Could not load questions for this subject. Please try again later.",
        );
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadQuestions();
    return () => {
      isActive = false;
    };
  }, [
    subjectId,
    config.duration,
    isPremium,
    isPractice,
    practiceConfig?.topic,
    practiceConfig?.difficulty,
    practiceConfig?.numQuestions,
  ]);

  // Save progress to LocalStorage
  useEffect(() => {
    if (isLoading || !questions.length || !currentSubjectKey) return;
    const examData = {
      userName,
      subjectId,
      questions,
      answers,
      currentQuestion,
      flagged,
      ...(isPractice
        ? {
            practiceConfig: {
              topic: practiceConfig?.topic || "",
              difficulty: practiceConfig?.difficulty || "",
              numQuestions: Number(practiceConfig?.numQuestions) || 10,
            },
          }
        : {}),
    };
    localStorage.setItem(currentSubjectKey, JSON.stringify(examData));
  }, [
    questions,
    answers,
    currentQuestion,
    flagged,
    userName,
    subjectId,
    isLoading,
    currentSubjectKey,
    isPractice,
    practiceConfig?.topic,
    practiceConfig?.difficulty,
    practiceConfig?.numQuestions,
  ]);

  const saveAnswer = useCallback(async (answer) => {
    const attemptId = getAttemptId();
    if (!attemptId) {
      console.error("Cannot save exam answer without an active attempt.");
      return;
    }

    try {
      const { error } = await supabase.from("answers").upsert(
        {
          attempt_id: attemptId,
          ...answer,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "attempt_id,subject,question_id" },
      );

      if (error) {
        console.error("Failed to save exam answer to Supabase:", error);
      }
    } catch (error) {
      console.error("Failed to save exam answer to Supabase:", error);
    }
  }, []);

  const flushPendingAnswers = useCallback(async () => {
    const pendingAnswers = [...pendingAnswersRef.current.values()];
    pendingAnswersRef.current.clear();
    await Promise.all(pendingAnswers.map(saveAnswer));
  }, [saveAnswer]);

  useEffect(() => {
    const syncTimeRemaining = async () => {
      let session;
      try {
        session = JSON.parse(localStorage.getItem("jamb_exam_session") || "{}");
      } catch (error) {
        console.error("Failed to read the current exam timer:", error);
        return;
      }

      const attemptId = getAttemptId();
      const timeLeft = session.timeLeft;
      if (!attemptId || typeof timeLeft !== "number") return;

      try {
        const { error } = await supabase
          .from("attempts")
          .update({ time_remaining_seconds: timeLeft })
          .eq("id", attemptId);

        if (error) {
          console.error("Failed to sync exam timer to Supabase:", error);
        }
      } catch (error) {
        console.error("Failed to sync exam timer to Supabase:", error);
      }
    };

    const intervalId = setInterval(syncTimeRemaining, 15000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      flushPendingAnswers();
    };
  }, [flushPendingAnswers]);

  const finishExam = useCallback(async () => {
    const attemptId = getAttemptId();

    if (isFinishingRef.current) return;
    setIsFinishing(true);
    isFinishingRef.current = true;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    await flushPendingAnswers();

    const currentExamData = {
      userName,
      subjectId,
      questions,
      answers,
      currentQuestion,
      flagged,
    };
    localStorage.setItem(currentSubjectKey, JSON.stringify(currentExamData));

    let totalScore = 0;
    const subjectScores = {};
    const subjectTotals = {};
    const allReviewData = [];

    normalizedSelected.forEach((key) => {
      const storedData = JSON.parse(
        localStorage.getItem(`${SESSION_PREFIX}${key}`),
      );

      if (storedData && storedData.questions) {
        subjectScores[key] = 0;
        subjectTotals[key] = storedData.questions.length;

        storedData.questions.forEach((q, idx) => {
          const userAns = storedData.answers[idx];
          const isCorrect = userAns === q.answer;

          if (isCorrect) {
            totalScore++;
            subjectScores[key]++;
          }

          // Push to review with subject name for filtering
          allReviewData.push({
            ...q,
            userAnswer: userAns,
            isCorrect,
            subjectName: key,
          });
        });
      }
    });

    const totalQuestions = Object.values(subjectTotals).reduce(
      (sum, count) => sum + count,
      0,
    );

    // Practice drills have no `attempts` row, so never write a score for them.
    if (attemptId && !isPractice) {
      const { error } = await supabase
        .from("attempts")
        .update({
          score: totalScore,
          total: totalQuestions,
          status: "submitted",
          completed_at: new Date().toISOString(),
        })
        .eq("id", attemptId);

      if (error) console.error("Failed to save score to Supabase:", error);
    }

    setScore(totalScore);
    const finalResults = { breakdown: subjectScores, totals: subjectTotals };
    setDetailedResults(finalResults);
    setReviewData(allReviewData);

    localStorage.setItem(
      "last_exam_results",
      JSON.stringify({
        score: totalScore,
        results: finalResults,
        review: allReviewData,
      }),
    );

    // Clear only exam-related storage
    Object.keys(localStorage).forEach((k) => {
      if (
        k.startsWith(SESSION_PREFIX) ||
        k.startsWith(PRACTICE_PREFIX) ||
        k === "jamb_exam_session"
      ) {
        localStorage.removeItem(k);
      }
    });

    navigate("/exam-end", { replace: true });
  }, [
    normalizedSelected,
    navigate,
    setScore,
    setDetailedResults,
    setReviewData,
    userName,
    subjectId,
    questions,
    answers,
    currentQuestion,
    flagged,
    currentSubjectKey,
    flushPendingAnswers,
    isPractice,
  ]);

  const chooseOption = useCallback(
    (index) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: index }));
      setSelectedOption(index);

      const question = questions[currentQuestion];
      if (!question?.id || !subjectId) return;

      const pendingAnswer = {
        subject: subjectId.toLowerCase().trim(),
        question_id: question.id,
        selected_option: index,
      };
      pendingAnswersRef.current.set(
        `${pendingAnswer.subject}:${pendingAnswer.question_id}`,
        pendingAnswer,
      );

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        flushPendingAnswers();
      }, 500);
    },
    [currentQuestion, questions, subjectId, flushPendingAnswers],
  );

  const jumpToQuestion = useCallback(
    (index) => {
      if (index < 0 || index >= questions.length) return;
      setCurrentQuestion(index);
      setSelectedOption(answers[index] ?? null);
    },
    [questions.length, answers],
  );

  const handleNextAction = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      jumpToQuestion(currentQuestion + 1);
    } else if (!isLastSubject) {
      navigate(`/exam/${nextSubjectId}`);
    } else if (isPractice) {
      finishExam();
    } else {
      if (
        window.confirm("You are at the end of the exam. Do you want to submit?")
      ) {
        finishExam();
      }
    }
  }, [
    currentQuestion,
    questions.length,
    isLastSubject,
    nextSubjectId,
    navigate,
    jumpToQuestion,
    finishExam,
    isPractice,
  ]);

  const toggleFlag = useCallback(() => {
    setFlagged((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((q) => q !== currentQuestion)
        : [...prev, currentQuestion],
    );
  }, [currentQuestion]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if the user is typing in an input (if you add a search bar later)
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      )
        return;

      const key = event.key.toLowerCase();

      // Mapping A, B, C, D to indices 0, 1, 2, 3
      if (key === "a") chooseOption(0);
      if (key === "b") chooseOption(1);
      if (key === "c") chooseOption(2);
      if (key === "d") chooseOption(3);

      // Navigation shortcuts
      if (key === "n") handleNextAction();
      if (key === "p") jumpToQuestion(currentQuestion - 1);

      // Flag shortcut
      if (key === "f") toggleFlag();
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on unmount
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    chooseOption,
    handleNextAction,
    jumpToQuestion,
    toggleFlag,
    currentQuestion,
  ]);

  return {
    userName,
    config,
    questions,
    question: questions[currentQuestion] || null,
    currentQuestion,
    selectedOption,
    answers,
    flagged,
    isLoading,
    loadError,
    isFinishing,
    chooseOption,
    nextQuestion: handleNextAction,
    finishExam,
    jumpToQuestion,
    toggleFlag,
    isLastSubject,
    isPremium,
    isPractice,
  };
};
