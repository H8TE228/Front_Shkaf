import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, CircleCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  useCreateReview,
  useExchange,
  useItemById,
  useUsers,
} from "@/hooks";
import { exchangeStatusLabel, formatDayMonth, personName } from "../profile/format";
import { MediaCover } from "../profile/media-cover";
import { StarPicker } from "../user-profile/stars";

const limit = 500;

export function ExchangeReview({
  userId,
  exchangeId,
}: {
  userId: string;
  exchangeId: string;
}) {
  const navigate = useNavigate();
  const exchange = useExchange(exchangeId);
  const users = useUsers();
  const item = useItemById(
    exchange.data ? String(exchange.data.item.id) : "",
  );
  const { mutate, isPending, isError } = useCreateReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const person = users.data?.find((entry) => String(entry.id) === userId);
  const name = person ? personName(person) : "";
  const title = name ? `Профиль ${name}` : "Профиль";
  const size = item.data?.size?.trim();
  const partner = name ? `Обмен с ${name}` : "Обмен";
  const subtitle = size ? `${partner}, ${size}` : partner;
  const current = exchange.data;
  const done = current?.status === "completed";
  const when = formatDayMonth(current?.completed_at || current?.created_at);

  if (exchange.isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Загрузка...</span>
      </section>
    );
  }

  if (exchange.isError || !current) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Ошибка загрузки данных</span>
      </section>
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!rating) return;
    mutate(
      {
        exchange_id: current.id,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      },
      {
        onSuccess: () => navigate(`/users/${userId}`),
      },
    );
  }

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex flex-wrap items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <Link
            to={`/users/${userId}`}
            className="hover:underline hover:underline-offset-4"
          >
            {title}
          </Link>
          <ChevronRight />
          <span>Отзыв после обмена</span>
        </nav>
        <h1 className="mb-7 text-[32px] leading-10 font-semibold tracking-tight">
          Отзыв после обмена
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 pb-12 lg:px-0">
        <form
          onSubmit={submit}
          className="border-border bg-card grid max-w-3xl gap-6 rounded-2xl border p-6 sm:p-8"
        >
          <div className="flex items-center gap-4">
            <MediaCover src={current.item.cover} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{current.item.title}</p>
              <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
            </div>
            <div
              className={`flex shrink-0 flex-col items-end text-sm font-semibold ${
                done ? "text-primary" : "text-foreground"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                {done && <CircleCheck className="size-4" />}
                {done ? "Обмен завершён" : exchangeStatusLabel[current.status]}
              </span>
              {when && (
                <span className="text-muted-foreground mt-0.5 font-normal">
                  {when}
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {name ? `Как прошёл обмен с ${name}?` : "Как прошёл обмен?"}
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Оцените, как вы договорились и как прошла передача.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium">Ваша оценка обмена</span>
              {!rating && (
                <span className="text-muted-foreground text-sm">
                  Выберите оценку
                </span>
              )}
            </div>
            <StarPicker value={rating} onChange={setRating} />
            <p className="text-muted-foreground text-sm">
              1 очень плохо, 5 отлично.
            </p>
          </div>

          <label className="grid gap-2">
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-medium">Комментарий</span>
              <span className="text-muted-foreground text-sm font-normal">
                необязательно
              </span>
            </span>
            <span className="relative">
              <Textarea
                value={comment}
                maxLength={limit}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Например, удобно ли было договориться о встрече"
                className="border-input bg-muted min-h-24 rounded-lg border px-4 py-3"
              />
              <span className="text-muted-foreground mt-1 block text-right text-sm">
                {comment.length} / {limit}
              </span>
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              disabled={!rating || isPending}
              className="h-11 rounded-xl px-5 font-semibold"
            >
              Отправить отзыв
            </Button>
            {!rating && (
              <span className="text-muted-foreground text-sm">
                Выберите оценку, чтобы отправить отзыв.
              </span>
            )}
          </div>
          {isError && (
            <p className="text-destructive text-sm">Не удалось отправить отзыв</p>
          )}
        </form>
      </section>
    </div>
  );
}
