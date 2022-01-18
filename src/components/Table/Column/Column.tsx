import React from 'react';
import ColumnCell from '../ColumnCell/ColumnCell';
import { TableColumn } from '../types';

interface Props {
  columns: TableColumn[];
  onSelectAll: () => void;
  onSearch?: ({
    columnId,
    searchText,
  }: {
    columnId: string;
    searchText: string;
  }) => void;
  onFocus: (id: string) => void;
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
          onFocus={props.onFocus}
          needSearch={needSearch}
        />
      );
    });

    const checkBox = (
      <th className="p-4" key="0-CheckBox">
        <input
          type="checkbox"
          className="w-4 h-4"
          id="selectAll"
          name="selectAll"
          onClick={props.onSelectAll}></input>
      </th>
    );

    const action = <th className="text-left p-4">Actions</th>;

    return [checkBox, ...columnList, action];
  };
  return <tr>{renderCells()}</tr>;
};

export default Column;
