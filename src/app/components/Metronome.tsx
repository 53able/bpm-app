// components/Metronome.tsx
"use client";

import { useState } from "react";
import { useMetronome } from "../hooks/useMetronome";
import { BPMInput } from "./BPMInput";
import { FrequencyInput } from "./FrequencyInput";
import { WaveformSelect } from "./WaveformSelect";
import { VolumeSlider } from "./VolumeSlider";
import { DecayTimeInput } from "./DecayTimeInput";
import { PlayButton } from "./PlayButton";

export default function Metronome() {
  // 設定の状態管理
  const [bpm, setBpm] = useState(120);
  const [frequency, setFrequency] = useState(1000);
  const [waveform, setWaveform] = useState<OscillatorType>("square");
  const [volume, setVolume] = useState(1);
  const [decayTime, setDecayTime] = useState(0.01);

  // カスタムフックの使用
  const { isPlaying, handlePlay, handleStop } = useMetronome({
    bpm,
    frequency,
    waveform,
    volume,
    decayTime,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="flex flex-col items-center space-y-6 mb-8 w-full max-w-md">
        {/* 入力フィールド */}
        <BPMInput bpm={bpm} setBpm={setBpm} />
        <FrequencyInput frequency={frequency} setFrequency={setFrequency} />
        <WaveformSelect waveform={waveform} setWaveform={setWaveform} />
        <VolumeSlider volume={volume} setVolume={setVolume} />
        <DecayTimeInput decayTime={decayTime} setDecayTime={setDecayTime} />
      </div>

      {/* 再生・停止ボタン */}
      <PlayButton
        isPlaying={isPlaying}
        handlePlay={handlePlay}
        handleStop={handleStop}
      />
    </div>
  );
}
