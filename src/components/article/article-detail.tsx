import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { buttonVariants } from "../ui/button";
import { articles } from "./article-data";

function headingId(title: string) {
  return `section-${title
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[^a-zа-я0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export function ArticleDetail() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-8 lg:px-0 lg:pt-12">
        <p className="text-muted-foreground">Статья не найдена.</p>
        <Link
          to="/articles"
          className={buttonVariants({
            variant: "outline",
            className: "mt-4 cursor-pointer",
          })}
        >
          Ко всем статьям
        </Link>
      </section>
    );
  }

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.topic === article.topic) - Number(a.topic === article.topic),
    )
    .slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-8 lg:px-0 lg:pt-12">
      <nav className="text-muted-foreground mb-5 flex flex-wrap items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
        <Link to="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight />
        <Link to="/articles" className="hover:text-foreground">
          Статьи и инструкции
        </Link>
        <ChevronRight />
        <Link to="#" className="hover:text-foreground">
          {article.title}
        </Link>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(220px,0.8fr)]">
        <article className="bg-card border-border min-w-0 rounded-2xl border p-5 sm:p-7">
          <span className="text-primary text-sm">{article.topic}</span>
          <h1 className="mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-[30px]">
            {article.title}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6 sm:text-base">
            {article.excerpt}
          </p>

          <div className="mt-6 space-y-6">
            {article.sections.map((section) => (
              <section key={section.title} id={headingId(section.title)}>
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link
              to="/points"
              className={buttonVariants({ className: "h-11" })}
            >
              Найти пункт приёма
            </Link>
            <Link
              to="/catalog"
              className={buttonVariants({
                variant: "outline",
                className: "h-11",
              })}
            >
              Открыть каталог
            </Link>
          </div>
        </article>

        <aside className="grid gap-7 lg:sticky lg:top-24">
          <nav aria-label="В этой статье">
            <h2 className="font-semibold">В этой статье</h2>
            <ul className="mt-3 grid gap-2.5">
              {article.sections.map((section) => (
                <li key={section.title}>
                  <a
                    href={`#${headingId(section.title)}`}
                    className="text-primary text-sm underline-offset-4 hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Читайте также">
            <h2 className="font-semibold">Читайте также</h2>
            <ul className="mt-3 grid gap-2.5">
              {relatedArticles.map((related) => (
                <li key={related.slug}>
                  <Link
                    to={`/articles/${related.slug}`}
                    className="text-muted-foreground hover:text-foreground flex items-center justify-between gap-2 text-sm"
                  >
                    {related.title}
                    <ChevronRight className="size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </section>
  );
}
