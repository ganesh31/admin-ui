import { useMemo } from 'react';

const range = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, index) => index + start);
};

export const DOTS = '...';

interface Props {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount,
  currentPage = 1,
}: Props): (string | number)[] | undefined => {
  const paginationRange = useMemo(() => {
    const FIRST_PAGE_INDEX = 1;
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const LAST_PAGE_INDEX = totalPageCount;

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount,
    );

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!showLeftDots && showRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (showLeftDots && !showRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount,
      );
      return [FIRST_PAGE_INDEX, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [FIRST_PAGE_INDEX, DOTS, ...middleRange, DOTS, LAST_PAGE_INDEX];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
