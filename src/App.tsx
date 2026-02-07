import { AuthProvider } from '@core/auth';
import { AppRouter } from '@core/routing';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
