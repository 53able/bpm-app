// components/VolumeSlider.tsx
import React from "react";

interface VolumeSliderProps {
  volume: number;
  setVolume: (volume: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  volume,
  setVolume,
}) => (
  <div className="flex items-center w-full">
    <label className="mr-4 text-2xl w-1/3 text-right">音量:</label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
      className="w-2/3"
    />
  </div>
);
