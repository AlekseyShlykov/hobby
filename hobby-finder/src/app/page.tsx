import ClientProvider from '@/components/ClientProvider';
import TestFlow from '@/components/TestFlow';

export default function Home() {
  return (
    <ClientProvider>
      <TestFlow />
    </ClientProvider>
  );
}
