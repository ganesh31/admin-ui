import React from 'react';

interface Props {
  header?: boolean;
  children: React.ReactNode;
  sticky?: boolean;
}

const Cell: React.FC<Props> = (props: Props) => {
  const Component = props.header ? 'th' : 'td';

  return (
    <Component
      className={`text-left p-4 min-w-full ${
        props.header ? 'font-extrabold' : 'text-slate-900'
      } ${
        props.sticky ? 'sticky w-24 max-w-24 min-w-24 left-0 bg-white' : ''
      }`}>
      {props.children}
    </Component>
  );
};

export default Cell;
