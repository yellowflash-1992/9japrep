import { useState } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../Hooks/useAuth';

export default function PremiumModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePaymentSuccess = async (response) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bright-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ reference: response.reference, userId: user.id })
      });
      const result = await res.json();
      if (result.success) {
        alert('Payment successful! You are now Premium.');
        onClose();
      } else {
        alert('Payment verification failed. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      alert('Verification failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startPaystack = () => {
    const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!user?.email) {
      alert('A valid email address is required to start checkout.');
      return;
    }
    if (!paystackPublicKey) {
      alert('Paystack checkout is not configured. Please contact support.');
      console.error('Missing VITE_PAYSTACK_PUBLIC_KEY.');
      return;
    }
    if (!window.PaystackPop) {
      alert('Paystack checkout could not be loaded. Please try again later.');
      console.error('Paystack inline script is unavailable.');
      return;
    }

    setIsProcessing(true);
    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email: user.email,
      amount: 200000,
      currency: 'NGN',
      callback: function (response) {
        handlePaymentSuccess(response);
      },
      onClose: function () {
        setIsProcessing(false);
      }
    });
    handler.openIframe();
  };

  const benefits = [
    'Unlock 10,000+ JAMB, WAEC & NECO Questions',
    'Unlimited Full Mock Exams',
    'Detailed Explanations for Every Answer',
    'Advanced Performance Analytics',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-black mb-1 text-amber-300">Go Premium</h2>
        <p className="text-sm text-white/80 mb-5">Unlock the full 9jaPrep experience.</p>
        <ul className="space-y-3 mb-6">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <FaCheckCircle className="text-amber-300 mt-0.5 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={startPaystack}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100"
        >
          {isProcessing ? 'Processing... Please wait' : 'Pay ₦2,000 with Paystack'}
        </button>
      </div>
    </div>
  );
}