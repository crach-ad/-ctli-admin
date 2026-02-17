"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ensureLeafletCss } from "@/lib/leaflet-css";

interface MapRecord {
  id: number;
  latitude: number;
  longitude: number;
  projectname: string | null;
  date: string | null;
  type: "field" | "test" | "density";
}

const MapInner = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, CircleMarker, Popup } = mod;

      const colors = {
        field: "#f97316",   // orange
        test: "#3b82f6",    // blue
        density: "#a855f7", // purple
      };

      const labels = {
        field: "Field Inspection",
        test: "Concrete Test",
        density: "Nuclear Density",
      };

      const links = {
        field: "/concrete-field",
        test: "/concrete-tests",
        density: "/nuclear-density",
      };

      function Inner({ records }: { records: MapRecord[] }) {
        if (records.length === 0) return null;

        const avgLat = records.reduce((s, r) => s + r.latitude, 0) / records.length;
        const avgLng = records.reduce((s, r) => s + r.longitude, 0) / records.length;

        return (
          <MapContainer center={[avgLat, avgLng]} zoom={10} className="h-[400px] w-full rounded-md z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {records.map((r) => (
              <CircleMarker
                key={`${r.type}-${r.id}`}
                center={[r.latitude, r.longitude]}
                radius={8}
                pathOptions={{ color: colors[r.type], fillColor: colors[r.type], fillOpacity: 0.8 }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{labels[r.type]}</p>
                    <p>{r.projectname || "No project"}</p>
                    {r.date && <p>{new Date(r.date).toLocaleDateString()}</p>}
                    <a href={`${links[r.type]}/${r.id}`} className="text-blue-600 underline">
                      View details
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        );
      }
      return Inner;
    }),
  { ssr: false, loading: () => <div className="h-[400px] w-full rounded-md bg-muted animate-pulse" /> }
);

export function InspectionsMap() {
  const [records, setRecords] = useState<MapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => { ensureLeafletCss(); }, []);

  useEffect(() => {
    async function load() {
      const [field, tests, density] = await Promise.all([
        supabase
          .from("tblconcretefield")
          .select("id, latitude, longitude, projectname, fieldinspectiondate")
          .not("latitude", "is", null)
          .order("id", { ascending: false })
          .limit(50),
        supabase
          .from("tblconcretetestsubform")
          .select("id, latitude, longitude, projectname, testdate")
          .not("latitude", "is", null)
          .order("id", { ascending: false })
          .limit(50),
        supabase
          .from("tblnucleardensity")
          .select("id, latitude, longitude, projectname, fieldinspectiondate")
          .not("latitude", "is", null)
          .order("id", { ascending: false })
          .limit(50),
      ]);

      const all: MapRecord[] = [
        ...(field.data ?? []).map((r: any) => ({
          id: r.id,
          latitude: r.latitude,
          longitude: r.longitude,
          projectname: r.projectname,
          date: r.fieldinspectiondate,
          type: "field" as const,
        })),
        ...(tests.data ?? []).map((r: any) => ({
          id: r.id,
          latitude: r.latitude,
          longitude: r.longitude,
          projectname: r.projectname,
          date: r.testdate,
          type: "test" as const,
        })),
        ...(density.data ?? []).map((r: any) => ({
          id: r.id,
          latitude: r.latitude,
          longitude: r.longitude,
          projectname: r.projectname,
          date: r.fieldinspectiondate,
          type: "density" as const,
        })),
      ];

      setRecords(all);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Inspections Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Inspections Map</CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-orange-500" /> Field
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Test
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-purple-500" /> Density
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <MapInner records={records} />
      </CardContent>
    </Card>
  );
}
