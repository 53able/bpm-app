"use client";

import { useState, useEffect, useRef } from "react";

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const initializeAudioContext = async () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }

    return () => {
      stopMetronome();
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm]);

  const startMetronome = async () => {
    await initializeAudioContext();

    const interval = (60 / bpm) * 1000;
    playClick();

    intervalId.current = setInterval(() => {
      playClick();
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  const playClick = () => {
    if (audioContext.current) {
      const osc = audioContext.current.createOscillator();
      const envelope = audioContext.current.createGain();

      osc.type = "square";
      osc.frequency.value = 1000;

      envelope.gain.setValueAtTime(1, audioContext.current.currentTime);
      envelope.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.current.currentTime + 0.01
      );

      osc.connect(envelope);
      envelope.connect(audioContext.current.destination);

      osc.start(audioContext.current.currentTime);
      osc.stop(audioContext.current.currentTime + 0.02);
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
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-6">
        <label className="mr-2 text-lg">BPM:</label>
        <input
          type="number"
          inputMode="numeric"
          pattern="\d*"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="border rounded px-4 py-2 w-24 text-center text-lg"
          min={40}
          max={240}
        />
      </div>
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="bg-blue-500 text-white px-8 py-4 rounded-full text-lg active:bg-blue-600"
          aria-label="メトロノームを再生"
        >
          再生
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="bg-red-500 text-white px-8 py-4 rounded-full text-lg active:bg-red-600"
          aria-label="メトロノームを停止"
        >
          停止
        </button>
      )}
    </div>
  );
}
