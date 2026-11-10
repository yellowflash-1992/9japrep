import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaNewspaper, FaTimes } from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function News({ isOffline }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // NEW: Modal state

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      return;
    }

    async function fetchNews() {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        setNews(data);
      }
      setLoading(false);
    }

    fetchNews();
  }, [isOffline]);

  const visibleNews = showAll ? news : news.slice(0, 4);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric", // Added year for the modal
    });
  };

  return (
    <>
      <div className="-mt-2.5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-sm md:text-xl uppercase tracking-tight text-slate-800 flex items-center gap-2">
            <FaNewspaper className="text-blue-500" /> Latest Education News
          </h2>

          {!loading && news.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="cursor-pointer font-bold text-rose-600 text-xs whitespace-nowrap hover:text-rose-700 transition-colors"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-slate-500 animate-pulse">
            Loading news...
          </div>
        ) : news.length === 0 ? (
          <div className="text-sm text-slate-500">
            No news available right now.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleNews.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)} // NEW: Make card clickable
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col gap-1 cursor-pointer"
              >
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-slate-800 text-sm md:text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pt-1">
                    {formatDate(item.published_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.content}
                </p>

                {/* We removed the direct link here because the whole card is now clickable to open the modal */}
                <span className="text-[11px] font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 mt-2 w-max">
                  Read article <FaExternalLinkAlt size={10} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- NEWS MODAL --- */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaNewspaper className="text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {formatDate(selectedNews.published_at)}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                  {selectedNews.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="p-2 bg-slate-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors shrink-0"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Body (Scrollable if content is long) */}
            <div className="p-5 overflow-y-auto">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {selectedNews.content}
              </p>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Close
              </button>

              {selectedNews.source_url && (
                <a
                  href={selectedNews.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  Read Full Story <FaExternalLinkAlt size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
