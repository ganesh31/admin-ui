import React, { ChangeEvent } from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
  placeholder?: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onHideSearchBar?: () => void;
  onFocus?: () => void;
  showClose?: boolean;
}

const SearchBar = (props: Props) => {
  return (
    <div className="flex w-full items-center">
      <input
        type="text"
        className="w-full border-b-2 rounded-sm border-gray-400 outline-none focus:border-violet-500 placeholder:pl-1"
        autoFocus
        placeholder={props.placeholder}
        onChange={props.onChange}
        name={props.name}
        onFocus={props.onFocus}
      />
      {props.showClose && (
        <MdClose className="text-xl" onClick={props.onHideSearchBar} />
      )}
    </div>
  );
};

export default SearchBar;
