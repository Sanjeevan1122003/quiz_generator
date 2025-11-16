import { useEffect } from "react";

export default function Modal({ children, onClose }) {

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}   // click outside to close
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()} // prevent closing on content click
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:text-black transition px-3 py-2"
        >
          Esc to close
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[80vh] mt-8 pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
