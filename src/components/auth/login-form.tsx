import { useLogin } from "@/hooks/auth/use-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card } from "../ui/card";

const formSchema = z.object({
  email: z.string().min(2, { message: "Минимум 2 символа" }),
  password: z.string().min(2, { message: "Минимум 2 символа" }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setServerError(null);

    mutate(data, {
      onSuccess: () => {
        form.reset();
        navigate("/profile");
      },
      onError: (error) => {
        const message = error.response?.data.detail;
        setServerError(message || "Ошибка");
      },
    });
  }

  return (
    <Card className="w-full max-w-120 p-8">
      <div className="mb-8">
        <h1 className="mb-3 text-[32px] leading-10 font-semibold">Вход</h1>
        <p className="text-muted-foreground text-base leading-6">
          Войдите в свой аккаунт.
        </p>
      </div>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <FieldGroup className="flex flex-col gap-6">
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
                  placeholder="Введите email"
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
                  placeholder="Введите пароль"
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

          <Link
            type="button"
            to="/forget-password"
            className="hover:text-primary/80 text-primary -mt-2 self-end text-right text-sm leading-5 transition-colors"
          >
            Не помню пароль
          </Link>

          <Button
            type="submit"
            disabled={isPending}
            className="left-1/2 h-12 text-base font-semibold"
          >
            {isPending ? "Вход..." : "Войти"}
          </Button>
        </FieldGroup>

        <p className="text-muted-foreground mt-6 text-center text-sm leading-5">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Зарегистрироваться
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
