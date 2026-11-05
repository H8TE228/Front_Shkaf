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
  email: z
    .string()
    .min(1, { message: "Минимум 1 символ" })
    .max(254, { message: "Максимум 254 символов" }),
  password: z.string().min(8, { message: "Минимум 8 символов" }),
  password2: z.string().min(8, { message: "Минимум 8 символов" }),
  username: z
    .string()
    .min(2, { message: "Минимум 1 символ" })
    .max(150, { message: "Максимум 150 символов" }),
  phoneNumber: z
    .string()
    .optional()
    .transform((value) => {
      return value === "+7" || value === "" ? undefined : value;
    })
    .refine((value) => value === undefined || /^\+7\d{10}$/.test(value), {
      message: "Некорректный номер телефона",
    }),
  agreeToRules: z.boolean().refine((val) => val === true, {
    message: "Необходимо принять правила сервиса",
  }),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNumber: "+7",
      email: "",
      password: "",
      password2: "",
      agreeToRules: false,
    },
    mode: "onSubmit",
  });

  function onSubmit(data: FormOutput) {
    setServerError(null);

    const passwordsMatch = data.password === data.password2;
    if (!passwordsMatch) {
      form.setError("password2", {
        message: "Пароли не совпадают",
      });
      return;
    }

    const newData = {
      username: data.username,
      phone_number: data.phoneNumber,
      email: data.email,
      password: data.password,
      password2: data.password2,
    };

    mutate(newData, {
      onSuccess: () => {
        form.reset();
        navigate("/login");
      },
      onError: (error) => {
        const message = error.response?.data.detail;
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
          <div className="flex flex-col gap-6">
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
                    placeholder="+79081234567"
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value;
                      value =
                        "+7" + value.slice(2).replace(/\D/g, "").slice(0, 10);

                      field.onChange(value);
                      setServerError(null);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-6">
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
          </div>
          <Controller
            name="agreeToRules"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-3 md:col-span-2"
              >
                <label className="text-muted-foreground flex items-start gap-3 text-sm leading-6">
                  <input
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    type="checkbox"
                    className="accent-primary mt-1 h-4 w-4 rounded border border-[#d4dded]"
                  />
                  <span>
                    Я принимаю условия{" "}
                    <Link
                      to="#"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Пользовательского соглашения
                    </Link>{" "}
                    и{" "}
                    <Link
                      to="#"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Политики конфиденциальности
                    </Link>
                  </span>
                </label>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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
