import { useObservableState } from 'observable-hooks';
import SearchBar from '../../components/SearchBar';
import { useMember } from '../../store';

export const GlobalSearch = () => {
  const { searchString$ } = useMember();
  const searchTerm = useObservableState(searchString$, '');
  return (
    <SearchBar
      value={searchTerm}
      name="GlobalSearch"
      placeholder="Search by name, email or role"
      onChange={(e) => searchString$.next(e.target.value)}
      showClose
      onClose={() => searchString$.next('')}
    />
  );
};
