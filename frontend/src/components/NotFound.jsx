import React from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from './Navigation';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navigation
        t={t}
        showLogoutButton={false}
      />
      <div className="login-container">
        <h1>{t('error.notFound')}</h1>
        <div className="p-4">
          <span>{t('login.pleaseReturn')}</span>
          <a href="/">{t('login.mainPage')}</a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
