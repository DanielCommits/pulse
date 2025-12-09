"use client";

import type React from "react";
import { X } from "lucide-react";

interface SimpleModalProps {
  /** Boolean to control the visibility of the modal. */
  isOpen: boolean;
  /** Function to call when the modal should close (e.g., on backdrop click, or close button click). */
  onClose: () => void;
  /** The content to display inside the modal (e.g., the full-size image). */
  children: React.ReactNode;
}

/**
 * A simple, full-screen overlay modal for displaying content like enlarged images.
 */
export default function SimpleModal({
  isOpen,
  onClose,
  children,
}: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop: Fixed, full-screen, semi-transparent black overlay
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      // Clicking the backdrop closes the modal
      onClick={onClose}
    >
      {/* Modal Content Container */}
      <div
        className="relative p-4 md:p-8 rounded-lg max-w-[95vw] max-h-[95vh]"
        // Prevent click propagation from the content to the backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button: ROBUST FIX FOR PROPAGATION */}
        <button
          onClick={(e) => {
            // 1. Prevent default action (rarely useful here, but good practice for buttons)
            e.preventDefault(); 
            // 2. Stop propagation immediately so the event does NOT bubble up 
            // and trigger the backdrop's onClick={onClose} or the outer Link.
            e.stopPropagation(); 
            // 3. Finally, run the close function.
            onClose();
          }}
          className="absolute top-0 right-0 m-4 p-2 bg-[#1f2937] text-white rounded-full hover:bg-[#374151] transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Children (The content, e.g., the image) */}
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}