//import React, { useState } from "react";
import HeroSlider from "../Components/HeroSlider";
import ExamCards from '../Components/ExamCards'
import QuickGrid from "../Components/QuickGrid";
import WelcomeHeader from "../Components/WelcomeHeader";
import ExamHistory from "../Components/ExamHistory";
import PostUtmeSection from "../Components/PostUtmeSection";
import useOfflineStatus from "../Hooks/useOfflineStatus";
import ProjectMaterial from '../Components/ProjectMaterial';
import SuggestedGroup from "../Components/SuggestedGroup";
import { useOutletContext } from "react-router-dom";


 

export default function Dashboard() {

  const isOffline = useOfflineStatus();
  const { handleStartExam } = useOutletContext();

  return (
    <div className="w-full max-w-full px-2 md:px-4 space-y-5 pt-5 pb-12">

        <WelcomeHeader />       

        <ExamHistory />

        <HeroSlider />
               {/* next */}

        <ExamCards onStartExam={handleStartExam} />
        {/* next */}

        <QuickGrid />

            
        <PostUtmeSection isOffline={isOffline} />

        <ProjectMaterial isOffline={isOffline} />

        <SuggestedGroup isOffline={isOffline} />

    </div>
  );
}




{/* Slider container */}
        {/* <div className="overflow-hidden w-full relative">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {messages.map((text, i) => (
              <div
                key={i}
                className="shrink-0 w-full text-center font-semibold text-blue-700 text-lg"
              >
                {text}
              </div>
            ))}
          </div>
        </div> */}


// import React from "react";

// export default function Dashboard() {
//   const messages = [
//     "📊 Your analytics report is ready.",
//     "🚀 New feature update available.",
//     "👥 24 new users joined today.",
//     "🏆 Leaderboard rankings updated."
//   ];

//   // Join messages with separator and repeat for smooth looping
//   const tickerText = messages.join("   •   ") + "   •   ";
//   const repeatedText = tickerText.repeat(20); // repeat to make it long enough

//   return (
//     <div className="space-y-4">
//       <h1 className="text-2xl font-bold">Hello,</h1>
//       <p className="text-gray-600">Welcome To The Platform</p>

//       <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
//         <div className="relative w-full overflow-hidden">
//           <div
//             className="whitespace-nowrap animate-marquee text-blue-700 font-semibold text-lg"
//           >
//             {repeatedText}
//           </div>
//         </div>

//         <style>{`
//           @keyframes marquee {
//             0%   { transform: translateX(0%); }
//             100% { transform: translateX(-50%); }
//           }
//           .animate-marquee {
//             display: inline-block;
//             padding-left: 100%;
//             animation: marquee 20s linear infinite;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }
