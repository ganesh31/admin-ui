import React from 'react';
import { usePagination } from '../../hooks';
import { DOTS } from '../../hooks/usePagination';

interface Props {
  totalCount: number;
  currentPage: number;
  siblingCount?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}: Props) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  if (!paginationRange) {
    return <></>;
  }
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="flex list-none">
      <li
        key="arrowLeft"
        className={`pagination hover:bg-violet-300 hover:cursor-pointer ${
          currentPage === 1 ? 'pointer-events-none' : ''
        }`}
        onClick={onPrevious}>
        &laquo;
      </li>
      {paginationRange.map((pageNo) => {
        if (typeof pageNo === 'string' && pageNo === DOTS) {
          return (
            <li key="dots" className={`pagination hover:cursor-default`}>
              &#8230;
            </li>
          );
        }
        const selected = pageNo === currentPage;

        return (
          <li
            tabIndex={0}
            key={pageNo}
            className={`pagination  hover:cursor-pointer ${
              selected ? 'bg-violet-500 text-white' : 'hover:bg-violet-300'
            }`}
            onClick={() => onPageChange(pageNo as number)}>
            {pageNo}
          </li>
        );
      })}
      <li
        key="arrowRight"
        className={`pagination hover:bg-violet-300 hover:cursor-pointer ${
          currentPage === lastPage ? 'pointer-events-none' : ''
        }`}
        onClick={onNext}>
        &raquo;
      </li>
    </ul>
  );
};

export default Pagination;
