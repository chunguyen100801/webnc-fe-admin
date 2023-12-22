// /* eslint-disable perfectionist/sort-imports */

import PropTypes from 'prop-types';
import React, { useMemo, useState, createContext } from 'react';

import { getProfileFromLS, getAccessTokenFromLS } from 'src/utils/auth';

const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => {},
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => {},
};

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAppContext.isAuthenticated);
  const [profile, setProfile] = useState(initialAppContext.profile);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      profile,
      setProfile,
      reset,
    }),
    [isAuthenticated, setIsAuthenticated, profile, setProfile]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
