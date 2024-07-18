import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from './Navigation';
import { ROUTES } from '../utils/router';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navigation
        showLogoutButton={false}
      />
      <div className="login-container">
        <h1>{t('error.notFound')}</h1>
        <div className="p-4">
          <span>{t('login.pleaseReturn')}</span>
          <Link to={ROUTES.home}>{t('login.mainPage')}</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
