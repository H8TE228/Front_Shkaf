import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useExchangePoints, useItemTypes } from "@/hooks";
import { getCurrentDay } from "@/lib";
import { getSavedCoordinates } from "@/lib/get-saved-coords";
import { STORAGE_KEY_LOCATION, STORAGE_KEY_USER_LOCATION_UPDATED_EVENT } from "@/constants";
import type { TExchangePoint, TExchangePointsQueryParams, TLocationData } from "@/types";

const formatLabels = {
  free: "Бесплатно",
  points: "За баллы",
  charity: "Благотворительность",
} as const;

const yekaterinburgCenter: [number, number] = [60.597465, 56.838011];

function readSavedCity() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
    if (!saved) return "";
    const data = JSON.parse(saved) as TLocationData;
    if (typeof data.city !== "string") return "";
    const city = data.city.trim();
    if (!city || city === "Неизвестный город") return "";
    return city;
  } catch {
    return "";
  }
}

function readSavedCenter(): [number, number] | null {
  const saved = getSavedCoordinates();
  return saved ? [saved[0], saved[1]] : null;
}

function todayHours(point: TExchangePoint) {
  const currentDay = getCurrentDay();
  const openingHours =
    point.opening_hours?.[currentDay as keyof typeof point.opening_hours];

  return (
    openingHours?.map(({ from, to }) => `${from}–${to}`).join(", ") || "выходной"
  );
}

function pointsCenter(points: TExchangePoint[]): [number, number] | null {
  const located = points.filter(
    (point) =>
      Number.isFinite(point.address.longitude) &&
      Number.isFinite(point.address.latitude),
  );
  if (!located.length) return null;

  const longitude =
    located.reduce((sum, point) => sum + point.address.longitude, 0) /
    located.length;
  const latitude =
    located.reduce((sum, point) => sum + point.address.latitude, 0) /
    located.length;

  return [longitude, latitude];
}

function addressLine(point: TExchangePoint) {
  return [point.address.street, point.address.building].filter(Boolean).join(", ");
}

