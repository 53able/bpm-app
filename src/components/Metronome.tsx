// components/Metronome.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

export default function Metronome() {
  // 状態管理
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(1000);
  const [waveform, setWaveform] = useState<OscillatorType>("square");
  const [volume, setVolume] = useState(1);
  const [decayTime, setDecayTime] = useState(0.01);

  // Refで最新の値を保持
  const bpmRef = useRef(bpm);
  const frequencyRef = useRef(frequency);
  const waveformRef = useRef(waveform);
  const volumeRef = useRef(volume);
  const decayTimeRef = useRef(decayTime);

  // useEffectでRefを更新
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    waveformRef.current = waveform;
  }, [waveform]);
  const initializeAudioContext = useCallback(async () => {
    if (!audioContext.current) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      audioContext.current = new AudioContextClass();
    }
    if (audioContext.current.state === "suspended") {
      await audioContext.current.resume();
    }
  }, []);

  const scheduler = useCallback(() => {
    while (
      nextNoteTime.current <
      audioContext.current!.currentTime + 0.1
    ) {
      scheduleClick(nextNoteTime.current);
      nextNoteTime.current += 60.0 / bpmRef.current;
    }
    schedulerId.current = requestAnimationFrame(scheduler);
  }, []);

  const startMetronome = useCallback(async () => {
    await initializeAudioContext();
    nextNoteTime.current = audioContext.current!.currentTime;
    scheduler();
  }, [initializeAudioContext, scheduler]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    decayTimeRef.current = decayTime;
  }, [decayTime]);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0);
  const schedulerId = useRef<number | null>(null);



  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }

    return () => {
      stopMetronome();
    };
  }, [isPlaying, startMetronome]);


  const stopMetronome = () => {
    if (schedulerId.current) {
      cancelAnimationFrame(schedulerId.current);
      schedulerId.current = null;
    }
  };

  const scheduleClick = (time: number) => {
    if (audioContext.current) {
      const osc = audioContext.current.createOscillator();
      const envelope = audioContext.current.createGain();

      osc.type = waveformRef.current;
      osc.frequency.value = frequencyRef.current;

      envelope.gain.setValueAtTime(volumeRef.current, time);
      envelope.gain.exponentialRampToValueAtTime(
        0.001,
        time + decayTimeRef.current
      );

      osc.connect(envelope);
      envelope.connect(audioContext.current.destination);

      osc.start(time);
      osc.stop(time + decayTimeRef.current);
    }
  };

  const handlePlay = async () => {
    await initializeAudioContext();
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">BPM メトロノーム</h1>
      <div className="flex flex-col items-center space-y-6 mb-8 w-full max-w-md">
        {/* BPM入力フィールド */}
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

        {/* 周波数入力フィールド */}
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

        {/* 波形選択フィールド */}
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

        {/* 音量調整スライダー */}
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

        {/* ディケイタイム入力フィールド */}
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
      </div>

      {/* 再生・停止ボタン */}
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="bg-blue-500 text-white px-12 py-4 rounded-full text-2xl active:bg-blue-600 mb-4"
          aria-label="メトロノームを再生"
        >
          再生
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-12 py-4 rounded-full text-2xl active:bg-red-600 mb-4"
          aria-label="メトロノームを停止"
        >
          停止
        </button>
      )}
    </div>
  );
}
