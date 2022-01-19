import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Cell: React.FC<Props> = (props: Props) => {
  return <td className="text-left p-4 min-w-full">{props.children}</td>;
};

export default Cell;
