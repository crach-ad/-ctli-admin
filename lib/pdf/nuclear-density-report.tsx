import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { ReportHeader } from "./report-header";
import { PdfTable } from "./pdf-table";
import type { NuclearDensity, NuclearDensitySubform } from "@/lib/types";

const readingColumns = [
  { key: "testno", label: "Test No" },
  { key: "wd", label: "WD" },
  { key: "dd", label: "DD" },
  { key: "m", label: "M" },
  { key: "m_pct", label: "M %" },
  { key: "compaction_pct", label: "Compaction %" },
  { key: "depth", label: "Depth" },
];

interface Props {
  record: NuclearDensity;
  subforms: NuclearDensitySubform[];
}

export function NuclearDensityReport({ record, subforms }: Props) {
  const fields = [
    { label: "Location", value: record.structurepourlocation2 },
    { label: "Time on Site", value: record.timeonsite },
    { label: "Weather (Present)", value: record.weatherpresentday },
    { label: "Weather (Previous)", value: record.weatherpreviousday },
    { label: "Client Rep", value: record.client_representative },
    { label: "Recorder", value: record.datasheet_recorder },
    { label: "Trench", value: record.trench ? "Yes" : "No" },
    { label: "Road", value: record.road ? "Yes" : "No" },
    { label: "Foundation", value: record.foundation ? "Yes" : "No" },
    { label: "Proctor", value: record.proctor },
    { label: "Moisture", value: record.moisture },
    { label: "Compaction", value: record.comppass ? "Pass" : record.compfail ? "Fail" : "—" },
    { label: "Moisture Result", value: record.moisturepass ? "Pass" : record.moisturefail ? "Fail" : "—" },
  ];

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <ReportHeader
          title="Nuclear Density Report"
          project={record.projectname}
          date={record.fieldinspectiondate}
          recordId={record.id}
        />

        <View style={pdfStyles.fieldGrid}>
          {fields.map((f) => (
            <View key={f.label} style={pdfStyles.fieldItem}>
              <Text style={pdfStyles.fieldLabel}>{f.label}:</Text>
              <Text style={pdfStyles.fieldValue}>{String(f.value ?? "—")}</Text>
            </View>
          ))}
        </View>

        <Text style={pdfStyles.sectionTitle}>
          Test Readings ({subforms.length})
        </Text>
        <PdfTable columns={readingColumns} rows={subforms} />

        <Text style={pdfStyles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
