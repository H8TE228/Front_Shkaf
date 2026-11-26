import { useEffect, useRef, useState } from "react";
import {
  circleMarker,
  divIcon,
  layerGroup,
  map,
  marker,
  tileLayer,
} from "leaflet";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { TExchangePoint } from "@/types";
import "leaflet/dist/leaflet.css";

type OpenStreetMapProps = {
  points: TExchangePoint[];
  center: [number, number];
  zoom: number;
  userLocation?: [number, number] | null;
  selectedId?: number;
  onSelect?: (point: TExchangePoint) => void;
};

const tileUrl =
  import.meta.env.VITE_OSM_TILE_URL?.trim() ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export function OpenStreetMap({
  points,
  center: [longitude, latitude],
  zoom,
  userLocation,
  selectedId,
  onSelect,
}: OpenStreetMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const liveMap = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    const instance = map(element, { scrollWheelZoom: false });
    const tiles = tileLayer(tileUrl, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    let hasTiles = false;
    tiles.on("tileload", () => {
      hasTiles = true;
      setTilesUnavailable(false);
    });
    tiles.on("tileerror", () => {
      if (!hasTiles) setTilesUnavailable(true);
    });
    tiles.addTo(instance);
    markers.current = layerGroup().addTo(instance);
    liveMap.current = instance;

    const observer = new ResizeObserver(() => instance.invalidateSize());
    observer.observe(element);
    return () => {
      observer.disconnect();
      tiles.off();
      instance.remove();
      liveMap.current = null;
      markers.current = null;
    };
  }, []);

  useEffect(() => {
    liveMap.current?.setView([latitude, longitude], zoom);
  }, [latitude, longitude, zoom]);

  useEffect(() => {
    const layer = markers.current;
    if (!layer) return;

    layer.clearLayers();
    for (const point of points) {
      const { latitude, longitude } = point.address;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;

      const selected = point.id === selectedId;
      const label = document.createElement("span");
      label.textContent = point.title;
      const pin = marker([latitude, longitude], {
        title: point.title,
        alt: point.title,
        keyboard: Boolean(onSelect),
        zIndexOffset: selected ? 100 : 0,
        icon: divIcon({
          className: `rounded-full border-2 border-white shadow-md ${
            selected
              ? "bg-primary"
              : point.status === "active"
                ? "bg-teal-700"
                : "bg-slate-500"
          }`,
          iconSize: selected ? [22, 22] : [17, 17],
        }),
      }).bindTooltip(label);
      if (onSelect) pin.on("click", () => onSelect(point));
      pin.addTo(layer);
    }

    if (userLocation) {
      const [longitude, latitude] = userLocation;
      circleMarker([latitude, longitude], {
        radius: 7,
        color: "white",
        weight: 2,
        fillColor: "#2563eb",
        fillOpacity: 1,
      })
        .bindTooltip("Ваше местоположение")
        .addTo(layer);
    }
  }, [points, userLocation, selectedId, onSelect]);

  return (
    <div className="relative h-full min-h-42 w-full">
      <div
        ref={container}
        className="absolute inset-0 z-0"
        aria-label="Карта пунктов OpenStreetMap"
      />
      {tilesUnavailable && (
        <p
          role="status"
          className="bg-card text-muted-foreground pointer-events-none absolute top-2 left-1/2 m-0 -translate-x-1/2 rounded px-2 py-1 text-xs shadow"
        >
          Фон карты временно недоступен
        </p>
      )}
    </div>
  );
}
