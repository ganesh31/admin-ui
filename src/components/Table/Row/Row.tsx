import React from 'react';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import Cell from '../Cell/Cell';
import { TableCell } from '../types';

interface Props {
  cells: TableCell[];
  id: string;
  onSelect: () => void;
}

const Row: React.FC<Props> = (props: Props) => {
  const renderCells = () => {
    const cellList = props.cells.map(({ id, value }) => {
      return <Cell key={id}>{value}</Cell>;
    });

    const checkbox = (
      <td key="0-CheckBox" className="p-4 text-center">
        <input
          type="checkbox"
          key={props.id}
          id={props.id}
          name="select"
          onClick={props.onSelect}></input>
      </td>
    );

    const actions = (
      <td key="Actions" className="flex p-4 text-xl">
        <MdEdit className="mr-3" />
        <MdDeleteForever className="text-red-500" />
      </td>
    );

    return [checkbox, ...cellList, actions];
  };

  return <tr className="border-y">{renderCells()}</tr>;
};

export default Row;
