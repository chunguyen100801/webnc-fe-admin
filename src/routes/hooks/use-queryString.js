import { useSearchParams } from 'react-router-dom';

function useQueryString() {
  const [searchParams] = useSearchParams();

  return Object.fromEntries([...searchParams]);
}

export default useQueryString;
