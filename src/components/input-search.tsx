import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";
import { useItems, useMobileSearch } from "@/hooks";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

const formSchema = z.object({
  search: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type InputSearchProps = {
  variant: "dialog" | "header";
  focusOnOpen?: boolean;
};

export function InputSearch({
  variant = "header",
  focusOnOpen = false,
}: InputSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { closeMobileSearchModal } = useMobileSearch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchText = searchParams.get("search")?.trim() ?? "";
  const [debouncedSearch, setDebouncedSearch] = useState(searchText); // * для задержки при печати

  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: searchText,
    },
  });

  const draftSearch = useWatch({
    control: form.control,
    name: "search",
  }).trim();

  const isSearchPending = draftSearch !== debouncedSearch; // * чтобы не моргали результаты

  // TODO потом добавить тут лимит
  const {
    data: items,
    isLoading,
    isError,
  } = useItems(debouncedSearch ? { search: debouncedSearch } : undefined);

  useEffect(() => {
    if (focusOnOpen) {
      form.setFocus("search");
    }
  }, [focusOnOpen, form]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(draftSearch);
    }, 300);

    return () => clearTimeout(timeout);
  }, [draftSearch]);

  useEffect(() => {
    if (location.pathname === "/catalog" && searchParams.has("search")) {
      form.setValue("search", searchParams.get("search") ?? "");
    }
  }, [form, location.pathname, searchParams]);

  function onSubmit({ search: value }: FormValues) {
    const nextSearch = value.trim();

    if (!nextSearch) return;

    setIsDropdownOpen(false);
    closeMobileSearchModal?.();
    navigate(`/catalog?search=${nextSearch}`, {
      replace: variant === "dialog",
    });
  }

  return (
    <div
      className={`relative rounded-xl ${
        variant === "dialog" ? "flex h-full min-h-0 flex-col" : "h-12"
      } ${
        variant === "header"
          ? "bg-muted hidden flex-1 sm:block"
          : "w-full bg-transparent"
      }`}
    >
      <form
        role="search"
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={
          variant === "header"
            ? (event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  closeTimeout.current = setTimeout(() => {
                    setIsDropdownOpen(false);
                  }, 150);
                }
              }
            : undefined
        }
        onFocus={() => {
          if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
          }

          setIsDropdownOpen(true);
        }}
        className={
          variant === "dialog" ? "flex min-h-0 flex-1 flex-col" : "size-full"
        }
        autoComplete="off"
      >
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <Field
              className={
                variant === "dialog" ? "h-12 shrink-0 bg-transparent" : "h-full"
              }
            >
              <div className="flex h-full w-full items-center gap-2">
                {variant === "dialog" && (
                  <button
                    type="button"
                    className="hover:bg-muted flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full"
                    onClick={closeMobileSearchModal}
                  >
                    <ArrowLeft />
                  </button>
                )}
                <div
                  className={`relative min-w-0 flex-1 ${
                    variant === "dialog" ? "h-full" : "size-full"
                  }`}
                >
                  <Input
                    {...field}
                    id={`${variant}-search`}
                    className={`placeholder:text-muted-foreground size-full border-0 py-0 outline-none md:text-base ${
                      variant === "dialog" ? "bg-muted rounded-xl px-4" : "px-6"
                    }`}
                    placeholder="Найти нужную вещь"
                    onChange={(event) => {
                      const value = event.target.value.replace(/^\s+/, "");
                      field.onChange(value);
                    }}
                  />
                  {draftSearch && (
                    <Button
                      type="button"
                      onClick={() => {
                        form.setValue("search", "");
                        form.setFocus("search");
                      }}
                      variant="ghost"
                      size="icon"
                      className={`text-muted-foreground absolute top-1 ${variant === "dialog" ? "right-3" : "right-9"} size-10`}
                    >
                      <X className="size-6" />
                    </Button>
                  )}
                  {variant === "header" && (
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground absolute top-1 right-1 size-10"
                    >
                      <Search className="size-6" />
                    </Button>
                  )}
                </div>
              </div>
            </Field>
          )}
        />

        {isDropdownOpen && draftSearch && (
          <div
            className={`border-border bg-popover text-popover-foreground z-30 overflow-y-auto p-2 ${
              variant === "dialog"
                ? "bg-popover/0 mt-2 min-h-0 flex-1 rounded-xl"
                : "absolute top-full right-0 left-0 mt-2 max-h-[70vh] rounded-xl border shadow-lg"
            }`}
          >
            {(isSearchPending || isLoading) && (
              <p className="text-muted-foreground px-3 py-2 text-sm">
                Поиск...
              </p>
            )}

            {!isSearchPending && isError && (
              <p className="text-destructive px-3 py-2 text-sm">
                Не удалось загрузить результаты поиска
              </p>
            )}

            {!isSearchPending &&
              !isLoading &&
              !isError &&
              items?.length === 0 && (
                <p className="text-muted-foreground px-3 py-2 text-sm">
                  Ничего не найдено
                </p>
              )}

            {!isSearchPending &&
              !isLoading &&
              !isError &&
              items?.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  replace={variant === "dialog"}
                  onClick={() => {
                    if (closeTimeout.current) {
                      clearTimeout(closeTimeout.current);
                    }

                    const selectedTitle = item.title.trim();

                    form.setValue("search", selectedTitle);
                    setDebouncedSearch(selectedTitle);
                    setIsDropdownOpen(false);
                    closeMobileSearchModal?.();
                  }}
                  className={`block rounded-lg outline-none ${
                    variant === "dialog"
                      ? "hover:bg-muted/60 focus-visible:bg-muted/60 px-3 py-2"
                      : "hover:bg-muted focus-visible:bg-muted px-3 py-2"
                  }`}
                >
                  <span className="block truncate text-sm font-medium">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-muted-foreground mt-1 line-clamp-2 block text-xs">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
          </div>
        )}
      </form>
    </div>
  );
}
