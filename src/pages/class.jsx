import { Helmet } from 'react-helmet-async';

import { ClassView } from 'src/sections/class/view';

// ----------------------------------------------------------------------

export default function ClassPage() {
  return (
    <>
      <Helmet>
        <title> Class | Admin </title>
      </Helmet>

      <ClassView />
    </>
  );
}
