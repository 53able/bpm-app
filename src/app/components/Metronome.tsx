// components/Metronome.tsx
"use client";

import { useState } from "react";
import { useMetronome } from "../hooks/useMetronome";
import { useDistanceTracker } from "../hooks/useDistanceTracker";
import { BPMInput } from "./BPMInput";
import { FrequencyInput } from "./FrequencyInput";
import { WaveformSelect } from "./WaveformSelect";
import { VolumeSlider } from "./VolumeSlider";
import { DecayTimeInput } from "./DecayTimeInput";
import { PlayButton } from "./PlayButton";
import MapView from "./MapView";
import { formatTime } from "../utils/formatTime";

export default function Metronome() {
  // 設定の状態管理
  const [bpm, setBpm] = useState(120);
  const [frequency, setFrequency] = useState(1000);
  const [waveform, setWaveform] = useState<OscillatorType>("square");
  const [volume, setVolume] = useState(1);
  const [decayTime, setDecayTime] = useState(0.01);

  // メトロノームのカスタムフック
  const { isPlaying, handlePlay, handleStop } = useMetronome({
    bpm,
    frequency,
    waveform,
    volume,
    decayTime,
  });

  // 距離計測のカスタムフック
  const {
    distance,
    positions,
    error,
    elapsedTime,
  } = useDistanceTracker(isPlaying);

  // ペースの計算
  const distanceKm = distance / 1000;
  const elapsedMinutes = elapsedTime / 60;

  const paceMinPerKm =
    distanceKm > 0 ? elapsedMinutes / distanceKm : 0;

  const speedKmh =
    elapsedTime > 0 ? (distanceKm / (elapsedTime / 3600)) : 0;

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

      {/* 距離と時間の表示 */}
      <p className="text-2xl mb-2">
        距離: {distanceKm.toFixed(2)} km
      </p>
      <p className="text-2xl mb-2">
        時間: {formatTime(elapsedTime)}
      </p>

      {/* ペースの表示 */}
      <p className="text-2xl mb-2">
        ペース: {paceMinPerKm > 0 ? paceMinPerKm.toFixed(2) : " - "} 分/km
      </p>
      <p className="text-2xl mb-4">
        スピード: {speedKmh > 0 ? speedKmh.toFixed(2) : " - "} km/h
      </p>

      {/* 地図の表示 */}
      <div className="w-full mb-4">
        <MapView positions={positions} />
      </div>

      {/* エラーメッセージ */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 再生・停止ボタン */}
      <PlayButton
        isPlaying={isPlaying}
        handlePlay={handlePlay}
        handleStop={handleStop}
      />
    </div>
  );
}
