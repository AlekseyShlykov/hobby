'use client';

import { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="animate-pulse text-indigo-600 text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
