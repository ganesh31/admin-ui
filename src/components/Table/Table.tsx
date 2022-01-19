import React, { ChangeEvent, useMemo, useState } from 'react';
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
  filters: ColumnSearch[];
  noOfRowsPerPage: number;
  selectAll?: boolean;
  selectedIdList?: string[];

  onSelectAll?: () => void;
  onSelect?: (id: string) => void;
  onEnableEdit?: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteSelcted?: () => void;
  onSearch?: (searchObj: SearchObj) => void;
  onRemoveFilter?: (id: string) => void;
}

interface ColumnSearch {
  id: string;
  searchText: string;
}

const Table: React.FC<Props> = (props: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const currentTableData: TableRow[] = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * props.noOfRowsPerPage;
    const lastPageIndex = firstPageIndex + props.noOfRowsPerPage;

    return props.rows.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, props.noOfRowsPerPage, props.rows]);

  const handleSelectAll = (): void => {
    if (props.onSelectAll) props.onSelectAll();
  };

  const handleSelect = (id: string): void => {
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

  const renderRows = (): JSX.Element[] => {
    return currentTableData.map(({ id, cells }) => {
      const rowSelected = props.selectedIdList?.includes(id);
      return (
        <Row
          key={id}
          cells={cells}
          id={id}
          selected={Boolean(rowSelected)}
          onSelect={() => handleSelect(id)}
          onDelete={props.onDelete}
          onEnableEdit={props.onEnableEdit}
        />
      );
    });
  };

  return (
    <div>
      <table className="w-full mt-5">
        <thead>
          <Column
            columns={props.columns}
            selectAll={Boolean(props.selectAll)}
            onSelectAll={handleSelectAll}
            onSearch={handleSearch}
            onClose={handleRemoveFilter}
          />
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      <div className="flex py-3">
        <button
          className="ml-5 px-3 rounded-md border border-red-600 text-white bg-red-600"
          onClick={props.onDeleteSelcted}>
          {props.selectedIdList && props.selectedIdList.length > 0
            ? `Delete Selected - (${props.selectedIdList.length})`
            : 'Delete Selected'}
        </button>
        <Pagination
          currentPage={currentPage}
          totalCount={props.rows.length}
          pageSize={props.noOfRowsPerPage}
          onPageChange={handlePageChange}
          siblingCount={2}
        />
      </div>
    </div>
  );
};

export default Table;
