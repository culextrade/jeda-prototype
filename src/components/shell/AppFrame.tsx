"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useJeda } from "@/lib/provider";
import Toast from "../ui/Toast";
import Sheet from "../ui/Sheet";
import Button from "../ui/Button";
import { LEVELS } from "@/lib/levels";

export interface AppFrameProps {
  children: React.ReactNode;
}

export const AppFrame: React.FC<AppFrameProps> = ({ children }) => {
  const { 
    toast, 
    celebratingLevel, 
    clearLevelCelebration
  } = useJeda();

  // Find level details for celebration
  const currentLvlDetails = celebratingLevel 
    ? LEVELS.find(l => l.key === celebratingLevel)
    : null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#ECEFEF] p-0 sm:p-4 select-none">
      {/* Device Wrapper */}
      <div 
        className={cn(
          "w-full max-w-[430px] h-screen sm:h-[860px]",
          "sm:rounded-[40px] sm:border-[12px] sm:border-ink/90 sm:shadow-2xl",
          "bg-canvas overflow-hidden flex flex-col relative"
        )}
      >
        {/* Notch / Speaker Simulator for Premium aesthetic on Desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-ink/90 rounded-b-2xl z-50">
          <div className="w-12 h-1 bg-ink-soft/40 rounded-full mx-auto mt-1" />
        </div>

        {/* Screen Content Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative sm:pt-4">
          {children}
        </div>

        {/* Global Toast rewards */}
        {toast && (
          <Toast 
            message={toast.message} 
            coins={toast.coins} 
          />
        )}

        {/* Level Celebration bottom sheet/modal */}
        <Sheet 
          isOpen={celebratingLevel !== null} 
          onClose={clearLevelCelebration}
          title="Naik Level! 🎉"
        >
          <div className="flex flex-col items-center text-center py-6 px-2 select-none">
            {/* Level Icon / Badge */}
            <div className="w-20 h-20 rounded-full bg-amber-tint border-2 border-amber flex items-center justify-center text-3xl mb-4 animate-bounce">
              👑
            </div>
            
            <h4 className="text-H1 font-display text-ink font-bold mb-2">
              Kamu Naik Level!
            </h4>
            
            <p className="text-body text-ink font-semibold mb-1">
              Level Baru: <span className="text-amber">{currentLvlDetails?.name}</span>
            </p>
            
            <p className="text-caption text-ink-soft mb-6 leading-relaxed">
              {currentLvlDetails?.description}. Setiap langkah kecil yang kamu ambil membawamu lebih dekat ke pemulihan yang konsisten.
            </p>

            <Button 
              variant="primary" 
              onClick={clearLevelCelebration}
              className="w-full"
            >
              Lanjutkan Perjalanan
            </Button>
          </div>
        </Sheet>
      </div>
    </div>
  );
};

export default AppFrame;
