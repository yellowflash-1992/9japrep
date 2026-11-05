import { FaDesktop, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../App.css";

export default function ExamCards({ onStartExam }) {
  const handleJambClick = (e) => {
    e.preventDefault();
    onStartExam("jamb");
  };

  const handleWaecClick = () => {
    onStartExam("waec");
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-10 md:px-4 exam-cards mx-auto justify-center">
        <div
          onClick={handleWaecClick}
          className="cursor-pointer rounded-2xl bg-rose-100 gap-3 flex flex-col py-1 backdrop-blur-md border border-rose-200 px-4 md:p-3 text-rose-600 items-center text-center hover:bg-rose-200 active:scale-95 transition-all shadow-sm lg:flex-row lg:py-5"
        >
          <div className="bg-white rounded-lg shadow-sm p-1">
            <FaGraduationCap className="text-rose-500 text-2xl h-7 w-7 md:w-15 md:h-15" />
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-sm lg:mb-1 font-bold lg:text-base leading-tight text-rose-600 lg:whitespace-nowrap">
              WAEC/NECO CBT
            </h1>
            <p className="text-[10px] md:text-xs text-rose-400 leading-tight">
              Practice your SSCE exams
            </p>
          </div>
        </div>

        <Link
          to="/select-subject"
          onClick={handleJambClick}
          className="cursor-pointer rounded-2xl bg-emerald-100 gap-3 flex flex-col py-1
                backdrop-blur-md border-emerald-200 px-3 md:p-3 text-emerald-600
                items-center text-center border hover:bg-emerald-200
                active:scale-95 transition-all shadow-sm lg:flex-row lg:py-5"
        >
          <div className="bg-white  rounded-lg shadow-sm p-1 -mb-1 md:-mb-2 ">
            <FaDesktop className="text-emerald-500 text-2xl h-7 w-7 md:w-15 md:h-15" />
          </div>
          <div className="text-center lg:text-left">
            <h1
              className="text-sm lg:mb-1 font-bold lg:text-base leading-tight
                    lg:leading-none text-emerald-600 lg:whitespace-nowrap lg:flex lg:px-9"
            >
              JAMB CBT<span className="hidden md:block"></span>
            </h1>

            <p className="text-[10px] md:text-xs text-emerald-400 leading-tight ">
              Practice by using the <br className="hidden md:block" />
              exam JAMB CBT Replica
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
