import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function PremiumUpgrade({ className = "" }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(undefined);

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

  const startPremiumCheckout = () => {
    const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!user?.email) {
      alert("A valid email address is required to start checkout.");
      return;
    }

    if (!paystackPublicKey) {
      alert("Paystack checkout is not configured. Please contact support.");
      console.error("Missing VITE_PAYSTACK_PUBLIC_KEY.");
      return;
    }

    if (!window.PaystackPop) {
      alert("Paystack checkout could not be loaded. Please try again later.");
      console.error("Paystack inline script is unavailable.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: user.email,
      amount: 200000,
      currency: "NGN",
      callback: (response) => {
        console.log("Payment successful", response.reference);
        alert("Payment successful!");
      },
    });

    handler.openIframe();
  };

  if (isPremium !== false) return null;

  return (
    <button
      type="button"
      onClick={startPremiumCheckout}
      className={`bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform ${className}`}
    >
      👑 Go Premium
    </button>
  );
}
