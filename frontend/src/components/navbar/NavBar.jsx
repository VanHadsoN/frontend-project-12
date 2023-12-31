import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appRoutes } from '../../routes';
import { useAuthorization } from '../../hooks';
import LogoutButton from '../buttons/LogoutButton';
import './style.css';

const NavBar = () => {
  const { t } = useTranslation();
  const { logOut } = useAuthorization();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(appRoutes.loginPagePath());
    logOut();
  };
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="nav-container">
        <NavLink to={appRoutes.chatPagePath()} className="navbar-brand">
          {t('navigation.chatName')}
        </NavLink>
        <LogoutButton onLogout={handleLogout} buttonText={t('navigation.exitBtn')} />
      </div>
    </nav>
  );
};

export default NavBar;
