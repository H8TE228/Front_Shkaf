import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Landmark,
  MapPin,
  Repeat2,
  Search,
  Shirt,
} from "lucide-react";
import { Button } from "../ui/button";

const kindLabels = {
  exchange: "Обменный пункт",
  fund: "Фонд",
  container: "Контейнер для текстиля",
};

const kindIcons = {
  exchange: Repeat2,
  fund: Landmark,
  container: Shirt,
};

const formatLabels = {
  points: "Баллы",
  free: "Бесплатно",
  charity: "Благотворительность",
};

const categoryOptions = [
  "Детская одежда",
  "Взрослая одежда",
  "Обувь",
  "Игрушки",
  "Книги",
  "Домашний текстиль",
  "Мебель",
];

const points = [
  {
    id: "p1",
    title: "Пункт в центре",
    address: "8 Марта, 46",
    hours: "Сегодня до 20:00",
    accepts: "Детская одежда и обувь",
    kind: "exchange" as const,
    format: "points" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Обувь"],
    x: 48.75453,
    y: 48.21178,
  },
  {
    id: "p4",
    title: "Фонд на ВИЗе",
    address: "Крауля, 63",
    hours: "Сегодня до 19:00",
    accepts: "Одежда и обувь",
    kind: "fund" as const,
    format: "free" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Обувь"],
    x: 40.03772,
    y: 47.4195,
  },
  {
    id: "p5",
    title: "Пункт в Академическом",
    address: "Краснолесья, 133",
    hours: "Сегодня до 18:00",
    accepts: "Детская одежда и игрушки",
    kind: "exchange" as const,
    format: "charity" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Игрушки"],
    x: 35.22524,
    y: 69.56979,
  },
  {
    id: "p6",
    title: "Контейнер на Ботанике",
    address: "Родонитовая, 4",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    kind: "container" as const,
    format: "free" as const,
    status: "closed",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Домашний текстиль"],
    x: 51.7676,
    y: 70.23902,
  },
  {
    id: "p2",
    title: "Фонд в Пионерском",
    address: "Советская, 7/1",
    hours: "Сегодня до 18:00",
    accepts: "Одежда, игрушки и книги",
    kind: "fund" as const,
    format: "free" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Игрушки", "Книги"],
    x: 53.61336,
    y: 34.90174,
  },
  {
    id: "p8",
    title: "Пункт на Уктусе",
    address: "Щербакова, 43",
    hours: "Сегодня до 20:00",
    accepts: "Одежда и обувь",
    kind: "exchange" as const,
    format: "points" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Обувь"],
    x: 57.70385,
    y: 75.71359,
  },
  {
    id: "p7",
    title: "Фонд в Химмаше",
    address: "Грибоедова, 13",
    hours: "Завтра с 10:00",
    accepts: "Одежда и книги",
    kind: "fund" as const,
    format: "free" as const,
    status: "closed",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Книги"],
    x: 64.68666,
    y: 93.21444,
  },
  {
    id: "p10",
    title: "Пункт на ЖБИ",
    address: "Сиреневый бульвар, 2",
    hours: "Сегодня до 19:00",
    accepts: "Одежда, игрушки и книги",
    kind: "exchange" as const,
    format: "charity" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Игрушки", "Книги"],
    x: 62.82134,
    y: 44.87619,
  },
  {
    id: "p9",
    title: "Контейнер на Бебеля",
    address: "Бебеля, 138",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    kind: "container" as const,
    format: "free" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Домашний текстиль"],
    x: 40.63095,
    y: 28.48363,
  },
  {
    id: "p3",
    title: "Контейнер на Уралмаше",
    address: "Победы, 18",
    hours: "Круглосуточно",
    accepts: "Одежда и домашний текстиль",
    kind: "container" as const,
    format: "free" as const,
    status: "active",
    itemTypes: ["Детская одежда", "Взрослая одежда", "Домашний текстиль"],
    x: 49.73229,
    y: 6.91952,
  },
];

