import { lazy, Suspense } from "react";
import type { Station } from "@/lib/canvive/data";
import "leaflet/dist/leaflet.css";

const StationMapClient = lazy(() => import("./StationMapClient").then((module) => ({ default: module.StationMapClient })));

type StationMapProps = {
  stations: Station[];
  search: string;
  onSearchChange: (value: string) => void;
  focusStation?: Station;
};

export function StationMap(props: StationMapProps) {
  return (
    <Suspense fallback={<div className="card-soft mb-8 h-[390px] animate-pulse bg-sage-soft sm:h-[520px]" aria-label="Loading station map" />}>
      <StationMapClient {...props} />
    </Suspense>
  );
}
