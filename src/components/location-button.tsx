import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { getCityFromCoordinates } from "@/lib";
import {
  STORAGE_KEY_LOCATION,
  STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
} from "@/constants";
import type { TLocationData } from "@/types";

export function LocationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [location, setLocation] = useState<TLocationData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY_LOCATION);
      return null;
    }
  });

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocationError("Геолокация недоступна");
      return;
    }

    function saveLocation(next: TLocationData) {
      setLocation(next);
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_KEY_USER_LOCATION_UPDATED_EVENT));
    }

    setLocationError("");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const coordinates = {
            longitude: coords.longitude,
            latitude: coords.latitude,
          };
          saveLocation({ ...coordinates, city: "" });

          const city = await getCityFromCoordinates(coordinates);
          if (city) saveLocation({ ...coordinates, city });
        } catch (error) {
          console.warn(
            "Не удалось сохранить геопозицию или определить город:",
            error,
          );
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Разрешите геолокацию"
            : "Повторить определение",
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  const city = location?.city === "Неизвестный город" ? "" : location?.city;
  const locationLabel =
    city || (location ? "Геопозиция определена" : "Определить город");

  return (
    <div>
      <Button
        onClick={handleGetLocation}
        type="button"
        disabled={isLoading}
        className="text-foreground hover:text-foreground/80 h-10 shrink-0 cursor-pointer items-center justify-start gap-2 rounded-xl bg-transparent px-2 text-sm hover:bg-transparent sm:px-4 lg:flex"
      >
        <MapPin className="size-6" />
        <span aria-live="polite">
          {isLoading ? "Определяем..." : locationError || locationLabel}
        </span>
      </Button>
    </div>
  );
}
