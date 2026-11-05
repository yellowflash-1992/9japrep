import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function ExamHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "submitted")
        .order("completed_at", { ascending: false })
        .limit(2);

      if (!isActive) return;

      if (error) {
        console.error("Failed to load exam history:", error);
        setHistory([]);
      } else {
        setHistory(data ?? []);
      }

      setIsLoading(false);
    };

    fetchHistory();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (isLoading || history.length === 0 || isDismissed) {
    return null;
  }

  const recentAttempt = history[0];

  return (
    <div className="mb-4 w-full rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full px-3 py-1.5 gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center md:gap-2 w-full md:w-auto">
          <div className="flex justify-between items-center w-full md:w-auto">
            <span className="text-sm font-semibold text-slate-700">
              Recent Score:
            </span>

            <div className="flex md:hidden items-center gap-3">
              <Link
                to="/history"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
              >
                View History →
              </Link>
              <button
                type="button"
                aria-label="Dismiss recent exam history"
                onClick={(event) => {
                  event.preventDefault();
                  setIsDismissed(true);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <span className="text-lg font-bold text-emerald-600 mt-1 md:mt-0">
            {String(recentAttempt.exam_type ?? "").toUpperCase()} -{" "}
            {recentAttempt.score ?? 0}/{recentAttempt.total ?? 0}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/history"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
          >
            View History →
          </Link>
          <button
            type="button"
            aria-label="Dismiss recent exam history"
            onClick={(event) => {
              event.preventDefault();
              setIsDismissed(true);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
}
