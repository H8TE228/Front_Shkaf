import { Link } from "react-router-dom";
import { ArrowUpRight, Feather, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useExchanges } from "@/hooks";
import type { TExchange } from "@/types";
import { exchangeMoment, exchangeStatusLabel, formatDayMonth } from "./format";
import { MediaCover } from "./media-cover";

export function ProfileOverview({ onHistory }: { onHistory: () => void }) {
  const { data: exchangePage, isLoading, isError } = useExchanges();
  const exchanges = exchangePage?.results ?? [];
  const latest = [...exchanges].sort(
    (a, b) =>
      new Date(exchangeMoment(b)).getTime() -
      new Date(exchangeMoment(a)).getTime(),
  )[0];

  return (
    <div className="grid gap-7">
      <section className="border-border bg-card flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 sm:flex-row">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-secondary text-primary grid size-8 place-items-center rounded-[10px]">
              <Feather className="size-4" />
            </span>
            <h2 className="text-primary text-[15px] font-semibold">
              Экологический вклад
            </h2>
          </div>
          {isLoading && <p className="mt-3.5 text-sm">Загрузка...</p>}
          {!isLoading && isError && (
            <p className="mt-3.5 text-sm">Ошибка загрузки данных</p>
          )}
          {!isLoading && !isError && !exchanges.length && (
            <p className="text-muted-foreground mt-3.5 text-sm">
              Пока нет передач
            </p>
          )}
        </div>
        <Button type="button" className="h-11 rounded-xl px-5 font-semibold">
          <Plus /> Отдать вещь
        </Button>
      </section>

      {!isLoading && !isError && latest && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Последняя передача</h2>
            <Button
              type="button"
              variant="link"
              onClick={onHistory}
              className="h-auto px-0 text-sm font-semibold"
            >
              Открыть историю
            </Button>
          </div>
          <ExchangeCard exchange={latest} />
        </section>
      )}
    </div>
  );
}

function ExchangeCard({ exchange }: { exchange: TExchange }) {
  const done = exchange.status === "completed";
  const when = formatDayMonth(exchangeMoment(exchange));

  return (
    <article className="border-border bg-card flex items-center gap-4 rounded-2xl border p-4">
      <MediaCover src={exchange.item.cover} />
      <div className="min-w-0 flex-1">
        <Link
          to={`/item/${exchange.item.id}`}
          className="hover:text-primary line-clamp-2 font-semibold"
        >
          {exchange.item.title}
        </Link>
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
    </article>
  );
}
