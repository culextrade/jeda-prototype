"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useJeda } from "@/lib/provider";
import { DominantCondition } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CheckInPage() {
  const router = useRouter();
  const { addCheckIn } = useJeda();

  // Slider State
  const [pressure, setPressure] = useState<number>(3);
  const [urgency, setUrgency] = useState<number>(3);
  const [capacity, setCapacity] = useState<number>(3);
  const [intent, setIntent] = useState<number>(3);

  const handleSubmit = () => {
    // Add check-in
    addCheckIn({
      dominantCondition: "panik" as DominantCondition, // Default or mock
      pressure: pressure as 1 | 2 | 3 | 4 | 5,
      urgency: urgency as 1 | 2 | 3 | 4 | 5,
      capacity: capacity as 1 | 2 | 3 | 4 | 5,
      intentToBorrow: intent as 1 | 2 | 3 | 4 | 5,
      readyToContinue: capacity >= 3, // Ready to continue if capacity is decent
    });

    // Go to home
    router.push("/home");
  };

  const renderSlider = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    labels: Record<number, string>
  ) => {
    return (
      <Card tone="default" className="flex flex-col gap-3.5 p-4 border border-line select-none text-left">
        <label className="text-caption font-bold text-ink leading-snug">
          {label}
        </label>
        
        {/* HTML Input Slider */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full h-1.5 bg-line rounded-lg appearance-none cursor-pointer accent-clay"
        />

        {/* Labels at extremities */}
        <div className="flex justify-between items-center text-[10.5px] font-medium text-ink-soft select-none">
          <span>{labels[1]}</span>
          <span className="text-clay font-bold text-xs bg-clay-tint px-2 py-0.5 rounded">
            Nilai: {value}
          </span>
          <span>{labels[5]}</span>
        </div>
      </Card>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-canvas overflow-y-auto select-none">
      {/* Header */}
      <div className="flex flex-col gap-1 text-left select-none pt-2">
        <h2 className="text-H2 font-display font-bold text-ink">Emotional Check-In</h2>
        <p className="text-caption text-ink-soft leading-relaxed">
          Beberapa pertanyaan singkat untuk memahami kondisimu. Jawabanmu hanya untukmu.
        </p>
      </div>

      {/* Sliders Container */}
      <div className="flex flex-col gap-4 py-2">
        {renderSlider(
          "Seberapa berat tekanan yang kamu rasakan saat ini?",
          pressure,
          setPressure,
          { 1: "Sangat Ringan", 5: "Sangat Berat" }
        )}
        
        {renderSlider(
          "Seberapa mendesak keputusan ini terasa?",
          urgency,
          setUrgency,
          { 1: "Bisa Ditunda", 5: "Sangat Mendesak" }
        )}
        
        {renderSlider(
          "Saat ini, seberapa siap kamu menimbang pilihan dengan jernih?",
          capacity,
          setCapacity,
          { 1: "Sangat Bingung", 5: "Sangat Siap" }
        )}
        
        {renderSlider(
          "Seberapa kuat dorongan untuk meminjam lagi sekarang?",
          intent,
          setIntent,
          { 1: "Tidak Ada", 5: "Sangat Kuat" }
        )}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-2 pt-2 items-center select-none">
        <Button variant="primary" onClick={handleSubmit} className="w-full font-bold">
          Selesaikan Check-In
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => router.push("/home")}
          className="w-full text-caption text-ink-soft hover:bg-ink/5"
        >
          Nanti Saja
        </Button>
      </div>
    </div>
  );
}
