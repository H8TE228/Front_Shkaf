import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

export function Footer() {
  // const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-muted mt-16 border-t px-0 py-10 lg:px-12">
      <div className="mx-auto grid w-full max-w-[1550px] gap-8 px-6 text-sm md:grid-cols-2 lg:px-0 xl:grid-cols-4 xl:gap-12">
        <div className="flex flex-col justify-between gap-4">
          <p className="text-primary text-xl leading-7 font-semibold">
            Добрый Шкаф
          </p>
          <ThemeToggle />
          <span className="text-muted-foreground text-xs">© {currentYear}</span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-foreground font-semibold">Разделы</p>
          <div className="text-muted-foreground flex flex-col gap-2">
            <span>Пункты приёма</span>
            <span>Статьи</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-foreground font-semibold">Документы</p>
          <div className="text-muted-foreground flex flex-col gap-2">
            <span>Правила сервиса</span>
            <span>Политика обработки персональных данных</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-foreground font-semibold">Войти в сервис</p>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              className="border-border bg-card hover:bg-card/80 text-foreground h-11 w-full max-w-50 justify-start rounded-xl border px-4 font-medium"
            >
              Войти как волонтёр
            </Button>
            <Button
              type="button"
              className="border-border bg-card hover:bg-card/80 text-foreground h-11 w-full max-w-50 justify-start rounded-xl border px-4 font-medium"
            >
              Войти как организатор
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
