import React from 'react'
import Cell from '../Cell/Cell'
import { TableCell } from '../types'

interface Props {
  cells: TableCell[];
}

const Row = ({cells}: Props) => {
  return (
    <tr className='shadow-sm shadow-slate-400'>{cells.map(({id, value}) => {
      return (
        <Cell key={id}>{value}</Cell>
      )
    })}</tr>
  )
}

export default Row
