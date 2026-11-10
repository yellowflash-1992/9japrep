import { FaFeatherAlt, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const TIPS = [
  "💡 Read the JAMB syllabus before you start practising",
  "⏱️ Real JAMB: 2 hours for 180 questions — time yourself",
  "📘 English is compulsory for every UTME candidate",
  "🎯 Practise your weak topics twice as often as strong ones",
  "🇳🇬 WAEC and NECO results can be combined for admission",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rounded-lg overflow-hidden bg-slate-900 text-slate-300 mt-8">
      {/* Exam tips ticker */}
      <div className="overflow-hidden border-b border-slate-800">
        <div
          className="flex whitespace-nowrap py-2"
          style={{ animation: "marquee 45s linear infinite" }}
        >
          {[...TIPS, ...TIPS].map((tip, i) => (
            <span key={i} className="mx-8 text-xs font-medium text-amber-300">
              {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-white mb-2">9jaPrep</h3>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Modern CBT practice for JAMB, WAEC, and NECO. Real exam-style
            questions, personal progress tracking, and a study path that adapts
            to you.
          </p>
        </div>

        {/* Practice */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Practice
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/exam-menu"
                className="hover:text-white transition-colors"
              >
                Full CBT Exam
              </Link>
            </li>
            <li>
              <Link
                to="/select-subject"
                className="hover:text-white transition-colors"
              >
                Practice Questions
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="hover:text-white transition-colors"
              >
                Exam History
              </Link>
            </li>
            <li>
              <Link
                to="/study-materials"
                className="hover:text-white transition-colors"
              >
                Study Materials
              </Link>
            </li>
          </ul>
        </div>

        {/* More */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            More
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/info" className="hover:text-white transition-colors">
                News &amp; Info
              </Link>
            </li>
            <li>
              <a
                href="https://muse-night.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <FaFeatherAlt className="text-pink-400" /> Poetry &amp;
                Literature
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@9japrep.com"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>© {year} 9jaPrep · Not affiliated with JAMB, WAEC, or NECO.</p>
          <p className="flex items-center gap-1">
            Built by{" "}
            <span className="text-white font-semibold">Yellowflash</span>
            <span className="mx-1">·</span>
            Made with <FaHeart className="text-rose-500 mx-0.5" /> in Nigeria 🇳🇬
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
