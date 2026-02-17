import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 16,
    borderBottom: "1px solid #333",
    paddingBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  headerLabel: {
    width: 120,
    fontFamily: "Helvetica-Bold",
  },
  headerValue: {
    flex: 1,
  },
  table: {
    marginTop: 12,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderBottom: "1px solid #333",
    borderTop: "1px solid #333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5px solid #ccc",
  },
  tableCell: {
    padding: 4,
    flex: 1,
    borderRight: "0.5px solid #ccc",
  },
  tableCellHeader: {
    padding: 4,
    flex: 1,
    fontFamily: "Helvetica-Bold",
    borderRight: "0.5px solid #ccc",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
  },
  fieldGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fieldItem: {
    width: "50%",
    flexDirection: "row",
    marginBottom: 3,
  },
  fieldLabel: {
    width: 130,
    fontFamily: "Helvetica-Bold",
  },
  fieldValue: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});
