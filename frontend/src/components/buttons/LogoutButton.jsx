import React, { useContext } from 'react';
import { UserDataContext } from '../../context/UserDataContext';

const LogoutButton = (handle, title) => {
  const userDataContext = useContext(UserDataContext);

  if (userDataContext.userData !== null) {
    return (
      <button type="button" className="logout-button" onClick={handle}>{title}</button>
    );
  }

  return null;
};

export default LogoutButton;
