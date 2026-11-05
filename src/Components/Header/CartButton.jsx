// components/header/CartButton.jsx
import { FaShoppingCart } from 'react-icons/fa';

export default function CartButton() {
  return (
    <button
      onClick={() => alert('Cart features are coming soon!')}
      aria-label="Open shopping cart"
      className="flex text-xs rounded-4xl border px-1 py-2 border-gray-200 items-center gap-1 text-red-800 md:px-5 md:py-3 md:text-sm md:font-bold relative"
    >
      <FaShoppingCart className="text-xl md:text-2xl" />
    </button>
  );
}