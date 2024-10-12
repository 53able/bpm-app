// app/page.tsx

import dynamic from 'next/dynamic';

// 動的インポート
const Metronome = dynamic(() => import('@/components/Metronome'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">BPM メトロノーム</h1>
      <Metronome />
    </div>
  );
}

