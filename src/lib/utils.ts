export { cn } from "cn";

interface ICoordinates {
  latitude: number;
  longitude: number;
}

export async function getCityFromCoordinates({
  latitude,
  longitude,
}: ICoordinates): Promise<string | null> {
  const params = new URLSearchParams({
    apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY,
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
