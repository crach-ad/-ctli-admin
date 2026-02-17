"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ensureLeafletCss } from "@/lib/leaflet-css";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

const MapInner = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const { MapContainer, TileLayer, Marker, Popup } = mod;

      function Inner({ latitude, longitude }: LocationMapProps) {
        return (
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="h-[300px] w-full rounded-md z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              <Popup>
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Popup>
            </Marker>
          </MapContainer>
        );
      }
      return Inner;
    }),
  { ssr: false, loading: () => <div className="h-[300px] w-full rounded-md bg-muted animate-pulse" /> }
);

export function LocationMap({ latitude, longitude }: LocationMapProps) {
  useEffect(() => { ensureLeafletCss(); }, []);
  return <MapInner latitude={latitude} longitude={longitude} />;
}
