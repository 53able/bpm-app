// components/DecayTimeInput.tsx
import React from "react";

interface DecayTimeInputProps {
  decayTime: number;
  setDecayTime: (decayTime: number) => void;
}

export const DecayTimeInput: React.FC<DecayTimeInputProps> = ({
  decayTime,
  setDecayTime,
}) => (
  <div className="flex items-center w-full">
    <label className="mr-4 text-2xl w-1/3 text-right">減衰時間 (秒):</label>
    <input
      type="number"
      value={decayTime}
      onChange={(e) => setDecayTime(Number(e.target.value))}
      className="border rounded px-4 py-2 w-2/3 text-center text-2xl"
      min={0.001}
      max={1}
      step={0.001}
    />
  </div>
);
