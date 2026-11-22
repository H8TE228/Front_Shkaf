import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const formatLabels = {
  points: "Баллы",
  free: "Бесплатно",
  charity: "Благотворительность",
};

const formatTexts = {
  points: "Условия начисления и использования баллов уточняют на месте.",
  free: "Вещи можно передать бесплатно.",
  charity: "Вещи принимают для благотворительной передачи.",
};

const point = {
  title: "Пункт в центре",
  address: {
    city: "Екатеринбург",
    street: "8 Марта",
    building: "46",
  },
  status: "active",
  schedule: "10:00–20:00",
  contact: "p1@example.org",
  format: "points" as const,
  itemTypes: ["Детская одежда", "Обувь"],
};

export function Point() {
  const navigate = useNavigate();
  const [favoritePrompt, setFavoritePrompt] = useState(false);
  const paused = point.status !== "active";
  const formatLabel = formatLabels[point.format];
  const address = `${point.address.street}, ${point.address.building}`;

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
          <ChevronRight />
          <span>Карточка пункта</span>
        </nav>

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
          </div>
          <Button
            type="button"
            variant="outline"
            aria-expanded={favoritePrompt}
            onClick={() => setFavoritePrompt(!favoritePrompt)}
            className="h-11 rounded-xl px-4 font-medium"
          >
            <Heart /> В избранное
          </Button>
        </div>

        {favoritePrompt && (
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
      </section>

      <section className="mx-auto grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
        <div className="bg-border text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl text-[13px] [&_svg]:size-9">
          <Camera />
          <span>Фото входа</span>
        </div>

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
              <dd className="mt-1 text-[15px] font-medium">{point.schedule}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Контакты</dt>
              <dd className="mt-1 text-[15px] font-medium">{point.contact}</dd>
            </div>
          </dl>

          {paused && (
            <p className="text-muted-foreground max-w-[42ch] text-sm">
              Приём вещей приостановлен. Когда он возобновится, пока неизвестно.
            </p>
          )}

          <Button
            type="button"
            onClick={() => navigate("/points")}
            className="h-12 px-5 text-base font-medium"
          >
            <MapPinned /> Показать на карте
          </Button>
        </div>
      </section>

      <section className="mx-auto mt-5 mb-12 grid w-full max-w-[1550px] grid-cols-1 gap-5 px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
        <div className="border-border bg-card grid content-start justify-items-start gap-4 rounded-2xl border p-5">
          <h2 className="text-2xl leading-7 font-semibold">
            {paused ? "Что обычно принимают" : "Что принимают"}
          </h2>
          <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
            {point.itemTypes.map((itemType) => (
              <li
                key={itemType}
                className="bg-muted rounded-lg px-2.5 py-1 text-[13px]"
              >
                {itemType}
              </li>
            ))}
          </ul>
          <div className="grid gap-1">
            <h3 className="text-[15px] font-semibold">Формат передачи</h3>
            <strong className="text-primary text-sm font-semibold">
              {formatLabel}
            </strong>
            <p className="text-muted-foreground text-sm">
              {formatTexts[point.format]}
            </p>
          </div>
        </div>

        <div className="border-border bg-card grid overflow-hidden rounded-2xl border">
          <div className="bg-secondary relative min-h-42 overflow-hidden">
            <img
              src="/src/assets/images/ekaterinburg-map.png"
              alt=""
              className="size-full object-cover opacity-[0.83] grayscale dark:invert dark:brightness-75"
            />
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
    </div>
  );
}
