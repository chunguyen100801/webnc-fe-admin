import React from 'react';
import { Helmet } from 'react-helmet-async';

import { ChangePasswordView } from 'src/sections/change-password';

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
