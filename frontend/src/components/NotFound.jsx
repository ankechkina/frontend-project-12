import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <>
      <nav className="shadow-sm navbar navbar-expand-lg bg-white">
        <div>
          <a className="navbar-brand" href="/">{t('login.navBrand')}</a>
        </div>
      </nav>
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
