import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();

  // тут можно будет настроить разные ошибки по пути ошибки /401, /404 и тд
  return (
    <section className="mx-auto flex min-h-[60svh] w-full max-w-[1550px] flex-col items-center justify-center px-6 text-center lg:px-0">
      <p className="text-primary text-7xl font-bold">404</p>
      <h1 className="mt-4 text-3xl font-semibold">Страница не найдена</h1>
      <p className="text-muted-foreground mt-3">
        Возможно, ссылка устарела или была введена неверно.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="mt-8 h-12 px-5 py-3 font-medium"
      >
        На главную
      </Button>
    </section>
  );
}
