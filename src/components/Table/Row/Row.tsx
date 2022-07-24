import React from 'react';
import Cell from '../Cell/Cell';
import { TableCell, TableColumn } from '../types';

interface Props {
  cells: TableCell[];
  id: string;
  selected: boolean;
  columns: TableColumn[];
}

const Row: React.FC<Props> = (props: Props) => {
  const renderCells = () => {
    const cellList = props.cells.map(({ id, value, columnMapping }) => {
      const sticky = props.columns.find(
        (column) =>
          columnMapping !== undefined && columnMapping === column.columnMapping,
      )?.sticky;
      return (
        <Cell key={id} sticky={sticky}>
          {value}
        </Cell>
      );
    });

    return cellList;
  };

  return (
    <tr
      className={`border-y ${
        props.selected
          ? 'shadow-md shadow-slate-200 bg-slate-100 opacity-80'
          : ''
      } hover:shadow-md hover:shadow-slate-300 transition duration-100 ease-in `}>
      {renderCells()}
    </tr>
  );
};

export default Row;
