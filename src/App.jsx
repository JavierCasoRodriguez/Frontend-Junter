import { useLocation } from 'react-router-dom';
import Dashboard from './views/Dashboard'
import RedirectAuth from './views/RedirectAuth';
import {ContextProvider} from './views/SessionContext';
import ErrorBoundary from './views/processing/ErrorBoundary';
import {ContextLocalitiesProvider} from './views/ProviderLocal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// import NewLogin from './views/auth/NewLogin';
function App() {
  const queryClient = new QueryClient();
const location  = useLocation();
const authLocation = location.pathname.startsWith('/auth') ? true : false;


    return(
      authLocation ? (
        <ErrorBoundary>
          <RedirectAuth />
        </ErrorBoundary>
      ): 
     <ErrorBoundary>
        <ContextProvider>
          <ContextLocalitiesProvider>
          <QueryClientProvider client={queryClient}>
        <Dashboard/>
        </QueryClientProvider>
          </ContextLocalitiesProvider>
        </ContextProvider>
     </ErrorBoundary>
      
      
      )
    }
export default App

