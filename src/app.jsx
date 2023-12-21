/* eslint-disable perfectionist/sort-imports */
import { useEffect, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { AppContext } from './context/app.context';
import { LocalStorageEventTarget } from './utils/auth';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset);
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset);
    };
  }, [reset]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router />
        <ToastContainer />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
