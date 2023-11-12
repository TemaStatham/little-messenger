import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthComponent } from './components/auth/AuthComponent';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth',
    element: <AuthComponent />,
  },
]);
export default AppRouter;
