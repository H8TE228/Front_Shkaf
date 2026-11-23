import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MapPinned,
  Repeat2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  useBookmarks,
  useCreateExchangePointBookmark,
  useDeleteExchangePointBookmark,
  useExchangePointById,
  useMe,
} from "@/hooks";
import { getCurrentDay } from "@/lib";
import type { TExchangePoint } from "@/types";

const pointFormatTitle = {
  free: "Бесплатно",
  points: "За баллы",
  charity: "Благотворительность",
} as const;

const formatTexts = {
  points: "Условия начисления и использования баллов уточняют на месте.",
  free: "Вещи можно передать бесплатно.",
  charity: "Вещи принимают для благотворительной передачи.",
};

function todayHours(point: TExchangePoint) {
  const currentDay = getCurrentDay();
  const openingHours =
    point.opening_hours?.[currentDay as keyof typeof point.opening_hours];

  return openingHours?.map(({ from, to }) => `${from}–${to}`).join(", ") || "выходной";
}

function yandexMapsHref(point: TExchangePoint) {
  const { longitude, latitude, city, street, building } = point.address;

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return `https://yandex.ru/maps/?pt=${longitude},${latitude}&z=17&l=map`;
  }

  const query = [city, street, building].filter(Boolean).join(", ");

  if (!street && !building) {
    return null;
  }

  return `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;
}

export function Point() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favoritePrompt, setFavoritePrompt] = useState(false);
  const { data: user, isLoading: meLoading } = useMe();
  const {
    data: point,
    isLoading,
    isError,
  } = useExchangePointById(id ?? "");
  const { data: bookmarks } = useBookmarks({ type: "point" });
  const { mutate: createBookmark, isPending: createPending } =
    useCreateExchangePointBookmark();
  const { mutate: deleteBookmark, isPending: deletePending } =
    useDeleteExchangePointBookmark();

  const bookmarkPending = createPending || deletePending;
  const bookmarked = !!bookmarks?.some(
    (bookmark) => bookmark.point?.id === point?.id,
  );

  function onFavoriteClick() {
    if (meLoading || bookmarkPending || !point) return;

    if (!user) {
      setFavoritePrompt(true);
      return;
    }

    const pointId = String(point.id);
    const onError = (error: { response?: { status?: number } }) => {
      if (error.response?.status === 401) {
        setFavoritePrompt(true);
      }
    };

    if (bookmarked) {
      deleteBookmark(pointId, { onError });
      return;
    }

    createBookmark(pointId, { onError });
  }

  return (
    <div>
      <section
        className={`mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0 ${
          isLoading || isError || !point ? "pb-12" : ""
        }`}
      >
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
          <ChevronRight />
          <span>Карточка пункта</span>
        </nav>

        {isLoading && <span>Загрузка...</span>}

        {!isLoading && (isError || !point) && (
          <span className="mb-12 block">Ошибка загрузки данных</span>
        )}

        {!isLoading && !isError && point && (
          <>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
                  {point.title}
                </h1>
                <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
                    <Repeat2 />
                    Обменный пункт
                  </span>
                  <span className="ml-3">{point.address.city}</span>
                </p>
                {point.description && (
                  <p className="text-muted-foreground mt-2 max-w-[62ch] text-sm">
                    {point.description}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                aria-expanded={favoritePrompt}
                aria-pressed={bookmarked}
                disabled={meLoading || bookmarkPending}
                onClick={onFavoriteClick}
                className="h-11 rounded-xl px-4 font-medium"
              >
                <Heart className={bookmarked ? "fill-current text-primary" : ""} />{" "}
                В избранное
              </Button>
            </div>

            {favoritePrompt && !user && (
              <div className="border-border bg-card mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                <p>Войдите, чтобы сохранить пункт в избранное.</p>
                <Button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="h-11 px-4 font-medium"
                >
                  Войти
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {!isLoading && !isError && point && (
        <>
          <PointDetails point={point} />
        </>
      )}
    </div>
  );
}

function PointDetails({ point }: { point: TExchangePoint }) {
  const paused = point.status !== "active";
  const address = [point.address.street, point.address.building]
    .filter(Boolean)
    .join(", ");
  const mapHref = yandexMapsHref(point);
  const formats = point.formats ?? [];

  return (
    <>
      <section className="mx-auto grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
        {point.picture ? (
          <img
            src={point.picture}
            alt=""
            className="min-h-64 w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="bg-border text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl text-[13px] [&_svg]:size-9">
            <Camera />
            <span>Фото входа</span>
          </div>
        )}

        <div className="border-border bg-card grid content-start justify-items-start gap-4 rounded-2xl border p-5">
          <span
            className="text-primary flex w-fit items-center gap-2 text-[13px] font-semibold data-[paused=true]:text-foreground [&>span]:size-2 [&>span]:rounded-full [&>span]:bg-current data-[paused=true]:[&>span]:border-[1.5px] data-[paused=true]:[&>span]:border-current data-[paused=true]:[&>span]:bg-transparent"
            data-paused={paused}
          >
            <span />
            {paused ? "Временно не принимает" : "Принимает вещи"}
          </span>

          <div className="flex items-center gap-2.5">
            <MapPin className="text-primary size-5 shrink-0" />
            <div>
              <span className="text-muted-foreground text-sm">Адрес</span>
              <h2 className="text-2xl leading-7 font-semibold">{address}</h2>
            </div>
          </div>

          <dl className="flex flex-wrap gap-x-9 gap-y-2.5">
            <div>
              <dt className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Clock3 className="size-4 shrink-0" />
                Часы работы
              </dt>
              <dd className="mt-1 text-[15px] font-medium">{todayHours(point)}</dd>
            </div>
            {(point.phone || point.email) && (
              <div>
                <dt className="text-muted-foreground text-sm">Контакты</dt>
                <dd className="mt-1 grid gap-1 text-[15px] font-medium">
                  {point.phone && (
                    <a
                      href={`tel:${point.phone}`}
                      className="hover:underline hover:underline-offset-4"
                    >
                      {point.phone}
                    </a>
                  )}
                  {point.email && <span>{point.email}</span>}
                </dd>
              </div>
            )}
          </dl>

          {paused && (
            <p className="text-muted-foreground max-w-[42ch] text-sm">
              Приём вещей приостановлен. Когда он возобновится, пока неизвестно.
            </p>
          )}

          {mapHref ? (
            <Button
              render={
                <a href={mapHref} target="_blank" rel="noopener noreferrer" />
              }
              nativeButton={false}
              className="h-12 px-5 text-base font-medium"
            >
              <MapPinned /> Показать на карте
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              className="h-12 px-5 text-base font-medium"
            >
              <MapPinned /> Показать на карте
            </Button>
          )}
        </div>
      </section>

      <section className="mx-auto mt-5 mb-12 grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
        <div className="border-border bg-card grid content-start justify-items-start gap-4 rounded-2xl border p-5">
          <h2 className="text-2xl leading-7 font-semibold">
            {paused ? "Что обычно принимают" : "Что принимают"}
          </h2>
          <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
            {point.item_types.map((itemType) => (
              <li
                key={itemType.id}
                className="bg-muted rounded-lg px-2.5 py-1 text-[13px]"
              >
                {itemType.title}
              </li>
            ))}
          </ul>
          {!!formats.length && (
            <div className="grid gap-3">
              <h3 className="text-[15px] font-semibold">Формат передачи</h3>
              {formats.map((format) => (
                <div key={format} className="grid gap-1">
                  <strong className="text-primary text-sm font-semibold">
                    {pointFormatTitle[format]}
                  </strong>
                  <p className="text-muted-foreground text-sm">
                    {formatTexts[format]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-border bg-card grid overflow-hidden rounded-2xl border">
          <div className="bg-secondary relative min-h-42 overflow-hidden">
            <PointPreviewMap point={point} />
          </div>
          <div className="text-muted-foreground flex items-center gap-2 px-3.5 py-2.5 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
            <MapPin />
            <span>{address}</span>
            <Link
              to="/points"
              className="text-primary ml-auto inline-flex items-center gap-1 text-sm font-medium hover:underline hover:underline-offset-4"
            >
              Все пункты <ChevronRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PointPreviewMap({ point }: { point: TExchangePoint }) {
  const [maps, setMaps] = useState<typeof import("@/lib/ymaps3") | null>(null);
  const [failed, setFailed] = useState(false);
  const { longitude, latitude } = point.address;
  const hasCoords = Number.isFinite(longitude) && Number.isFinite(latitude);

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

  if (!hasCoords || failed) {
    return (
      <p className="text-muted-foreground grid h-full min-h-42 place-items-center px-6 text-center text-sm">
        Не удалось загрузить карту
      </p>
    );
  }

  if (!maps) return <div className="min-h-42" />;

  return <PointPreviewMapView maps={maps} point={point} />;
}

function PointPreviewMapView({
  maps,
  point,
}: {
  maps: typeof import("@/lib/ymaps3");
  point: TExchangePoint;
}) {
  const center: [number, number] = [
    point.address.longitude,
    point.address.latitude,
  ];
  const location = maps.reactify.useDefault(
    { center, zoom: 16, duration: 300 },
    [center[0], center[1]],
  );

  return (
    <maps.YMap location={location} className="size-full min-h-42">
      <maps.YMapDefaultSchemeLayer />
      <maps.YMapDefaultFeaturesLayer />
      <maps.YMapMarker coordinates={maps.reactify.useDefault(center)}>
        <span className="bg-primary block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card" />
      </maps.YMapMarker>
    </maps.YMap>
  );
}
