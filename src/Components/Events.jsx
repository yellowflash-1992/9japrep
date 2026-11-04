// components/Events.jsx
import { useState } from 'react';
import OfflineWrapper from './OfflineWrapper';
import { useEvents } from '../Hooks/useEvents';
import { FaCalendarAlt, FaExternalLinkAlt, FaClock } from 'react-icons/fa';

// Event type badge colors
const typeStyles = {
  registration: 'bg-blue-100 text-blue-700 border-blue-200',
  exam: 'bg-rose-100 text-rose-700 border-rose-200',
  deadline: 'bg-amber-100 text-amber-700 border-amber-200',
  scholarship: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Events({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const { events, loading } = useEvents();

  const visibleEvents = showAll ? events : events.slice(0, 4);

  return (
    <OfflineWrapper 
      title="Upcoming Events" 
      isOffline={isOffline}
      onViewAll={() => setShowAll(!showAll)}
      showAll={showAll}
    >
      {loading ? (
        [...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 animate-pulse">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-24 mb-1.5" />
                <div className="h-3 bg-slate-100 rounded w-32" />
              </div>
            </div>
          </div>
        ))
      ) : (
        visibleEvents.map((event) => {
          const style = typeStyles[event.type] || typeStyles.default;
          return (
            <a
              key={event.id}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all block"
            >
              <div className="flex items-start gap-2 md:gap-3">
                {/* Calendar Icon */}
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 border ${style}`}>
                  <FaCalendarAlt className="text-sm md:text-base" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-16">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-xs
                     md:text-sm lg:text-base line-clamp-5 group-hover:text-rose-600 transition-colors">
                      {event.title}
                    </h3>
                    <FaExternalLinkAlt className="hidden md:block shrink-0 text-slate-300 group-hover:text-rose-500 transition-colors text-xs mt-0.5 opacity-0 group-hover:opacity-100" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] md:text-xs text-slate-500">
                    <FaClock className="text-[8px] md:text-[10px] shrink-0" />
                    <span className="font-medium truncate">{event.date}</span>
                  </div>
                  
                  {event.description && (
                    <p className="text-[10px] md:text-xs text-slate-500 mt-1.5 line-clamp-1 md:line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })
      )}
    </OfflineWrapper>
  );
}