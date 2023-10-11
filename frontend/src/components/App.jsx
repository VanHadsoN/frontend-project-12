import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';
  import { ToastContainer } from 'react-toastify';
  import Chat from '../pages/ChatPage';
  import Login from '../pages/LoginPage';
  import NotFound from '../pages/ErrorPage';
  import NavBar from './navbar/NavBar';
  import Signup from '../pages/SignupPage';
  import routes from '../routes';
  import { useAuthorization } from '../hooks';
  import 'react-toastify/dist/ReactToastify.css';
  
  const App = () => {
    const AuthorizationRoute = ({ children }) => {
      const authorization = useAuthorization();
      return authorization.userData ? children : <Navigate to={routes.loginPagePath()} />;
    };
  
    return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path={routes.chatPagePath()}
            element={(
              <AuthorizationRoute>
                <Chat />
              </AuthorizationRoute>
            )}
          />
          <Route path={routes.loginPagePath()} element={<Login />} />
          <Route path={routes.signupPagePath()} element={<Signup />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    );
  };
  
  export default App;
  