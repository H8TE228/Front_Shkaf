import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function LocationButton() {
  // думаю надо добавить сохранение координат в localStorage, чтобы при перезагрузке страницы не терялись данные
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  function handleGetLocation() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoords({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log(
          `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`,
        );
      },
      (error) => {
        console.error(error.message);
      },
    );
  }

  return (
    <div>
      <Button
        onClick={handleGetLocation}
        type="button"
        className="text-foreground hidden h-10 shrink-0 cursor-pointer items-center justify-start gap-2 rounded-xl bg-transparent px-4 text-sm hover:bg-transparent lg:flex"
      >
        <MapPin className="size-6" />
        {coords
          ? `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`
          : "Москва"}
      </Button>
    </div>
  );
}
