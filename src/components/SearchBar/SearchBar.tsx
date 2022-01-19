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
    <div className="relative flex justify-center items-center space-x-1">
      <input
        type="text"
        className="peer w-full rounded-lg placeholder-transparent border-gray-300 outline-none focus:border-violet-500 focus:ring-violet-500"
        autoFocus
        placeholder={props.placeholder}
        onChange={props.onChange}
        name={props.name}
        id={props.name}
        onFocus={props.onFocus}
      />
      <label
        className="absolute transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:left-0 peer-focus:-top-6 peer-focus:text-gray-700 peer-focus:text-sm peer-focus:font-semibold"
        htmlFor={props.name}>
        {props.placeholder}
      </label>
      {props.showClose && (
        <MdClose className="text-2xl" onClick={props.onHideSearchBar} />
      )}
    </div>
  );
};

export default SearchBar;
