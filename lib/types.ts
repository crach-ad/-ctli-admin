export type UserRole = "admin" | "field_inspector" | "lab_technician" | "viewer";

export interface UserRoleRow {
  id: number;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface ConcreteField {
  id: number;
  projectname: string | null;
  fieldinspectiondate: string | null;
  structurepourlocation2: string | null;
  gridlinesa: string | null;
  gridlines1: string | null;
  datasheetno: string | null;
  concretestrength_slump: string | null;
  psi: string | null;
  ins: string | null;
  remarks: string | null;
  concretesupplier: string | null;
  spc_yds: number | null;
  act_yds: number | null;
  datasheet_recorder: string | null;
  timeonsite: string | null;
  timepourfinished: string | null;
  airtemp_f: string | null;
  unitweight_lbs_ft: string | null;
  structurepourlocationother: string | null;
  entry_date: string | null;
  created_by?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ConcreteFieldSubform {
  id: number | null;
  deliverytime: string | null;
  truckno: string | null;
  ticketno: string | null;
  yards_per_truck: string | null;
  trucksequence: string | null;
  w_cratio: string | null;
  slumpin: string | null;
  conctemp_f: string | null;
  cylno: number | null;
  cylsize: string | null;
  entry_date: string | null;
}

export interface ConcreteTestSubform {
  id: number;
  projectname: string | null;
  structurepourlocation2: string | null;
  ageofcylinder: number | null;
  castdate: string | null;
  testdate: string | null;
  slumpin: string | null;
  truckno: string | null;
  crosssecareascylin: string | null;
  typecylindersize: string | null;
  weightcylinder: string | null;
  densitycylinder: string | null;
  maxload_lbs: string | null;
  compressivestrength_psi: string | null;
  typebreak: string | null;
  mixdesign28days: string | null;
  concretesupplier: string | null;
  cast7day: string | null;
  cast14day: string | null;
  cast28day: string | null;
  cast56day: string | null;
  structurepourlocationother: string | null;
  datasheet_recorder: string | null;
  gridline_location: string | null;
  cylinders_casted_by: string | null;
  castdate36h: string | null;
  castdate24h: string | null;
  castdate48: string | null;
  area: string | null;
  entry_date: string | null;
  test_mode: boolean | null;
  created_by?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface NuclearDensity {
  id: number;
  projectname: string;
  structurepourlocation2: string | null;
  fieldinspectiondate: string | null;
  timeonsite: string | null;
  weatherpresentday: string | null;
  weatherpreviousday: string | null;
  client_representative: string | null;
  datasheet_recorder: string | null;
  trench: boolean | null;
  road: boolean | null;
  foundation: boolean | null;
  proctor: string | null;
  moisture: string | null;
  comppass: boolean | null;
  compfail: boolean | null;
  moisturepass: boolean | null;
  moisturefail: boolean | null;
  sketch: string | null;
  entry_date: string | null;
  created_by?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface NuclearDensitySubform {
  id: number | null;
  testno: string | null;
  wd: string | null;
  dd: string | null;
  m: string | null;
  m_pct: string | null;
  compaction_pct: string | null;
  depth: string | null;
}

export interface ProjectName {
  projectname: string;
}

// All lookup table names for the admin lookup management page
export const LOOKUP_TABLES = [
  { name: "concretestrengthslump", column: "concretestrengthslump", label: "Concrete Strength/Slump" },
  { name: "cross_sectional", column: "cross_sectional", label: "Cross Sectional Area" },
  { name: "cylage", column: "cylage", label: "Cylinder Age" },
  { name: "cylcastedby", column: "cylcastedby", label: "Cylinders Casted By" },
  { name: "cylno", column: "cylno", label: "Cylinder Number" },
  { name: "cylsize", column: "cylsize", label: "Cylinder Size" },
  { name: "cyltype", column: "cyltype", label: "Cylinder Type" },
  { name: "cylweight", column: "cylweight", label: "Cylinder Weight" },
  { name: "datasheetrecorder", column: "datasheetrecorder", label: "Datasheet Recorder" },
  { name: "datasheet", column: "datasheet", label: "Datasheet" },
  { name: "gridline1", column: "gridline1", label: "Gridline 1" },
  { name: "gridlinea", column: "gridlinesa", label: "Gridline A" },
  { name: "ins", column: "ins", label: "INS" },
  { name: "mixdesign28days", column: "mixdesign28days", label: "Mix Design 28 Days" },
  { name: "psi", column: "psi", label: "PSI" },
  { name: "readymixcompany", column: "readymixcompany", label: "Ready Mix Company" },
  { name: "slump", column: "slump", label: "Slump" },
  { name: "structurepourlocation2", column: "structurepourlocation2", label: "Structure/Pour Location" },
  { name: "testno", column: "testno", label: "Test Number" },
  { name: "trucksequence", column: "trucksequence", label: "Truck Sequence" },
  { name: "typebreak", column: "typebreak", label: "Type of Break" },
  { name: "weather", column: "weather", label: "Weather" },
  { name: "ydspertruck", column: "ydspertruck", label: "Yards per Truck" },
] as const;

export type LookupTableDef = (typeof LOOKUP_TABLES)[number];

export interface CalendarEvent {
  id: number;
  projectname: string | null;
  castdate: string | null;
  testdate: string | null;
  ageofcylinder: number | null;
  compressivestrength_psi: string | null;
  status: "upcoming" | "overdue" | "completed";
}

export interface FilterState {
  project: string;
  dateFrom: string;
  dateTo: string;
}
