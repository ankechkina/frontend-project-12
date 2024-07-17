import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navigation = ({ showLogoutButton, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <Link className="navbar-brand" to="/">{t('login.navBrand')}</Link>
      {showLogoutButton && (
        <button
          onClick={handleLogout}
          type="button"
          className="btn btn-primary logout-button"
        >
          {t('channels.logout')}
        </button>
      )}
    </nav>
  );
};

export default Navigation;
