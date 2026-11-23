import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Heart,
  MapPin,
  MapPinned,
  MessageCircle,
  Repeat2,
  ShieldCheck,
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
import {
  useBookmarks,
  useCreateConversation,
  useCreateItemBookmark,
  useDeleteItemBookmark,
  useItemById,
  useMe,
} from "@/hooks";
import type { TItem, TItemPhoto } from "@/types";

const exchangeFormatTitle = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "За баллы",
} as const;

const exchangeFormatText = {
  free: "Вещь можно забрать бесплатно.",
  swap: "Владелец предлагает обмен на другую вещь.",
  points: "Вещь можно получить за баллы.",
} as const;

const conditionTitle = {
  new: "Новая",
  good: "Хорошее",
  used: "Б/у",
} as const;

const statusTitle = {
  draft: "Черновик",
  active: "Доступна",
  reserved: "Зарезервирована",
  given: "Передана",
  archived: "В архиве",
} as const;

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${hours}:${minutes}`;
}

function yandexMapsHref(item: TItem) {
  const { longitude, latitude } = item;

  if (
    longitude == null ||
    latitude == null ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return null;
  }

  return `https://yandex.ru/maps/?pt=${longitude},${latitude}&z=16&l=map`;
}

export function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favoritePrompt, setFavoritePrompt] = useState(false);
  const { data: user, isLoading: meLoading } = useMe();
  const { data: item, isLoading, isError } = useItemById(id ?? "");
  const { data: bookmarks } = useBookmarks({ type: "item" });
  const { mutate: createBookmark, isPending: createPending } =
    useCreateItemBookmark();
  const { mutate: deleteBookmark, isPending: deletePending } =
    useDeleteItemBookmark();
  const { mutate: createConversation, isPending: conversationPending } =
    useCreateConversation();

  const bookmarkPending = createPending || deletePending;
  const bookmarked = !!bookmarks?.some(
    (bookmark) => bookmark.item?.id === item?.id,
  );
  const isOwner = !!user && user.id === item?.owner_id;
  const ready = !isLoading && !isError && !!item;

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
              <span>{item.title}</span>
            </>
          )}
        </nav>

        {isLoading && <span>Загрузка...</span>}

        {!isLoading && (isError || !item) && (
          <span>Ошибка загрузки данных</span>
        )}

        {ready && (
          <>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
                  {item.title}
                </h1>
                <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
                    <Repeat2 />
                    {exchangeFormatTitle[item.exchange_format]}
                  </span>
                  {item.district && <span className="ml-3">{item.district}</span>}
                </p>
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
          isOwner={isOwner}
          meLoading={meLoading}
          conversationPending={conversationPending}
          onWriteClick={onWriteClick}
          bookmarked={bookmarked}
          favoriteDisabled={meLoading || bookmarkPending}
          onFavoriteClick={onFavoriteClick}
        />
      )}
    </div>
  );
}

