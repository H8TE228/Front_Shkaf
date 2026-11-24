import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Check,
  ChevronRight,
  EyeOff,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { DeleteItemDialog, EditItemDialog } from "../items/edit-item-form";
import { useMyItems, useUpdateItem } from "@/hooks";
import type { TItem } from "@/types";
import { isAxiosError } from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
    return {
      label: "Скрыто",
      icon: EyeOff,
      className: "text-muted-foreground",
    };
  }
  return { label: "Опубликовано", icon: null, className: "text-primary" };
}

function getErrorMessage(
  error: unknown,
  fallback = "Не удалось сохранить изменения. Попробуйте ещё раз.",
) {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }

  return fallback;
}

export function MyItems() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useMyItems();
  const [filter, setFilter] = useState<ItemFilter>("all");
  const items = data?.results ?? [];
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
          <Link
            to="/my-items"
            className="hover:underline hover:underline-offset-4"
          >
            Мои вещи
          </Link>
        </nav>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
            Мои вещи
          </h1>
          <Button
            onClick={() => navigate("/items/new")}
            type="button"
            className="h-10 rounded-xl px-5 font-semibold"
          >
            <Plus /> Разместить вещь
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 pb-12 lg:px-0">
        <div
          className="mb-5 flex flex-wrap gap-1.5"
          role="group"
          aria-label="Статус вещей"
        >
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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const photo = [...(item.photos ?? [])].sort(
    (a, b) => a.position - b.position,
  )[0];
  const status = statusView(item.status);
  const StatusIcon = status.icon;
  const size = item.size?.trim();
  const detail = size || conditionTitle[item.condition];
  const district = item.district?.trim();
  const given = itemGroup(item.status) === "given";
  const updateItem = useUpdateItem();
  const [activationError, setActivationError] = useState<string | null>(null);

  function activateItem(id: string) {
    setActivationError(null);
    const itemData = new FormData();
    itemData.append("status", "active");

    updateItem.mutate(
      { id, itemData },
      {
        onError: (error) => {
          setActivationError(getErrorMessage(error));
        },
      },
    );
  }

  return (
    <>
      <li className="border-border bg-card flex h-full flex-col overflow-hidden rounded-2xl border">
        <div className="bg-muted text-muted-foreground grid aspect-square place-items-center">
          {photo?.image ? (
            <img src={photo.image} alt="" className="size-full object-cover" />
          ) : (
            <Camera className="size-11" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <span
            className={`flex items-center justify-between text-sm font-semibold ${status.className}`}
          >
            <div className="flex items-center gap-2">
              {StatusIcon ? (
                <StatusIcon className="size-4" />
              ) : (
                <span className="size-2 rounded-full bg-current" />
              )}
              {status.label}{" "}
            </div>
            {(item.status ?? "active") !== "active" && (
              <Button
                type="button"
                disabled={updateItem.isPending}
                onClick={() => {
                  activateItem(item.id.toString());
                }}
                className=""
              >
                {updateItem.isPending ? "Обновляем..." : "Опубликовать"}
              </Button>
            )}
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
          <div className="mt-auto flex gap-2 pt-4">
            {given ? (
              <Button
                render={<Link to={`/item/${item.id}`} />}
                nativeButton={false}
                variant="secondary"
                className="h-11 min-w-0 flex-1 rounded-xl px-2 font-semibold"
              >
                Посмотреть
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                className="h-11 min-w-0 flex-1 rounded-xl px-2 font-semibold"
                onClick={() => setEditOpen(true)}
              >
                <Pencil /> Редактировать
              </Button>
            )}
            <Button
              type="button"
              variant="destructive"
              className="h-11 shrink-0 rounded-xl px-3 font-semibold"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 /> Удалить
            </Button>
          </div>
        </div>
      </li>
      {editOpen && (
        <EditItemDialog
          item={item}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
      {deleteOpen && (
        <DeleteItemDialog
          item={item}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
      {activationError && (
        <Alert variant="destructive">
          <AlertTitle>Не удалось активировать объявление</AlertTitle>
          <AlertDescription>{activationError}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
