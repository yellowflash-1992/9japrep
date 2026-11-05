import { FaBookOpen, FaStopwatch, FaStore, FaVideo } from "react-icons/fa";

const DEFAULT_TOOLS = [
  {
    label: "Past Questions",
    icon: FaStopwatch,
    color: "bg-purple-900/10",
    text: "text-purple-900",
    url: "https://myschool.ng/classroom", // Example
  },
  {
    label: "School Store",
    icon: FaStore,
    color: "bg-purple-400/20",
    text: "text-purple-700",
    url: "https://myschool.ng/video-lessons", // Example
  },
  {
    label: "Video Lessons",
    icon: FaVideo,
    color: "bg-purple-600/20",
    text: "text-purple-800",
    url: "https://www.jumia.com.ng/catalog/?q=jamb+waec+books", // Example
  },
  {
    label: "Novels",
    icon: FaBookOpen,
    color: "bg-purple-900/30",
    text: "text-purple-900",
    url: "https://flashlearners.com/jamb-syllabus-brochure-novel/", // Example
  },
];

export default function QuickGrid({ tools = DEFAULT_TOOLS }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm font-bold md:px-12 md:items-stretch px-8 sm:px-0 mx-auto max-w-lg sm:max-w-full">
      {tools.map((tool) => (
        <a
          key={tool.label}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer md:px-2 group"
        >
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
        </a>
      ))}
    </div>
  );
}
