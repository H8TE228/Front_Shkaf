import { useMe } from "@/hooks";
import { Map, Newspaper, PackageSearch, Search, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { data: isAuth } = useMe();

  return (
    <nav className="border-border bg-background fixed inset-x-0 bottom-0 z-40 flex h-24 items-center justify-around border-t md:hidden">
      <button
        onClick={() => navigate("/catalog")}
        type="button"
        className="text-foreground hover:text-foreground/80 flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[10px] transition-colors"
      >
        <PackageSearch className="size-7" />
      </button>
      <button
        onClick={() => navigate("/points")}
        type="button"
        className="text-foreground hover:text-foreground/80 flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[10px] transition-colors"
      >
        <Map className="size-7" />
      </button>
      <button
        onClick={() => navigate("#")}
        type="button"
        className="text-primary hover:text-primary/80 flex h-full flex-1 cursor-pointer items-center justify-center transition-colors"
      >
        <Search className="size-9" />
      </button>
      <button
        onClick={() => navigate("/articles")}
        type="button"
        className="text-foreground hover:text-foreground/80 flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[10px] transition-colors"
      >
        <Newspaper className="size-7" />
      </button>
      <button
        onClick={() => navigate(isAuth ? "/profile" : "/login")}
        type="button"
        className="text-foreground hover:text-foreground/80 flex h-full flex-1 cursor-pointer flex-col items-center justify-center gap-1 text-[10px] transition-colors"
      >
        <UserRound className="size-7" />
      </button>
    </nav>
  );
}
