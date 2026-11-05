import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExamStateContext } from "../Helpers/Contexts";
import { toSentenceCase } from "../Helpers/stringUtils";
import { useAuth } from "../Hooks/useAuth";

export default function WelcomeHeader() {
  // 1. Grab the name directly from the Brain
  const { userName, waecUserName, activeExam, setUserName, setWaecUserName } =
    useContext(ExamStateContext);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error("Failed to sign out:", error);
      return;
    }

    // Clear all exam data
    localStorage.clear();
    setUserName("");
    setWaecUserName("");
    navigate("/login");
  };

  // If for some reason there is no name, show a generic welcome
  const displayName =
    activeExam === "waec"
      ? waecUserName
        ? toSentenceCase(waecUserName)
        : "Candidate"
      : userName
        ? toSentenceCase(userName)
        : "Candidate";

  const authButton = user ? (
    <button
      onClick={handleLogout}
      className="inline-flex items-center justify-center whitespace-nowrap px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
    >
      Log Out
    </button>
  ) : (
    <Link
      to="/login"
      className="inline-flex w-auto max-w-fit items-center justify-center whitespace-nowrap px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
    >
      <span>Login</span>
      <span className="hidden md:inline"> / Sign Up</span>
    </Link>
  );

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 w-full bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="w-full md:w-auto">
        <div className="flex flex-row justify-between items-center w-full mb-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              System Online
            </span>
          </div>
          {authButton}
        </div>
        <div className="hidden md:flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            System Online
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Hello, {displayName}!
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Your CBT Practice Portal
        </p>
      </div>
      <div className="hidden md:block">{authButton}</div>
    </div>
  );
}
