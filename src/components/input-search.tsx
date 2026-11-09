import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";
import { useItems } from "@/hooks";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { Input } from "./ui/input";

const formSchema = z.object({
  search: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function InputSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const searchText = searchParams.get("search")?.trim() ?? "";
  const [dismissedSearch, setDismissedSearch] = useState<string | null>(
    searchText,
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

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

  const isOpen = Boolean(draftSearch) && dismissedSearch !== draftSearch;
  const isSearchPending = draftSearch !== debouncedSearch;

  const {
    data: items,
    isLoading,
    isError,
  } = useItems(debouncedSearch ? { search: debouncedSearch } : undefined);

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

    setDismissedSearch(draftSearch);
    navigate(`/catalog?search=${nextSearch}`);
  }

  return (
    <div className="bg-muted relative hidden h-12 flex-1 rounded-xl sm:block">
      <form
        role="search"
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setDismissedSearch(draftSearch);
          }
        }}
        className="size-full"
        autoComplete="off"
      >
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <Field className="h-full">
              <div className="relative size-full">
                <Input
                  {...field}
                  id="header-search"
                  className="placeholder:text-muted-foreground size-full border-0 py-0 pr-12 pl-6 outline-none md:text-base"
                  placeholder="Найти нужную вещь"
                  onFocus={() => {
                    if (draftSearch) setDismissedSearch(null);
                  }}
                  onChange={(event) => {
                    const value = event.target.value.replace(/^\s+/, "");
                    field.onChange(value);
                    setDismissedSearch(null);
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("search", "");
                    setDismissedSearch(null);

                    // if (location.pathname === "/catalog") {
                    //   navigate("/catalog", { replace: true });
                    // }
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground absolute top-1 right-9 size-10"
                >
                  <X className="size-6" />
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground absolute top-1 right-1 size-10"
                >
                  <Search className="size-6" />
                </Button>
              </div>
            </Field>
          )}
        />

        {isOpen && draftSearch && (
          <div className="border-border bg-popover text-popover-foreground absolute top-full right-0 left-0 z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border p-2 shadow-lg">
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
                  onClick={() => {
                    const selectedTitle = item.title.trim();
                    form.setValue("search", selectedTitle);
                    setDebouncedSearch(selectedTitle);
                    setDismissedSearch(selectedTitle);
                  }}
                  className="hover:bg-muted focus-visible:bg-muted block rounded-lg px-3 py-2 outline-none"
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
