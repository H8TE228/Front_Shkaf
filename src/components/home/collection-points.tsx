import { useEffect, useState } from "react";
import {
  defaultMapCenter,
  STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
} from "@/constants";
import {
  reactify,
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} from "@/lib/ymaps3";
import { getSavedCoordinates } from "@/lib/get-saved-coords";
import { useExchangePoints } from "@/hooks";
import { getCurrentDay } from "@/lib";

export function CollectionPoints() {
  const currentDay = getCurrentDay();
  const [center, setCenter] = useState(
    () => getSavedCoordinates() ?? defaultMapCenter,
  );
  const { data: exchangePoints } = useExchangePoints();

  useEffect(() => {
    const updateMapLocation = () => {
      const savedCoordinates = getSavedCoordinates();

      if (savedCoordinates) {
        setCenter(savedCoordinates);
      }
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
        <YMap
          location={reactify.useDefault(
            {
              center,
              zoom: 10,
              duration: 500,
            },
            [center],
          )}
        >
          <YMapDefaultSchemeLayer />
          <YMapDefaultFeaturesLayer />

          {exchangePoints?.map((point, index) => {
            const { longitude, latitude } = point.address;
            const yandexMapsUrl = new URL("https://yandex.ru/maps/");
            yandexMapsUrl.searchParams.set("pt", `${longitude},${latitude}`);
            yandexMapsUrl.searchParams.set("z", "16");
            yandexMapsUrl.searchParams.set("l", "map");

            return (
              <YMapMarker
                onClick={() =>
                  window.open(
                    yandexMapsUrl.toString(),
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                key={point.id}
                coordinates={reactify.useDefault([longitude, latitude])}
              >
                <div
                  className="bg-primary text-primary-foreground flex size-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#00ff15] text-sm font-semibold shadow-lg"
                  title={`${point.title} — ${point.address.country}, ${point.address.city}, ${point.address.street} ${point.address.building}`}
                >
                  {index + 1}
                </div>
              </YMapMarker>
            );
          })}
        </YMap>
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
