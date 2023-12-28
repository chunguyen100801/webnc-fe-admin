/* eslint-disable no-unused-vars */
/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
// import { Stack } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function MemberTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selected,
  setPage,
  setFilterName,
  queryMemberList,
  setSelected,
}) {
  const [searchKey, setSearchKey] = useState(0);

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected < 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
        marginY: { xs: 2, sm: 0 },
      }}
    >
      <OutlinedInput
        key={searchKey}
        defaultValue={filterName === ' ' ? '' : filterName}
        onChange={onFilterName}
        placeholder="Search by name, email"
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
    </Toolbar>
  );
}

MemberTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.any,
  setPage: PropTypes.any,
  setFilterName: PropTypes.any,
  queryMemberList: PropTypes.any,
  setSelected: PropTypes.any,
};
