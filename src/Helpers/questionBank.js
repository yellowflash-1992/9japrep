import { supabase } from "../lib/supabase";

/**
 * Shared question-bank helpers for the student app.
 *
 * The `questions` table now carries two extra columns:
 *   - topic      (text)  e.g. "Algebra", "Grammar", "Cell Biology"
 *   - difficulty (text)  e.g. "easy" | "medium" | "hard"
 *
 * Everything here is additive: the existing mock-exam queries in
 * `useLogic.js` / `jambUseExamLogic.js` keep working untouched.
 */

export const DIFFICULTIES = ["easy", "medium", "hard"];

// Default mix used when a mock exam is generated (30% easy / 50% medium / 20% hard).
export const MOCK_DIFFICULTY_MIX = { easy: 0.3, medium: 0.5, hard: 0.2 };

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export const normalizeDifficulty = (value) => {
  const key = normalize(value);
  return DIFFICULTIES.includes(key) ? key : null;
};

/** Fisher-Yates shuffle — unbiased, unlike `sort(() => Math.random() - 0.5)`. */
export const shuffle = (items = []) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Fetch approved questions for a subject, optionally narrowed by topic
 * and/or difficulty. Returns `{ data, error }` like a Supabase call.
 */
export const fetchPracticeQuestions = async ({
  examType = "jamb",
  subject,
  topic,
  difficulty,
  limit,
} = {}) => {
  if (!subject) {
    return { data: [], error: new Error("A subject is required.") };
  }

  let query = supabase
    .from("questions")
    .select("*")
    .eq("exam_type", normalize(examType))
    .eq("subject", normalize(subject))
    .eq("status", "approved");

  if (topic) query = query.eq("topic", topic);

  const safeDifficulty = normalizeDifficulty(difficulty);
  if (safeDifficulty) query = query.eq("difficulty", safeDifficulty);

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  return { data: data ?? [], error };
};

/**
 * Distinct topics available for a subject (used by the Practice Setup screen).
 * Falls back to an empty list when the column is not populated yet.
 */
export const fetchTopics = async ({ examType = "jamb", subject } = {}) => {
  if (!subject) return { data: [], error: null };

  const { data, error } = await supabase
    .from("questions")
    .select("topic")
    .eq("exam_type", normalize(examType))
    .eq("subject", normalize(subject))
    .eq("status", "approved")
    .not("topic", "is", null);

  if (error) return { data: [], error };

  const topics = [
    ...new Set((data ?? []).map((row) => row.topic).filter(Boolean)),
  ];
  topics.sort((a, b) => a.localeCompare(b));
  return { data: topics, error: null };
};

/**
 * Build a difficulty-balanced set from a pool of questions.
 *
 * `mix` is a ratio map, e.g. { easy: 0.3, medium: 0.5, hard: 0.2 }.
 * If a bucket is short, the remaining slots are filled from the other
 * buckets so the exam still reaches `count` questions when possible.
 */
export const pickBalancedQuestions = (
  pool = [],
  count = 0,
  mix = MOCK_DIFFICULTY_MIX,
) => {
  if (!pool.length || count <= 0) return [];

  const buckets = { easy: [], medium: [], hard: [], unrated: [] };
  pool.forEach((question) => {
    const key = normalizeDifficulty(question.difficulty) ?? "unrated";
    buckets[key].push(question);
  });

  Object.keys(buckets).forEach((key) => {
    buckets[key] = shuffle(buckets[key]);
  });

  const picked = [];
  const taken = new Set();

  const take = (bucketKey, amount) => {
    for (const question of buckets[bucketKey]) {
      if (picked.length >= count || amount <= 0) break;
      if (taken.has(question.id)) continue;
      taken.add(question.id);
      picked.push(question);
      amount -= 1;
    }
  };

  // 1. Fill each difficulty bucket according to the mix.
  DIFFICULTIES.forEach((level) => {
    const target = Math.round(count * (mix[level] ?? 0));
    take(level, target);
  });

  // 2. Top up from any remaining rated questions (keeps the mix as close as possible).
  if (picked.length < count) {
    take("unrated", count - picked.length);
  }

  // 3. Last resort: fill from whatever is left so the exam is never short.
  if (picked.length < count) {
    const leftovers = shuffle(
      pool.filter((question) => !taken.has(question.id)),
    );
    for (const question of leftovers) {
      if (picked.length >= count) break;
      taken.add(question.id);
      picked.push(question);
    }
  }

  return shuffle(picked);
};

/** Small helper for UI badges. */
export const difficultyStyles = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};
