import React from 'react';
import { Helmet } from 'react-helmet-async';

import { ResetPasswordView } from 'src/sections/reset-password';

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset password</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