function ItemDetails({
  item,
  isOwner,
  meLoading,
  conversationPending,
  onWriteClick,
  bookmarked,
  favoriteDisabled,
  onFavoriteClick,
}: {
  item: TItem;
  isOwner: boolean;
  meLoading: boolean;
  conversationPending: boolean;
  onWriteClick: () => void;
  bookmarked: boolean;
  favoriteDisabled: boolean;
  onFavoriteClick: () => void;
}) {
  const status = item.status ?? "active";
  const paused = status !== "active";
  const mapHref = yandexMapsHref(item);
  const published = formatDate(item.created_at);
  const specs = [
    item.item_type_title
      ? { label: "Тип", value: item.item_type_title }
      : null,
    { label: "Состояние", value: conditionTitle[item.condition] },
    item.size ? { label: "Размер", value: item.size } : null,
    item.district ? { label: "Район", value: item.district } : null,
  ].filter((spec) => spec !== null);

  return (
    <section className="mx-auto mb-12 grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
      <div className="grid content-start gap-5">
        <ItemGallery
          photos={item.photos}
          title={item.title}
          bookmarked={bookmarked}
          favoriteDisabled={favoriteDisabled}
          onFavoriteClick={onFavoriteClick}
        />

        <section className="border-border bg-card grid content-start gap-4 rounded-2xl border p-5">
          <h2 className="text-2xl leading-7 font-semibold">Описание</h2>
          <p className="text-muted-foreground max-w-[62ch] text-sm leading-relaxed whitespace-pre-wrap">
            {item.description?.trim() || "Описание отсутствует."}
          </p>

          <h2 className="text-2xl leading-7 font-semibold">Характеристики</h2>
          <dl className="grid gap-3">
            {specs.map((spec) => (
              <div key={spec.label} className="grid gap-1">
                <dt className="text-muted-foreground text-sm">{spec.label}</dt>
                <dd className="text-[15px] font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="text-2xl leading-7 font-semibold">Местоположение</h2>
          <p className="text-muted-foreground text-sm">
            {item.district || "Местоположение не указано."}
          </p>
          {mapHref && (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex w-fit items-center gap-1 text-sm font-medium hover:underline hover:underline-offset-4 [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <MapPinned /> Показать на карте
            </a>
          )}

          <p className="text-muted-foreground text-xs">
            № {item.id}
            {published ? ` | ${published}` : ""}
          </p>
        </section>
      </div>

      <div className="grid content-start gap-5">
        <div className="border-border bg-card grid content-start justify-items-start gap-4 rounded-2xl border p-5">
          <span
            className="text-primary flex w-fit items-center gap-2 text-[13px] font-semibold data-[paused=true]:text-foreground [&>span]:size-2 [&>span]:rounded-full [&>span]:bg-current data-[paused=true]:[&>span]:border-[1.5px] data-[paused=true]:[&>span]:border-current data-[paused=true]:[&>span]:bg-transparent"
            data-paused={paused}
          >
            <span />
            {statusTitle[status]}
          </span>

          <div>
            <h2 className="text-2xl leading-7 font-semibold">
              {exchangeFormatTitle[item.exchange_format]}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {exchangeFormatText[item.exchange_format]}
            </p>
          </div>

          {item.district && (
            <div className="flex items-center gap-2.5">
              <MapPin className="text-primary size-5 shrink-0" />
              <div>
                <span className="text-muted-foreground text-sm">Район</span>
                <p className="text-2xl leading-7 font-semibold">{item.district}</p>
              </div>
            </div>
          )}

          <dl className="flex flex-wrap gap-x-9 gap-y-2.5">
            <div>
              <dt className="text-muted-foreground text-sm">Состояние</dt>
              <dd className="mt-1 text-[15px] font-medium">
                {conditionTitle[item.condition]}
              </dd>
            </div>
            {item.size && (
              <div>
                <dt className="text-muted-foreground text-sm">Размер</dt>
                <dd className="mt-1 text-[15px] font-medium">{item.size}</dd>
              </div>
            )}
            {item.item_type_title && (
              <div>
                <dt className="text-muted-foreground text-sm">Тип</dt>
                <dd className="mt-1 text-[15px] font-medium">
                  {item.item_type_title}
                </dd>
              </div>
            )}
          </dl>

          {!meLoading && !isOwner && (
            <Button
              type="button"
              disabled={conversationPending}
              onClick={onWriteClick}
              className="h-12 px-5 text-base font-medium"
            >
              <MessageCircle /> Написать
            </Button>
          )}
        </div>

        <div className="border-border bg-card flex items-start gap-3 rounded-2xl border p-5">
          <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Будьте внимательны при передаче вещей. Договаривайтесь о встрече в
            переписке и не передавайте личные данные заранее.
          </p>
        </div>
      </div>
    </section>
  );
}

function ItemGallery({
  photos,
  title,
  bookmarked,
  favoriteDisabled,
  onFavoriteClick,
}: {
  photos: TItemPhoto[];
  title: string;
  bookmarked: boolean;
  favoriteDisabled: boolean;
  onFavoriteClick: () => void;
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
      <div className="bg-border relative aspect-[4/3] min-h-64 overflow-hidden rounded-2xl">
        {slides.length === 0 && (
          <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-2 text-[13px] [&_svg]:size-9">
            <Camera />
          </div>
        )}

        {slides.length === 1 && (
          <img
            src={slides[0].image}
            alt={title}
            className="absolute inset-0 size-full object-cover"
          />
        )}

        {several && (
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
            <CarouselPrevious className="top-1/2 left-3 -translate-y-1/2" />
            <CarouselNext className="top-1/2 right-3 -translate-y-1/2" />
          </Carousel>
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="В избранное"
          aria-pressed={bookmarked}
          disabled={favoriteDisabled}
          onClick={onFavoriteClick}
          className="bg-card absolute top-3 right-3 rounded-xl"
        >
          <Heart className={bookmarked ? "fill-current text-primary" : ""} />
        </Button>

        {!!slides.length && (
          <span className="bg-card/80 pointer-events-none absolute bottom-3 left-3 rounded-xl px-2.5 py-1 text-xs font-medium">
            {current + 1} / {slides.length}
          </span>
        )}
      </div>

      {several && (
        <div className="flex gap-2 overflow-x-auto">
          {slides.map((photo, index) => (
            <Button
              key={photo.id}
              type="button"
              variant="outline"
              aria-label={`Фото ${index + 1}`}
              aria-pressed={index === current}
              onClick={() => api?.scrollTo(index)}
              className={`size-16 overflow-hidden rounded-xl p-0 ${
                index === current ? "border-primary" : "opacity-60"
              }`}
            >
              <img src={photo.image} alt="" className="size-full object-cover" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
