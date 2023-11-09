import { createContext, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { unload } from '../slices/loadingSlice';

export const UserDataContext = createContext({});

const UserDataContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  const currentUser = JSON.parse(localStorage.getItem('user')) ?? null;
  const [userData, setUserData] = useState(currentUser);

  const logIn = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
    setUserData(data);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    dispatch(unload());
    setUserData(null);
  };

  const getUserName = () => userData.username;

  // Use useMemo to memoize the context value
  const contextValue = useMemo(() => ({
    userData, logIn, logOut, getUserName,
  }), [userData]);

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContextProvider;
