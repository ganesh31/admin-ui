import React, { useState } from 'react';
import OverlayModal from '../components/OverlayModal';
import { COLUMNS } from '../containers/members/MemberTable';
import { Member } from '../store';
import EditTextfield from './EditTextfiled';

interface Props {
  open: boolean;
  editRow: Member;
  onSave: (editedRow: Member) => void;
  onClose: () => void;
}

const EditOverlay: React.FC<Props> = ({ open, editRow, ...props }: Props) => {
  const [editRowData, setEditRowData] = useState<Member>(editRow);

  const disable =
    editRowData.email === '' ||
    editRowData.name === '' ||
    editRowData.role === '';

  return (
    <OverlayModal open={open} onClose={props.onClose}>
      <div className="w-full p-4 space-y-10">
        <h2 className="font-bold text-xl text-center text-slate-700">
          Edit User Data
        </h2>
        <div className="space-y-8 mt-8">
          <EditTextfield
            name={COLUMNS[0].value}
            value={editRow?.name as string}
            onChange={(e) => setEditRowData({ ...editRowData, name: e })}
          />
          <EditTextfield
            name={COLUMNS[1].value}
            value={editRow?.email as string}
            onChange={(e) => setEditRowData({ ...editRowData, email: e })}
          />
          <EditTextfield
            name={COLUMNS[2].value}
            value={editRow?.role as string}
            onChange={(e) => setEditRowData({ ...editRowData, role: e })}
          />
        </div>
        <div className="bg-slate-50 px-4 py-3  rounded-md flex justify-between">
          <button
            onClick={props.onClose}
            type="button"
            className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={() => props.onSave(editRowData)}
            disabled={disable}
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
