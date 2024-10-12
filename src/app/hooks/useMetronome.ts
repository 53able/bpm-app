// hooks/useMetronome.ts
import { useState, useEffect, useRef, useCallback } from "react";

export interface MetronomeSettings {
  bpm: number;
  frequency: number;
  waveform: OscillatorType;
  volume: number;
  decayTime: number;
}

export function useMetronome(settings: MetronomeSettings) {
  const [isPlaying, setIsPlaying] = useState(false);

  const bpmRef = useRef(settings.bpm);
  const frequencyRef = useRef(settings.frequency);
  const waveformRef = useRef(settings.waveform);
  const volumeRef = useRef(settings.volume);
  const decayTimeRef = useRef(settings.decayTime);

  const audioContext = useRef<AudioContext | null>(null);
  const nextNoteTime = useRef(0);
  const schedulerId = useRef<number | null>(null);

  // 設定の変更をRefに反映
  useEffect(() => {
    bpmRef.current = settings.bpm;
    frequencyRef.current = settings.frequency;
    waveformRef.current = settings.waveform;
    volumeRef.current = settings.volume;
    decayTimeRef.current = settings.decayTime;
  }, [settings]);

  const initializeAudioContext = useCallback(async () => {
    if (!audioContext.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
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

  const stopMetronome = useCallback(() => {
    if (schedulerId.current) {
      cancelAnimationFrame(schedulerId.current);
      schedulerId.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }

    return () => {
      stopMetronome();
    };
  }, [isPlaying, startMetronome, stopMetronome]);

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

  return {
    isPlaying,
    handlePlay,
    handleStop,
  };
}
