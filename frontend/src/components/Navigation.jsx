import React from 'react';

const Navigation = ({ t, handleLogout, showLogoutButton }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <a className="navbar-brand" href="/">{t('login.navBrand')}</a>
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

export default Navigation;
