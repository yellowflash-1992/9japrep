import { useState } from "react";
import {
  FaExternalLinkAlt,
  FaTelegram,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";
import { useSuggestedGroup } from "../Hooks/useSuggestedGroup";
import OfflineWrapper from "./OfflineWrapper";

export default function SuggestedGroup({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const { groups, loading } = useSuggestedGroup();

  const visibleGroups = showAll ? groups : groups.slice(0, 4);

  return (
    <OfflineWrapper
      title="Suggested Study Groups"
      isOffline={isOffline}
      // Only show "View All" if there are actually more than 4 groups
      onViewAll={groups.length > 4 ? () => setShowAll(!showAll) : undefined}
      showAll={showAll}
    >
      {loading ? (
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))
      ) : groups.length === 0 ? (
        <div className="col-span-1 sm:col-span-2 text-center text-sm text-slate-500 py-6">
          No study groups available yet. Check back soon!
        </div>
      ) : (
        visibleGroups.map((group) => (
          <a
            key={group.id}
            href={group.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-green-200 transition-all block cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0
                ${group.platform === "whatsapp" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
              >
                {group.platform === "whatsapp" ? (
                  <FaWhatsapp />
                ) : (
                  <FaTelegram />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">
                  {group.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {group.subject}
                </p>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <FaUsers size={10} /> {group.members || "Active"}
                  </span>

                  {/* Fixed mobile hover: show "Join" on mobile, fade in on desktop */}
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    Join <FaExternalLinkAlt size={8} />
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))
      )}
    </OfflineWrapper>
  );
}
