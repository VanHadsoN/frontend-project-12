import React, { useContext } from 'react';
import { UserDataContext } from '../../context/UserDataContext';

const LogoutButton = ({ onLogout, buttonText }) => {
  const userDataContext = useContext(UserDataContext);

  if (userDataContext.userData !== null) {
    return (
      <button type="button" className="logout-button" onClick={onLogout}>
        {buttonText}
      </button>
    );
  }

  return null;
};

export default LogoutButton;
