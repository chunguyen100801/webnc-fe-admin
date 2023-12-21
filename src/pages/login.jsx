import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------
// eslint-disable-next-line perfectionist/sort-imports
export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <LoginView />
    </>
  );
}
