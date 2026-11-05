import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaChartLine,
  FaCrown,
  FaEdit,
  FaFire,
  FaGraduationCap,
  FaHistory,
  FaSave,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { supabase } from "../lib/supabase";

const EXAM_LABEL = { jamb: "JAMB", waec: "WAEC", neco: "NECO" };

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function pct(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 100);
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    school: "",
    state: "",
    exam_type: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    (async () => {
      setLoading(true);
      const [profileRes, attemptsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("attempts")
          .select(
            "id, exam_type, subjects, score, total, status, started_at, completed_at",
          )
          .eq("user_id", user.id)
          .eq("status", "submitted")
          .order("completed_at", { ascending: false }),
      ]);

      if (profileRes.error) {
        setError(profileRes.error.message);
        setLoading(false);
        return;
      }

      setProfile(profileRes.data);
      setForm({
        full_name: profileRes.data?.full_name || "",
        school: profileRes.data?.school || "",
        state: profileRes.data?.state || "",
        exam_type: profileRes.data?.exam_type || "",
      });
      setAttempts(attemptsRes.data || []);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  const totalAttempts = attempts.length;
  const avgPct = totalAttempts
    ? Math.round(
        attempts.reduce((s, a) => s + pct(a.score, a.total), 0) / totalAttempts,
      )
    : 0;
  const bestPct = totalAttempts
    ? Math.max(...attempts.map((a) => pct(a.score, a.total)))
    : 0;
  const lastAttemptDate = attempts[0]?.completed_at
    ? new Date(attempts[0].completed_at).toLocaleDateString()
    : "—";

  const handleSave = async () => {
    setSaving(true);
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim() || null,
        school: form.school.trim() || null,
        state: form.state.trim() || null,
        exam_type: form.exam_type || null,
      })
      .eq("id", user.id);

    if (updateErr) {
      alert("Save failed: " + updateErr.message);
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({
      data: { full_name: form.full_name.trim() },
    });

    setProfile((p) => ({ ...p, ...form }));
    setEditing(false);
    setSaving(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Failed to load profile: {error}
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name?.trim() || user?.email || "Candidate";
  const email = user?.email || "";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 text-slate-800 dark:text-slate-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-4"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Header card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {initials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold truncate">{displayName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {email}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {profile?.is_premium ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  <FaCrown /> Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  Free
                </span>
              )}
              {profile?.exam_type && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  <FaGraduationCap />{" "}
                  {EXAM_LABEL[profile.exam_type] ||
                    profile.exam_type.toUpperCase()}
                </span>
              )}
              {profile?.created_at && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>

        {!profile?.is_premium && (
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <FaCrown /> Upgrade to Premium
          </button>
        )}
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Edit Profile</h2>
            <button
              onClick={() => setEditing(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <FaTimes />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                  School
                </label>
                <input
                  type="text"
                  value={form.school}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, school: e.target.value }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                  State
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, state: e.target.value }))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Preferred Exam
              </label>
              <select
                value={form.exam_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, exam_type: e.target.value }))
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Not set</option>
                <option value="jamb">JAMB</option>
                <option value="waec">WAEC</option>
                <option value="neco">NECO</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-sm text-slate-600 dark:text-slate-400 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard
          icon={<FaHistory />}
          label="Attempts"
          value={totalAttempts}
          color="blue"
        />
        <StatCard
          icon={<FaChartLine />}
          label="Average"
          value={`${avgPct}%`}
          color="purple"
        />
        <StatCard
          icon={<FaTrophy />}
          label="Best"
          value={`${bestPct}%`}
          color="amber"
        />
        <StatCard
          icon={<FaFire />}
          label="Last Exam"
          value={lastAttemptDate}
          color="red"
        />
      </div>

      {/* Recent attempts */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Recent Attempts</h2>
          <button
            onClick={() => navigate("/history")}
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </button>
        </div>
        {attempts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
            No attempts yet. Start practising to see your scores here.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {attempts.slice(0, 5).map((a) => {
              const p = pct(a.score, a.total);
              const subs = Array.isArray(a.subjects)
                ? a.subjects
                    .map((s) =>
                      typeof s === "string" ? s : s?.subject || s?.name || "",
                    )
                    .filter(Boolean)
                    .join(", ")
                : a.subjects || "—";
              return (
                <li
                  key={a.id}
                  className="py-3 flex justify-between items-center gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {(
                        EXAM_LABEL[a.exam_type] ||
                        a.exam_type ||
                        ""
                      ).toUpperCase()}{" "}
                      · {subs}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {a.completed_at
                        ? new Date(a.completed_at).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold">
                      {a.score}/{a.total}
                    </p>
                    <p
                      className={`text-xs font-semibold ${p >= 70 ? "text-green-600" : p >= 50 ? "text-amber-600" : "text-red-600"}`}
                    >
                      {p}%
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
    </div>
  );
}
