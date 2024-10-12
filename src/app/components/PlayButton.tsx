// components/PlayButton.tsx
import React from "react";

interface PlayButtonProps {
  isPlaying: boolean;
  handlePlay: () => void;
  handleStop: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  isPlaying,
  handlePlay,
  handleStop,
}) => (
  <>
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
  </>
);
