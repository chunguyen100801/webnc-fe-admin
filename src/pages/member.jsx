import { Helmet } from 'react-helmet-async';

import { MemberView } from 'src/sections/class/member/view';

// ----------------------------------------------------------------------

export default function MemberPage() {
  return (
    <>
      <Helmet>
        <title> Member | Admin </title>
      </Helmet>

      <MemberView />
    </>
  );
}
