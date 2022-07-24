import React, { useMemo, useState } from 'react';
import Pagination from '../Pagination';
import Column from './Column/Column';
import Row from './Row/Row';
import { TableColumn, TableRow } from './types';

interface Props {
  columns: TableColumn[];
  rows?: TableRow[];
  pageSize?: number;
  siblingCount?: number;
}

const Table: React.FC<Props> = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { firstPageIndex, lastPageIndex, PAGE_SIZE } = useMemo(() => {
    const PAGE_SIZE = props.pageSize || props.rows?.length || 0;
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return { firstPageIndex, lastPageIndex, PAGE_SIZE };
  }, [currentPage, props.pageSize, props.rows?.length]);

  const handlePageChange = (pageNo: number) => setCurrentPage(pageNo);

  const renderRows = (): JSX.Element[] | undefined => {
    if (!props.rows) return undefined;

    if (props.rows.length <= PAGE_SIZE) {
      return props.rows.map(({ id, cells, selected }) => (
        <Row
          key={id}
          cells={cells}
          columns={props.columns}
          id={id}
          selected={selected || false}
        />
      ));
    }
    return props.rows
      .slice(firstPageIndex, lastPageIndex)
      .map(({ id, cells, selected }) => (
        <Row
          key={id}
          cells={cells}
          columns={props.columns}
          id={id}
          selected={selected || false}
        />
      ));
  };

  return (
    <div className="overflow-auto">
      <table className="w-full mt-5">
        <thead>
          <Column columns={props.columns} />
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
      {props.pageSize !== undefined && (
        <div className="w-full flex align-middle justify-center py-4">
          <Pagination
            totalCount={props.rows?.length || 0}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            siblingCount={props.siblingCount || 2}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
