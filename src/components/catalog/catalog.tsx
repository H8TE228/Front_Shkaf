import type { TItemsQueryParams } from "@/types";
import { getSavedCoordinates } from "@/lib/get-saved-coords";
import { useInfiniteItems, useItemTypes } from "@/hooks";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ItemCard } from "../item-card";
import { Button } from "../ui/button";
import { FieldLegend, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

const exchangeFormats = [
  { value: "free", label: "Бесплатно" },
  { value: "swap", label: "Обмен" },
  { value: "points", label: "Баллы" },
] as const;

const conditions = [
  { value: "new", label: "Новое" },
  { value: "good", label: "Хорошее состояние" },
  { value: "used", label: "Есть следы использования" },
] as const;

const radiuses = [1, 5, 10, 25, 50];
const filterParams = ["exchange_format", "item_type_id", "condition", "radius"];

function isExchangeFormat(
  value: string | null,
): value is NonNullable<NonNullable<TItemsQueryParams>["exchange_format"]> {
  return exchangeFormats.some((format) => format.value === value);
}

function isCondition(
  value: string | null,
): value is NonNullable<NonNullable<TItemsQueryParams>["condition"]> {
  return conditions.some((condition) => condition.value === value);
}

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("search")?.trim() ?? "";
  const coordinates = getSavedCoordinates();
  const radiusValue = searchParams.get("radius");
  const radius = radiuses.find((value) => String(value) === radiusValue);
  const itemTypeValue = searchParams.get("item_type_id");
  const itemTypeId =
    itemTypeValue && /^\d+$/.test(itemTypeValue)
      ? Number(itemTypeValue)
      : undefined;

  const {
    data: itemTypes,
    isLoading: isItemTypesLoading,
    isError: isItemTypesError,
  } = useItemTypes();

  const query: NonNullable<TItemsQueryParams> = {};
  if (searchText) query.search = searchText;
  const exchangeFormat = searchParams.get("exchange_format");
  if (isExchangeFormat(exchangeFormat)) query.exchange_format = exchangeFormat;
  const condition = searchParams.get("condition");
  if (isCondition(condition)) query.condition = condition;
  if (itemTypeId !== undefined) query.item_type_id = itemTypeId;
  query.ordering =
    searchParams.get("ordering") === "created_at"
      ? "created_at"
      : "-created_at";
  if (coordinates && radius) {
    query.lng = coordinates[0];
    query.lat = coordinates[1];
    query.radius = radius;
  }

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data: itemPages,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteItems(query);
  const items = itemPages?.pages.flatMap((page) => page.results) ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;
    if (
      !target ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  function loadNextPage() {
    void fetchNextPage();
  }

  function updateParam(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(name, value);
    else nextParams.delete(name);
    setSearchParams(nextParams, { replace: true });
  }

  function resetFilters() {
    const nextParams = new URLSearchParams(searchParams);
    filterParams.forEach((name) => nextParams.delete(name));
    setSearchParams(nextParams, { replace: true });
  }

  const hasFilters = filterParams.some((name) => searchParams.has(name));
  const selectedCondition = isCondition(condition) ? condition : "";
  const selectedExchangeFormat = isExchangeFormat(exchangeFormat)
    ? exchangeFormat
    : "";
  const ordering =
    searchParams.get("ordering") === "created_at"
      ? "created_at"
      : "-created_at";
  const selectedItemType = itemTypes?.find((type) => type.id === itemTypeId);

  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
      <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
        <Link to="/" className="hover:underline hover:underline-offset-4">
          Главная
        </Link>
        <ChevronRight />
        <Link
          to="/catalog"
          className="hover:underline hover:underline-offset-4"
        >
          Каталог
        </Link>
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[212px_minmax(0,1fr)] lg:gap-7">
        <aside>
          <div className="lg:sticky lg:top-24">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Фильтры</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!hasFilters}
                onClick={resetFilters}
                className="text-muted-foreground hover:text-muted-foreground p-2 hover:bg-transparent dark:hover:bg-transparent"
              >
                Сбросить всё
              </Button>
            </div>

            <FieldSet className="mb-7 gap-3">
              <FieldLegend variant="label">Формат передачи</FieldLegend>
              <RadioGroup
                value={selectedExchangeFormat}
                onValueChange={(value) =>
                  updateParam("exchange_format", value ?? "")
                }
                className="gap-2.5"
              >
                <Label className="cursor-pointer font-normal">
                  <RadioGroupItem value="" />
                  Любой формат
                </Label>
                {exchangeFormats.map((format) => (
                  <Label
                    key={format.value}
                    className="cursor-pointer font-normal"
                  >
                    <RadioGroupItem value={format.value} />
                    {format.label}
                  </Label>
                ))}
              </RadioGroup>
            </FieldSet>

            <FilterSelect
              label="Категория"
              value={itemTypeId === undefined ? "" : String(itemTypeId)}
              onChange={(value) => updateParam("item_type_id", value)}
              displayValue={
                selectedItemType?.title ??
                (isItemTypesLoading ? "Загрузка категорий..." : "Все категории")
              }
            >
              {itemTypes?.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.title}
                </SelectItem>
              ))}
            </FilterSelect>
            {isItemTypesError && (
              <p className="text-destructive -mt-5 mb-6 text-xs">
                Не удалось загрузить категории
              </p>
            )}

            <FilterSelect
              label="Состояние"
              value={selectedCondition}
              onChange={(value) => updateParam("condition", value)}
              displayValue={
                conditions.find((item) => item.value === selectedCondition)
                  ?.label ?? "Любое состояние"
              }
            >
              {conditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </FilterSelect>

            <FilterSelect
              label="Расстояние"
              value={radius ? String(radius) : ""}
              disabled={!coordinates}
              onChange={(value) => updateParam("radius", value)}
              displayValue={radius ? `До ${radius} км` : "Любое расстояние"}
            >
              {radiuses.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  До {value} км
                </SelectItem>
              ))}
            </FilterSelect>
            {!coordinates && (
              <p className="text-muted-foreground -mt-5 text-xs">
                Укажите местоположение, чтобы искать рядом
              </p>
            )}
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-border mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] leading-9 font-semibold tracking-tight sm:text-[32px]">
                {searchText
                  ? `Результаты поиска: ${searchText}`
                  : "Вещи в Екатеринбурге"}
              </h1>
              {isLoading && (
                <p className="text-muted-foreground mt-1 text-sm">
                  Загрузка...
                </p>
              )}
              {!isLoading && !isError && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {itemPages?.pages[0]?.count ?? 0} вещей
                </p>
              )}
            </div>
            <FilterSelect
              ariaLabel="Сортировка"
              value={ordering}
              onChange={(value) => updateParam("ordering", value)}
              displayValue={
                ordering === "created_at" ? "Сначала старые" : "Сначала новые"
              }
              className="mb-0 w-auto min-w-40"
              triggerClassName="h-10 w-full"
            >
              <SelectItem value="-created_at">Сначала новые</SelectItem>
              <SelectItem value="created_at">Сначала старые</SelectItem>
            </FilterSelect>
          </div>

          {isLoading && <p className="text-muted-foreground">Загрузка...</p>}
          {!isLoading && isError && (
            <p className="text-destructive">Не удалось загрузить каталог</p>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <p className="text-muted-foreground">
              По выбранным фильтрам ничего не найдено
            </p>
          )}
          {!isLoading && !isError && items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {items.map((item) => (
                  <ItemCard item={item} key={item.id} />
                ))}
              </div>
              <div
                ref={loadMoreRef}
                className="mt-8 flex min-h-10 justify-center"
                aria-live="polite"
              >
                {isFetchingNextPage ? (
                  <p className="text-muted-foreground">Загружаем товары...</p>
                ) : isFetchNextPageError ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadNextPage}
                  >
                    Не удалось загрузить. Повторить
                  </Button>
                ) : hasNextPage ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadNextPage}
                  >
                    Загрузить ещё
                  </Button>
                ) : (
                  <p className="text-muted-foreground">Это все товары</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label?: string;
  ariaLabel?: string;
  value: string;
  displayValue: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

function FilterSelect({
  label,
  ariaLabel,
  value,
  displayValue,
  disabled,
  className = "",
  triggerClassName = "h-11 w-full",
  onChange,
  children,
}: FilterSelectProps) {
  const id = label?.toLowerCase().replaceAll(" ", "-");

  return (
    <div className={`mb-6 block ${className}`}>
      {label && (
        <div className="mb-3 flex min-h-8 items-center justify-between">
          <Label htmlFor={id} className="text-sm">
            {label}
          </Label>
          {value && (
            <Button
              type="button"
              variant="ghost"
              aria-label={`Сбросить: ${label}`}
              onClick={() => onChange("")}
              className="text-muted-foreground"
            >
              <X />
            </Button>
          )}
        </div>
      )}
      <Select
        value={value || null}
        disabled={disabled}
        onValueChange={(selectedValue) => onChange(String(selectedValue ?? ""))}
      >
        <SelectTrigger
          id={id}
          aria-label={ariaLabel ?? label}
          className={`${triggerClassName} bg-muted h-10! cursor-pointer rounded-xl px-3 text-sm`}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {displayValue}
          </span>
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {children}
        </SelectContent>
      </Select>
    </div>
  );
}
