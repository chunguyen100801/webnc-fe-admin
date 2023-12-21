import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/forgotpassword';

export default function FotgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
