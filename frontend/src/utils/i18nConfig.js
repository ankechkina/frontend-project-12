import i18next from 'i18next';
import resources from '../locales/index';

const initializeI18n = async () => {
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: 'ru',
    debug: false,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
  return i18n;
};

export default initializeI18n;
