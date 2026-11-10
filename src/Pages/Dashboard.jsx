//import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ExamCards from "../Components/ExamCards";
import ExamHistory from "../Components/ExamHistory";
import HeroSlider from "../Components/HeroSlider";
import QuickGrid from "../Components/QuickGrid";
import SuggestedGroup from "../Components/SuggestedGroup";
import WelcomeHeader from "../Components/WelcomeHeader";
import useOfflineStatus from "../Hooks/useOfflineStatus";

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

      {/* <PostUtmeSection isOffline={isOffline} /> */}

      {/* <ProjectMaterial isOffline={isOffline} /> */}

      <div className="hidden xl:block">
        <SuggestedGroup isOffline={isOffline} />
      </div>
    </div>
  );
}
