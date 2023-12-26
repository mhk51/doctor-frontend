import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerLicense } from "@syncfusion/ej2-base";
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

registerLicense(
"Ngo9BigBOggjHTQxAR8/V1NHaF5cXmVCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWH9feXRSRWZfVEB2XEo="
);
 i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'ar', 'fr'],
    fallbackLng: 'en',
    debug: false,
   
    // Options for language detector
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    // react: { useSuspense: false },
    backend: {
      loadPath: 'assets/locales/{{lng}}/translation.json',
    },
   
  })






const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

