// /* eslint-disable perfectionist/sort-imports */
// import { useMemo, createContext, useState } from 'react';

// import PropTypes from 'prop-types';

// import { getAccessTokenFromLS } from 'src/utils/auth';

// const initialAppContext = {
//   isAuthenticated: Boolean(getAccessTokenFromLS()),
//   setIsAuthenticated: () => null,
// };

// export const AppContext = createContext(initialAppContext);

// export const AppProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated);
//   const contextValue = useMemo(
//     () => ({
//       isAuthenticated: Boolean(getAccessTokenFromLS()),
//       setIsAuthenticated: () => {},
//     }),
//     []
//   ); // [] đảm bảo rằng useMemo chỉ thực hiện một lần khi component được tạo

//   return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
// };

// AppProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

import PropTypes from 'prop-types';
import React, { useMemo, useState, createContext } from 'react';

import { getAccessTokenFromLS } from 'src/utils/auth';

const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => {},
  reset: () => {},
};

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated);

  const reset = () => {
    setIsAuthenticated(false);
    // setProfile(null)
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      reset,
    }),
    [isAuthenticated, setIsAuthenticated]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
