import { useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import { ExamStateContext } from "../Helpers/Contexts";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const subjectMap = {
    maths: "mathematics",
    math: "mathematics",
    english: "english",
    physics: "physics",
    chemistry: "chemistry",
};

const getAttemptId = () => {
    try {
        const session = JSON.parse(localStorage.getItem("waec_exam_session") || "{}");
        return session.attemptId ?? null;
    } catch (error) {
        console.error("Failed to read the current exam attempt:", error);
        return null;
    }
};

export const useExam = (subjectId) => {
   const {
        waecUserName, 
        userName, 
        setScore,
        waecSelectedSubjects, 
        waecConfig, 
        setDetailedResults, 
        setReviewData
    } = useContext(ExamStateContext);

    const navigate = useNavigate();
    const activeName = waecUserName || userName || "Guest";
    const examType = String(waecConfig?.examType ?? "waec").toLowerCase() === "neco" ? "neco" : "waec";
    const PREFIX = "waec_progress_";
    const EXAM_LOCK_KEY = "waec_exam_completed"; // Flag to prevent re-entry

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFinishingRef = useRef(false);
    const saveTimerRef = useRef(null);
    const pendingAnswersRef = useRef(new Map());

    const normalizedSelected = useMemo(() => {
        return waecSelectedSubjects?.map(sub => sub.toLowerCase().split(" ")[0]) || [];
    }, [waecSelectedSubjects]);

    const currentSubjectIndex = normalizedSelected.indexOf(subjectId?.toLowerCase());
    const nextSubjectId = normalizedSelected[currentSubjectIndex + 1];
    const isLastSubject = currentSubjectIndex === normalizedSelected.length - 1;
    const answerSubject = subjectId
        ? subjectMap[subjectId.toLowerCase()] || subjectId.toLowerCase()
        : "";

    // Check if exam was already completed
    const isExamLocked = useCallback(() => {
        return localStorage.getItem(EXAM_LOCK_KEY) === 'true';
    }, []);

    useEffect(() => {
        // Security: Redirect if exam already submitted or no valid session
        if (isExamLocked()) {
            navigate("/new-exam-end", { replace: true });
            return;
        }

        if (!subjectId || subjectId === ":subjectId") {
            navigate("/new-exam-menu", { replace: true });
            return;
        }

        let isActive = true;

        const loadQuestions = async () => {
            setIsLoading(true);

            const subjectKey = subjectId.toLowerCase().trim();
            const normalizedSubject = subjectMap[subjectKey] || subjectKey;
            const storageKey = `${PREFIX}${subjectKey}`;
            const saved = localStorage.getItem(storageKey);
            const masterSession = localStorage.getItem("waec_exam_session");

            if (!saved && !masterSession) {
                navigate("/new-exam-menu", { replace: true });
                return;
            }

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.questions?.length > 0) {
                        setQuestions(parsed.questions);
                        setAnswers(parsed.answers || {});
                        setFlagged(parsed.flagged || []);
                        setCurrentQuestion(parsed.currentQuestion || 0);
                        setIsLoading(false);
                        return;
                    }

                    localStorage.removeItem(storageKey);
                } catch (error) {
                    console.error("Failed to restore saved exam progress:", error);
                    setQuestions([]);
                    setAnswers({});
                    setFlagged([]);
                    setCurrentQuestion(0);
                    setIsLoading(false);
                    return;
                }
            }

            setQuestions([]);
            setAnswers({});
            setFlagged([]);
            setCurrentQuestion(0);

            try {
                const { data, error } = await supabase
                    .from("questions")
                    .select("*")
                    .eq("exam_type", examType)
                    .eq("subject", normalizedSubject.toLowerCase());

                if (!isActive) return;

                if (error) {
                    console.error(`Failed to load ${examType.toUpperCase()} questions for ${normalizedSubject}:`, error);
                    return;
                }

                if (!data || data.length === 0) {
                    setIsLoading(false);
                    alert("No questions available for this subject yet. Please try another subject.");
                    navigate("/new-select-subject");
                    return;
                }

                const mappedQuestions = (data ?? [])
                    .filter((question) => (
                        examType !== "waec"
                        || ((question.options?.length ?? 0) <= 4 && Number(question.correct_option) < 4)
                    ))
                    .map((question) => ({
                    ...question,
                    prompt: question.question_text,
                    answer: question.correct_option,
                    }));

                if (mappedQuestions.length === 0) {
                    alert("No questions available. Please try again.");
                    navigate("/new-select-subject");
                    return;
                }

                const count = Number(waecConfig?.numQuestions) || (examType === "waec" ? 40 : 60);
                const shuffled = [...mappedQuestions]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.min(mappedQuestions.length, count));

                if (shuffled.length === 0) {
                    setIsLoading(false);
                    alert("No eligible questions available for this subject yet. Please try another subject.");
                    navigate("/new-select-subject");
                    return;
                }

                setQuestions(shuffled);
            } catch (error) {
                if (!isActive) return;
                console.error(`Failed to load ${examType.toUpperCase()} questions for ${normalizedSubject}:`, error);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        loadQuestions();

        return () => {
            isActive = false;
        };
    }, [subjectId, examType, waecConfig?.numQuestions, navigate, isExamLocked]);

    useEffect(() => {
        if (isLoading || !questions.length || !subjectId) return;
        const data = { questions, answers, flagged, currentQuestion };
        localStorage.setItem(`${PREFIX}${subjectId.toLowerCase()}`, JSON.stringify(data));
    }, [questions, answers, flagged, currentQuestion, subjectId, isLoading]);

    const saveAnswer = useCallback(async (answer) => {
        const attemptId = getAttemptId();
        if (!attemptId) {
            console.error("Cannot save exam answer without an active attempt.");
            return;
        }

        try {
            const payload = {
                attempt_id: attemptId,
                ...answer,
                updated_at: new Date().toISOString(),
            };
            const { error } = await supabase
                .from("answers")
                .upsert(payload, { onConflict: "attempt_id,subject,question_id" });

            if (error) {
                alert("Failed to save answer to database. Check console for details.");
                console.error("SUPABASE SAVE ERROR:", JSON.stringify(error, null, 2));
            }
        } catch (error) {
            console.error("Failed to save exam answer to Supabase:", error);
        }
    }, []);

    const flushPendingAnswer = useCallback(async () => {
        const pendingAnswers = [...pendingAnswersRef.current.values()];
        pendingAnswersRef.current.clear();
        await Promise.all(pendingAnswers.map(saveAnswer));
    }, [saveAnswer]);

    useEffect(() => {
        const syncTimeRemaining = async () => {
            let session;
            try {
                session = JSON.parse(localStorage.getItem("waec_exam_session") || "{}");
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

            flushPendingAnswer();
        };
    }, [flushPendingAnswer]);

    const finishExam = useCallback(async () => {
        const attemptId = getAttemptId();

        if (isFinishingRef.current) return;
        isFinishingRef.current = true;

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }

        await flushPendingAnswer();

        // Set the lock to prevent re-entry
        localStorage.setItem(EXAM_LOCK_KEY, 'true');

        let totalScore = 0;
        const subjectScores = {};
        const subjectTotals = {};
        const allReview = [];

        normalizedSelected.forEach(sub => {
            const data = JSON.parse(localStorage.getItem(`${PREFIX}${sub}`));
            if (data) {
                data.questions.forEach((q, idx) => {
                    const isCorrect = data.answers[idx] === q.answer;
                    if (isCorrect) {
                        totalScore++;
                        subjectScores[sub] = (subjectScores[sub] || 0) + 1;
                    }
                    allReview.push({ ...q, userAnswer: data.answers[idx], isCorrect, subject: sub });
                });
                subjectTotals[sub] = data.questions.length;
            }
        });

        const totalQuestions = Object.values(subjectTotals).reduce((sum, count) => sum + count, 0);

        if (attemptId) {
            const { error } = await supabase.from('attempts').update({
                score: totalScore,
                total: totalQuestions,
                status: 'submitted',
                completed_at: new Date().toISOString()
            }).eq('id', attemptId);

            if (error) console.error("Failed to save score to Supabase:", error);
        }

        setScore(totalScore);
        setDetailedResults({ breakdown: subjectScores, totals: subjectTotals });
        setReviewData(allReview);

        Object.keys(localStorage).forEach(key => {
            if (
                key.startsWith("waec_exam_session")
                || key.startsWith("waec_progress")
                || key.startsWith("neco_exam_session")
                || key.startsWith("neco_progress")
            ) {
                localStorage.removeItem(key);
            }
        });

        navigate("/new-exam-end", { replace: true });
    }, [normalizedSelected, navigate, setScore, setDetailedResults, setReviewData, flushPendingAnswer]);

    const chooseOption = useCallback((idx) => {
        setAnswers(prev => ({ ...prev, [currentQuestion]: idx }));

        const question = questions[currentQuestion];
        if (!question?.id || !subjectId) return;

        const pendingAnswer = {
            subject: answerSubject,
            question_id: question.id,
            selected_option: idx,
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
            flushPendingAnswer();
        }, 1000);
    }, [currentQuestion, questions, subjectId, answerSubject, flushPendingAnswer]);

    // Additional security: if user tries to go back after finishing, we can't prevent the page load,
    // but the check at the top of useEffect will redirect them immediately.

    return {
        activeName, questions, currentQuestion, answers, flagged,
        isLoading, isLastSubject, nextSubjectId, normalizedSelected,
        chooseOption,
        jumpToQuestion: (idx) => setCurrentQuestion(idx),
        toggleFlag: () => setFlagged(prev => prev.includes(currentQuestion) ? prev.filter(q => q !== currentQuestion) : [...prev, currentQuestion]),
        nextQuestion: () => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else if (nextSubjectId) {
                navigate(`/new-exam-page/${nextSubjectId}`);
            } else {
                finishExam();
            }
        },
        finishExam
    };
};