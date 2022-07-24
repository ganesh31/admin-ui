import { useObservableState } from 'observable-hooks';
import { useMember } from '../../store';

const Footer = () => {
  const { selected$, memberList$ } = useMember();

  const selectedRows = useObservableState(selected$, []);
  const memberList = useObservableState(memberList$, []);

  const onDeleteSelected = () => {
    // deletedIds$.next(selectedRows);
    const memberListAfterDelete = memberList.filter(
      (member) => !selectedRows.includes(member.id),
    );

    memberList$.next(memberListAfterDelete);
    selected$.next([]);
  };
  return (
    <footer>
      <div className="flex py-3 space-x-5">
        <button className="btn btn-danger" onClick={onDeleteSelected}>
          {`Delete Selected ${
            selectedRows.length ? `(${selectedRows.length})` : ''
          }`}
        </button>
        {/* <Pagination
              currentPage={currentPage}
              totalCount={filteredRows.length}
              pageSize={PAGE_SIZE}
              onPageChange={onPageChange}
              siblingCount={2}
            /> */}
      </div>
    </footer>
  );
};

export default Footer;
