import { getSubjectColor } from '../Helpers/JambSubjectColor';

const SubjectRow = ({ subject, score, total }) => {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const subjectColor = getSubjectColor(subject);
  
  return (
    <div className="flex w-full max-w-full min-w-0 items-center gap-4 overflow-hidden py-3 border-b border-slate-50 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex justify-between mb-1">
          <span className="min-w-0 break-words text-sm font-bold text-slate-700 md:text-base">{subject}</span>
          <span className="shrink-0 text-xs font-bold text-slate-400">{score}/{total}</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000"
            style={{ 
                width: `${pct}%`, 
                backgroundColor: subjectColor // Matches the chart!
            }}
          />
        </div>
      </div>
      <div className="font-black text-slate-700 text-sm w-10 text-right">{pct}%</div>
    </div>
  );
};
export default SubjectRow;