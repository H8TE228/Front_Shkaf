export function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1550px] justify-center px-6 py-16 lg:px-0">
      <div className="border-border bg-card w-full max-w-120 rounded-2xl border p-8">
        <div className="mb-8">
          <h1 className="mb-3 text-[32px] leading-10 font-semibold">Вход</h1>
          <p className="text-muted-foreground text-base leading-6">
            Войдите в свой аккаунт.
          </p>
        </div>

        <div className="flex flex-col gap-6">
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
          </label>
          <span className="text-primary -mt-2 text-right text-sm leading-5">
            Не помню пароль
          </span>
          <button
            type="button"
            className="bg-primary text-primary-foreground h-12 w-full rounded-xl text-base font-medium"
          >
            Войти
          </button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm leading-5">
          Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
        </p>
      </div>
    </section>
  );
}
