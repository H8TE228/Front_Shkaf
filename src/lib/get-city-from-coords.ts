import type { ICoordinates } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getCityFromCoordinates({
  longitude,
  latitude,
}: ICoordinates): Promise<string | null> {
  const params = new URLSearchParams({
    apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY_GEOCODER,
    geocode: `${longitude},${latitude}`,
    format: "json",
    results: "1",
  });

  const response = await fetch(`https://geocode-maps.yandex.ru/v1/?${params}`);

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
