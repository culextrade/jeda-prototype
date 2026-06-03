"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  // Prevent background scrolling when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-40 overflow-hidden flex items-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink pointer-events-auto"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full bg-surface rounded-t-lg border-t border-line/20 shadow-lg z-50 pointer-events-auto flex flex-col max-h-[90%] outline-none"
          >
            {/* Drag Handle Area */}
            <div className="flex flex-col items-center pt-3 pb-2 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1.5 rounded-full bg-line" />
            </div>

            {/* Title (Optional) */}
            {title && (
              <div className="px-5 pb-2 pt-1 border-b border-line/5 flex justify-between items-center">
                <h3 className="text-H2 font-display text-ink">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:bg-canvas text-lg"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="px-5 pb-8 pt-3 overflow-y-auto max-h-full">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sheet;
