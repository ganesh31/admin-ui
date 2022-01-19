import React from 'react';
import CheckBox from '../../CheckBox';
import ColumnCell from '../ColumnCell/ColumnCell';
import { TableColumn } from '../types';

interface Props {
  columns: TableColumn[];
  selectAll: boolean;
  onSelectAll: () => void;
  onSearch?: ({
    columnId,
    searchText,
  }: {
    columnId: string;
    searchText: string;
  }) => void;
  onClose: (id: string) => void;
}

const Column: React.FC<Props> = (props: Props) => {
  const renderCells = () => {
    const columnList = props.columns.map(({ id, value, needSearch }) => {
      return (
        <ColumnCell
          key={id}
          id={id}
          value={value}
          onSearch={props.onSearch}
          needSearch={needSearch}
          onClose={props.onClose}
        />
      );
    });

    const checkBox = (
      <th className="p-4 relative" key="0-CheckBox">
        <CheckBox
          name="SelectAll"
          checked={props.selectAll}
          onClick={props.onSelectAll}
          size="lg"
        />
      </th>
    );

    const action = (
      <th key="action" className="text-left p-4">
        Actions
      </th>
    );

    return [checkBox, ...columnList, action];
  };
  return <tr className="h-10">{renderCells()}</tr>;
};

export default Column;
