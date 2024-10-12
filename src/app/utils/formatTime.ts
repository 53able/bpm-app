// utils/formatTime.ts
export function formatTime(seconds: number): string {
  const sec = Math.floor(seconds % 60);
  const min = Math.floor((seconds / 60) % 60);
  const hr = Math.floor(seconds / 3600);

  const secStr = sec.toString().padStart(2, '0');
  const minStr = min.toString().padStart(2, '0');
  const hrStr = hr.toString().padStart(2, '0');

  if (hr > 0) {
    return `${hrStr}:${minStr}:${secStr}`;
  } else {
    return `${minStr}:${secStr}`;
  }
}
