import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { MdOutlineEditNote, MdDeleteForever } from 'react-icons/md';
import Table from './components';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import { TableColumn, TableRow } from './components/Table/types';
import EditOverlay from './EditOverlay';

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
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedIdList, setSelectedIdList] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { firstPageIndex, lastPageIndex } = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    return { firstPageIndex, lastPageIndex };
  }, [currentPage]);

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

  const onPageChange = (pageNo: number) => setCurrentPage(pageNo);

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
    const selectedRows: TableRow[] = [...filteredRows].slice(
      firstPageIndex,
      lastPageIndex,
    );
    setSelectedIdList(selectedRows.map(({ id }) => id));
    if (selectAll) {
      setSelectedIdList([]);
    }
  };

  const onEditOpen = (rowId: string) => {
    setEditRowId(rowId);
    setOpenEdit(true);
  };

  const onEditClose = () => {
    setEditRowId('');
    setOpenEdit(false);
  };

  const onEditSave = (editedRow: TableRow): void => {
    setRowList(
      rowList.map((row) => (row.id === editedRow.id ? editedRow : row)),
    );
    onEditClose();
  };

  const onDelete = (selectedId: string) => {
    const newRowList = rowList.filter(({ id }) => id !== selectedId);
    setRowList(newRowList);
    setSelectedIdList([...selectedIdList].filter((id) => id !== selectedId));
  };

  const onDeleteSelected = () => {
    if (selectAll) {
      setSelectAll(false);
    }
    const newRowList = rowList.filter(({ id }) => !selectedIdList.includes(id));
    setRowList(newRowList);
    setSelectedIdList([]);

    if (newRowList.length <= firstPageIndex) {
      setCurrentPage(currentPage - 1);
    }
    // setCurrentPage(1);
  };

  const onGlobalSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: searchText } = event.target;

    setGlobalSearchText(searchText);
    setCurrentPage(1);
  };

  const onGlobalSearchClear = () => {
    setGlobalSearchText('');
  };

  const getRowsByGlobalSearch = (
    searchText: string,
    rowsToFilter: TableRow[],
  ) =>
    rowsToFilter.filter(({ cells }) =>
      cells.some(({ value }) => value.includes(searchText)),
    );
  const rowsByGlobal: TableRow[] = useMemo(
    () => getRowsByGlobalSearch(globalSearchText, rowList),
    [globalSearchText, rowList],
  );

  const getFilteredRowsGlobal = () => {
    if (rowList.length === 0 && globalSearchText === '') {
      return rowList;
    }
    return rowsByGlobal;
  };

  const filteredRows = getFilteredRowsGlobal();

  const renderRowActions = (id: string) => (
    <>
      <MdOutlineEditNote
        className=" cursor-pointer"
        onClick={() => onEditOpen(id)}
      />
      <MdDeleteForever
        className="text-red-500 cursor-pointer"
        onClick={() => onDelete(id)}
      />
    </>
  );

  const slicedRowList =
    filteredRows.length <= PAGE_SIZE
      ? filteredRows
      : filteredRows.slice(firstPageIndex, lastPageIndex);

  const getRowForEdit = () => {
    const rowToEdit = filteredRows.find(({ id }) => id === editRowId);

    if (rowToEdit === undefined) {
      throw new Error('Cannot Edit unknown row');
    }

    return rowToEdit;
  };

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
        rows={slicedRowList}
        selectAll={selectAll}
        selectedIdList={selectedIdList}
        onSelect={onToggleSelect}
        onSelectAll={onToggleSelectAll}
        onDelete={onDelete}
        onEnableEdit={onEditOpen}
        renderActions={renderRowActions}
      />
      <footer>
        <div className="flex py-3 space-x-5">
          <button className="btn btn-danger" onClick={onDeleteSelected}>
            {'Delete Selected'}
          </button>
          <Pagination
            currentPage={currentPage}
            totalCount={filteredRows.length}
            pageSize={PAGE_SIZE}
            onPageChange={onPageChange}
            siblingCount={2}
          />
        </div>
      </footer>
      {openEdit && (
        <EditOverlay
          open={openEdit}
          colList={colList}
          editRow={getRowForEdit()}
          onCancel={onEditClose}
          onClose={onEditClose}
          onSave={onEditSave}
        />
      )}
    </main>
  );
};

export default App;
