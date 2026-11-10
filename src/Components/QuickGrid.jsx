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
    featured: true,
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
  if (tool.featured) {
    return (
      <Link
        to={tool.to}
        className="cursor-pointer md:px-2 group relative"
        aria-label={tool.label}
      >
        <div className="rounded-lg p-3 md:p-4 h-full flex-col transition-transform items-center flex shadow-md hover:shadow-lg hover:scale-105 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
          <span className="absolute top-1 right-1 text-[8px] font-extrabold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Start
          </span>

          {/* FLEX-1 forces text to center, keeping icons aligned */}
          <h2 className="flex-1 flex items-center justify-center text-center mb-2 text-xs md:text-sm font-bold leading-tight">
            {tool.label}
          </h2>
          <div className="flex justify-center rounded-full bg-white/20 p-2">
            <tool.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
      </Link>
    );
  }

  // Standard card — unchanged
  const inner = (
    <div
      className={`${tool.color} rounded-lg p-3 md:p-4 hover:scale-105 h-full flex-col transition-transform items-center flex shadow-sm hover:shadow-md`}
    >
      {/* FLEX-1 forces text to center, keeping icons aligned */}
      <h2
        className={`flex-1 flex items-center justify-center text-center mb-2 text-xs md:text-sm font-bold leading-tight ${tool.text}`}
      >
        {tool.label}
      </h2>
      <div className="flex justify-center rounded-full bg-white/50 md:bg-none hover:bg-purple-900/5 p-2">
        <tool.icon className={`h-6 w-6 md:h-8 md:w-8 ${tool.text}`} />
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 w-full">
      {tools.map((tool) => (
        <ToolCard key={tool.label} tool={tool} />
      ))}
    </div>
  );
}
