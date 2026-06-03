"use client";

import React from "react";
import { motion } from "framer-motion";
import { JCAmount } from "./JCAmount";

export interface ToastProps {
  message: string;
  coins: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, coins }) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="flex items-center gap-3 px-4 py-3 rounded-full bg-ink/95 text-surface shadow-lg border border-line/10 pointer-events-auto backdrop-blur-md max-w-sm w-auto"
      >
        {coins > 0 ? (
          <>
            <motion.div
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.15, type: "spring" }}
              className="flex-shrink-0"
            >
              <JCAmount amount={coins} size="md" />
            </motion.div>
            <div className="h-4 w-[1px] bg-surface/20" />
          </>
        ) : (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pine text-surface text-xs font-bold">
            ✓
          </span>
        )}
        <span className="text-caption font-medium tracking-wide pr-1 select-none text-surface">
          {message}
        </span>
      </motion.div>
    </div>
  );
};

export default Toast;
