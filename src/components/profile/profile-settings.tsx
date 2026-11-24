import { useEffect, useState, type FormEvent } from "react";
import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useLogout, useTheme, useUpdateMe } from "@/hooks";
import type { TUser } from "@/types";

const themes = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
] as const;

export function ProfileSettings({
  user,
  onNotifications,
}: {
  user: TUser;
  onNotifications: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemTheme(media.matches ? "dark" : "light");
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const selectedTheme = theme === "light" || theme === "dark" ? theme : systemTheme;
  const { mutate: logout } = useLogout();
  const { mutate: updateMe, isPending, isError } = useUpdateMe();
  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const email = user.email?.trim();

  function save(event: FormEvent) {
    event.preventDefault();
    updateMe({
      first_name: firstName.trim(),
      city: city.trim(),
    });
  }

  return (
    <form
      onSubmit={save}
      className="border-border bg-card grid max-w-3xl gap-7 rounded-2xl border p-6 sm:p-8"
    >
      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Профиль</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Имя
            <Input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal md:text-base"
            />
            <span className="text-muted-foreground text-[13px] leading-5 font-normal">
              Имя видно в объявлениях, чатах и отзывах.
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Город
            <Input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal md:text-base"
            />
            <span className="text-muted-foreground text-[13px] leading-5 font-normal">
              Вещи и пункты в вашем городе
            </span>
          </label>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-fit rounded-xl px-5 font-semibold"
        >
          Сохранить изменения
        </Button>
        {isError && (
          <p className="text-destructive text-sm">Не удалось сохранить изменения</p>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Оформление</h2>
        <div className="grid max-w-md grid-cols-2 gap-2.5">
          {themes.map((item) => {
            const Icon = item.icon;
            const selected = selectedTheme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setTheme(item.value)}
                className={`flex h-12 cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 text-sm ${
                  selected
                    ? "border-primary bg-secondary text-secondary-foreground font-semibold"
                    : "border-border bg-card font-medium"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Аккаунт</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {email && (
            <div>
              <p className="text-muted-foreground text-sm">Электронная почта</p>
              <p className="mt-1 font-medium">{email}</p>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => logout()}
            className="h-9 rounded-xl px-3.5 font-semibold"
          >
            <LogOut /> Выйти
          </Button>
        </div>
        <button
          type="button"
          onClick={onNotifications}
          className="text-primary w-fit cursor-pointer text-sm font-semibold hover:underline hover:underline-offset-4"
        >
          Настроить подписки и уведомления
        </button>
      </section>
    </form>
  );
}
