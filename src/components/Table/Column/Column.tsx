import React from 'react'
import ColumnCell from '../ColumnCell/ColumnCell';
import { TableColumn } from '../types'

interface Props {
  columns: TableColumn[];
}

const Column = (props: Props) => {
  const renderCells = () => {
    return props.columns.map(({id, value}) => {
      return <ColumnCell key={id} >{value}</ColumnCell>
    });
  }
  return (
    <tr>{renderCells()}</tr>
  )
}

export default Column
