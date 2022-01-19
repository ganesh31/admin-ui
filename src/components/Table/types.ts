export interface TableColumn {
  id: string;
  value: string;
  needSearch?: boolean;
  isEditable?: boolean;
}

export interface TableCell {
  id: string;
  value: string;
  colId?: string;
}

export interface TableRow {
  id: string;
  cells: TableCell[]
}