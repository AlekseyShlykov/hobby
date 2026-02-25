import ClientProvider from '@/components/ClientProvider';
import TestFlow from '@/components/TestFlow';
import DebugRestart from '@/components/DebugRestart';

export default function Home() {
  return (
    <ClientProvider>
      <TestFlow />
      <DebugRestart />
    </ClientProvider>
  );
}
