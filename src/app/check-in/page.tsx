"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

function CheckInFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const condition = searchParams.get("condition") || "panik";

  // Step state: 1 (Intro), 2 (Pressure), 3 (Urgency), 4 (Capacity), 5 (Intent to Borrow)
  const [step, setStep] = useState<number>(1);

  // Sliders State (initially null to detect if untouched)
  const [pressure, setPressure] = useState<number | null>(null);
  const [urgency, setUrgency] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [intent, setIntent] = useState<number | null>(null);

  const handleNext = (currentVal: number | null, setVal: (v: number) => void) => {
    // If untouched, nudge by setting to 3 (neutral)
    if (currentVal === null) {
      setVal(3);
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = () => {
    // Determine values, default to 3 if not touched
    const finalPressure = pressure ?? 3;
    const finalUrgency = urgency ?? 3;
    const finalCapacity = capacity ?? 3;
    const finalIntent = intent ?? 3;

    // Direct to check-in result screen with all parameters
    router.push(
      `/check-in/result?condition=${condition}&pressure=${finalPressure}&urgency=${finalUrgency}&capacity=${finalCapacity}&intent=${finalIntent}`
    );
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      router.push(`/safe-space`);
    }
  };

  const renderProgressIndicator = () => {
    if (step === 1) return null;
    return (
      <div className="flex gap-1.5 justify-center my-3 select-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step - 1 === i
                ? "w-8 bg-clay"
                : step - 1 > i
                ? "w-3 bg-clay/40"
                : "w-3 bg-line"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderSlider = (
    question: string,
    value: number | null,
    setValue: (val: number) => void,
    labels: { 1: string; 5: string },
    onConfirm: () => void,
    isLast: boolean = false
  ) => {
    const isTouched = value !== null;
    const displayVal = value ?? 3;

    return (
      <div className="flex-1 flex flex-col justify-between py-2 select-none">
        <Card tone="default" className="flex flex-col gap-5 p-5 border border-line select-none text-left bg-surface shadow-sm">
          <h3 className="text-body font-bold text-ink leading-relaxed">
            {question}
          </h3>

          <div className="flex flex-col gap-3 py-2">
            {/* HTML Input Slider */}
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={displayVal}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-clay"
            />

            {/* Extremity labels and dynamic state */}
            <div className="flex justify-between items-center text-[10.5px] font-semibold text-ink-soft select-none">
              <span className="max-w-[80px] leading-tight">{labels[1]}</span>
              <span className="text-clay font-bold text-xs bg-clay-tint px-2.5 py-1 rounded-full border border-clay/10">
                {isTouched ? `Skala: ${displayVal}` : "Belum digeser"}
              </span>
              <span className="max-w-[80px] leading-tight text-right">{labels[5]}</span>
            </div>
          </div>
        </Card>

        {/* Action button with contextual nudge text */}
        <div className="flex flex-col gap-2 pt-6 items-center select-none w-full max-w-xs mx-auto">
          {!isTouched && (
            <p className="text-[10px] text-ink-soft/80 italic font-semibold text-center pb-1">
              Geser slider atau langsung ketuk tombol di bawah untuk mengisi nilai netral (3).
            </p>
          )}
          
          <Button
            variant={isTouched ? "primary" : "secondary"}
            onClick={onConfirm}
            className="w-full font-bold"
          >
            {isLast
              ? isTouched
                ? "Selesaikan Check-In"
                : "Selesaikan dengan Nilai 3"
              : isTouched
              ? "Lanjutkan"
              : "Lanjutkan dengan Nilai 3"}
          </Button>

          <button
            onClick={handleBack}
            className="text-[11px] font-bold text-ink-soft hover:underline py-1.5 mt-1"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas select-none">
      {/* Custom Header */}
      <div className="flex items-center justify-between py-2 select-none border-b border-line/10 mb-2">
        <button
          onClick={handleBack}
          className="p-1 rounded-full text-ink hover:bg-surface active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-ink-soft" />
        </button>
        <span className="text-[10px] font-bold text-ink-soft/60 uppercase tracking-widest">
          {step === 1 ? "Mulai Check-In" : `Pertanyaan ${step - 1} dari 4`}
        </span>
        <div className="w-7 h-7" />
      </div>

      {renderProgressIndicator()}

      {step === 1 && (
        /* Step 1: Intro Page */
        <div className="flex-1 flex flex-col justify-between py-6 text-center select-none">
          <div className="my-auto flex flex-col gap-4 px-2">
            <span className="text-4xl mx-auto mb-2 animate-bounce">📝</span>
            <h2 className="text-H2 font-display font-extrabold text-ink leading-tight">
              Mari pahami kondisimu sejenak.
            </h2>
            <p className="text-caption text-ink-soft leading-relaxed max-w-xs mx-auto font-medium">
              Beberapa pertanyaan singkat untuk menilai beban pikiran dan dorongan meminjam. Jawabanmu sepenuhnya rahasia dan hanya disimpan di HP-mu.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 items-center select-none w-full max-w-xs mx-auto">
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              className="w-full font-bold"
            >
              Mulai
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/home")}
              className="w-full text-caption text-ink-soft hover:bg-ink/5"
            >
              Nanti Saja
            </Button>
          </div>
        </div>
      )}

      {step === 2 &&
        renderSlider(
          "Seberapa berat tekanan yang kamu rasakan saat ini?",
          pressure,
          (val) => setPressure(val),
          { 1: "Sangat Ringan", 5: "Sangat Berat" },
          () => handleNext(pressure, setPressure)
        )}

      {step === 3 &&
        renderSlider(
          "Seberapa mendesak keputusan keuangan ini terasa bagi kamu?",
          urgency,
          (val) => setUrgency(val),
          { 1: "Bisa Ditunda", 5: "Sangat Mendesak" },
          () => handleNext(urgency, setUrgency)
        )}

      {step === 4 &&
        renderSlider(
          "Saat ini, seberapa siap kamu menimbang pilihan dengan kepala jernih?",
          capacity,
          (val) => setCapacity(val),
          { 1: "Sangat Bingung", 5: "Sangat Siap" },
          () => handleNext(capacity, setCapacity)
        )}

      {step === 5 &&
        renderSlider(
          "Seberapa kuat dorongan untuk meminjam lagi (ambil utang baru) sekarang?",
          intent,
          (val) => setIntent(val),
          { 1: "Tidak Ada", 5: "Sangat Kuat" },
          handleSubmit,
          true
        )}
    </div>
  );
}

export default function CheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-caption text-ink-soft select-none font-medium">
          Sebentar ya…
        </div>
      }
    >
      <CheckInFlow />
    </Suspense>
  );
}

