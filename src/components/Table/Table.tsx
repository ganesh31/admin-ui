import React from 'react'
import Column from './Column/Column'
import Row from './Row/Row'
import { TableColumn, TableRow } from './types'

interface Props {
  columns: TableColumn[]
  rows: TableRow[]
}

const Table = (props: Props) => {
  const renderRows = () => {
    return props.rows.map(({id, cells}) => {
      return (
        <Row key={id} cells={cells} />
      )
    })
  }
  return (
    <main className='m-52'>
    <table className="w-10/12 shadow-sm shadow-slate-500">
      <Column columns={props.columns} />
      {renderRows()}
    </table>
    </main>
  )
}

export default Table
