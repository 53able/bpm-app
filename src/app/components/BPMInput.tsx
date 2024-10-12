// components/BPMInput.tsx
import React from "react";

interface BPMInputProps {
  bpm: number;
  setBpm: (bpm: number) => void;
}

export const BPMInput: React.FC<BPMInputProps> = ({ bpm, setBpm }) => (
  <div className="flex items-center w-full">
    <label className="mr-4 text-2xl w-1/3 text-right">BPM:</label>
    <input
      type="number"
      inputMode="numeric"
      pattern="\d*"
      value={bpm}
      onChange={(e) => setBpm(Number(e.target.value))}
      className="border rounded px-4 py-2 w-2/3 text-center text-2xl"
      min={40}
      max={240}
    />
  </div>
);
