import { STORAGE_KEY_LOCATION } from "@/constants";
import type { ICoordinates } from "@/types";

export function getSavedCoordinates() {
  try {
    const savedLocation = localStorage.getItem(STORAGE_KEY_LOCATION);

    if (!savedLocation) {
      return null;
    }

    const { longitude, latitude } = JSON.parse(savedLocation) as ICoordinates;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null;
    }

    return [longitude, latitude];
  } catch (error) {
    console.error("Не удалось прочитать сохранённую геопозицию:", error);
    return null;
  }
}