export function Points() {
  const navigate = useNavigate();
  const { data: itemTypes } = useItemTypes();
  const [itemType, setItemType] = useState("");
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [savedCity, setSavedCity] = useState(readSavedCity);
  const [savedCenter, setSavedCenter] = useState(readSavedCenter);

  const query: NonNullable<TExchangePointsQueryParams> = {};
  if (savedCity) query.city = savedCity;
  if (itemType) query.item_type = itemType;
  if (format) query.exchange_format = format as NonNullable<TExchangePointsQueryParams>["exchange_format"];
  if (status === "accepting") query.status = "active";

  const { data, isLoading, isError } = useExchangePoints(query);
  const points =
    status === "paused"
      ? (data ?? []).filter((point) => point.status !== "active")
      : (data ?? []);
  const selected = points.find((point) => point.id === selectedId) ?? points[0];
  const hasFilters = Boolean(itemType || format || status);
  const count = points.length;
  const countText = `${count} ${count === 1 ? "пункт" : count >= 2 && count <= 4 ? "пункта" : "пунктов"}`;
  const selectedFormat = selected?.formats?.[0];
  const mapCenter = savedCenter ?? pointsCenter(points) ?? yekaterinburgCenter;

  useEffect(() => {
    const updateLocation = () => {
      setSavedCity(readSavedCity());
      setSavedCenter(readSavedCenter());
    };

    window.addEventListener(STORAGE_KEY_USER_LOCATION_UPDATED_EVENT, updateLocation);
    return () => {
      window.removeEventListener(
        STORAGE_KEY_USER_LOCATION_UPDATED_EVENT,
        updateLocation,
      );
    };
  }, []);

  function reset() {
    setItemType("");
    setFormat("");
    setStatus("");
    setSelectedId(null);
  }

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <Link
            to="/points"
            className="hover:underline hover:underline-offset-4"
          >
            Пункты приёма
          </Link>
        </nav>

        <div className="mb-6">
          <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
            Пункты приёма
          </h1>
          {savedCity && (
            <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
                <MapPin />
                {savedCity}
              </span>
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto mb-5 grid w-full max-w-[1550px] grid-cols-1 gap-4 px-6 md:grid-cols-3 lg:px-0">
        <div className="text-muted-foreground grid min-w-0 gap-1.5 text-[13px]">
          <label htmlFor="point-filter-category">Что сдаёте</label>
          <span className="relative block">
            <select
              id="point-filter-category"
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
              className="border-border bg-card text-foreground h-11 w-full cursor-pointer appearance-none rounded-2xl border pr-9 pl-3 text-sm"
            >
              <option value="">Все вещи</option>
              {itemTypes?.map((type) => (
                <option key={type.id} value={type.title}>
                  {type.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-3.5 right-3 size-4" />
          </span>
        </div>
        <div className="text-muted-foreground grid min-w-0 gap-1.5 text-[13px]">
          <label htmlFor="point-filter-format">Формат передачи</label>
          <span className="relative block">
            <select
              id="point-filter-format"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
              className="border-border bg-card text-foreground h-11 w-full cursor-pointer appearance-none rounded-2xl border pr-9 pl-3 text-sm"
            >
              <option value="">Все форматы</option>
              {Object.entries(formatLabels).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-3.5 right-3 size-4" />
          </span>
        </div>
        <div className="text-muted-foreground grid min-w-0 gap-1.5 text-[13px]">
          <label htmlFor="point-filter-status">Статус приёма</label>
          <span className="relative block">
            <select
              id="point-filter-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="border-border bg-card text-foreground h-11 w-full cursor-pointer appearance-none rounded-2xl border pr-9 pl-3 text-sm"
            >
              <option value="">Все статусы</option>
              <option value="accepting">Принимает вещи</option>
              <option value="paused">Временно не принимает</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-3.5 right-3 size-4" />
          </span>
        </div>
      </section>

      <section className="mx-auto mb-12 grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[minmax(310px,32%)_minmax(0,1fr)] lg:px-0">
        <div className="border-border bg-card flex h-128 min-w-0 flex-col rounded-2xl border">
          <div className="flex min-h-14 items-center justify-between px-4.5 py-3">
            <h2 className="text-[17px] font-semibold">
              {isLoading
                ? "Загрузка..."
                : isError
                  ? "Ошибка загрузки данных"
                  : countText}
            </h2>
            {hasFilters && count > 0 && (
              <button
                type="button"
                onClick={reset}
                className="text-primary text-sm font-medium hover:underline hover:underline-offset-4"
              >
                Сбросить
              </button>
            )}
          </div>

          {isLoading && <span className="px-4.5 pb-4">Загрузка...</span>}

          {!isLoading && isError && (
            <span className="px-4.5 pb-4">Ошибка загрузки данных</span>
          )}

          {!isLoading && !isError && selected && (
            <>
              <article className="bg-secondary mx-3 mb-2 grid justify-items-start gap-1.5 rounded-xl px-4 pt-3.5 pb-4">
                <h3 className="text-xl leading-6.5 font-semibold">
                  {selected.title}
                </h3>
                <p className="text-secondary-foreground text-sm">
                  {addressLine(selected)}
                </p>
                {selected.description && (
                  <p className="text-muted-foreground text-sm">
                    {selected.description}
                  </p>
                )}
                <span
                  className="text-primary data-[paused=true]:text-foreground flex w-fit items-center gap-2 text-[13px] font-semibold [&>span]:size-2 [&>span]:rounded-full [&>span]:bg-current data-[paused=true]:[&>span]:border-[1.5px] data-[paused=true]:[&>span]:border-current data-[paused=true]:[&>span]:bg-transparent"
                  data-paused={selected.status !== "active"}
                >
                  <span />
                  {selected.status !== "active"
                    ? "Временно не принимает"
                    : "Принимает вещи"}
                </span>
                <p className="text-secondary-foreground flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                  <span>{todayHours(selected)}</span>
                  {selectedFormat && <span>{formatLabels[selectedFormat]}</span>}
                </p>
                <Button
                  type="button"
                  onClick={() => navigate(`/points/${selected.id}`)}
                  className="mt-1 h-11 px-4 font-medium"
                >
                  Открыть пункт <ChevronRight />
                </Button>
              </article>
              {points.length > 1 && (
                <ul className="min-h-0 overflow-y-auto px-3 pb-2">
                  {points
                    .filter((point) => point.id !== selected.id)
                    .map((point) => (
                      <li key={point.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(point.id)}
                          className="grid min-h-16 w-full grid-cols-[34px_minmax(0,1fr)_16px] items-center gap-2.5 rounded-[10px] p-2 text-left hover:bg-muted"
                        >
                          <span className="bg-muted text-primary grid size-8.5 place-items-center rounded-[9px]">
                            <MapPin className="size-4" />
                          </span>
                          <span>
                            <strong className="block text-sm font-semibold wrap-break-word">
                              {point.title}
                            </strong>
                            <small className="text-muted-foreground mt-0.5 block text-xs wrap-break-word">
                              {`${addressLine(point)}${point.status !== "active" ? ", приём приостановлен" : ""}`}
                            </small>
                          </span>
                          <ChevronRight className="size-4 shrink-0" />
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </>
          )}

          {!isLoading && !isError && !selected && (
            <div className="grid min-h-0 flex-1 content-center justify-items-center gap-2 p-4.5 text-center">
              <Search className="text-primary size-6.5" />
              <h2 className="text-lg font-semibold">Подходящих пунктов нет</h2>
              <p className="text-muted-foreground max-w-[30ch] text-sm">
                Выберите другую категорию или сбросьте фильтры.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={reset}
                className="mt-1.5 h-11 px-4 font-medium"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>

        <div className="border-border bg-card grid h-100 min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-2xl border lg:h-128">
          <div className="bg-secondary relative h-full min-h-0 w-full overflow-hidden">
            <PointsMap
              points={points}
              selectedId={selected?.id}
              center={mapCenter}
              onSelect={setSelectedId}
            />
          </div>
          <div className="border-border flex flex-wrap gap-x-5.5 gap-y-2.5 border-t px-4 py-3">
            <span className="text-muted-foreground flex items-center gap-2 text-[13px]">
              <span className="size-4 rounded-full border-[1.5px] border-primary bg-card" />
              Принимает
            </span>
            <span className="text-muted-foreground flex items-center gap-2 text-[13px]">
              <span className="size-4 rounded-full border-[1.5px] border-dashed border-current" />
              Приём приостановлен
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function PointsMap({
  points,
  selectedId,
  center,
  onSelect,
}: {
  points: TExchangePoint[];
  selectedId?: number;
  center: [number, number];
  onSelect: (id: number) => void;
}) {
  const [maps, setMaps] = useState<typeof import("@/lib/ymaps3") | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    import("@/lib/ymaps3")
      .then((module) => {
        if (active) setMaps(module);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return (
      <p className="text-muted-foreground grid h-full place-items-center px-6 text-center text-sm">
        Не удалось загрузить карту
      </p>
    );
  }

  if (!maps) return null;

  return (
    <PointsMapView
      maps={maps}
      points={points}
      selectedId={selectedId}
      center={center}
      onSelect={onSelect}
    />
  );
}

function PointsMapView({
  maps,
  points,
  selectedId,
  center,
  onSelect,
}: {
  maps: typeof import("@/lib/ymaps3");
  points: TExchangePoint[];
  selectedId?: number;
  center: [number, number];
  onSelect: (id: number) => void;
}) {
  const location = maps.reactify.useDefault(
    {
      center,
      zoom: 12,
      duration: 500,
    },
    [center],
  );

  return (
    <maps.YMap location={location} className="size-full">
      <maps.YMapDefaultSchemeLayer />
      <maps.YMapDefaultFeaturesLayer />
      {points.map((point) => (
        <PointMarker
          key={point.id}
          maps={maps}
          point={point}
          active={selectedId === point.id}
          onSelect={onSelect}
        />
      ))}
    </maps.YMap>
  );
}

function PointMarker({
  maps,
  point,
  active,
  onSelect,
}: {
  maps: typeof import("@/lib/ymaps3");
  point: TExchangePoint;
  active: boolean;
  onSelect: (id: number) => void;
}) {
  const paused = point.status !== "active";

  return (
    <maps.YMapMarker
      coordinates={maps.reactify.useDefault([
        point.address.longitude,
        point.address.latitude,
      ])}
      onClick={() => onSelect(point.id)}
    >
      <button
        type="button"
        aria-label={point.title}
        className={`flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-[1.5px] ${
          active
            ? "border-card bg-primary text-primary-foreground"
            : paused
              ? "text-muted-foreground border-dashed border-muted-foreground bg-card"
              : "text-secondary-foreground border-primary bg-card"
        } ${active && paused ? "border-dashed" : ""}`}
      >
        <MapPin className="size-3.5" />
      </button>
    </maps.YMapMarker>
  );
}
