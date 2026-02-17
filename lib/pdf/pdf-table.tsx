import { View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";

interface PdfTableColumn {
  key: string;
  label: string;
  width?: number;
}

interface PdfTableProps {
  columns: PdfTableColumn[];
  rows: Record<string, any>[];
}

export function PdfTable({ columns, rows }: PdfTableProps) {
  return (
    <View style={pdfStyles.table}>
      <View style={pdfStyles.tableHeaderRow}>
        {columns.map((col) => (
          <Text
            key={col.key}
            style={[pdfStyles.tableCellHeader, col.width ? { width: col.width, flex: 0 } : {}]}
          >
            {col.label}
          </Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={pdfStyles.tableRow}>
          {columns.map((col) => (
            <Text
              key={col.key}
              style={[pdfStyles.tableCell, col.width ? { width: col.width, flex: 0 } : {}]}
            >
              {String(row[col.key] ?? "")}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
