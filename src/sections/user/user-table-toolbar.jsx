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

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName }) {
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

      {numSelected > 0 ? (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography component="div" variant="subtitle1" sx={{ verticalAlign: 'middle' }}>
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton sx={{ color: 'error.main' }}>
              <Iconify icon="eva:trash-2-outline" width="200" />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
