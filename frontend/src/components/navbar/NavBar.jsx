import React from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthorization } from '../../hooks';
import { appRoutes } from '../../routes';

const NavBar = () => {
  const { t } = useTranslation();
  const auth = useAuthorization();
  const navigate = useNavigate();
  const logOutUser = () => {
    auth.logOut();
    navigate(appRoutes.login());
  };
  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">{t('nav.logo')}</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" />
          {auth.currentUser ? (
            <Button onClick={logOutUser}>{t('nav.exit')}</Button>
          ) : (
            <Button onClick={() => navigate(appRoutes.login())}>{t('nav.enter')}</Button>
          )}
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default NavBar;
