export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export function applyFilter({ inputData, myId }) {
  const stabilizedThis = inputData?.map((el, index) => [el, index]);
  // const filteredStabilizedThis = stabilizedThis?.filter(([el]) => el.id !== myId);
  inputData = stabilizedThis?.map((el) => el[0]);
  return inputData;
}
