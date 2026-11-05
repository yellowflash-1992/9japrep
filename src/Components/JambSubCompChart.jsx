import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { getSubjectColor } from '../Helpers/JambSubjectColor'; // Import the helper above

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function SubjectComparisonChart({ detailedResults, selectedSubjects }) {
 const data = {
  labels: selectedSubjects,
  datasets: [{
    label: 'Performance %',
    data: selectedSubjects.map(sub => {
       const key = sub.toLowerCase().includes("english") ? "english" : sub.toLowerCase().split(" ")[0];
       const s = detailedResults.breakdown?.[key] || 0;
       const t = detailedResults.totals?.[key] || 1;
       return Math.round((s / t) * 100);
    }),
    backgroundColor: selectedSubjects.map(sub => getSubjectColor(sub)),
    borderRadius: 6,
    barThickness: 20
  }]
};

  const options = {
    indexAxis: 'y', // Makes it a horizontal bar chart
    scales: {
      x: { max: 100, grid: { display: false }, ticks: { callback: v => v + '%' } },
      y: { grid: { display: false } }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[250px] md:h-[350px]">
      <Bar data={data} options={options} />
    </div>
  );
}