import { useEffect, useState } from "react";

export function useYandexMaps() {
  const [maps, setMaps] = useState<typeof import("@/lib/ymaps3") | null>();

  useEffect(() => {
    let active = true;
    import("@/lib/ymaps3").then(
      (module) => {
        if (active) setMaps(module);
      },
      () => {
        if (active) setMaps(null);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return maps;
}
