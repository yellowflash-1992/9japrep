import {
  FaArrowLeft,
  FaBook,
  FaExternalLinkAlt,
  FaFeatherAlt,
  FaFileAlt,
  FaGlobe,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { POETRY_URL } from "../Components/QuickGrid";

const RESOURCES = [
  {
    label: "Poetry & Literature",
    description:
      "Original poems, literary analysis, and study aids for JAMB/WAEC English Literature.",
    url: POETRY_URL,
    icon: FaFeatherAlt,
    badge: "9jaPrep",
    color: "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
  },
  {
    label: "JAMB IBASS — Official Syllabus",
    description:
      "Official UTME syllabus, brochure, subject combinations, and recommended texts.",
    url: "https://ibass.jamb.gov.ng",
    icon: FaBook,
    badge: "Official",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
  {
    label: "WAEC e-Learning — Official",
    description:
      "WAEC-approved subject resources and standards for WASSCE preparation.",
    url: "https://waeconline.org.ng/e-learning",
    icon: FaGlobe,
    badge: "Official",
    color:
      "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  },
  {
    label: "NECO Syllabuses — Official",
    description:
      "Official NECO SSCE syllabuses. Navigate: Examinations → SSCE → Syllabuses.",
    url: "https://neco.gov.ng",
    icon: FaFileAlt,
    badge: "Official",
    color:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
];

export default function StudyMaterials() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 text-slate-800 dark:text-slate-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 mb-4"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-1">Study Materials</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Official syllabi and curated resources to guide your JAMB, WAEC, and
        NECO preparation.
      </p>

      <ul className="space-y-3">
        {RESOURCES.map((r) => (
          <li key={r.label}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}
                >
                  <r.icon />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-sm">{r.label}</h2>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {r.description}
                  </p>
                </div>
                <FaExternalLinkAlt
                  className="text-slate-400 mt-1 flex-shrink-0"
                  size={12}
                />
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <strong>Tip:</strong> Practice what you read. Head back to the dashboard
        and click <strong>Past Questions</strong> to test yourself on the same
        topics.
      </div>
    </div>
  );
}
