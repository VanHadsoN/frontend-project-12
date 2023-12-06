import {
  createContext, useState, useMemo, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { setLoadingState } from '../slices/channelsSlice.js';

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
    dispatch(setLoadingState());
    setUserData(null);
  }, [dispatch]);

  const getUserName = useCallback(() => {
    const userNameData = JSON.parse(localStorage.getItem(`user_${userData}`));
    return userNameData?.[userData]?.username;
  }, [userData]);

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
