import React, { ChangeEvent } from 'react';

interface Props {
  placeholder?: string;
  name: string;
  value: string;
  autoFocus?: boolean;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Textfield = (props: Props) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    props.onChange(event);
  };

  return (
    <div className="relative w-full flex justify-center items-center space-x-1">
      <input
        type="text"
        className={`peer w-full rounded-md placeholder-transparent border-slate-300 outline-none focus:border-violet-500 focus:ring-violet-500`}
        placeholder={props.placeholder}
        value={props.value}
        onChange={handleChange}
        name={props.name}
        id={props.name}
      />

      <label
        className={`absolute left-0 -top-6 text-slate-700 text-sm font-semibold transition-all peer-placeholder-shown:font-normal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-2 peer-placeholder-shown:left-3 peer-focus:left-0 peer-focus:-top-6 peer-focus:text-slate-700 peer-focus:text-sm peer-focus:font-semibold`}
        htmlFor={props.name}>
        {props.placeholder}
      </label>
    </div>
  );
};

export default Textfield;
