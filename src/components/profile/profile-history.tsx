import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useExchanges, useMe } from "@/hooks";
import { exchangeMoment, exchangeStatusLabel, formatDayMonth } from "./format";
import { MediaCover } from "./media-cover";

export function ProfileHistory() {
  const { data: user } = useMe();
  const { data: exchangePage, isLoading, isError } = useExchanges();
  const exchanges = [...(exchangePage?.results ?? [])].sort(
    (a, b) =>
      new Date(exchangeMoment(b)).getTime() -
      new Date(exchangeMoment(a)).getTime(),
  );

  if (isLoading) return <span>Загрузка...</span>;
  if (isError) return <span>Ошибка загрузки данных</span>;
  if (!exchanges.length) {
    return (
      <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
        <h2 className="text-lg font-semibold">Пока нет передач</h2>
      </div>
    );
  }

  return (
    <section
      aria-label="История обменов"
      className="border-border bg-card overflow-hidden rounded-2xl border"
    >
      <ul className="divide-border divide-y">
        {exchanges.map((exchange) => {
          const done = exchange.status === "completed";
          const when = formatDayMonth(exchangeMoment(exchange));
          const otherId =
            user && user.id === exchange.giver_id
              ? exchange.receiver_id
              : exchange.giver_id;

          return (
            <li key={exchange.id} className="flex items-center gap-4 px-5 py-4">
              <MediaCover src={exchange.item.cover} />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/item/${exchange.item.id}`}
                  className="hover:text-primary line-clamp-2 font-semibold"
                >
                  {exchange.item.title}
                </Link>
                {done && otherId && (
                  <Link
                    to={`/users/${otherId}/review/${exchange.id}`}
                    className="text-primary mt-1 inline-flex text-sm font-semibold hover:underline hover:underline-offset-4"
                  >
                    Отзыв после обмена
                  </Link>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5 text-sm">
                <span
                  className={`inline-flex items-center gap-1 font-semibold ${
                    done ? "text-primary" : "text-foreground"
                  }`}
                >
                  {done && <ArrowUpRight className="size-4" />}
                  {exchangeStatusLabel[exchange.status]}
                </span>
                {when && <span className="text-muted-foreground">{when}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
