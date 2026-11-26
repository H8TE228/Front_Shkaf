import type { ICoordinates } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getCityFromCoordinates({
  longitude,
  latitude,
}: ICoordinates): Promise<string | null> {
  const key = import.meta.env.VITE_YANDEX_MAPS_API_KEY_GEOCODER?.trim();
  if (!key) return null;

  const params = new URLSearchParams({
    apikey: key,
    geocode: `${longitude},${latitude}`,
    lang: "ru_RU",
    format: "json",
    kind: "locality",
    results: "1",
  });

  const response = await fetch(`https://geocode-maps.yandex.ru/v1/?${params}`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Ошибка геокодера: ${response.status}`);
  }

  const data: any = await response.json();

  const components =
    data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject
      ?.metaDataProperty?.GeocoderMetaData?.Address?.Components;

  return (
    components?.find((component: any) => component.kind === "locality")?.name ??
    null
  );
}
