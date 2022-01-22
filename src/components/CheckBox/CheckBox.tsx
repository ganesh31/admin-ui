import React from 'react';

interface Props {
  onClick: () => void;
  name: string;
  size?: 'lg' | 'sm';
  checked?: boolean;
}

const sizeChart = {
  default: '',
  lg: 'h-5 w-5',
  sm: 'h-3 w-3',
};

const CheckBox: React.FC<Props> = (props: Props) => {
  const { size = 'default' } = props;
  return (
    <div className="flex flex-col justify-start items-center relative">
      <input
        type="checkbox"
        className={`${sizeChart[size]} rounded border-slate-300 text-violet-500 focus:ring-violet-400`}
        id={props.name}
        name={props.name}
        checked={props.checked}
        onChange={props.onClick}
      />
      <label
        htmlFor={props.name}
        className="absolute cursor-pointer text-transparent">
        {props.name}
      </label>
    </div>
  );
};

export default CheckBox;
