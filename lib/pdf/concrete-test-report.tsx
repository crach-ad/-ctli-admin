import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { ReportHeader } from "./report-header";
import type { ConcreteTestSubform } from "@/lib/types";

interface Props {
  record: ConcreteTestSubform;
}

export function ConcreteTestReport({ record }: Props) {
  const fields = [
    { label: "Location", value: record.structurepourlocation2 },
    { label: "Cast Date", value: record.castdate ? new Date(record.castdate).toLocaleDateString() : "—" },
    { label: "Test Date", value: record.testdate ? new Date(record.testdate).toLocaleDateString() : "—" },
    { label: "Age (days)", value: record.ageofcylinder },
    { label: "Slump (in)", value: record.slumpin },
    { label: "Truck No", value: record.truckno },
    { label: "Cross Section Area", value: record.crosssecareascylin },
    { label: "Cylinder Size", value: record.typecylindersize },
    { label: "Weight", value: record.weightcylinder },
    { label: "Density", value: record.densitycylinder },
    { label: "Max Load (lbs)", value: record.maxload_lbs },
    { label: "Compressive Strength (PSI)", value: record.compressivestrength_psi },
    { label: "Type of Break", value: record.typebreak },
    { label: "Mix Design 28 Days", value: record.mixdesign28days },
    { label: "Supplier", value: record.concretesupplier },
    { label: "Recorder", value: record.datasheet_recorder },
    { label: "Gridline Location", value: record.gridline_location },
    { label: "Casted By", value: record.cylinders_casted_by },
    { label: "Area", value: record.area },
  ];

  const castFields = [
    { label: "Cast 7 Day", value: record.cast7day },
    { label: "Cast 14 Day", value: record.cast14day },
    { label: "Cast 28 Day", value: record.cast28day },
    { label: "Cast 56 Day", value: record.cast56day },
  ];

  const strength = parseFloat(record.compressivestrength_psi ?? "0");
  const design = parseFloat(record.mixdesign28days ?? "0");
  const passFail = design > 0 ? (strength >= design ? "PASS" : "FAIL") : "N/A";

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <ReportHeader
          title="Test Break Report"
          project={record.projectname}
          date={record.testdate}
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

        <Text style={pdfStyles.sectionTitle}>Strength Results</Text>
        <View style={pdfStyles.fieldGrid}>
          {castFields.map((f) => (
            <View key={f.label} style={pdfStyles.fieldItem}>
              <Text style={pdfStyles.fieldLabel}>{f.label}:</Text>
              <Text style={pdfStyles.fieldValue}>{String(f.value ?? "—")}</Text>
            </View>
          ))}
          <View style={pdfStyles.fieldItem}>
            <Text style={pdfStyles.fieldLabel}>Result:</Text>
            <Text style={pdfStyles.fieldValue}>{passFail}</Text>
          </View>
        </View>

        <Text style={pdfStyles.footer}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </Page>
    </Document>
  );
}
