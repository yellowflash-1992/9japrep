import {
  FaBookOpen,
  FaFeatherAlt,
  FaFileAlt,
  FaStopwatch,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Export so StudyMaterials page can reuse without duplication
export const POETRY_URL = "https://muse-night.vercel.app/";

const DEFAULT_TOOLS = [
  {
    label: "Full CBT Exam",
    icon: FaFileAlt,
    color: "bg-purple-900/10",
    text: "text-purple-900",
    type: "internal",
    to: "/exam-menu",
  },
  {
    label: "Past Questions",
    icon: FaStopwatch,
    color: "bg-purple-400/20",
    text: "text-purple-700",
    type: "internal",
    to: "/select-subject",
  },
  {
    label: "Poetry & Literature",
    icon: FaFeatherAlt,
    color: "bg-purple-600/20",
    text: "text-purple-800",
    type: "external",
    url: POETRY_URL,
  },
  {
    label: "Study Materials",
    icon: FaBookOpen,
    color: "bg-purple-900/30",
    text: "text-purple-900",
    type: "internal",
    to: "/study-materials",
  },
];

function ToolCard({ tool }) {
  const inner = (
    <div
      className={`${tool.color} rounded-lg p-4 hover:scale-105 h-full flex-col transition-transform items-center justify-between shadow-sm flex hover:shadow-md`}
    >
      <h2
        className={`mb-3 md:mb-5 text-[10px] md:text-sm font-bold ${tool.text}`}
      >
        {tool.label}
      </h2>
      <div className="flex justify-center rounded-full bg-white/50 md:bg-none hover:bg-purple-900/5">
        <tool.icon className={`h-8 w-8 md:h-8 md:w-8 ${tool.text}`} />
      </div>
    </div>
  );

  if (tool.type === "external") {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer md:px-2 group"
        aria-label={tool.label}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      to={tool.to}
      className="cursor-pointer md:px-2 group"
      aria-label={tool.label}
    >
      {inner}
    </Link>
  );
}

export default function QuickGrid({ tools = DEFAULT_TOOLS }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm font-bold md:px-12 md:items-stretch px-8 sm:px-0 mx-auto max-w-lg sm:max-w-full">
      {tools.map((tool) => (
        <ToolCard key={tool.label} tool={tool} />
      ))}
    </div>
  );
}
