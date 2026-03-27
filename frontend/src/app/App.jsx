import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { Toaster } from 'sonner';
import AppRoutes from '../routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster position="bottom-right" theme="dark" />
    </QueryClientProvider>
  );
}

export default App;
