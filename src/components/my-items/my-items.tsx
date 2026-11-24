import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Check, ChevronRight, EyeOff, MapPin, Pencil, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useMyItems } from "@/hooks";
import type { TItem } from "@/types";

type ItemFilter = "all" | "active" | "hidden" | "given";

const exchangeFormatTitle = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "За баллы",
} as const;

const conditionTitle = {
  new: "Новое",
  good: "Хорошее состояние",
  used: "Б/у",
} as const;

function itemGroup(status?: TItem["status"]): Exclude<ItemFilter, "all"> {
  if (status === "given") return "given";
  if (status === "draft" || status === "archived") return "hidden";
  return "active";
}

function statusView(status?: TItem["status"]) {
  if (itemGroup(status) === "given") {
    return { label: "Передано", icon: Check, className: "text-foreground" };
  }
  if (itemGroup(status) === "hidden") {
    return { label: "Скрыто", icon: EyeOff, className: "text-muted-foreground" };
  }
  return { label: "Опубликовано", icon: null, className: "text-primary" };
}

export function MyItems() {
  const { data, isLoading, isError } = useMyItems();
  const [filter, setFilter] = useState<ItemFilter>("all");
  const items = data ?? [];
  const counts = {
    all: items.length,
    active: items.filter((item) => itemGroup(item.status) === "active").length,
    hidden: items.filter((item) => itemGroup(item.status) === "hidden").length,
    given: items.filter((item) => itemGroup(item.status) === "given").length,
  };
  const visible =
    filter === "all"
      ? items
      : items.filter((item) => itemGroup(item.status) === filter);
  const tabs: [ItemFilter, string, number][] = [
    ["all", "Все", counts.all],
    ["active", "Опубликовано", counts.active],
    ["hidden", "Скрыты", counts.hidden],
    ["given", "Переданы", counts.given],
  ];

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <span>Мои вещи</span>
        </nav>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
            Мои вещи
          </h1>
          <Button type="button" className="h-12 rounded-xl px-5 font-semibold">
            <Plus /> Разместить вещь
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 pb-12 lg:px-0">
        <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Статус вещей">
          {tabs.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm ${
                filter === id
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
              }`}
            >
              {label}
              <span className="text-[13px]">{count}</span>
            </button>
          ))}
        </div>

        {isLoading && <span>Загрузка...</span>}
        {!isLoading && isError && <span>Ошибка загрузки данных</span>}
        {!isLoading && !isError && !visible.length && (
          <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">Пока нет вещей</h2>
          </div>
        )}
        {!isLoading && !isError && !!visible.length && (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ItemCard({ item }: { item: TItem }) {
  const photo = [...(item.photos ?? [])].sort((a, b) => a.position - b.position)[0];
  const status = statusView(item.status);
  const StatusIcon = status.icon;
  const size = item.size?.trim();
  const detail = size || conditionTitle[item.condition];
  const district = item.district?.trim();
  const given = itemGroup(item.status) === "given";

  return (
    <li className="border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border">
      <div className="bg-muted text-muted-foreground grid aspect-square place-items-center">
        {photo?.image ? (
          <img src={photo.image} alt="" className="size-full object-cover" />
        ) : (
          <Camera className="size-11" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className={`flex items-center gap-2 text-sm font-semibold ${status.className}`}>
          {StatusIcon ? (
            <StatusIcon className="size-4" />
          ) : (
            <span className="size-2 rounded-full bg-current" />
          )}
          {status.label}
        </span>
        <p className="text-muted-foreground mt-3 text-sm">
          {exchangeFormatTitle[item.exchange_format]}
        </p>
        <h2 className="mt-1 text-lg leading-6 font-semibold">{item.title}</h2>
        {detail && <p className="mt-1 text-sm">{detail}</p>}
        {district && (
          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
            <MapPin className="size-3.5 shrink-0" />
            {district}
          </p>
        )}
        <div className="mt-auto pt-4">
          {given ? (
            <Button
              render={<Link to={`/item/${item.id}`} />}
              nativeButton={false}
              variant="secondary"
              className="h-11 w-full rounded-xl font-semibold"
            >
              Посмотреть
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="h-11 w-full rounded-xl font-semibold"
            >
              <Pencil /> Редактировать
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
