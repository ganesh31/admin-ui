import React from 'react';
import CheckBox from '../../CheckBox';
import Cell from '../Cell/Cell';
import { TableCell } from '../types';

interface Props {
  cells: TableCell[];
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;

  renderRowAction?: () => JSX.Element;
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

    const actions = props.renderRowAction ? (
      <td key="Actions" className="flex p-4 space-x-5 text-xl">
        {props.renderRowAction()}
      </td>
    ) : (
      <td key="Actions" className="flex p-4 space-x-5 text-xl"></td>
    );

    return [checkbox, ...cellList, actions];
  };

  return <tr className="border-y">{renderCells()}</tr>;
};

export default Row;
