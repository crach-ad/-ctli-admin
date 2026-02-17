import { View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";

interface ReportHeaderProps {
  title: string;
  project?: string | null;
  date?: string | null;
  recordId?: number;
}

export function ReportHeader({ title, project, date, recordId }: ReportHeaderProps) {
  return (
    <View style={pdfStyles.header}>
      <Text style={pdfStyles.companyName}>CTLI</Text>
      <Text style={pdfStyles.reportTitle}>{title}</Text>
      {project && (
        <View style={pdfStyles.headerRow}>
          <Text style={pdfStyles.headerLabel}>Project:</Text>
          <Text style={pdfStyles.headerValue}>{project}</Text>
        </View>
      )}
      {date && (
        <View style={pdfStyles.headerRow}>
          <Text style={pdfStyles.headerLabel}>Date:</Text>
          <Text style={pdfStyles.headerValue}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </View>
      )}
      {recordId !== undefined && (
        <View style={pdfStyles.headerRow}>
          <Text style={pdfStyles.headerLabel}>Record #:</Text>
          <Text style={pdfStyles.headerValue}>{recordId}</Text>
        </View>
      )}
    </View>
  );
}
