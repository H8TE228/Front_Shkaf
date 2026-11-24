import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import { ItemCard } from "../item-card";
import { UserAvatar } from "../profile/user-avatar";
import {
  useBookmarks,
  useCreateConversation,
  useCreateItemBookmark,
  useDeleteItemBookmark,
  useItemById,
  useItems,
  useMe,
  useUsers,
} from "@/hooks";
import type { TItem, TItemPhoto, TUser } from "@/types";
import { ItemOwnerActions } from "./edit-item-form";

const exchangeFormatTitle = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "За баллы",
} as const;

const conditionTitle = {
  new: "Новая",
  good: "Хорошее",
  used: "Б/у",
} as const;

function personName(person: {
  first_name?: string | null;
  username?: string | null;
}) {
  const first = person.first_name?.trim();
  if (first) return first;
  return person.username?.trim() ?? "";
}

function hasCoordinates(item: TItem) {
  return (
    item.latitude != null &&
    item.longitude != null &&
    Number.isFinite(item.latitude) &&
    Number.isFinite(item.longitude)
  );
}

const YandexPreview = lazy(async () => {
  const maps = await import("@/lib/ymaps3");

  function Preview({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) {
    const center: [number, number] = [longitude, latitude];

    return (
      <div className="h-55 overflow-hidden rounded-xl">
        <maps.YMap
          location={maps.reactify.useDefault({ center, zoom: 14 }, [
            longitude,
            latitude,
          ])}
        >
          <maps.YMapDefaultSchemeLayer />
          <maps.YMapDefaultFeaturesLayer />
          <maps.YMapMarker
            coordinates={maps.reactify.useDefault(center, [
              longitude,
              latitude,
            ])}
          >
            <div className="bg-primary border-card size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow" />
          </maps.YMapMarker>
        </maps.YMap>
      </div>
    );
  }

  return { default: Preview };
});

class MapBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favoritePrompt, setFavoritePrompt] = useState(false);
  const { data: user, isLoading: meLoading } = useMe();
  const { data: item, isLoading, isError } = useItemById(id ?? "");
  const { data: items } = useItems();
  const itemsData = items?.results;
  const { data: users, isError: usersError } = useUsers();
  const { data: bookmarks } = useBookmarks({ type: "item" });
  const bookmarksData = bookmarks?.results;
  const { mutate: createBookmark, isPending: createPending } =
    useCreateItemBookmark();
  const { mutate: deleteBookmark, isPending: deletePending } =
    useDeleteItemBookmark();
  const { mutate: createConversation, isPending: conversationPending } =
    useCreateConversation();

  const bookmarkPending = createPending || deletePending;
  const bookmarked = !!bookmarksData?.some(
    (bookmark) => bookmark.item?.id === item?.id,
  );
  const isOwner = !!user && user.id === item?.owner_id;
  const ready = !isLoading && !isError && !!item;
  const owner = users?.results.find((entry) => entry.id === item?.owner_id);
  const ownerName = !usersError && owner ? personName(owner) : "";
  const similar = (itemsData ?? [])
    .filter(
      (entry) => entry.id !== item?.id && entry.item_type === item?.item_type,
    )
    .slice(0, 4);

  function onFavoriteClick() {
    if (meLoading || bookmarkPending || !item) return;

    if (!user) {
      setFavoritePrompt(true);
      return;
    }

    const itemId = String(item.id);
    const onError = (error: { response?: { status?: number } }) => {
      if (error.response?.status === 401) {
        setFavoritePrompt(true);
      }
    };

    if (bookmarked) {
      deleteBookmark(itemId, { onError });
      return;
    }

    createBookmark(itemId, { onError });
  }

  function onWriteClick() {
    if (meLoading || conversationPending || !item || isOwner) return;

    if (!user) {
      navigate("/login");
      return;
    }

    createConversation(
      { item_id: String(item.id) },
      { onSuccess: () => navigate("/chats") },
    );
  }

  async function onShare() {
    if (!item) return;

    const url = new URL(`/item/${item.id}`, window.location.origin).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: item.title, url });
      } catch {
        return;
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
  }

  return (
    <div>
      <section
        className={`mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0 ${
          ready ? "" : "pb-12"
        }`}
      >
        <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <Link
            to="/catalog"
            className="hover:underline hover:underline-offset-4"
          >
            Каталог
          </Link>
          {ready && (
            <>
              <ChevronRight />
              <Link
                to={`/item/${id}`}
                className="hover:underline hover:underline-offset-4"
              >
                {item.title}
              </Link>
            </>
          )}
        </nav>

        {isLoading && <span>Загрузка...</span>}

        {!isLoading && (isError || !item) && (
          <span>Ошибка загрузки данных</span>
        )}

        {ready && (
          <>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
                  {item.title}
                </h1>
                {item.district && (
                  <p className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-sm leading-5">
                    <MapPin className="text-primary size-5 shrink-0" />
                    {item.district}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="В избранное"
                  aria-pressed={bookmarked}
                  disabled={meLoading || bookmarkPending}
                  onClick={onFavoriteClick}
                  className="size-11 rounded-lg"
                >
                  <Heart
                    className={`size-5 ${bookmarked ? "text-primary fill-current" : ""}`}
                  />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Поделиться"
                  onClick={onShare}
                  className="size-11 rounded-lg"
                >
                  <Share2 className="size-5" />
                </Button>
              </div>
            </div>

            {favoritePrompt && !user && (
              <div className="border-border bg-card mb-4 flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                <p>Войдите, чтобы сохранить вещь в избранное</p>
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

      {ready && (
        <ItemDetails
          item={item}
          owner={usersError ? undefined : owner}
          ownerName={ownerName}
          isOwner={isOwner}
          meLoading={meLoading}
          conversationPending={conversationPending}
          onWriteClick={onWriteClick}
          bookmarked={bookmarked}
          favoriteDisabled={meLoading || bookmarkPending}
          onFavoriteClick={onFavoriteClick}
          onShare={onShare}
        />
      )}

      {ready && similar.length > 0 && (
        <section className="mx-auto mt-8 mb-12 w-full max-w-[1550px] px-6 lg:px-0">
          <h2 className="text-2xl font-semibold">Похожие вещи</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {similar.map((entry) => (
              <ItemCard item={entry} key={entry.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ItemDetails({
  item,
  owner,
  ownerName,
  isOwner,
  meLoading,
  conversationPending,
  onWriteClick,
  bookmarked,
  favoriteDisabled,
  onFavoriteClick,
  onShare,
}: {
  item: TItem;
  owner?: TUser;
  ownerName: string;
  isOwner: boolean;
  meLoading: boolean;
  conversationPending: boolean;
  onWriteClick: () => void;
  bookmarked: boolean;
  favoriteDisabled: boolean;
  onFavoriteClick: () => void;
  onShare: () => void;
}) {
  const showMap = hasCoordinates(item);
  const navigate = useNavigate();

  return (
    <section className="mx-auto mb-12 grid w-full max-w-[1550px] grid-cols-1 items-start gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
      <div className="grid content-start gap-5">
        <ItemGallery photos={item.photos} title={item.title} />

        <section className="grid content-start gap-3">
          <h2 className="text-2xl font-semibold">Описание</h2>
          <p className="text-base leading-[27px] whitespace-pre-wrap">
            {item.description?.trim() || "Описание отсутствует."}
          </p>
        </section>

        <section className="grid content-start gap-3">
          <h2 className="text-2xl font-semibold">Характеристики</h2>
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-2 text-sm leading-5">
            <dt className="text-muted-foreground">Состояние</dt>
            <dd>{conditionTitle[item.condition]}</dd>
            {item.size && (
              <>
                <dt className="text-muted-foreground">Размер</dt>
                <dd>{item.size}</dd>
              </>
            )}
          </dl>
        </section>

        <section className="border-border grid content-start gap-3 rounded-2xl border p-6">
          <h2 className="text-2xl font-semibold">Местоположение</h2>
          {item.district && (
            <p className="flex items-center gap-2">
              <MapPin className="text-primary size-5 shrink-0" />
              {item.district}
            </p>
          )}
          <p className="text-muted-foreground text-sm leading-5">
            Точное место передачи обсудите в чате.
          </p>
          {showMap && (
            <MapBoundary>
              <Suspense fallback={null}>
                <YandexPreview
                  latitude={item.latitude as number}
                  longitude={item.longitude as number}
                />
              </Suspense>
            </MapBoundary>
          )}
        </section>
      </div>

      <aside className="top-24 [@media(min-width:1024px)_and_(min-height:601px)]:sticky">
        <div className="border-border bg-card grid content-start gap-4 rounded-2xl border p-6">
          <div
            onClick={() => {
              if (owner?.id !== undefined) {
                navigate(`/users/${owner?.id}`);
              }
            }}
            className="flex cursor-pointer items-center gap-3"
          >
            {owner && (owner.avatar || ownerName) ? (
              <UserAvatar
                src={owner.avatar}
                name={ownerName}
                className="size-12 text-lg"
              />
            ) : (
              <span className="bg-muted size-12 shrink-0 rounded-full" />
            )}
            <div className="min-w-0">
              {ownerName ||
                (owner?.username && (
                  <p className="truncate font-semibold">
                    {ownerName || owner.username}
                  </p>
                )) ||
                "Имя не загружено"}
              <p className="text-muted-foreground text-sm leading-5">
                Владелец вещи
              </p>
            </div>
          </div>

          <p className="text-[32px] leading-10 font-semibold">
            {exchangeFormatTitle[item.exchange_format]}
          </p>

          {!meLoading && !isOwner && (
            <Button
              type="button"
              disabled={conversationPending}
              onClick={onWriteClick}
              className="h-12 w-full rounded-xl text-base font-medium"
            >
              <MessageCircle className="size-5" /> Написать владельцу
            </Button>
          )}
          {isOwner && <ItemOwnerActions item={item} />}

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              aria-pressed={bookmarked}
              disabled={favoriteDisabled}
              onClick={onFavoriteClick}
              className="h-12 rounded-xl"
            >
              <Heart
                className={`size-5 ${bookmarked ? "text-primary fill-current" : ""}`}
              />
              В избранное
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onShare}
              className="h-12 rounded-xl"
            >
              <Share2 className="size-5" />
              Поделиться
            </Button>
          </div>

          <p className="text-muted-foreground text-sm leading-5">
            Время и место встречи обсудите в чате.
          </p>

          <button
            type="button"
            className="text-muted-foreground inline-flex w-fit items-center gap-2 text-[13px]"
          >
            <Flag className="size-5 shrink-0" />
            Пожаловаться
          </button>
        </div>
      </aside>
    </section>
  );
}

function ItemGallery({
  photos,
  title,
}: {
  photos: TItemPhoto[];
  title: string;
}) {
  const slides = [...photos].sort((a, b) => a.position - b.position);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const several = slides.length > 1;

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="grid content-start gap-3">
      <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-2xl">
        {slides.length === 0 && (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
            <Camera className="size-9" />
          </div>
        )}

        {slides.length > 0 && (
          <Carousel setApi={setApi} className="absolute inset-0">
            <CarouselContent className="ml-0 h-full">
              {slides.map((photo) => (
                <CarouselItem key={photo.id} className="h-full pl-0">
                  <img
                    src={photo.image}
                    alt={title}
                    className="size-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {several && (
              <>
                <CarouselPrevious className="top-1/2 left-3 size-11 -translate-y-1/2 rounded-lg" />
                <CarouselNext className="top-1/2 right-3 size-11 -translate-y-1/2 rounded-lg" />
              </>
            )}
          </Carousel>
        )}

        {slides.length > 0 && (
          <span className="bg-card/80 pointer-events-none absolute top-3 right-3 rounded-lg px-2 py-1 text-xs">
            {current + 1} / {slides.length}
          </span>
        )}
      </div>

      {slides.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Фото ${index + 1}`}
              aria-pressed={index === current}
              onClick={() => api?.scrollTo(index)}
              className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                index === current
                  ? "border-primary"
                  : "border-border opacity-60"
              }`}
            >
              <img
                src={photo.image}
                alt=""
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
