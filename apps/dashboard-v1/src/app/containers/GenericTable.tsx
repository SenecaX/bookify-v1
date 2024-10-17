import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface GenericTableProps<T> {
  data: T[];
  columns: {
    header: string;
    key: keyof T;
    render?: (row: T) => React.ReactNode;
  }[]; // Added render function for custom rendering
}

const GenericTable = <T extends {}>({
  data,
  columns,
}: GenericTableProps<T>) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.header}>{column.header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key as string}>
                  {/* If render function is provided, use it */}
                  {column.render
                    ? column.render(row) // Pass the full row to the render function
                    : String(row[column.key]) || 'N/A'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
