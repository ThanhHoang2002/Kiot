import { AppProvider } from './provider';
import { AppRouter } from './router';
export const App = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('currentUser')
  return (
    <AppProvider>
      <AppRouter/>
    </AppProvider>
  );
};
