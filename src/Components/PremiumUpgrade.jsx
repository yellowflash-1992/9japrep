import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { supabase } from "../lib/supabase";
import PremiumModal from "./PremiumModal";

export default function PremiumUpgrade({ className = "" }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchPremiumStatus = async () => {
      if (!user) {
        setIsPremium(undefined);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .maybeSingle();

        if (!isActive) return;

        if (error) {
          console.error("Failed to load premium status:", error);
          setIsPremium(undefined);
          return;
        }

        setIsPremium(data?.is_premium);
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to load premium status:", error);
        setIsPremium(undefined);
      }
    };

    fetchPremiumStatus();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (isPremium !== false) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform ${className}`}
      >
        👑 Go Premium
      </button>
      <PremiumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
