import { Map, Newspaper, PackageSearch, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LocationButton } from "../location-button";
import { useMe } from "@/hooks";
import { InputSearch } from "../input-search";

export function Header() {
  const navigate = useNavigate();
  const { data: isAuth } = useMe();

  return (
    <header className="border-border bg-header-background sticky top-0 z-20 h-20 border-b px-0 backdrop-blur-sm lg:px-12">
      <div className="mx-auto flex h-full w-full max-w-[1550px] items-center justify-between gap-4 px-6 md:justify-normal lg:px-0">
        <Link
          to="/"
          className="text-primary shrink-0 text-lg leading-6 font-semibold whitespace-nowrap"
        >
          Добрый Шкаф
        </Link>
        <LocationButton />
        <div className="hidden flex-1 md:block">
          <InputSearch />
        </div>
        <nav className="ml-auto hidden shrink-0 items-center gap-1 sm:gap-3 md:flex">
          <button
            onClick={() => navigate("/catalog")}
            type="button"
            className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
          >
            <PackageSearch className="size-6" />
            <span className="hidden sm:block">Каталог</span>
          </button>
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
            onClick={() => {
              if (isAuth) {
                navigate("/profile");
              } else {
                navigate("/login");
              }
            }}
            type="button"
            className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
          >
            <UserRound className="size-6" />
            <span className="hidden sm:block">Профиль</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
