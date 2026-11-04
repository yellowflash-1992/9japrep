import React, { useState, useEffect } from 'react';
import { createHashRouter, RouterProvider } from "react-router-dom";
import './App.css';

// Pages & Components
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import NewsAndInfo from './Pages/NewsAndInfo';
import JambSubjectSelect from './Pages/JambSubjectSelect';
import JambExamPage from './Pages/JambExamPage';
import JambExamMenu from './Pages/JambExamMenu';
import { ExamStateContext } from './Helpers/Contexts';
import ExamLayout from './Layout/ExamLayout';
import JambExamConfig from './Pages/JambExamConfig';
import JambExamEnd from './Pages/JambExamEnd';
import JambExamReview from './Pages/JambExamReview';
import ProtectedRoute from './Components/ProtectedRoute';
import SubjectSelect from './Pages/SubjectSelect';
import ExamMenu from './Pages/ExamMenu';
import ExamConfig from './Pages/ExamConfig';
import ExamPage from './Pages/ExamPage';
import ExamEnd from './Pages/ExamEnd';
import ExamReview from './Pages/ExamReview';

const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'info', element: <NewsAndInfo /> },
      {
        element: <ProtectedRoute />, 
        children: [
          {
            element: <ExamLayout />, 
            children: [
              // JAMB ROUTES
              { path: 'exam-menu', element: <JambExamMenu /> },
              { path: 'select-subject', element: <JambSubjectSelect /> },
              { path: 'exam-config', element: <JambExamConfig /> },
              { path: "exam/:subjectId", element: <JambExamPage /> },
              { path: "exam-end", element: <JambExamEnd /> },
              { path: "exam-review", element: <JambExamReview /> },
              
              // WAEC ROUTES
              { path: "new-exam-menu", element: <ExamMenu /> },
              { path: "new-select-subject", element: <SubjectSelect /> },
              { path: "new-exam-config", element: <ExamConfig /> },
              { path: "new-exam-page/:subjectId", element: <ExamPage /> }, // <-- Fixed routing here
              { path: "new-exam-end", element: <ExamEnd /> },
              { path: "new-exam-review", element: <ExamReview /> },
            ]
          }
        ]
      }
    ]
  }
]);

