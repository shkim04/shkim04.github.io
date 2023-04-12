import React, { createContext, useState, useContext } from 'react';

const LocaleContext = createContext('');

const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('ko');

  const changeLocale = (lang) => setLocale(lang)

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within an LocaleProvider');
  }
  return context;
};

export { LocaleProvider, useLocale };