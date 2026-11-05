import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import PremiumUpgrade from "../Components/PremiumUpgrade";
import { useAuth } from "../Hooks/useAuth";
import Footer from "../Layout/Footer";
import Header from "../Layout/Header";
import Sidebar from "../Layout/Sidebar";
import NewsAndInfo from "./NewsAndInfo";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const isExamPage = location.pathname.includes('exam') || location.pathname.includes('subject');

  const [isOpen, setIsOpen] = useState(false);

  const isExamActive =
    location.pathname.startsWith("/exam/") ||
    location.pathname.startsWith("/new-exam-page") ||
    location.pathname === "/exam-end" ||
    location.pathname === "/new-exam-end" ||
    location.pathname === "/exam-review" ||
    location.pathname === "/new-exam-review";

  const hiddenPages = [
    "/select-subject",
    "/exam-menu",
    "/exam-config",
    "/exam-end",
    "/new-select-subject",
    "/new-exam-menu",
    "/new-exam-config",
    "/new-exam-end",
  ];

  const hidePartLayout =
    hiddenPages.includes(location.pathname) ||
    location.pathname.startsWith("/exam/");

  const handleStartExam = (examType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (examType === "jamb") navigate("/select-subject");
    if (examType === "waec" || examType === "neco") {
      navigate("/new-select-subject");
    }
  };

  if (isExamActive) {
    return (
      <div className="min-h-screen w-full bg-white overflow-y-auto">
        <Outlet /> {/* This will render ONLY the ExamPage */}
      </div>
    );
  }

  return (
    <div className="Menu">
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onStartExam={handleStartExam}
        />

        <div className="flex-1 flex flex-col p-2 overflow-auto">
          {!hidePartLayout && <Header setIsOpen={setIsOpen} />}

          <div
            className="flex flex-col xl:flex-row flex-1 min-h-0 min-w-0 md:overflow-y-scroll
                    md:[&::-webkit-scrollbar]:w-0.5 bg-[#E2E8F0]
                    md:[scrollbar-width:thin] md:transition-all "
          >
            <main
              className={`relative text-slate-800 transition-all px-6 min-w-0 ${hidePartLayout ? "flex-1" : "flex-[1.5]"}`}
            >
              <Outlet context={{ handleStartExam }} />
            </main>

            {!hidePartLayout && (
              <aside
                className="hidden md:flex flex-col w-full xl:w-auto xl:flex-1 mt-6 xl:mt-0 border-t xl:border-t-0 xl:border-l px-4 xl:mx-3
                    border-slate-200 rounded-sm "
              >
                <NewsAndInfo />
              </aside>
            )}
          </div>

          <div className="hidden lg:block px-1">
            <Footer />
          </div>
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm
                    transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {!isExamPage && <PremiumUpgrade className="fixed bottom-6 left-4 z-50 md:hidden px-4 py-2 text-sm" />}
      </div>
    </div>
  );
}

export default LandingPage;
