import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  useCreateSubscription,
  useDeleteSubscription,
  useItemTypes,
  useSubscriptions,
} from "@/hooks";

export function ProfileSubscriptions() {
  const subscriptions = useSubscriptions();
  const itemTypes = useItemTypes();
  const { mutate: createSubscription, isPending: isCreating } =
    useCreateSubscription();
  const { mutate: deleteSubscription, isPending: isDeleting, variables } =
    useDeleteSubscription();
  const [adding, setAdding] = useState(false);
  const [events, setEvents] = useState(false);
  const taken = new Set(
    (subscriptions.data ?? [])
      .map((item) => item.item_type)
      .filter((id): id is number => id != null),
  );
  const available = (itemTypes.data ?? []).filter((type) => !taken.has(type.id));

  return (
    <div className="border-border bg-card grid max-w-3xl gap-7 rounded-2xl border p-6 sm:p-8">
      <section className="grid gap-3">
        <div>
          <h2 className="text-xl font-semibold">Новые объявления</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Уведомления о новых вещах в выбранных категориях.
          </p>
        </div>

        {(subscriptions.isLoading || itemTypes.isLoading) && (
          <p className="text-sm">Загрузка...</p>
        )}
        {(subscriptions.isError || itemTypes.isError) && (
          <p className="text-sm">Ошибка загрузки данных</p>
        )}

        {!subscriptions.isLoading &&
          !subscriptions.isError &&
          !itemTypes.isLoading &&
          !itemTypes.isError && (
            <>
              {!!subscriptions.data?.length && (
                <ul className="divide-border divide-y">
                  {subscriptions.data.map((subscription) => {
                    const title =
                      itemTypes.data?.find(
                        (type) => type.id === subscription.item_type,
                      )?.title || "Любая категория";
                    return (
                      <li
                        key={subscription.id}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <span className="font-medium">{title}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Удалить подписку, ${title}`}
                          disabled={isDeleting && variables === subscription.id}
                          onClick={() => deleteSubscription(subscription.id)}
                          className="text-muted-foreground size-9"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {!subscriptions.data?.length && (
                <p className="text-muted-foreground text-sm">Пока нет подписок</p>
              )}
              <Button
                type="button"
                disabled={!available.length || isCreating}
                onClick={() => setAdding((value) => !value)}
                className="h-11 w-fit rounded-xl px-5 font-semibold"
              >
                <Plus /> Добавить подписку
              </Button>
              {adding && !!available.length && (
                <div className="flex flex-wrap gap-2">
                  {available.map((type) => (
                    <Button
                      key={type.id}
                      type="button"
                      variant="outline"
                      disabled={isCreating}
                      onClick={() =>
                        createSubscription(
                          { item_type: type.id },
                          { onSuccess: () => setAdding(false) },
                        )
                      }
                      className="h-9 rounded-xl px-3.5"
                    >
                      {type.title}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
      </section>

      <section className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Акции и сборы</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Напоминания о ближайших акциях и сборах вещей.
          </p>
        </div>
        <Switch
          checked={events}
          onCheckedChange={setEvents}
          aria-label="Напоминания о ближайших акциях и сборах вещей"
          className="mt-1"
        />
      </section>
    </div>
  );
}
