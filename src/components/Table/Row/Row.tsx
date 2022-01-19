import React from 'react';
import { MdEdit, MdDeleteForever } from 'react-icons/md';
import CheckBox from '../../CheckBox';
import Cell from '../Cell/Cell';
import { TableCell } from '../types';

interface Props {
  cells: TableCell[];
  id: string;
  selected: boolean;
  onEnableEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect: (id: string) => void;
}

const Row: React.FC<Props> = (props: Props) => {
  const renderCells = () => {
    const cellList = props.cells.map(({ id, value }) => {
      return <Cell key={id}>{value}</Cell>;
    });

    const checkbox = (
      <td
        key="0-CheckBox"
        className="p-4 text-center flex justify-center items-center">
        <CheckBox
          name={props.id}
          onClick={() => props.onSelect(props.id)}
          checked={props.selected}
        />
      </td>
    );

    const actions = (
      <td key="Actions" className="flex p-4 text-xl">
        <MdEdit
          className="mr-3"
          onClick={() => props.onEnableEdit && props.onEnableEdit(props.id)}
        />
        <MdDeleteForever
          className="text-red-500 cursor-pointer"
          onClick={() => props.onDelete && props.onDelete(props.id)}
        />
      </td>
    );

    return [checkbox, ...cellList, actions];
  };

  return <tr className="border-y">{renderCells()}</tr>;
};

export default Row;
