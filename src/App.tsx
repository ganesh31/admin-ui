import { useObservableState } from 'observable-hooks';
import Footer from './containers/footer/Footer';
import MemberTable from './containers/members/MemberTable';
import { GlobalSearch } from './containers/search/GlobalSearch';
import { MemberProvider, useMember } from './store';

const App: React.FC = () => {
  const { memberList$ } = useMember();

  const memberList = useObservableState(memberList$, []);

  return (
    <MemberProvider>
      <main className="">
        <header className="py-4 text-center bg-slate-50 shadow-sm shadow-slate-100">
          <h1 className="text-2xl text-slate-800 font-bold">Admin Dashboard</h1>
        </header>
        <div className="m-6">
          <GlobalSearch />
          <MemberTable />
          {memberList.length !== 0 && <Footer />}
        </div>
      </main>
    </MemberProvider>
  );
};

export default App;
