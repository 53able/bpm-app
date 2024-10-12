// components/WaveformSelect.tsx
import React from "react";

interface WaveformSelectProps {
  waveform: OscillatorType;
  setWaveform: (waveform: OscillatorType) => void;
}

export const WaveformSelect: React.FC<WaveformSelectProps> = ({
  waveform,
  setWaveform,
}) => (
  <div className="flex items-center w-full">
    <label className="mr-4 text-2xl w-1/3 text-right">波形:</label>
    <select
      value={waveform}
      onChange={(e) => setWaveform(e.target.value as OscillatorType)}
      className="border rounded px-4 py-2 text-2xl w-2/3"
    >
      <option value="sine">サイン波</option>
      <option value="square">矩形波</option>
      <option value="sawtooth">ノコギリ波</option>
      <option value="triangle">三角波</option>
    </select>
  </div>
);
