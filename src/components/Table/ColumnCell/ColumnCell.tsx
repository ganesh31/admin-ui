import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}


const ColumnCell = (props: Props) => {
  return (
    <th>{props.children}</th>
  )
}

export default ColumnCell
