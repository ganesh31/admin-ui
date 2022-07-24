import { useObservableState } from 'observable-hooks';
import { MdOutlineEditNote, MdDeleteForever } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { combineLatestWith, map } from 'rxjs';
import Table from '../../components';
import CheckBox from '../../components/CheckBox';
import { Member, useMember } from '../../store';
import EditOverlay from '../../EditOverlay';

type ColumnMapping = keyof Member;

interface Column {
  value: string;
  id: string;
  columnMapping: ColumnMapping;
}

export const COLUMNS: Column[] = [
  { value: 'Name', id: '1', columnMapping: 'name' },
  { value: 'Email', id: '2', columnMapping: 'email' },
  { value: 'Role', id: '3', columnMapping: 'role' },
];

const MemberTable = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [edit, setEdit] = useState(false);
  const { memberList$, selected$, searchString$ } = useMember();
  const [editRow, setEditRow] = useState<Member>();

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json',
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => memberList$.next(data));

    return () => {
      controller.abort();
    };
  }, [memberList$]);

  const isMatch = (member: Member, searchString: string) =>
    member.email.includes(searchString) ||
    member.name.includes(searchString) ||
    member.role.includes(searchString);

  const [memberList] = useObservableState(() => {
    return memberList$.pipe(
      combineLatestWith(selected$),
      combineLatestWith(searchString$),
      map(([[members, selectedRows], searchTerm]) => {
        return members
          .map((member) => ({
            ...member,
            selected: selectedRows.includes(member.id),
          }))
          .filter((member) => searchTerm === '' || isMatch(member, searchTerm));
      }),
    );
  }, []);

  const onToggleSelectAll = () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      selected$.next(memberList.map(({ id }) => id));
    } else {
      selected$.next([]);
    }
  };

  const onRowSelected = (rowId: string) => {
    if (selected$.value.includes(rowId)) {
      selected$.next(selected$.value.filter((id) => rowId !== id));
    } else {
      selected$.next([...selected$.value, rowId]);
    }
  };

  const onEditOpen = (memberRow: Member) => {
    setEdit(true);
    setEditRow(memberRow);
  };

  const onDelete = (id: string) => {
    const memberListAfterDelete = memberList.filter(
      (member) => member.id !== id,
    );

    memberList$.next(memberListAfterDelete);
  };

  const onUpdate = (editRow: Member) => {
    memberList$.next(
      memberList.map((member) => {
        if (member.id === editRow.id) {
          return editRow;
        }
        return member;
      }),
    );
    setEdit(false);
  };

  const getColumnsWithActions = () => {
    const checkbox = (
      <CheckBox
        name="SelectAll"
        checked={selected$.value.length === 0 ? false : selectAll}
        onClick={onToggleSelectAll}
        size="lg"
      />
    );

    return [
      {
        value: checkbox,
        id: 'selectAll',
        sticky: true,
        columnMapping: 'select',
      },
      ...COLUMNS,
      { value: 'Actions', id: 'action' },
    ];
  };

  const getRowsWithActions = () => {
    return memberList.map((member) => {
      const cells = COLUMNS.map((column) => {
        const { columnMapping } = column;
        return {
          value: member[columnMapping],
          id: `${member[columnMapping]}`,
          columnMapping,
        };
      });

      const checkbox = (
        <CheckBox
          name={`checkbox-${member.id}`}
          checked={member.selected}
          onClick={() => onRowSelected(member.id)}
          size="lg"
        />
      );

      const actions = (
        <div className="flex p-4 space-x-5 text-xl">
          <MdOutlineEditNote
            className=" cursor-pointer"
            onClick={() => onEditOpen(member)}
          />
          <MdDeleteForever
            className="text-red-500 cursor-pointer"
            onClick={() => onDelete(member.id)}
          />
        </div>
      );

      return {
        cells: [
          {
            value: checkbox,
            id: `select-${member.id}`,
            columnMapping: 'select',
          },
          ...cells,
          { value: actions, id: `action-${member.id}` },
        ],
        id: member.id,
      };
    });
  };

  return (
    <>
      <Table
        columns={getColumnsWithActions()}
        rows={getRowsWithActions()}
        pageSize={10}
        siblingCount={2}
      />
      {editRow && edit && (
        <EditOverlay
          open={edit}
          editRow={editRow}
          onSave={onUpdate}
          onClose={() => setEdit(false)}
        />
      )}
    </>
  );
};

export default MemberTable;
