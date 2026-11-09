import { useMe } from "@/hooks";
import { Map, Newspaper, PackageSearch, Search, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: isAuth } = useMe();

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  const profileIsActive =
    isActive("/profile") || pathname === "/login" || pathname === "/register";

  return (
    <nav className="bg-bottom-nav-background fixed inset-x-0 bottom-0 z-40 grid h-30 grid-cols-5 items-center justify-items-center rounded-t-4xl border-t px-2 backdrop-blur md:hidden">
      <button
        onClick={() => navigate("/articles")}
        className={`flex size-18 cursor-pointer items-center justify-center rounded-2xl transition-colors ${
          isActive("/articles")
            ? "bg-secondary text-primary"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <Newspaper className="size-7" />
      </button>

      <button
        onClick={() => navigate("/points")}
        className={`flex size-18 cursor-pointer items-center justify-center rounded-2xl transition-colors ${
          isActive("/points")
            ? "bg-secondary text-primary"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <Map className="size-7" />
      </button>

      <button
        onClick={() => navigate("#")}
        aria-label="Поиск"
        className="text-primary hover:bg-muted flex size-23 cursor-pointer items-center justify-center rounded-2xl transition-colors"
      >
        <Search className="size-9" />
      </button>

      <button
        onClick={() => navigate("/catalog")}
        className={`flex size-18 cursor-pointer items-center justify-center rounded-2xl transition-colors ${
          isActive("/catalog") || isActive("/item")
            ? "bg-secondary text-primary"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <PackageSearch className="size-7" />
      </button>

      <button
        onClick={() => navigate(isAuth ? "/profile" : "/login")}
        className={`flex size-18 cursor-pointer items-center justify-center rounded-2xl transition-colors ${
          profileIsActive
            ? "bg-secondary text-primary"
            : "text-foreground hover:bg-muted"
        }`}
      >
        <UserRound className="size-7" />
      </button>
    </nav>
  );
}
