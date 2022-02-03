import React, { useEffect, useState } from 'react';
import OverlayModal from '../components/OverlayModal';
import { TableColumn, TableRow } from '../components/Table/types';
import EditTextfield from './EditTextfiled';

interface Props {
  open: boolean;
  editRow: TableRow;
  colList: TableColumn[];
  onCancel: () => void;
  onSave: (editedRow: TableRow) => void;
  onClose: () => void;
}

const EditOverlay: React.FC<Props> = ({ open, editRow, ...props }: Props) => {
  const [editRowData, setEditRowData] = useState(editRow);

  useEffect(() => {
    if (open) {
      setEditRowData(editRow);
    }
  }, [open, editRow]);

  /* handlers */

  const onEditChange = (value: string, cellId: string) => {
    const updatedCell = editRowData.cells.map((cell) => {
      if (cell.id === cellId) {
        return {
          ...cell,
          value: value,
        };
      }
      return cell;
    });

    setEditRowData({ ...editRow, cells: updatedCell });
  };

  /* end handlers */

  const { cells } = editRowData;

  const emptyCellIndex = cells.findIndex(({ value }) => value === '');

  const disableSave = emptyCellIndex !== -1;

  return (
    <OverlayModal open={open} onClose={props.onClose}>
      <div className="w-full p-4 space-y-10">
        <h2 className="font-bold text-xl text-center text-slate-700">
          Edit User Data
        </h2>
        <div className="space-y-8 mt-8">
          {cells.map(({ id, value, colId }) => {
            const name =
              props.colList.find(({ id }) => id === colId)?.value || '';
            return (
              <EditTextfield
                key={id}
                value={value}
                name={name}
                onChange={(value) => onEditChange(value, id)}
              />
            );
          })}
        </div>
        <div className="bg-slate-50 px-4 py-3  rounded-md flex justify-between">
          <button
            onClick={props.onCancel}
            type="button"
            className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => props.onSave(editRowData)}
            disabled={disableSave}
            type="button"
            className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </OverlayModal>
  );
};

export default EditOverlay;
