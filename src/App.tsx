import React, { useEffect, useMemo, useState } from 'react';
import Table from './components';
import { TableColumn, TableRow } from './components/Table/types';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const colList: TableColumn[] = [
  { id: '1', value: 'Name', needSearch: true },
  { id: '2', value: 'Email', needSearch: true },
  { id: '3', value: 'Role', needSearch: true },
];

const PAGE_SIZE = 10;

const App: React.FC = () => {
  const [rowList, setRowList] = useState<TableRow[]>([]);
  const [globalSearchText, setGlobalSearchText] = useState<string>('');
  const [filters, setFilters] = useState<
    {
      id: string;
      searchText: string;
    }[]
  >([]);

  useEffect(() => {
    const url =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

    fetch(url)
      .then((response) => response.json())
      .then((data: Member[]) => {
        const rowListData: TableRow[] = data.map(
          ({ id, name, email, role }) => ({
            id,
            cells: [
              { id: '1', value: name },
              { id: '2', value: email },
              { id: '3', value: role },
            ],
          }),
        );

        setRowList(rowListData);
      });
  }, []);

  const onRemoveFilter = (filterId: string): void => {
    setFilters(filters.filter(({ id }) => id !== filterId));
  };

  const onGlobalSearch = (searchText: string) => {
    setGlobalSearchText(searchText);
  };

  const onSearchByColumn = ({
    columnId,
    searchText,
  }: {
    columnId: string;
    searchText: string;
  }) => {
    const filterIndex = filters.findIndex(({ id }) => columnId === id);
    if (filterIndex !== -1) {
      let newFilter = filters;
      newFilter[filterIndex].searchText = searchText;

      setFilters([...newFilter]);
    } else {
      setFilters([{ id: columnId, searchText }, ...filters]);
    }
  };

  const applyFilters = (rowsToFilter: TableRow[]): TableRow[] => {
    let filterdRow = rowsToFilter;
    filters.forEach(({ searchText, id }) => {
      filterdRow = filterdRow.filter(({ cells }) => {
        const columnIndex = cells.findIndex(
          ({ colId, value }) => colId === id && value.includes(searchText),
        );
        return columnIndex !== -1;
      });
    });

    return filterdRow;
  };

  const getRowsByGlobalSearch = (
    searchText: string,
    rowsToFilter: TableRow[],
  ) => {
    console.log('SearchBy GLOBAL');

    return rowsToFilter.filter(({ cells }) =>
      cells.some(({ value }) => value.includes(searchText)),
    );
  };
  const rowsByGlobal: TableRow[] = useMemo(
    () => getRowsByGlobalSearch(globalSearchText, rowList),
    [globalSearchText, rowList],
  );

  const getFilteredRowsGlobalCol = () => {
    if (rowList.length === 0 && globalSearchText === '') {
      return rowList;
    }
    return applyFilters(rowsByGlobal);
  };

  const filteredRows = getFilteredRowsGlobalCol();
  return (
    <Table
      name="GlobalSearch"
      placeholder="Search by name, email or role"
      columns={colList}
      noOfRowsPerPage={PAGE_SIZE}
      rows={filteredRows}
      onSearch={onSearchByColumn}
      onRemoveFilter={onRemoveFilter}
      onGlobalSearch={onGlobalSearch}
      filters={filters}
    />
  );
};

export default App;
