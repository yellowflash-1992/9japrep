import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const INITIAL_MESSAGES = [
  {
    id: 1,
    title: "📊 JAMB & WAEC Past Questions",
    desc: "Practice with real exam-style questions and detailed explanations.",
    link: "/select-subject",
    btnText: "Start Practice",
  },
  {
    id: 2,
    title: "🚀 Study and Practice Anywhere",
    desc: "Access your practice history and materials 100% offline.",
    link: "/history",
    btnText: "View History",
  },
  {
    id: 3,
    title: "👥 Join Study Groups",
    desc: "Connect with other candidates and prepare together.",
    link: "/",
    btnText: "Find a Group",
  },
  {
    id: 4,
    title: "🏆 WAEC and NECO GCE 2026",
    desc: "Candidates, schools, and centers — get ready for the upcoming exams!",
    link: "/new-exam-menu",
    btnText: "Start WAEC/NECO",
  },
];

export default function HeroSlider() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Trigger the slide animation
      setIsSliding(true);

      // 2. Wait for the animation to finish (500ms), then shift the array
      setTimeout(() => {
        setMessages((prev) => {
          const newArr = [...prev];
          const first = newArr.shift(); // Remove the first item
          newArr.push(first); // Put it at the end
          return newArr;
        });
        // 3. Instantly reset the transform so the new first item is in view
        setIsSliding(false);
      }, 500); // MUST match the CSS duration
    }, 5000); // Wait 5 seconds before sliding again

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 bg-[radial-gradient(circle,#312e81_0%,#0f172a_100%)] border border-blue-200 rounded-lg overflow-hidden relative">
      {/* The Slider Track */}
      <div
        className={`flex ${isSliding ? "transition-transform duration-500 ease-in-out" : ""}`}
        style={{ transform: isSliding ? "translateX(-100%)" : "translateX(0)" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="w-full shrink-0 flex items-center justify-center p-6 md:p-10 text-center flex-col"
          >
            <h1 className="text-xl md:text-3xl font-bold text-gray-50 mb-3 md:mb-4 leading-tight">
              {msg.title}
            </h1>
            <p className="text-sm md:text-base font-medium text-gray-300 max-w-md mx-auto mb-6">
              {msg.desc}
            </p>
            <Link
              to={msg.link}
              className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-2 px-6 rounded-full transition-colors shadow-lg"
            >
              {msg.btnText}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Dots (Just visual indicators) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {INITIAL_MESSAGES.map((dot) => (
          <div
            key={dot.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              messages[0].id === dot.id
                ? "w-6 bg-purple-400"
                : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
