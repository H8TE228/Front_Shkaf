import { Map, Newspaper, Search, UserRound } from "lucide-react";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { LocationButton } from "../location-button";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-border bg-header-background sticky top-0 z-20 h-20 border-b px-0 backdrop-blur-sm lg:px-12">
      <div className="mx-auto flex h-full w-full max-w-[1550px] items-center gap-4 px-6 lg:px-0">
        <Link
          to="/"
          className="text-primary shrink-0 text-lg leading-6 font-semibold whitespace-nowrap"
        >
          Добрый Шкаф
        </Link>
        <LocationButton />
        <div className="bg-muted relative hidden h-12 flex-1 rounded-xl sm:block">
          <Search className="text-muted-foreground pointer-events-none absolute top-3 left-4 size-6" />
          <Input
            className="placeholder:text-muted-foreground size-full rounded-xl border-0 py-0 pr-4 pl-11 text-sm outline-none"
            placeholder="Найти нужную вещь"
          />
        </div>
        <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            onClick={() => navigate("/points")}
            type="button"
            className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
          >
            <Map className="size-6" />
            <span className="hidden sm:block">Пункты</span>
          </button>
          <button
            onClick={() => navigate("/articles")}
            type="button"
            className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
          >
            <Newspaper className="size-6" />
            <span className="hidden sm:block">Статьи</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
          >
            <UserRound className="size-6" />
            <span className="hidden sm:block">Войти</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
