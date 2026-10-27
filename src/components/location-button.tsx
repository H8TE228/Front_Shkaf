import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { getCityFromCoordinates } from "@/lib";
import { STORAGE_KEY_LOCATION } from "@/constants";

interface ILocationData {
  latitude: number;
  longitude: number;
  city: string;
}

export function LocationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<ILocationData | null>(() => {
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
      console.error("Геолокация не поддерживается браузером");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;

          const city = await getCityFromCoordinates({
            latitude,
            longitude,
          });

          const newLocation: ILocationData = {
            latitude,
            longitude,
            city: city ?? "Неизвестный город",
          };

          setLocation(newLocation);
          localStorage.setItem(
            STORAGE_KEY_LOCATION,
            JSON.stringify(newLocation),
          );
        } catch (error) {
          console.error("Не удалось определить город:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Не удалось получить геолокацию:", error.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  return (
    <div>
      <Button
        onClick={handleGetLocation}
        type="button"
        disabled={isLoading}
        className="text-foreground hover:text-foreground/80 hidden h-10 shrink-0 cursor-pointer items-center justify-start gap-2 rounded-xl bg-transparent px-4 text-sm hover:bg-transparent lg:flex"
      >
        <MapPin className="size-6" />
        {isLoading
          ? "Определяем..."
          : location
            ? location.city
            : "Определить город"}
      </Button>
    </div>
  );
}
