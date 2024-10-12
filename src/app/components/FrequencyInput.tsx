// components/FrequencyInput.tsx
import React from "react";

interface FrequencyInputProps {
  frequency: number;
  setFrequency: (frequency: number) => void;
}

export const FrequencyInput: React.FC<FrequencyInputProps> = ({
  frequency,
  setFrequency,
}) => (
  <div className="flex items-center w-full">
    <label className="mr-4 text-2xl w-1/3 text-right">周波数 (Hz):</label>
    <input
      type="number"
      inputMode="numeric"
      pattern="\d*"
      value={frequency}
      onChange={(e) => setFrequency(Number(e.target.value))}
      className="border rounded px-4 py-2 w-2/3 text-center text-2xl"
      min={100}
      max={5000}
    />
  </div>
);
