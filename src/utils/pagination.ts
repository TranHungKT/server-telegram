export const generateSkip = ({
  pageSize,
  pageNumber,
}: {
  pageSize: number;
  pageNumber: number;
}) => {
  if (pageNumber === 1) {
    return 0;
  }
  return pageSize * (pageNumber - 1);
};
