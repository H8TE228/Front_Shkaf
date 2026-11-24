import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { useItems, useReviews, useUserRating, useUsers } from "@/hooks";
import { formatDayMonth, personName, reviewsDative } from "../profile/format";
import { MediaCover } from "../profile/media-cover";
import { UserAvatar } from "../profile/user-avatar";
import { Stars } from "./stars";

export function UserProfile({ id }: { id: string }) {
  const [tab, setTab] = useState<"reviews" | "items">("reviews");
  const users = useUsers();
  const rating = useUserRating(id);
  const reviews = useReviews({ target_user: Number(id) });
  const items = useItems();
  const user = users.data?.results.find((entry) => String(entry.id) === id);
  const name = user ? personName(user) : "";
  const title = name ? `Профиль ${name}` : "Профиль";
  const ownItems = (items.data?.results ?? []).filter(
    (item) => String(item.owner_id) === id,
  );
  const reviewCount = reviews.data?.length ?? rating.data?.count ?? 0;
  const average = rating.data?.average;

  if (users.isLoading || rating.isLoading || reviews.isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Загрузка...</span>
      </section>
    );
  }

  if (reviews.isError && users.isError) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Ошибка загрузки данных</span>
      </section>
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
            to="/catalog"
            className="hover:underline hover:underline-offset-4"
          >
            Каталог
          </Link>
          <ChevronRight />
          <span>{title}</span>
        </nav>
        <h1 className="mb-7 text-[32px] leading-10 font-semibold tracking-tight">
          {title}
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-[1550px] items-start gap-6 px-6 pb-12 lg:grid-cols-[278px_minmax(0,1fr)] lg:px-0">
        <aside className="border-border bg-card grid gap-4 rounded-2xl border p-6">
          <div className="flex items-center gap-3.5">
            <UserAvatar
              src={user?.avatar}
              name={name}
              className="size-16 text-xl"
            />
            {name && <span className="text-lg font-semibold">{name}</span>}
          </div>
          {average != null && reviewCount > 0 && (
            <div>
              <div className="flex items-end gap-2.5">
                <span className="text-4xl leading-none font-semibold tracking-tight">
                  {new Intl.NumberFormat("ru", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }).format(average)}
                </span>
                <Stars value={average} />
              </div>
              <p className="text-muted-foreground mt-1.5 text-sm">
                из 5 по {reviewCount} {reviewsDative(reviewCount)}
              </p>
            </div>
          )}
          {reviewCount === 0 && (
            <p className="text-muted-foreground text-sm">Пока нет отзывов</p>
          )}
        </aside>

        <div className="min-w-0">
          <div className="mb-3 flex gap-1.5" role="group" aria-label="Разделы профиля">
            {(
              [
                ["reviews", "Отзывы", reviewCount],
                ["items", "Объявления", ownItems.length],
              ] as const
            ).map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl px-4 text-sm ${
                  tab === id
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                {label}
                <span className="text-[13px]">{count}</span>
              </button>
            ))}
          </div>

          {tab === "reviews" && reviews.isError && (
            <span>Ошибка загрузки данных</span>
          )}
          {tab === "reviews" && !reviews.isError && !reviews.data?.length && (
            <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">Пока нет отзывов</h2>
            </div>
          )}
          {tab === "reviews" && !reviews.isError && !!reviews.data?.length && (
            <div className="grid gap-3">
              {reviews.data.map((review) => {
                const author = personName(review.author);
                const when = formatDayMonth(review.created_at);
                return (
                  <article
                    key={review.id}
                    className="border-border bg-card rounded-2xl border p-5"
                  >
                    <div className="flex items-start gap-3">
                      <UserAvatar
                        src={review.author.avatar}
                        name={author}
                        className="size-10 text-base"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {author && (
                            <span className="font-semibold">{author}</span>
                          )}
                          <Stars value={review.rating} />
                        </div>
                        {review.comment?.trim() && (
                          <p className="mt-2">{review.comment}</p>
                        )}
                        {review.item?.title && (
                          <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-[13px]">
                            <Package className="size-4 shrink-0" />
                            После обмена вещью «{review.item.title}»
                          </p>
                        )}
                      </div>
                      {when && (
                        <time className="text-muted-foreground shrink-0 text-sm">
                          {when}
                        </time>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {tab === "items" && items.isLoading && <span>Загрузка...</span>}
          {tab === "items" && items.isError && (
            <span>Ошибка загрузки данных</span>
          )}
          {tab === "items" && !items.isLoading && !items.isError && !ownItems.length && (
            <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">Пока нет объявлений</h2>
            </div>
          )}
          {tab === "items" && !items.isLoading && !items.isError && !!ownItems.length && (
            <section className="border-border bg-card overflow-hidden rounded-2xl border">
              <ul className="divide-border divide-y">
                {ownItems.map((item) => {
                  const photo = [...item.photos].sort(
                    (a, b) => a.position - b.position,
                  )[0];
                  return (
                    <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                      <MediaCover src={photo?.image} />
                      <Link
                        to={`/item/${item.id}`}
                        className="hover:text-primary min-w-0 flex-1 font-semibold"
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
