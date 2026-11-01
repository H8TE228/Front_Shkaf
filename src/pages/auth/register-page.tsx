import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1550px] justify-center px-6 py-16 lg:px-0">
      <div className="border-border bg-card w-full max-w-120 rounded-2xl border p-8">
        <div className="mb-8">
          <h1 className="mb-3 text-[32px] leading-10 font-semibold">
            Регистрация
          </h1>
          <p className="text-muted-foreground text-base leading-6">
            Создайте аккаунт в Добром Шкафе.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 text-sm leading-5 font-medium">
            Имя
            <input
              className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none"
              type="text"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm leading-5 font-medium">
            Электронная почта
            <input
              className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none"
              type="email"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm leading-5 font-medium">
            Пароль
            <input
              className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none"
              type="password"
            />
            <span className="text-muted-foreground text-sm leading-5 font-normal">
              Не менее 8 символов
            </span>
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-2 text-sm leading-5 font-normal">
              <input className="mt-0.5 size-4 shrink-0" type="checkbox" />
              <span>
                Принимаю{" "}
                <span className="text-primary">правила сервиса</span>
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm leading-5 font-normal">
              <input className="mt-0.5 size-4 shrink-0" type="checkbox" />
              <span>
                Даю{" "}
                <span className="text-primary">
                  согласие на обработку персональных данных
                </span>
              </span>
            </label>
            <span className="text-primary text-sm leading-5">
              Политика обработки персональных данных
            </span>
          </div>
          <Button
            type="button"
            className="left-1/2 h-12 text-base font-semibold"
          >
            Зарегистрироваться
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm leading-5">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-primary">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}
