import { createContext, useContext } from 'react';
import { BehaviorSubject } from 'rxjs';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  selected?: boolean;
}

const memberList$ = new BehaviorSubject<Member[]>([]);

const selected$ = new BehaviorSubject<string[]>([]);
const searchString$ = new BehaviorSubject<string>('');

const MemberContext = createContext({
  memberList$,
  selected$,
  searchString$,
});

export const useMember = () => useContext(MemberContext);

export const MemberProvider: React.FunctionComponent = ({ children }) => (
  <MemberContext.Provider
    value={{
      memberList$,
      selected$,
      searchString$,
    }}>
    {children}
  </MemberContext.Provider>
);
