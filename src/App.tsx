import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { MdOutlineEditNote, MdDeleteForever } from 'react-icons/md';
import Table from './components';
import OverlayModal from './components/OverlayModal';
import Pagination from './components/Pagination';
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
    const selectedRows: TableRow[] = [...rowList].slice(
      firstPageIndex,
      lastPageIndex,
    );
    setSelectAll(!selectAll);
    setSelectedIdList(selectedRows.map(({ id }) => id));
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

  const onRemoveFilter = (filterId: string): void => {
    setFilters(filters.filter(({ id }) => id !== filterId));
  };

  const onGlobalSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: searchText } = event.target;

    setGlobalSearchText(searchText);
    setCurrentPage(1);
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
      return <></>;
    }
    const rowToEdit = filteredRows.find(({ id }) => id === editRowId);
    if (!rowToEdit) {
      return <></>;
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
      <div className="w-full p-4 space-y-10">
        <h2 className="font-bold text-xl text-center text-slate-700">
          Edit User Data
        </h2>
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
        <div className="bg-slate-50 px-4 py-3  rounded-md flex justify-between">
          <button
            onClick={onEditCancel}
            type="button"
            className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={onEditSave}
            disabled={disableSave}
            type="button"
            className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
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

  const slicedRowList =
    filteredRows.length <= PAGE_SIZE
      ? filteredRows
      : filteredRows.slice(firstPageIndex, lastPageIndex);
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
        onSearch={onSearchByColumn}
        onRemoveFilter={onRemoveFilter}
        filters={filters}
        onEnableEdit={onEnableEdit}
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
        <OverlayModal open={openEdit} onClose={onEditClose}>
          {renderEdit()}
        </OverlayModal>
      )}
    </main>
  );
};

export default App;
