import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { MdOutlineEditNote, MdDeleteForever } from 'react-icons/md';
import Table from './components';
import OverlayModal from './components/OverlayModal';
import SearchBar from './components/SearchBar';
import { TableColumn, TableRow } from './components/Table/types';
import EditTextfiled from './EditTextfiled';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

const colList: TableColumn[] = [
  { id: '1', value: 'Name', needSearch: false },
  { id: '2', value: 'Email', needSearch: false },
  { id: '3', value: 'Role', needSearch: false },
];

const PAGE_SIZE = 10;

const App: React.FC = () => {
  const [rowList, setRowList] = useState<TableRow[]>([]);
  const [globalSearchText, setGlobalSearchText] = useState<string>('');
  const [editRowId, setEditRowId] = useState<string>('');
  const [editRowData, setEditRowData] = useState<TableRow | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [filters, setFilters] = useState<
    {
      id: string;
      searchText: string;
    }[]
  >([]);

  const [selectedIdList, setSelectedIdList] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    const url =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

    fetch(url)
      .then((response) => response.json())
      .then((data: Member[]) => {
        const rowListData: TableRow[] = data.map(
          ({ id, name, email, role }) => ({
            id,
            cells: [
              { id: '1', value: name, colId: '1', isEditable: true },
              { id: '2', value: email, colId: '2', isEditable: true },
              { id: '3', value: role, colId: '3', isEditable: true },
            ],
          }),
        );

        setRowList(rowListData);
      });
  }, []);

  const onToggleSelect = (selectedId: string) => {
    const selectedIndex = selectedIdList.findIndex((id) => id === selectedId);

    if (selectAll) {
      setSelectAll(false);
    }
    if (selectedIndex === -1) {
      setSelectedIdList([...selectedIdList, selectedId]);
    } else {
      setSelectedIdList([...selectedIdList].filter((id) => id !== selectedId));
    }
  };

  const onToggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedIdList(rowList.map(({ id }) => id));
    if (selectAll) {
      setSelectedIdList([]);
    }
  };

  const onEnableEdit = (rowId: string) => {
    setEditRowId(rowId);
    setOpenEdit(true);
  };

  const onDelete = (selectedId: string) => {
    const newRowList = rowList.filter(({ id }) => id !== selectedId);
    setRowList(newRowList);
    setSelectedIdList([...selectedIdList].filter((id) => id !== selectedId));
  };

  const onDeleteSelected = () => {
    if (selectAll) {
      setRowList([]);
      setSelectAll(false);
    } else {
      const newRowList = rowList.filter(
        ({ id }) => !selectedIdList.includes(id),
      );
      setRowList(newRowList);
    }
  };

  const onRemoveFilter = (filterId: string): void => {
    setFilters(filters.filter(({ id }) => id !== filterId));
  };

  const onGlobalSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: searchText } = event.target;

    setGlobalSearchText(searchText);
  };

  const onGlobalSearchClear = () => setGlobalSearchText('');

  const onSearchByColumn = ({
    columnId,
    searchText,
  }: {
    columnId: string;
    searchText: string;
  }) => {
    const filterIndex = filters.findIndex(({ id }) => columnId === id);
    if (filterIndex !== -1) {
      let newFilter = filters;
      newFilter[filterIndex].searchText = searchText;

      setFilters([...newFilter]);
    } else {
      setFilters([{ id: columnId, searchText }, ...filters]);
    }
  };

  const onEditClose = () => {
    setEditRowData(null);
    setEditRowId('');
    setOpenEdit(false);
  };

  const onEditCancel = (): void => {
    onEditClose();
  };

  const onEditSave = (): void => {
    const editedRowId: number = rowList.findIndex(({ id }) => id === editRowId);

    if (editedRowId === -1) {
      throw new Error('Unknown row edited');
    }

    const updatedRowList = [...rowList];
    if (editRowData === null) {
      return;
    }
    updatedRowList[editedRowId].cells = editRowData.cells;

    setRowList([...updatedRowList]);

    onEditClose();
  };

  const onEditChange = (value: string, cellId: string): void => {
    const cellList = rowList.find(({ id }) => id === editRowId)?.cells || [];
    const rowValues: TableRow = {
      id: editRowId,
      cells: [...cellList].map((cell) => {
        if (cell.id === cellId) {
          return {
            ...cell,
            value,
          };
        } else {
          return cell;
        }
      }),
    };

    setEditRowData(rowValues);
  };

  const applyFilters = (rowsToFilter: TableRow[]): TableRow[] => {
    let filterdRow = rowsToFilter;
    filters.forEach(({ searchText, id }) => {
      filterdRow = filterdRow.filter(({ cells }) => {
        const columnIndex = cells.findIndex(
          ({ colId, value }) => colId === id && value.includes(searchText),
        );
        return columnIndex !== -1;
      });
    });

    return filterdRow;
  };

  const getRowsByGlobalSearch = (
    searchText: string,
    rowsToFilter: TableRow[],
  ) => {
    console.log('SearchBy GLOBAL');

    return rowsToFilter.filter(({ cells }) =>
      cells.some(({ value }) => value.includes(searchText)),
    );
  };
  const rowsByGlobal: TableRow[] = useMemo(
    () => getRowsByGlobalSearch(globalSearchText, rowList),
    [globalSearchText, rowList],
  );

  const getFilteredRowsGlobalCol = () => {
    if (rowList.length === 0 && globalSearchText === '') {
      return rowList;
    }
    return applyFilters(rowsByGlobal);
  };

  const filteredRows = getFilteredRowsGlobalCol();

  const renderEdit = () => {
    if (!openEdit) {
      return null;
    }
    const rowToEdit = filteredRows.find(({ id }) => id === editRowId);
    if (!rowToEdit) {
      return null;
    }

    let cells;
    if (editRowData === null) {
      cells = rowToEdit.cells;
    } else {
      cells = editRowData.cells;
    }

    const emptyCellIndex = cells.findIndex(({ value }) => value === '');

    const disableSave = emptyCellIndex !== -1;
    return (
      <form>
        <div className="space-y-10">
          <h2 className="font-bold text-xl text-center">Edit</h2>
          <div className="space-y-8 mt-8">
            {cells.map(({ id, value, colId }) => {
              const name = colList.find(({ id }) => id === colId)?.value || '';
              return (
                <EditTextfiled
                  key={id}
                  value={value}
                  name={name}
                  onChange={(value) => onEditChange(value, id)}
                />
              );
            })}
          </div>
          <div className="space-x-3 w-full flex justify-between items-center">
            <button
              className="btn btn-secondary text-lg"
              onClick={onEditCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary text-lg disabled:bg-slate-400"
              onClick={onEditSave}
              disabled={disableSave}>
              Save
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderRowActions = (id: string) => (
    <>
      <MdOutlineEditNote
        className=" cursor-pointer"
        onClick={() => onEnableEdit(id)}
      />
      <MdDeleteForever
        className="text-red-500 cursor-pointer"
        onClick={() => onDelete(id)}
      />
    </>
  );
  return (
    <main className="m-10">
      <SearchBar
        value={globalSearchText}
        name="GlobalSearch"
        placeholder="Search by name, email or role"
        onChange={onGlobalSearch}
        showClose
        onClose={onGlobalSearchClear}
      />
      <Table
        columns={colList}
        noOfRowsPerPage={PAGE_SIZE}
        rows={filteredRows}
        selectAll={selectAll}
        selectedIdList={selectedIdList}
        onSelect={onToggleSelect}
        onSelectAll={onToggleSelectAll}
        onDelete={onDelete}
        onDeleteSelcted={onDeleteSelected}
        onSearch={onSearchByColumn}
        onRemoveFilter={onRemoveFilter}
        filters={filters}
        onEnableEdit={onEnableEdit}
        renderActions={renderRowActions}
      />
      {openEdit && (
        <OverlayModal open={openEdit} onClose={onEditClose}>
          {renderEdit()}
        </OverlayModal>
      )}
    </main>
  );
};

export default App;
