import path from 'src/constants/path';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'user',
    path: path.user,
    icon: icon('ic_user'),
  },
  {
    title: 'class',
    path: path.class,
    icon: icon('ic_cart'),
  },
];

export default navConfig;
