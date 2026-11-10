import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ExamStateContext } from "../Helpers/Contexts";
import { useAuth } from "../Hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { selectedSubjects, waecSelectedSubjects } = useContext(ExamStateContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isWaecRoute = location.pathname.startsWith("/new-");
  const savedSubjects = localStorage.getItem(isWaecRoute ? "waec_subjects" : "exam_subjects");
  const currentSubjects = isWaecRoute ? waecSelectedSubjects : selectedSubjects;
  const hasSubjects = currentSubjects.length > 0 ||
    (savedSubjects && JSON.parse(savedSubjects).length > 0);
  const needsSubjects =
    location.pathname.startsWith("/exam/") ||
    location.pathname.includes("/exam-config") ||
    location.pathname.includes("/exam-menu") ||
    location.pathname.startsWith("/new-exam-page") ||
    location.pathname.includes("/new-exam-config") ||
    location.pathname.includes("/new-exam-menu");

  if (needsSubjects && !hasSubjects) {
    return <Navigate to={isWaecRoute ? "/new-select-subject" : "/select-subject"} replace />;
  }

  return <Outlet />;
}