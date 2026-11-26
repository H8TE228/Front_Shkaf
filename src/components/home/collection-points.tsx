import { useEffect, useState } from "react";
import { useExchangePoints } from "@/hooks";
import { useYandexMaps } from "@/hooks/use-yandex-maps";
import { OpenStreetMap } from "../points/open-street-map";
import { getCurrentDay } from "@/lib";
import { getSavedCoordinates } from "@/lib/get-saved-coords";
import {
  defaultMapCenter,
  STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
} from "@/constants";
import type { TExchangePoint } from "@/types";

export function CollectionPoints() {
  const currentDay = getCurrentDay();
  const [center, setCenter] = useState<[number, number]>(
    () => (getSavedCoordinates() as [number, number] | null) ?? (defaultMapCenter as [number, number]),
  );
  const { data: exchangePoints } = useExchangePoints();

  useEffect(() => {
    const updateMapLocation = () => {
      const savedCoordinates = getSavedCoordinates();
      if (savedCoordinates) setCenter(savedCoordinates as [number, number]);
    };

    window.addEventListener(
      STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
      updateMapLocation,
    );

    return () => {
      window.removeEventListener(
        STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
        updateMapLocation,
      );
    };
  }, []);

  return (
    <section className="border-border bg-card mx-auto mt-16 grid h-auto w-full max-w-[1550px] grid-cols-1 overflow-hidden rounded-2xl border px-6 lg:h-90 lg:grid-cols-[7fr_5fr] lg:px-0">
      <div className="bg-secondary relative h-80 min-w-0 overflow-hidden shadow-lg lg:h-auto">
        <CollectionMap points={exchangePoints ?? []} center={center} />
      </div>

      <div className="bg-card min-w-0 pt-7 pr-6 pb-6 pl-0 lg:pl-6">
        <h2 className="mb-3 text-2xl leading-8 font-semibold tracking-tight">
          Пункты приёма
        </h2>

        <div className="h-66 space-y-2 overflow-y-auto pr-3">
          {exchangePoints?.map((point) => {
            const openingHours =
              point.opening_hours?.[
                currentDay as keyof typeof point.opening_hours
              ];
            const todayHours =
              openingHours?.map(({ from, to }) => `${from}–${to}`).join(", ") ||
              "выходной";

            return (
              <div
                className="border-border bg-muted min-h-32 rounded-xl border p-4"
                key={point.id}
              >
                <h3 className="text-base leading-6 font-semibold">
                  {point.title}
                </h3>

                <p className="text-muted-foreground mt-1 text-[13px] leading-5">
                  {point.address.country}, {point.address.city},{" "}
                  {point.address.street} {point.address.building}
                </p>

                <div className="mt-1 flex justify-between">
                  <p className="text-primary text-[13px] leading-5 font-medium">
                    Сегодня: {todayHours}
                  </p>
                  <p className="text-primary text-[13px] leading-5 font-medium">
                    Телефон:{" "}
                    <a
                      href={`tel:${point.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {point.phone}
                    </a>
                  </p>
                </div>

                <p className="text-muted-foreground mt-1 text-[13px] leading-5">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CollectionMap({
  points,
  center,
}: {
  points: TExchangePoint[];
  center: [number, number];
}) {
  const maps = useYandexMaps();

  if (maps === null) {
    return (
      <OpenStreetMap points={points} center={center} zoom={10} onSelect={openCollectionPointMap} />
    );
  }

  if (!maps) return null;

  return <CollectionMapView maps={maps} points={points} center={center} />;
}

function CollectionMapView({
  maps,
  points,
  center,
}: {
  maps: typeof import("@/lib/ymaps3");
  points: TExchangePoint[];
  center: [number, number];
}) {
  const location = maps.reactify.useDefault(
    { center, zoom: 10, duration: 500 },
    [center],
  );

  return (
    <maps.YMap location={location} className="size-full">
      <maps.YMapDefaultSchemeLayer />
      <maps.YMapDefaultFeaturesLayer />
      {points.map((point, index) => (
        <CollectionMarker
          key={point.id}
          maps={maps}
          point={point}
          index={index}
        />
      ))}
    </maps.YMap>
  );
}

function openCollectionPointMap(point: TExchangePoint) {
  const { longitude, latitude } = point.address;
  const url = new URL("https://yandex.ru/maps/");
  url.search = new URLSearchParams({ pt: `${longitude},${latitude}`, z: "16", l: "map" }).toString();
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function CollectionMarker({
  maps,
  point,
  index,
}: {
  maps: typeof import("@/lib/ymaps3");
  point: TExchangePoint;
  index: number;
}) {
  const { longitude, latitude } = point.address;

  return (
    <maps.YMapMarker
      coordinates={maps.reactify.useDefault([longitude, latitude])}
      onClick={() => openCollectionPointMap(point)}
    >
      <div
        className="bg-primary text-primary-foreground flex size-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#00ff15] text-sm font-semibold shadow-lg"
        title={`${point.title} — ${point.address.country}, ${point.address.city}, ${point.address.street} ${point.address.building}`}
      >
        {index + 1}
      </div>
    </maps.YMapMarker>
  );
}
