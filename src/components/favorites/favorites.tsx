import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ChevronRight, Heart, PauseCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  useBookmarks,
  useCreateExchangePointBookmark,
  useCreateItemBookmark,
  useDeleteExchangePointBookmark,
  useDeleteItemBookmark,
} from "@/hooks";
import { getCurrentDay } from "@/lib";
import type { TBookmarkExchangePoint, TBookmarkType, TItem } from "@/types";

const exchangeFormatTitle = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "За баллы",
} as const;

const pointFormatTitle = {
  free: "Бесплатно",
  points: "За баллы",
  charity: "Благотворительность",
} as const;

function Cover({ src }: { src?: string | null }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="size-14 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <span className="bg-muted text-muted-foreground grid size-14 shrink-0 place-items-center rounded-xl">
      <Camera className="size-5" />
    </span>
  );
}

function todayHours(point: TBookmarkExchangePoint) {
  const currentDay = getCurrentDay();
  const openingHours =
    point.opening_hours?.[currentDay as keyof typeof point.opening_hours];

  return (
    openingHours?.map(({ from, to }) => `${from}–${to}`).join(", ") ||
    "выходной"
  );
}

export function Favorites() {
  const [tab, setTab] = useState<TBookmarkType>("item");
  const [undo, setUndo] = useState<{ kind: TBookmarkType; id: string } | null>(
    null,
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const {
    data: itemBookmarks,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useBookmarks({ type: "item" });
  const itemBookmarksData = itemBookmarks?.results;
  const {
    data: pointBookmarks,
    isLoading: pointsLoading,
    isError: pointsError,
  } = useBookmarks({ type: "point" });
  const pointBookmarksData = pointBookmarks?.results;
  const { mutate: deleteItemBookmark } = useDeleteItemBookmark();
  const { mutate: deletePointBookmark } = useDeleteExchangePointBookmark();
  const { mutate: createItemBookmark } = useCreateItemBookmark();
  const { mutate: createPointBookmark } = useCreateExchangePointBookmark();

  const isItems = tab === "item";
  const isLoading = isItems ? itemsLoading : pointsLoading;
  const isError = isItems ? itemsError : pointsError;
  const bookmarks = isItems ? itemBookmarksData : pointBookmarksData;

  useEffect(() => {
    if (!undo) return;
    const timer = window.setTimeout(() => setUndo(null), 6000);
    return () => window.clearTimeout(timer);
  }, [undo]);

  function remove(kind: TBookmarkType, id: number) {
    const key = `${kind}:${id}`;
    setPendingId(key);
    const mutate = kind === "item" ? deleteItemBookmark : deletePointBookmark;
    mutate(String(id), {
      onSuccess: () => setUndo({ kind, id: String(id) }),
      onSettled: () => setPendingId(null),
    });
  }

  function restore() {
    if (!undo) return;
    setPendingId(`${undo.kind}:${undo.id}`);
    const mutate =
      undo.kind === "item" ? createItemBookmark : createPointBookmark;
    mutate(undo.id, {
      onSuccess: () => setUndo(null),
      onSettled: () => setPendingId(null),
    });
  }

  const tabs: [TBookmarkType, string, number][] = [
    ["item", "Вещи", itemBookmarksData?.length ?? 0],
    ["point", "Пункты приёма", pointBookmarksData?.length ?? 0],
  ];

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <Link
            to="/favorites"
            className="hover:underline hover:underline-offset-4"
          >
            Избранное
          </Link>
        </nav>
        <h1 className="mb-6 text-[32px] leading-10 font-semibold tracking-tight">
          Избранное
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 pb-12 lg:px-0">
        <div
          className="mb-3 flex gap-1.5"
          role="group"
          aria-label="Разделы избранного"
        >
          {tabs.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
              className={`inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm font-medium whitespace-nowrap ${
                tab === id
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
              <span className="text-[13px]">{count}</span>
            </button>
          ))}
        </div>

        {isLoading && <span>Загрузка...</span>}

        {!isLoading && isError && <span>Ошибка загрузки данных</span>}

        {!isLoading && !isError && !bookmarks?.length && (
          <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">
              {isItems
                ? "В избранном пока нет вещей"
                : "Нет сохранённых пунктов приёма"}
            </h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-[46ch]">
              {isItems
                ? "Нажимайте на сердечко у объявления, и вещь появится здесь."
                : "Отмечайте сердечком пункты на карте, чтобы быстро возвращаться к ним."}
            </p>
            <Button
              render={<Link to={isItems ? "/catalog" : "/points"} />}
              nativeButton={false}
              className="mt-4 h-11 rounded-2xl px-5"
            >
              {isItems ? "Перейти в каталог" : "Открыть пункты"}
            </Button>
          </div>
        )}

        {!isLoading && !isError && !!bookmarks?.length && (
          <section
            aria-label={
              isItems ? "Сохранённые вещи" : "Сохранённые пункты приёма"
            }
            className="border-border bg-card overflow-hidden rounded-2xl border"
          >
            <ul className="divide-border divide-y">
              {isItems
                ? itemBookmarksData?.map((bookmark) =>
                    bookmark.item ? (
                      <ItemRow
                        key={bookmark.id}
                        item={bookmark.item}
                        pending={pendingId === `item:${bookmark.item.id}`}
                        onRemove={() => remove("item", bookmark.item!.id)}
                      />
                    ) : null,
                  )
                : pointBookmarksData?.map((bookmark) =>
                    bookmark.point ? (
                      <PointRow
                        key={bookmark.id}
                        point={bookmark.point}
                        pending={pendingId === `point:${bookmark.point.id}`}
                        onRemove={() => remove("point", bookmark.point!.id)}
                      />
                    ) : null,
                  )}
            </ul>
          </section>
        )}
      </section>

      {undo && (
        <div
          role="status"
          className="bg-foreground text-background fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl px-4 py-2.5 text-sm md:bottom-6"
        >
          Убрано из избранного
          <button
            type="button"
            className="text-primary cursor-pointer font-semibold disabled:opacity-50"
            disabled={pendingId === `${undo.kind}:${undo.id}`}
            onClick={restore}
          >
            Вернуть
          </button>
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  pending,
  onRemove,
}: {
  item: TItem;
  pending: boolean;
  onRemove: () => void;
}) {
  const passed = item.status === "given";
  const photo = [...item.photos].sort((a, b) => a.position - b.position)[0];

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <Cover src={photo?.image} />
      <div className="min-w-0 flex-1">
        <Link
          to={`/item/${item.id}`}
          className={`hover:text-primary line-clamp-2 text-base font-semibold ${
            passed ? "text-muted-foreground" : ""
          }`}
        >
          {item.title}
        </Link>
        <div className="text-muted-foreground mt-0.5 truncate text-sm">
          {passed && (
            <span className="bg-muted text-foreground mr-2 inline-flex h-[26px] items-center rounded-full px-2.5 text-[13px] font-medium">
              Вещь передана
            </span>
          )}
          {item.district}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!passed && (
          <span className="text-sm font-medium">
            {exchangeFormatTitle[item.exchange_format]}
          </span>
        )}
        <RemoveButton name={item.title} pending={pending} onRemove={onRemove} />
      </div>
    </li>
  );
}

function PointRow({
  point,
  pending,
  onRemove,
}: {
  point: TBookmarkExchangePoint;
  pending: boolean;
  onRemove: () => void;
}) {
  const paused = point.status === "closed";
  const formats = point.formats
    ?.map((format) => pointFormatTitle[format])
    .join(", ");
  const accepts = point.item_types.map((type) => type.title).join(", ");
  const address = [
    point.address.city,
    point.address.street,
    point.address.building,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <Cover src={point.picture} />
      <div className="min-w-0 flex-1">
        <Link
          to="/points"
          className="hover:text-primary block truncate text-base font-semibold"
        >
          {point.title}
        </Link>
        <p className="text-muted-foreground truncate text-sm">
          {[formats, address].filter(Boolean).join(", ")}
        </p>
        {accepts && (
          <p className="text-muted-foreground truncate text-sm">{accepts}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-1 text-sm">
          {paused && (
            <span className="bg-muted inline-flex h-[26px] items-center gap-1.5 rounded-full px-2.5 text-[13px] whitespace-nowrap">
              <PauseCircle className="size-3.5" />
              Приём приостановлен
            </span>
          )}
          <span
            className={
              paused ? "text-muted-foreground text-[13px]" : "font-medium"
            }
          >
            {todayHours(point)}
          </span>
        </div>
        <RemoveButton
          name={point.title}
          pending={pending}
          onRemove={onRemove}
        />
      </div>
    </li>
  );
}

function RemoveButton({
  name,
  pending,
  onRemove,
}: {
  name: string;
  pending: boolean;
  onRemove: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Убрать из избранного, ${name}`}
      disabled={pending}
      onClick={onRemove}
      className="text-primary size-10 rounded-full"
    >
      <Heart className="size-5 fill-current" />
    </Button>
  );
}
