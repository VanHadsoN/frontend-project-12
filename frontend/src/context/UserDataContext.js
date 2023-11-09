import { createContext, useState, useMemo, useCallback } from 'react';
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

  const logOut = useCallback(() => {
    localStorage.removeItem('user');
    dispatch(unload());
    setUserData(null);
  }, [dispatch]);

  const getUserName = useCallback(() => userData.username, [userData]);

  const contextValue = useMemo(() => ({
    userData,
    logIn,
    logOut,
    getUserName,
  }), [userData, logOut, getUserName]);

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContextProvider;
