import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { ReportHeader } from "./report-header";
import { PdfTable } from "./pdf-table";
import type { ConcreteField, ConcreteFieldSubform } from "@/lib/types";

const truckColumns = [
  { key: "truckno", label: "Truck No" },
  { key: "ticketno", label: "Ticket No" },
  { key: "deliverytime", label: "Delivery Time" },
  { key: "yards_per_truck", label: "Yards" },
  { key: "trucksequence", label: "Sequence" },
  { key: "slumpin", label: "Slump (in)" },
  { key: "conctemp_f", label: "Temp (F)" },
  { key: "cylno", label: "Cyl No" },
  { key: "cylsize", label: "Cyl Size" },
];

interface Props {
  record: ConcreteField;
  subforms: ConcreteFieldSubform[];
}

export function ConcreteFieldReport({ record, subforms }: Props) {
  const fields = [
    { label: "Location", value: record.structurepourlocation2 },
    { label: "Supplier", value: record.concretesupplier },
    { label: "Datasheet No", value: record.datasheetno },
    { label: "Recorder", value: record.datasheet_recorder },
    { label: "Strength/Slump", value: record.concretestrength_slump },
    { label: "PSI", value: record.psi },
    { label: "INS", value: record.ins },
    { label: "Specified Yards", value: record.spc_yds },
    { label: "Actual Yards", value: record.act_yds },
    { label: "Time on Site", value: record.timeonsite },
    { label: "Pour Finished", value: record.timepourfinished },
    { label: "Air Temp (F)", value: record.airtemp_f },
    { label: "Unit Weight", value: record.unitweight_lbs_ft },
  ];

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <ReportHeader
          title="Field Inspection Datasheet"
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

        {record.remarks && (
          <View style={{ marginTop: 8 }}>
            <Text style={pdfStyles.fieldLabel}>Remarks:</Text>
            <Text>{record.remarks}</Text>
          </View>
        )}

        <Text style={pdfStyles.sectionTitle}>
          Truck Deliveries ({subforms.length})
        </Text>
        <PdfTable columns={truckColumns} rows={subforms} />

        <Text style={pdfStyles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
