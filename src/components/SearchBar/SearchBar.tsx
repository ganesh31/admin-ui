import React, { ChangeEvent } from 'react';
import { MdClose } from 'react-icons/md';
import Textfield from '../Textfield';

interface Props {
  placeholder?: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose?: () => void;
  showClose?: boolean;
}

const SearchBar: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex w-full justify-center items-center relative">
      <Textfield
        autoFocus
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        name={props.name}
      />

      {props.showClose && (
        <MdClose
          tabIndex={0}
          className="text-2xl absolute right-2 focus:outline-none focus:ring rounded focus:ring-offset focus:ring-violet-400"
          onClick={props.onClose}
        />
      )}
    </div>
  );
};

export default SearchBar;
