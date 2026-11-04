// components/ProjectMaterial.jsx
import { useState } from 'react';
import OfflineWrapper from './OfflineWrapper';
import { useProjectMaterials } from '../Hooks/useProjectMaterials';
import { FaFilePdf, FaFileWord, FaDownload, FaChevronRight } from 'react-icons/fa';

export default function ProjectMaterial({ isOffline }) {
  const [showAll, setShowAll] = useState(false);
  const { projects, loading } = useProjectMaterials();

  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <OfflineWrapper 
      title="Project Materials" 
      isOffline={isOffline}
      onViewAll={() => setShowAll(!showAll)}
      showAll={showAll}
    >
      {loading ? (
        [...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))
      ) : (
        visibleProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                {project.format === 'PDF' ? (
                  <FaFilePdf className="text-red-500 text-2xl" />
                ) : (
                  <FaFileWord className="text-blue-500 text-2xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span>{project.department}</span>
                  <span className="flex items-center gap-1">
                    <FaDownload className="text-[10px]" /> {project.downloads}
                  </span>
                </div>
              </div>
              <FaChevronRight className="shrink-0 text-slate-300 group-hover:text-rose-500 transition-colors mt-1" />
            </div>
          </div>
        ))
      )}
    </OfflineWrapper>
  );
}