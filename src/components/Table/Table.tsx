import React from 'react';
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
  selectAll?: boolean;
  selectedIdList?: string[];

  renderActions: (id: string) => JSX.Element;
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
  const handleSelectAll = (): void => {
    if (props.onSelectAll) props.onSelectAll();
  };

  const handleSelect = (id: string): void => {
    if (props.onSelect) props.onSelect(id);
  };

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
    return props.rows.map(({ id, cells }) => {
      const rowSelected = props.selectedIdList?.includes(id);
      return (
        <Row
          key={id}
          cells={cells}
          id={id}
          selected={Boolean(rowSelected)}
          onSelect={() => handleSelect(id)}
          renderRowAction={() => props.renderActions(id)}
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
    </div>
  );
};

export default Table;