export function Points() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [kind, setKind] = useState("");
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");
  const [selectedId, setSelectedId] = useState(points[0].id);

  const visible = points.filter((point) => {
    const paused = point.status !== "active";
    return (
      (!category || point.itemTypes.includes(category)) &&
      (!kind || point.kind === kind) &&
      (!format || point.format === format) &&
      (!status || (paused ? "paused" : "accepting") === status)
    );
  });

  const selected =
    visible.find((point) => point.id === selectedId) ?? visible[0];
  const hasFilters = Boolean(category || kind || format || status);
  const count = visible.length;
  const countText = `${count} ${count === 1 ? "пункт" : count >= 2 && count <= 4 ? "пункта" : "пунктов"}`;
  const SelectedKindIcon = selected
    ? kindIcons[selected.kind]
    : kindIcons.exchange;

  function reset() {
    setCategory("");
    setKind("");
    setFormat("");
    setStatus("");
    setSelectedId(points[0].id);
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
          <p className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
              <MapPin />
              Екатеринбург
            </span>
            <span className="ml-3">Демонстрационные пункты</span>
          </p>
        </div>
      </section>

      <section className="mx-auto mb-5 grid w-full max-w-[1550px] grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-0">
        <div className="text-muted-foreground grid min-w-0 gap-1.5 text-[13px]">
          <label htmlFor="point-filter-category">Что сдаёте</label>
          <span className="relative block">
            <select
              id="point-filter-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="border-border bg-card text-foreground h-11 w-full cursor-pointer appearance-none rounded-2xl border pr-9 pl-3 text-sm"
            >
              <option value="">Все вещи</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-3.5 right-3 size-4" />
          </span>
        </div>
        <div className="text-muted-foreground grid min-w-0 gap-1.5 text-[13px]">
          <label htmlFor="point-filter-kind">Тип пункта</label>
          <span className="relative block">
            <select
              id="point-filter-kind"
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              className="border-border bg-card text-foreground h-11 w-full cursor-pointer appearance-none rounded-2xl border pr-9 pl-3 text-sm"
            >
              <option value="">Все типы</option>
              {Object.entries(kindLabels).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
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
            <h2 className="text-[17px] font-semibold">{countText}</h2>
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

          {selected ? (
            <>
              <article className="bg-secondary mx-3 mb-2 grid justify-items-start gap-1.5 rounded-xl px-4 pt-3.5 pb-4">
                <span className="text-secondary-foreground flex items-center gap-2 text-[13px] [&_svg]:size-4 [&_svg]:shrink-0">
                  <SelectedKindIcon />
                  {kindLabels[selected.kind]}
                </span>
                <h3 className="text-xl leading-6.5 font-semibold">
                  {selected.title}
                </h3>
                <p className="text-secondary-foreground text-sm">
                  {selected.address}
                </p>
                <span
                  className="text-primary data-[paused=true]:text-foreground flex w-fit items-center gap-2 text-[13px] font-semibold [&>span]:size-2 [&>span]:rounded-full [&>span]:bg-current data-[paused=true]:[&>span]:border-[1.5px] data-[paused=true]:[&>span]:border-current data-[paused=true]:[&>span]:bg-transparent"
                  data-paused={selected.status !== "active"}
                >
                  <span />
                  {selected.status !== "active"
                    ? "Временно не принимает"
                    : "Принимает вещи"}
                </span>
                <p className="text-sm">{selected.accepts}</p>
                <p className="text-secondary-foreground flex flex-wrap gap-x-3 gap-y-1 text-[13px]">
                  {selected.status === "active" && (
                    <span>{selected.hours}</span>
                  )}
                  <span>{formatLabels[selected.format]}</span>
                </p>
                <Button
                  type="button"
                  onClick={() => navigate(`/points/${selected.id}`)}
                  className="mt-1 h-11 px-4 font-medium"
                >
                  Открыть пункт <ChevronRight />
                </Button>
              </article>
              {visible.length > 1 && (
                <ul className="min-h-0 overflow-y-auto px-3 pb-2">
                  {visible
                    .filter((point) => point.id !== selected.id)
                    .map((point) => {
                      const Icon = kindIcons[point.kind];
                      return (
                        <li key={point.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(point.id)}
                            className="hover:bg-muted grid min-h-16 w-full grid-cols-[34px_minmax(0,1fr)_16px] items-center gap-2.5 rounded-[10px] p-2 text-left"
                          >
                            <span className="bg-muted text-primary grid size-8.5 place-items-center rounded-[9px]">
                              <Icon className="size-4" />
                            </span>
                            <span>
                              <strong className="block text-sm font-semibold wrap-break-word">
                                {point.title}
                              </strong>
                              <small className="text-muted-foreground mt-0.5 block text-xs wrap-break-word">
                                {`${point.address}${point.status !== "active" ? ", приём приостановлен" : ""}`}
                              </small>
                            </span>
                            <ChevronRight className="size-4 shrink-0" />
                          </button>
                        </li>
                      );
                    })}
                </ul>
              )}
            </>
          ) : (
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
          <div className="bg-secondary relative min-h-0 overflow-hidden">
            <img
              src="/src/assets/images/ekaterinburg-map.png"
              alt=""
              className="size-full object-cover opacity-[0.83] grayscale dark:brightness-75 dark:invert"
            />
            {visible.map((point) => {
              const Icon = kindIcons[point.kind];
              const paused = point.status !== "active";
              const active = selected?.id === point.id;
              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedId(point.id)}
                  className="text-secondary-foreground border-primary bg-card data-[active=true]:border-card data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[paused=true]:border-muted-foreground data-[paused=true]:text-muted-foreground absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] data-[paused=true]:border-dashed"
                  data-active={active}
                  data-paused={paused}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <Icon className="size-3" />
                </button>
              );
            })}
          </div>
          <div className="border-border flex flex-wrap gap-x-5.5 gap-y-2.5 border-t px-4 py-3">
            {Object.entries(kindLabels).map(([value, text]) => {
              const Icon = kindIcons[value as keyof typeof kindIcons];
              return (
                <span
                  key={value}
                  className="text-muted-foreground [&_svg]:text-primary flex items-center gap-2 text-[13px] [&_svg]:size-4 [&_svg]:shrink-0"
                >
                  <Icon />
                  {text}
                </span>
              );
            })}
            <span className="text-muted-foreground flex items-center gap-2 text-[13px] [&_svg]:size-4 [&_svg]:shrink-0">
              <span className="size-4 rounded-full border-[1.5px] border-dashed border-current" />
              Приём приостановлен
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
