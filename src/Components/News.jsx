// components/News.jsx
import { useState } from 'react';
import OfflineWrapper from './OfflineWrapper';
import { useNews } from '../Hooks/useNews';
import { FaExternalLinkAlt, FaClock, FaNewspaper } from 'react-icons/fa';

export default function News({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const { news, loading } = useNews();

  const visibleNews = showAll ? news : news.slice(0, 4);

  return (
    <OfflineWrapper 
      title="Latest Education News" 
      isOffline={isOffline}
      onViewAll={() => setShowAll(!showAll)}
      showAll={showAll}
    >
      {loading ? (
        [...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 animate-pulse">
            <div className="flex gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                  <div className="h-3 bg-slate-100 rounded w-16 md:w-20" />
                  <div className="h-3 bg-slate-100 rounded w-12 md:w-16" />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        visibleNews.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-3 md:p-4 shadow-sm border
             border-slate-100 hover:shadow-md transition-all block"
          >
            <div className="flex items-start gap-2 md:gap-3">
              {/* Icon - fixed size */}
              <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl shrink-0">
                {item.image || <FaNewspaper className="text-rose-400 text-base md:text-lg" />}
              </div>
              
              {/* Content - takes remaining space */}
              <div className="flex-1 min-w-12">
                <h3 className="font-semibold text-slate-800 text-xs md:text-sm 
                lg:text-base line-clamp-4 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-1.5 text-[10px] md:text-xs text-slate-500 flex-wrap">
                  <span className="font-medium text-slate-600 truncate max-w-[100px] md:max-w-none">
                    {item.source}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <FaClock className="text-[8px] md:text-[10px]" /> 
                    <span className="truncate">{item.time}</span>
                  </span>
                </div>
              </div>
              
              {/* External link icon - hidden on mobile, visible on hover for desktop */}
              <FaExternalLinkAlt className="hidden md:block shrink-0 text-slate-300 group-hover:text-rose-500 transition-colors text-xs mt-0.5 opacity-0 group-hover:opacity-100" />
            </div>
          </a>
        ))
      )}
    </OfflineWrapper>
  );
}