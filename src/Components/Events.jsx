import { useState } from "react";
import { FaCalendarAlt, FaClock, FaTimes } from "react-icons/fa";
import { useEvents } from "../Hooks/useEvents";
import OfflineWrapper from "./OfflineWrapper";

const typeStyles = {
  jamb: "bg-emerald-100 text-emerald-700 border-emerald-200",
  waec: "bg-blue-100 text-blue-700 border-blue-200",
  neco: "bg-purple-100 text-purple-700 border-purple-200",
  general: "bg-slate-100 text-slate-700 border-slate-200",
};

// Helper to make URLs clickable in text
const renderDescription = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-rose-600 hover:underline font-medium break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export default function Events({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the modal
  const { events, loading } = useEvents();

  const visibleEvents = showAll ? events : events.slice(0, 4);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <OfflineWrapper
        title="Upcoming Events"
        isOffline={isOffline}
        onViewAll={events.length > 4 ? () => setShowAll(!showAll) : undefined}
        showAll={showAll}
      >
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 animate-pulse"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-24 mb-1.5" />
                </div>
              </div>
            </div>
          ))
        ) : visibleEvents.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 text-center text-sm text-slate-500 py-6">
            No upcoming events at the moment.
          </div>
        ) : (
          visibleEvents.map((event) => {
            const style = typeStyles[event.exam_type] || typeStyles.general;
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)} // Make card clickable
                className="group bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all block cursor-pointer"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 border ${style}`}
                  >
                    <FaCalendarAlt className="text-sm md:text-base" />
                  </div>
                  <div className="flex-1 min-w-16">
                    <h3 className="font-semibold text-slate-800 text-xs md:text-sm lg:text-base line-clamp-3 group-hover:text-rose-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-xs text-slate-500">
                      <FaClock className="text-[8px] md:text-[10px] shrink-0" />
                      <span className="font-medium truncate">
                        {formatDate(event.event_date)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 line-clamp-1 md:line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </OfflineWrapper>

      {/* --- EVENT MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-3 ${typeStyles[selectedEvent.exam_type] || typeStyles.general}`}
                >
                  {selectedEvent.exam_type || "General"}
                </span>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 bg-slate-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mb-4 bg-slate-50 p-3 rounded-lg">
                <FaCalendarAlt className="text-rose-500" />
                {formatDate(selectedEvent.event_date)}
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Details
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {renderDescription(selectedEvent.description)}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
