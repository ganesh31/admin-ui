export interface TableColumn {
  id: string;
  value: string | React.ReactNode;
  columnMapping?: string;
  sticky?: boolean;
}

export interface TableCell {
  id: string;
  value: string | React.ReactNode;
  columnMapping?: string;
  sticky?: boolean;
}

export interface TableRow {
  id: string;
  cells: TableCell[];
  selected?: boolean;
}
