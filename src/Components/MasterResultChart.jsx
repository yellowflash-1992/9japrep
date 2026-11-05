import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MasterResultChart({ score, total }) {
  // Fallback to prevent division by zero
  const safeTotal = total || 1;
  const percentage = Math.round((score / safeTotal) * 100);

  const data = {
    labels: ['Correct', 'Wrong/Unanswered'],
    datasets: [{
      data: [score, safeTotal - score],
      backgroundColor: ['#10b981', '#f1f5f9'],
      hoverBackgroundColor: ['#059669', '#e2e8f0'],
      borderWidth: 0,
      cutout: '80%',
      borderRadius: score > 0 ? 10 : 0, // Visual polish
    }],
  };

  const options = {
    plugins: { 
      legend: { display: false },
      tooltip: { enabled: total > 0 } // Only show tooltip if there's data
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="relative w-full h-[250px] md:h-[350px] mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-800">
          {percentage}%
        </span>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Overall</span>
      </div>
    </div>
  );
}