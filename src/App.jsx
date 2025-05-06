import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Define las rutas usando createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;