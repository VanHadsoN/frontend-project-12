import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { io } from 'socket.io-client';
import { Provider } from 'react-redux';
import LeoProfanity from 'leo-profanity';
import { Provider as RollbarProvider } from '@rollbar/react';

import ru from './locales/ru.js';
import ServerProvider from './providers/ServerProvider';
import AuthProvider from './providers/AuthProvider';
import App from './Components/App';
import store from './slices/index.js';

const runApp = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: true,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        ru,
      },
    });

  // rollbar
  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: process.env.NODE_ENV === 'production',
  };

  const profanityFilter = LeoProfanity;
  profanityFilter.add(profanityFilter.getDictionary('en'));
  profanityFilter.add(profanityFilter.getDictionary('ru'));

  const socket = io();

  return (
    <RollbarProvider config={rollbarConfig}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <AuthProvider>
            <ServerProvider socket={socket}>
              <App />
            </ServerProvider>
          </AuthProvider>
        </Provider>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default runApp;
