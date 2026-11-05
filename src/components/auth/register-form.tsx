import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRegister } from "@/hooks";
import { Card } from "../ui/card";

const formSchema = z.object({
  email: z.string().min(2, { message: "Минимум 2 символа" }),
  password: z.string().min(2, { message: "Минимум 2 символа" }),
  password2: z.string().min(2, { message: "Минимум 2 символа" }),
  username: z.string().min(2, { message: "Минимум 2 символа" }),
  phoneNumber: z.string().min(2, { message: "Минимум 2 символа" }),
});

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      password2: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setServerError(null);

    mutate(data, {
      onSuccess: () => {
        form.reset();
        navigate("/admin/yes-no-game");
      },
      onError: (error) => {
        const message = error.response?.data.error.message;
        setServerError(message || "Ошибка");
      },
    });
  }

  return (
    <Card className="w-full max-w-4xl p-8">
      <div className="mb-8">
        <h1 className="mb-3 text-[32px] leading-10 font-semibold">
          Регистрация
        </h1>
        <p className="text-muted-foreground text-base leading-6">
          Создайте аккаунт в Добром Шкафе.
        </p>
      </div>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="flex gap-2 text-sm leading-5 font-medium"
                  htmlFor={field.name}
                >
                  Email
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none md:text-base"
                  type="email"
                  placeholder="05pa@mail.ru"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setServerError(null);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="flex gap-2 text-sm leading-5 font-medium"
                  htmlFor={field.name}
                >
                  Пароль
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none md:text-base"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setServerError(null);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password2"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="flex gap-2 text-sm leading-5 font-medium"
                  htmlFor={field.name}
                >
                  Повторный пароль
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none md:text-base"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setServerError(null);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="flex gap-2 text-sm leading-5 font-medium"
                  htmlFor={field.name}
                >
                  Телефон
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none md:text-base"
                  type="text"
                  placeholder="+70123456789"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setServerError(null);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  className="flex gap-2 text-sm leading-5 font-medium"
                  htmlFor={field.name}
                >
                  Имя пользователя
                </FieldLabel>
                <Input
                  id={field.name}
                  className="border-input bg-muted h-12 rounded-lg border px-4 text-base font-normal outline-none md:text-base"
                  type="text"
                  placeholder="pashus"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setServerError(null);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* сделать */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <label className="flex items-start gap-2 text-sm leading-5 font-normal">
              <input className="mt-0.5 size-4 shrink-0" type="checkbox" />
              <span>
                Принимаю <span className="text-primary">правила сервиса</span>
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
            type="submit"
            disabled={isPending}
            className="h-12 text-base font-semibold md:col-span-2"
          >
            {isPending ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </FieldGroup>

        <p className="text-muted-foreground mt-6 text-center text-sm leading-5">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Войти
          </Link>
        </p>

        <div className="mt-2 flex h-10 items-center justify-center text-center text-sm">
          {serverError && (
            <span className="text-destructive">{serverError}</span>
          )}
        </div>
      </form>
    </Card>
  );
}
