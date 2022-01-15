import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const Cell = (props: Props) => {
  return (
    <td className='text-center'>{props.children}</td>
  )
}

export default Cell
