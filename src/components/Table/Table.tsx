import React, { ChangeEvent, useMemo, useState } from 'react';
import { MdRemoveCircleOutline } from 'react-icons/md';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';
import Column from './Column/Column';
import Row from './Row/Row';
import { TableColumn, TableRow } from './types';

interface SearchObj {
  columnId: string;
  searchText: string;
}

interface Props {
  columns: TableColumn[];
  rows: TableRow[];
  name: string;
  placeholder: string;
  filters: ColumnSearch[];
  noOfRowsPerPage: number;

  onSelectAll?: () => void;
  onSelect?: (id: string) => void;
  onSearch?: (searchObj: SearchObj) => void;
  onGlobalSearch: (searchTex: string) => void;
  onRemoveFilter?: (id: string) => void;
}

interface ColumnSearch {
  id: string;
  searchText: string;
}

const Table: React.FC<Props> = (props: Props) => {
  const [focusId, setFocusId] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentTableData: TableRow[] = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * props.noOfRowsPerPage;
    const lastPageIndex = firstPageIndex + props.noOfRowsPerPage;

    return props.rows.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, props.noOfRowsPerPage, props.rows]);

  const handleSelectAll = (): void => {
    console.log('All Rows are selected');
    if (props.onSelectAll) props.onSelectAll();
  };

  const handleSelect = (id: string): void => {
    console.log('Selected ROw Id', id);
    if (props.onSelect) props.onSelect(id);
  };

  const handlePageChange = (pageNo: number) => setCurrentPage(pageNo);

  const handleRemoveFilter = (filterId: string): void => {
    if (props.onRemoveFilter) props.onRemoveFilter(filterId);
  };

  const handleSearch = ({
    columnId,
    searchText,
  }: {
    columnId: string;
    searchText: string;
  }) => {
    if (props.onSearch) props.onSearch({ columnId, searchText });
  };

  const handleGlobalSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: searchText } = event.target;

    props.onGlobalSearch(searchText);
  };

  const handleFocus = (id: string) => setFocusId(id);

  const renderRows = (): JSX.Element[] => {
    return currentTableData.map(({ id, cells }) => {
      return (
        <Row key={id} cells={cells} id={id} onSelect={() => handleSelect(id)} />
      );
    });
  };

  const renderBadge = (): JSX.Element[] => {
    return props.filters.map(({ searchText, id }) => {
      const columnName = props.columns.find(
        ({ id: colId }) => colId === id,
      )?.value;

      return (
        <div
          key={id}
          className={`flex justify-between items-center mr-2 w-fit rounded-lg border ${
            focusId === id
              ? 'shadow-sm shadow-slate-500'
              : 'shadow-sm shadow-slate-400'
          }`}>
          <span className="mx-2">
            <b>{columnName}: </b>
            {searchText}
          </span>
          <MdRemoveCircleOutline
            className="text-xl"
            onClick={() => handleRemoveFilter(id)}
          />
        </div>
      );
    });
  };

  return (
    <main className="m-52">
      <div className="w-full h-5 flex">{renderBadge()}</div>
      <div className="py-1 leading-7">
        <SearchBar
          name={props.name}
          placeholder={props.placeholder}
          onChange={handleGlobalSearch}
        />
      </div>
      <table className="w-full">
        <thead>
          <Column
            columns={props.columns}
            onSelectAll={handleSelectAll}
            onSearch={handleSearch}
            onFocus={handleFocus}
          />
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      <div className="flex py-3">
        <button className="ml-5 px-3 rounded-md border border-red-600 text-white bg-red-500">
          Delete Selected
        </button>
        <Pagination
          currentPage={currentPage}
          totalCount={props.rows.length}
          pageSize={props.noOfRowsPerPage}
          onPageChange={handlePageChange}
          siblingCount={2}
        />
      </div>
    </main>
  );
};

export default Table;
