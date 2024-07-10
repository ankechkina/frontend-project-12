import useAuth from '../hooks/useAuth';

const AuthLoader = ({ children }) => {
  useAuth();

  return children;
};

export default AuthLoader;
