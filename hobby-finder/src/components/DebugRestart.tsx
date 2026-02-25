'use client';

import { useTestStore } from '@/lib/store';

export default function DebugRestart() {
  const { resetTest } = useTestStore();

  return (
    <button
      onClick={resetTest}
      className="fixed bottom-4 left-4 z-50 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
      style={{
        background: 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      }}
      title="Debug: Restart Test"
    >
      🔄 Restart
    </button>
  );
}
