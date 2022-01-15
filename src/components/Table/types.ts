export interface TableColumn {
  id: string;
  value: string;
}

export interface TableCell {
  id: string;
  value: string;
  colId?: number;
}

export interface TableRow {
  id: string;
  cells: TableCell[]
}