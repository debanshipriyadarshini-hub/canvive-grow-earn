import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { LocateFixed, MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Station } from "@/lib/canvive/data";
import { cn } from "@/lib/utils";

const COLLEGE_CENTER: [number, number] = [18.4861, 73.8162];

const statusStyles = {
  Available: "bg-sage-soft text-primary-foreground",
  Busy: "bg-sun text-foreground",
  Offline: "bg-beige text-muted-foreground",
} as const;

const stationIcon = L.divIcon({
  className: "canvive-marker",
  html: '<span class="canvive-marker-dot"><span class="canvive-marker-leaf">+</span></span>',
  iconSize: [38, 46],
  iconAnchor: [19, 42],
  popupAnchor: [0, -42],
});

const userHereIcon = L.divIcon({
  className: "canvive-user-marker",
  html: `
    <div class="you-are-here-wrapper">
      <div class="you-are-here-bubble">You are here</div>
      <div class="you-are-here-pin">
        <div class="you-are-here-head"></div>
        <div class="you-are-here-body"></div>
      </div>
    </div>
  `,
  iconSize: [84, 72],
  iconAnchor: [42, 60],
  popupAnchor: [0, -60],
});

function MapFocus({ station }: { station?: Station }) {
  const map = useMap();

  useEffect(() => {
    if (station) {
      map.flyTo([station.latitude, station.longitude], 17, { duration: 0.7 });
      return;
    }

    map.setView(COLLEGE_CENTER, 16, { animate: true });
  }, [map, station]);

  return null;
}

type StationMapProps = {
  stations: Station[];
  search: string;
  onSearchChange: (value: string) => void;
  focusStation?: Station | undefined;
};

export function StationMapClient({ stations, search, onSearchChange, focusStation }: StationMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(COLLEGE_CENTER);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [openStationId, setOpenStationId] = useState<string | null>(null);
  const matchingStations = useMemo(() => stations, [stations]);

  useEffect(() => {
    setOpenStationId(focusStation?.id ?? null);
  }, [focusStation]);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not available in this browser.");
      setUserLocation(COLLEGE_CENTER);
      return;
    }

    setLocating(true);
    setLocationMessage("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const fallbackLocation: [number, number] = [18.4861, 73.8162];
        const campusRadiusKm = 1.2;
        const distanceKm = Math.sqrt(
          (coords.latitude - COLLEGE_CENTER[0]) ** 2 + (coords.longitude - COLLEGE_CENTER[1]) ** 2,
        ) * 111.32;
        setUserLocation(distanceKm <= campusRadiusKm ? [coords.latitude, coords.longitude] : fallbackLocation);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setUserLocation(COLLEGE_CENTER);
        setLocationMessage("Using the campus demo location for this prototype map.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section aria-label="CanVive station locator" className="mb-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <span className="sr-only">Search CanVive stations</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search CanVive stations..."
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/30"
          />
        </label>
        <Button variant="outline" onClick={useMyLocation} disabled={locating}>
          <LocateFixed aria-hidden />
          {locating ? "Locating..." : "Use My Location"}
        </Button>
      </div>

      <div className="card-soft overflow-hidden p-2">
        <MapContainer center={COLLEGE_CENTER} zoom={16} scrollWheelZoom className="canvive-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFocus station={focusStation} />
          {matchingStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={stationIcon}
              eventHandlers={{ click: () => setOpenStationId(station.id) }}
            >
              <Popup autoPan open={openStationId === station.id}>
                <div className="canvive-popup">
                  <p className="font-display text-lg font-semibold">{station.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{station.type}</p>
                  <span className={cn("mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[station.mapStatus])}>
                    <span aria-hidden className="mr-1">{station.mapStatus === "Offline" ? "○" : "●"}</span>
                    {station.mapStatus}
                  </span>
                  <a
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-foreground underline-offset-4 hover:underline"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="h-3.5 w-3.5" aria-hidden /> Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
          {userLocation && (
            <Marker position={userLocation} icon={userHereIcon} zIndexOffset={1000}>
              <Popup>You are here</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span><MapPin className="mr-1 inline h-3.5 w-3.5 text-sage" aria-hidden />Centered on Cummins College of Engineering for Women, Pune</span>
        {locationMessage && <span role="status">{locationMessage}</span>}
      </div>
    </section>
  );
}
