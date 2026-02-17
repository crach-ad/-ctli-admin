"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { LOOKUP_TABLES, type LookupTableDef } from "@/lib/types";

interface LookupData {
  values: string[];
  loading: boolean;
}

export default function LookupsPage() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("admin");
  const supabase = createClient();

  const [selectedTable, setSelectedTable] = useState<LookupTableDef>(LOOKUP_TABLES[0]);
  const [data, setData] = useState<LookupData>({ values: [], loading: true });
  const [newValue, setNewValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadTable(table: LookupTableDef) {
    setData({ values: [], loading: true });
    const { data: rows } = await supabase
      .from(table.name)
      .select(table.column)
      .order(table.column);
    setData({
      values: (rows ?? []).map((r: any) => String(r[table.column] ?? "")),
      loading: false,
    });
  }

  useEffect(() => {
    loadTable(selectedTable);
  }, [selectedTable]);

  async function handleAdd() {
    if (!newValue.trim()) return;
    const { error } = await supabase
      .from(selectedTable.name)
      .insert({ [selectedTable.column]: newValue.trim() });
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    setNewValue("");
    setDialogOpen(false);
    loadTable(selectedTable);
  }

  async function handleDelete(value: string) {
    if (!confirm(`Delete "${value}" from ${selectedTable.label}?`)) return;
    const { error } = await supabase
      .from(selectedTable.name)
      .delete()
      .eq(selectedTable.column, value);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    loadTable(selectedTable);
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">
          You need admin access to manage lookup tables.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Lookup Tables</h1>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tables</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-0.5">
              {LOOKUP_TABLES.map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                    selectedTable.name === table.name
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {table.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedTable.label}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Table: <code>{selectedTable.name}</code>
                <Badge variant="secondary" className="ml-2">
                  {data.values.length} values
                </Badge>
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Value
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add to {selectedTable.label}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter new value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <Button onClick={handleAdd} className="w-full">
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {data.loading ? (
              <p className="text-muted-foreground py-4">Loading...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{selectedTable.column}</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.values.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center text-muted-foreground py-8"
                        >
                          No values found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.values.map((value, i) => (
                        <TableRow key={i}>
                          <TableCell>{value}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(value)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
