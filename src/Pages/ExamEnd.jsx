import React, { useContext } from 'react';
import { ExamStateContext } from '../Helpers/Contexts';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FaAward, FaHistory, FaRedo, FaChevronRight } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ExamEnd() {
    const { score, detailedResults, waecUserName, waecConfig } = useContext(ExamStateContext);
    const navigate = useNavigate();
    const examType = String(waecConfig?.examType ?? "waec").toLowerCase() === "neco" ? "neco" : "waec";
    const theme = examType === "neco"
        ? {
            border: "border-purple-100",
            buttonBorder: "border-purple-600",
            buttonText: "text-purple-600",
            buttonHover: "hover:bg-purple-50",
            panel: "bg-purple-600",
            panelIcon: "text-purple-200",
            panelSubtle: "text-purple-100",
            chart: "rgba(147, 51, 234, 0.6)",
            chartBorder: "rgb(147, 51, 234)",
            progress: "bg-orange-500",
            scoreText: "text-purple-600",
        }
        : {
            border: "border-emerald-100",
            buttonBorder: "border-emerald-600",
            buttonText: "text-emerald-600",
            buttonHover: "hover:bg-emerald-50",
            panel: "bg-emerald-600",
            panelIcon: "text-emerald-200",
            panelSubtle: "text-emerald-100",
            chart: "rgba(5, 150, 105, 0.6)",
            chartBorder: "rgb(5, 150, 105)",
            progress: "bg-blue-500",
            scoreText: "text-emerald-600",
        };

    // Calculate total questions across all subjects
    const totals = detailedResults?.totals || {};
    const breakdown = detailedResults?.breakdown || {};
    const totalPossible = Object.values(totals).reduce((a, b) => a + b, 0);
    const percentage = Math.round((score / totalPossible) * 100) || 0;

    // Chart Data for Subject Breakdown
    const barData = {
        labels: Object.keys(breakdown).map(s => s.toUpperCase()),
        datasets: [{
            label: 'Score per Subject',
            data: Object.values(breakdown),
            backgroundColor: theme.chart,
            borderColor: theme.chartBorder,
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* --- Hero Score Section --- */}
                <div className={`bg-white rounded-[2rem] shadow-xl overflow-hidden border ${theme.border} flex flex-col md:flex-row`}>
                    <div className={`${theme.panel} p-10 text-white flex flex-col items-center justify-center md:w-1/3`}>
                        <FaAward size={60} className={`mb-4 ${theme.panelIcon}`} />
                        <h1 className="text-xl font-bold tracking-widest">
                            {examType === "waec" ? "WAEC Practice Result" : "NECO Practice Result"}
                        </h1>
                        <div className="text-7xl font-black my-2">{percentage}%</div>
                        <p className={`${theme.panelSubtle} font-medium`}>
                            {score} out of {totalPossible} Correct
                        </p>
                    </div>

                    <div className="p-10 flex-1">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">
                            Congratulations, {waecUserName || "Candidate"}!
                        </h2>
                        <p className="text-slate-500 mb-8">You have successfully completed the {examType.toUpperCase()} Mock Examination.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                                onClick={() => navigate('/new-exam-review')}
                                className="w-full md:w-auto px-6 py-2.5 text-sm md:text-base font-semibold rounded-lg flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-900 transition-all"
                            >
                                <FaHistory /> View Review
                            </button>
                            <button 
                                onClick={() => navigate('/new-select-subject')}
                                className={`w-full md:w-auto px-6 py-2.5 text-sm md:text-base font-semibold rounded-lg flex items-center justify-center gap-2 border-2 ${theme.buttonBorder} ${theme.buttonText} ${theme.buttonHover} transition-all`}
                            >
                                <FaRedo /> Retake Exam
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full md:w-auto px-6 py-2.5 text-sm md:text-base font-semibold rounded-lg flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                            >
                                <FaChevronRight className="rotate-180" /> Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Analytics Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                        <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-6">Subject Performance</h3>
                        <div className="h-64">
                            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                        </div>
                    </div>

                    <div className="w-full max-w-full min-w-0 overflow-hidden bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                        <h3 className="font-black text-slate-400 text-xs uppercase tracking-widest mb-6">Result Summary</h3>
                        <div className="space-y-4">
                            {Object.keys(totals).map(sub => (
                                <div key={sub} className="flex w-full max-w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <span className="min-w-0 break-words text-sm font-bold text-slate-700 md:text-base capitalize">{sub.replaceAll("_", " ")}</span>
                                    <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
                                        <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-slate-200 sm:w-32">
                                            <div 
                                                className={`h-full ${theme.progress}`}
                                                style={{ width: `${totals[sub] ? ((breakdown[sub] || 0) / totals[sub]) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className={`shrink-0 text-sm font-black md:text-base ${theme.scoreText}`}>
                                            {breakdown[sub] || 0}/{totals[sub]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}