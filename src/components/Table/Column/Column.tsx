import React from 'react';
import Cell from '../Cell/Cell';
import { TableColumn } from '../types';

interface Props {
  columns: TableColumn[];
}

const Column: React.FC<Props> = (props: Props) => {
  const renderCells = () => {
    const columnList = props.columns.map(({ id, value, sticky }) => {
      return (
        <Cell key={id} header sticky={sticky}>
          {value}
        </Cell>
      );
    });

    return columnList;
  };
  return <tr className="h-10">{renderCells()}</tr>;
};

export default Column;
