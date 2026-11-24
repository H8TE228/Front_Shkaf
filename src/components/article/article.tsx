import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { articleTopics, articles, type ArticleTopic } from "./article-data";

export function Article() {
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopic | "Все темы">(
    "Все темы",
  );
  const visibleArticles =
    selectedTopic === "Все темы"
      ? articles
      : articles.filter((article) => article.topic === selectedTopic);

  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-8 lg:px-0 lg:pt-12">
      <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
        <Link to="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight />
        <Link to="/articles" className="hover:text-foreground">
          Статьи и инструкции
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
          Статьи и инструкции
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Как подготовить вещи к передаче, ухаживать за ними и продлить их
          жизнь.
        </p>
      </header>

      <div
        aria-label="Темы статей"
        className="mb-5 flex flex-wrap gap-2"
        role="group"
      >
        {(["Все темы", ...articleTopics] as const).map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedTopic(topic)}
              className={`cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors ${
                isSelected
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className="group bg-card border-border hover:border-primary/40 flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition-colors sm:px-5"
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold">{article.title}</span>
                <span className="text-primary text-xs">{article.topic}</span>
              </span>
              <span className="text-muted-foreground mt-1.5 block max-w-3xl text-sm leading-5">
                {article.excerpt}
              </span>
            </span>
            <ChevronRight className="text-muted-foreground size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