function App() {
  // --- SHARED STATE ---
  const [examState, setExamState] = useState("menu");
  const [score, setScore] = useState(0);
  const [detailedResults, setDetailedResults] = useState({ breakdown: {}, totals : {} });
  const [reviewData, setReviewData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWaecLoginModal, setShowWaecLoginModal] = useState(false);

  // --- 🟠 JAMB SPECIFIC STATE ---
  const [userName, setUserName] = useState(() => localStorage.getItem("exam_user") || "");
  
  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    const saved = localStorage.getItem("exam_subjects");
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) { return []; }
  });

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("exam_config");
    return saved ? JSON.parse(saved) : { duration: 35 }; 
  });

  useEffect(() => {
    localStorage.setItem("exam_user", userName);
    localStorage.setItem("exam_subjects", JSON.stringify(selectedSubjects));
    localStorage.setItem("exam_config", JSON.stringify(config));
  }, [userName, selectedSubjects, config]);


  // --- 🔵 WAEC SPECIFIC STATE ---
  const [waecUserName, setWaecUserName] = useState(() => localStorage.getItem("waec_user") || "");
  
 const [waecSelectedSubjects, setWaecSelectedSubjects] = useState(() => {
    const saved = localStorage.getItem("waec_subjects");
    try {
        const parsed = saved ? JSON.parse(saved) : [];
        // Force strings, lower case
        return Array.isArray(parsed) ? parsed.map(s => String(s).toLowerCase()) : [];
    } catch {
        return [];
    }
});

  const [waecConfig, setWaecConfig] = useState(() => {
    const saved = localStorage.getItem("waec_config"); 
    return saved ? JSON.parse(saved) : { duration: 45, numQuestions: 2, examType: 'waec' }; 
  });

  useEffect(() => {
    localStorage.setItem("waec_user", waecUserName);
    localStorage.setItem("waec_subjects", JSON.stringify(waecSelectedSubjects));
    localStorage.setItem("waec_config", JSON.stringify(waecConfig));
  }, [waecUserName, waecSelectedSubjects, waecConfig]);


  // --- 🎯 ACTIVE EXAM TRACKING ---
  const [activeExam, setActiveExam] = useState(() => {
    // Determine initial active exam based on which user is logged in
    const jambUser = localStorage.getItem("exam_user");
    const waecUser = localStorage.getItem("waec_user");
    if (waecUser) return 'waec';
    if (jambUser) return 'jamb';
    return 'jamb'; // default
  });

  // Function to switch active exam and clean up the opposite exam's session
  const switchExam = (examType) => {
    if (examType === 'jamb') {
      // Clear WAEC ongoing exam session if any
      localStorage.removeItem("waec_exam_session");
      // Optional: clear subject progress keys (if you want full reset)
      // You can loop through waecSelectedSubjects and remove waec_progress_* keys
      setActiveExam('jamb');
    } else {
      // Clear JAMB ongoing exam session(s)
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("jamb_exam_session_")) {
          localStorage.removeItem(key);
        }
      });
      setActiveExam('waec');
    }
  };



  // --- ENTRY LOGIC ---
  const handleWaecEntry = (navigate) => {
    const enteredName = waecUserName?.trim();
    if (!enteredName || enteredName.length <= 2) {
      setShowWaecLoginModal(true); 
      return;
    }

    const raw = localStorage.getItem("waec_exam_session"); 
    if (raw) {
      setShowWaecLoginModal(true); 
    } else {
      navigate("/new-select-subject"); 
    }
  };

  const handleExamEntry = (navigate, closeNavbarCallback) => {
    if (closeNavbarCallback) closeNavbarCallback();

    const enteredName = userName?.trim();
    if (!enteredName || enteredName.length <= 2) {
      setShowLoginModal(true);
      return;
    }

    const sessionKey = Object.keys(localStorage).find(key => {
      if (!key.startsWith("jamb_exam_session_")) return false;
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return data && data.userName?.toLowerCase() === enteredName.toLowerCase();
      } catch (e) { return false; }
    });

    if (sessionKey) {
      setShowLoginModal(true);
    } else {
      navigate('/select-subject');
    }
  };

  return (
    <ExamStateContext.Provider value={{ 
      // Shared
      examState, setExamState, 
      score, setScore, 
      detailedResults, setDetailedResults, 
      reviewData, setReviewData, 
      showLoginModal, setShowLoginModal,
      showWaecLoginModal, setShowWaecLoginModal, 
      handleExamEntry, handleWaecEntry,
      
      // JAMB
      userName, setUserName,
      config, setConfig, 
      selectedSubjects, setSelectedSubjects,
      
      // WAEC (These were missing from your previous provider!)
      waecUserName, setWaecUserName,
      waecConfig, setWaecConfig,
      waecSelectedSubjects, setWaecSelectedSubjects,

       // Active Exam
      activeExam,
      switchExam,
    }}>
      <RouterProvider router={router} />
    </ExamStateContext.Provider>
  );
}

export default App;



// ... imports stay the same

// function App() {
//   const [examState, setExamState] = useState("menu");
//   const [userName, setUserName] = useState("");
//   const [config, setConfig] = useState({
//     duration:5, numQuestions:2
//   })

//   const [score, setScore] = useState(0);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [detailedResults, setDetailedResults] = useState({
//     breakdown: {},
//     totals : {}
//   });

//   const [reviewData, setReviewData] = useState([]);

//   return (
//     <ExamStateContext.Provider value={{ examState, setExamState, userName, setUserName,
//       config, setConfig,score, setScore, selectedSubjects, setSelectedSubjects,detailedResults,
//       setDetailedResults, reviewData, setReviewData
//      }}>
//       <BrowserRouter>
//         <Routes>
//           {/* LandingPage is the Parent Layout */}
//           <Route path="/" element={<LandingPage />}>
            
//             {/* These are the "Outlets" - they render inside LandingPage's <Outlet /> */}
//             <Route index element={<Dashboard />} /> 
//             <Route path='info' element={<NewsAndInfo />} />

//             <Route element ={<ExamLayout />}>
//             <Route path='select-subject' element={<SubjectSelect />} />
//             <Route path='exam-config' element={<ExamConfig />} />
//             <Route path='exam-menu' element={<ExamMenu />} />
//             <Route path="exam/:subjectId" element={<ExamPage />} />
//             <Route path="exam-end" element={<ExamEnd />} />
//             <Route path="exam-review" element={<ExamReview />} />
//             </Route>

//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </ExamStateContext.Provider>
//   );
// }
// export default App;