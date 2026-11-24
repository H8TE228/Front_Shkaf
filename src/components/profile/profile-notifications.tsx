/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Check, Package } from "lucide-react";
import { Button } from "../ui/button";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks";
import type { TNotification, TNotificationType } from "@/types";
import { formatDayMonth } from "./format";
import { ProfileSubscriptions } from "./profile-subscriptions";

const typeLabel: Record<TNotificationType, string> = {
  new_item: "Новое объявление по подписке",
  exchange_requested: "Запрос на обмен",
  exchange_agreed: "Обмен согласован",
  exchange_declined: "Обмен отклонён",
  exchange_cancelled: "Обмен отменён",
  exchange_completed: "Обмен завершён",
};

function payloadText(payload: unknown, keys: string[]) {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function notificationCopy(notification: TNotification) {
  const headline = payloadText(notification.payload, [
    "title",
    "item_title",
    "name",
  ]);
  const detail = payloadText(notification.payload, [
    "subtitle",
    "description",
    "message",
    "body",
    "text",
    "query",
  ]);
  const fallback = typeLabel[notification.type];
  return {
    title: headline || detail || fallback,
    subtitle: headline ? detail || fallback : "",
  };
}

export function ProfileNotifications() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNotifications();
  const {
    mutate: markRead,
    isPending: isMarking,
    variables,
  } = useMarkNotificationRead();
  const { mutate: markAll, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const subscriptionsOpen = params.get("section") === "subscriptions";
  const notifications = data?.results ?? [];
  const unread = notifications.filter((item) => !item.read_at);
  const visible = filter === "unread" ? unread : notifications;

  if (subscriptionsOpen) return <ProfileSubscriptions />;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Уведомления</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setParams({ tab: "notifications", section: "subscriptions" })
          }
          className="h-9 rounded-xl px-3.5 font-semibold"
        >
          Настроить подписки
        </Button>
      </div>

      <section className="border-border bg-card overflow-hidden rounded-2xl border">
        <div className="border-border flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <div
            className="flex gap-1.5"
            role="group"
            aria-label="Фильтр уведомлений"
          >
            {(
              [
                ["all", "Все"],
                ["unread", `Непрочитанные ${unread.length}`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={`inline-flex h-10 cursor-pointer items-center rounded-xl px-4 text-sm ${
                  filter === id
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!unread.length || isMarkingAll}
            onClick={() => markAll()}
            className="ml-auto h-9 rounded-xl px-3.5 font-semibold"
          >
            <Check /> Отметить все прочитанными
          </Button>
        </div>

        {isLoading && <p className="px-5 py-6 text-sm">Загрузка...</p>}
        {!isLoading && isError && (
          <p className="px-5 py-6 text-sm">Ошибка загрузки данных</p>
        )}
        {!isLoading && !isError && !visible.length && (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-semibold">
              {filter === "unread"
                ? "Нет непрочитанных уведомлений"
                : "Пока нет уведомлений"}
            </h3>
          </div>
        )}
        {!isLoading && !isError && !!visible.length && (
          <ul className="divide-border divide-y">
            {visible.map((notification) => {
              const copy = notificationCopy(notification);
              const unreadItem = !notification.read_at;
              const Icon =
                notification.type === "new_item" ? Package : Calendar;
              const when = formatDayMonth(notification.created_at);

              return (
                <li
                  key={notification.id}
                  onClick={() =>
                    navigate(`/item/${(notification!.payload as any).item_id}`)
                  }
                  className="flex cursor-pointer items-start gap-3 px-4 py-4"
                >
                  {unreadItem && (
                    <span className="bg-primary mt-5 size-2 shrink-0 rounded-full" />
                  )}
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                      unreadItem
                        ? "bg-secondary text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{copy.title}</p>
                    {copy.subtitle && copy.subtitle !== copy.title && (
                      <p className="text-muted-foreground mt-0.5 text-sm">
                        {copy.subtitle}
                      </p>
                    )}
                    {unreadItem && (
                      <button
                        type="button"
                        disabled={isMarking && variables === notification.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(notification.id);
                        }}
                        className="text-primary hover:text-primary/80 mt-2 inline-flex cursor-pointer items-center gap-1 text-sm font-semibold disabled:opacity-50"
                      >
                        <Check className="size-4" />
                        Отметить прочитанным
                      </button>
                    )}
                  </div>
                  {when && (
                    <time className="text-muted-foreground shrink-0 text-sm">
                      {when}
                    </time>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
