import React from 'react';
import Table from './components';
import { TableColumn, TableRow } from './components/Table/types';

function App() {
  const rowList: TableRow[] = [
    {
      id: "1",
      cells: [{
        id: "1",
        value: "Cell11"
      },
      {
        id: "2",
        value: "Cell12"
      },
      {
        id: "3",
        value: "Cell13"
      },
      {
        id: "4",
        value: "Cell14"
      }]
    },
    {
      id: "2",
      cells: [{
        id: "1",
        value: "Cell21"
      },
      {
        id: "2",
        value: "Cell22"
      },
      {
        id: "3",
        value: "Cell23"
      },
      {
        id: "4",
        value: "Cell24"
      }]
    },
    {
      id: "3",
      cells: [{
        id: "1",
        value: "Cell31"
      },
      {
        id: "2",
        value: "Cell32"
      },
      {
        id: "3",
        value: "Cell33"
      },
      {
        id: "4",
        value: "Cell34"
      }]
    },
    {
      id: "4",
      cells: [{
        id: "1",
        value: "Cell41"
      },
      {
        id: "2",
        value: "Cell42"
      },
      {
        id: "3",
        value: "Cell43"
      },
      {
        id: "4",
        value: "Cell44"
      }]
    }
  ];
  const colList: TableColumn[] = [
    { id: "1", value: "Col1"},
    { id: "2", value: "Col2"},
    { id: "3", value: "Col3"},
    { id: "4", value: "Col4"},
  ];
  return (
    <Table columns={colList} rows={rowList} />
  );
}

export default App;
