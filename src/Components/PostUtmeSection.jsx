// components/PostUtmeSection.jsx
import { useState } from 'react';
import OfflineWrapper from './OfflineWrapper';
import { usePostUtmeData } from '../Hooks/usePostUtmeData';
import { FaUniversity, FaChevronRight } from 'react-icons/fa';

export default function PostUtmeSection({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const { data, loading } = usePostUtmeData();

  // If offline, we show the offline UI; if online but loading, show skeleton
  // Determine visible items based on showAll toggle
  const visibleItems = showAll ? data : data.slice(0, 4);

  return (
    <OfflineWrapper 
      title="Post UTME Past Questions" 
      isOffline={isOffline}
      onViewAll={() => setShowAll(!showAll)}
      showAll={showAll}
    >
      {loading ? (
        // Skeleton loading state
        [...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))
      ) : (
        visibleItems.map((school) => (
          <div
            key={school.id}
            className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-2xl">
                {school.logo || <FaUniversity className="text-rose-500" />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm md:text-base">{school.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {school.acronym} • Cutoff: {school.cutoff}
                </p>
              </div>
              <FaChevronRight className="text-slate-300 group-hover:text-rose-500 transition-colors" />
            </div>
          </div>
        ))
      )}
    </OfflineWrapper>
  );
}