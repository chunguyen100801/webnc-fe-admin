/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { Stack } from '@mui/material';
import DeleteUserListModal from 'src/components/User/DeleteUserListForm';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selected,
  setPage,
  setFilterName,
  queryUserList,
  setSelected,
}) {
  const [openDelListModal, setOpenDelListModal] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const handleClickDelete = () => {
    setOpenDelListModal(true);
  };
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
        placeholder="name, email, student Id"
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      {numSelected > 0 ? (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography component="div" variant="subtitle1" sx={{ verticalAlign: 'middle' }}>
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton sx={{ color: 'error.main' }} onClick={handleClickDelete}>
              <Iconify icon="eva:trash-2-outline" width={25} />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
      <DeleteUserListModal
        open={openDelListModal}
        onClose={() => setOpenDelListModal(false)}
        selected={selected}
        queryUserList={queryUserList}
        setPage={setPage}
        setFilterName={setFilterName}
        setSelected={setSelected}
        setSearchKey={setSearchKey}
      />
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  selected: PropTypes.any,
  setPage: PropTypes.any,
  setFilterName: PropTypes.any,
  queryUserList: PropTypes.any,
  setSelected: PropTypes.any,
};
