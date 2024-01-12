import React from 'react';
import { Helmet } from 'react-helmet-async';

import { StudentView } from 'src/sections/student/view';

export default function StudentPage() {
  return (
    <>
      <Helmet>
        <title> Users | Admin</title>
      </Helmet>

      <StudentView />
    </>
  );
}
