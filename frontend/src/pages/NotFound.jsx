import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appRoutes } from '../routes';
import notFoundImg from '../img/404.png';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center not-found-container">
      <img src={notFoundImg} alt={t('notFound.pageNotFound')} className="img-fluid" width="450" />
      <h1 className="title text-center mb-4">{t('notFound.pageNotFound')}</h1>
      <p className="text-muted">
        <span className="to-main">
          {t('notFound.youCanGo')}
          {' '}
        </span>
        <NavLink to={appRoutes.chatPagePath()} className="link">
          {t('notFound.toMainPage')}
        </NavLink>
      </p>
    </div>
  );
};

export default NotFound;
