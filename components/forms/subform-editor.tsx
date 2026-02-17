"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface ColumnDef {
  key: string;
  label: string;
  type?: string;
}

interface SubformEditorProps<T extends Record<string, any>> {
  rows: T[];
  columns: ColumnDef[];
  onAdd: (row: Record<string, string>) => void;
  onDelete: (index: number) => void;
  title: string;
}

export function SubformEditor<T extends Record<string, any>>({
  rows,
  columns,
  onAdd,
  onDelete,
  title,
}: SubformEditorProps<T>) {
  const emptyRow = Object.fromEntries(columns.map((c) => [c.key, ""]));
  const [newRow, setNewRow] = useState<Record<string, string>>(emptyRow);

  function handleAdd() {
    onAdd(newRow);
    setNewRow({ ...emptyRow });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{String(row[col.key] ?? "")}</TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <Input
                    type={col.type ?? "text"}
                    value={newRow[col.key]}
                    onChange={(e) => setNewRow((prev) => ({ ...prev, [col.key]: e.target.value }))}
                    placeholder={col.label}
                    className="h-8 text-sm"
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button variant="ghost" size="icon" onClick={handleAdd}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
