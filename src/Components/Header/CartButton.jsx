// components/header/CartButton.jsx
import { useState } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';

export default function CartButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy cart items
  const cartItems = [
    { id: 1, name: 'JAMB Past Questions PDF', price: '₦1,500' },
    { id: 2, name: 'WAEC Video Course', price: '₦3,000' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open shopping cart"
        className="flex text-xs rounded-4xl border px-1 py-2 border-gray-200 items-center gap-1 text-red-800 md:px-5 md:py-3 md:text-sm md:font-bold relative"
      >
        <FaShoppingCart className="text-xl md:text-2xl" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
          <div className="relative w-80 bg-white h-full shadow-2xl p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)}><FaTimes /></button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-slate-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between border-b pb-2">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.price}</span>
                  </li>
                ))}
                <li className="pt-3 font-bold flex justify-between">
                  <span>Total</span>
                  <span>₦4,500</span>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}