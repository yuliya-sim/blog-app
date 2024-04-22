import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import './App.css'
import Blog from './components/blog/Blog';
import Home from './components/home/Home';
import SignIn from './auth/SignIn';
import CreateComment from './components/comments/CreateComment';
import CreatePost from './components/posts/CreatePost';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, {
    path: "/:id",
    element: <Blog />,
  }, {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/create-comment/:id",
    element: <CreateComment />,
  },
  {
    path: "/create-post/:id",
    element: <CreatePost />,
  },
]);

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

}

export default App
