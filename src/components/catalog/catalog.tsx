import type { TItem } from "@/types";
import { ItemCard } from "../item-card";
import { useItems } from "@/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

export function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchText = searchParams.get("search")?.trim() ?? "";

  const {
    data: items,
    isLoading,
    isError,
  } = useItems(searchText ? { search: searchText } : undefined);

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
          Каталог вещей
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 lg:px-0">
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* TODO сделать фильтры кнопкой на мобилках с раскрытием */}
          <aside className="md:block">
            <div className="sticky top-24">
              <div>фильтры</div>
              <div>фильтры</div>
              <div>фильтры</div>
              <div>фильтры</div>
              <div>фильтры</div>
            </div>
          </aside>
          <div className="min-w-0">
            <div className="mb-8 flex flex-wrap gap-2">
              <span>быстрые категории</span>
              <span>быстрые категории</span>
              <span>быстрые категории</span>
              <span>быстрые категории</span>
              <span>быстрые категории</span>
            </div>

            {isLoading && <span>Загрузка...</span>}

            {!isLoading && isError && <span>Ошибка загрузки данных</span>}

            {!isLoading && !isError && items?.length === 0 && (
              <span>Нет доступных вещей</span>
            )}

            {!isLoading && !isError && !!items?.length && (
              <>
                <div className="xs:grid-cols-3 grid grid-cols-2 gap-x-6 md:grid-cols-4 xl:grid-cols-5">
                  {items.map((item: TItem) => (
                    <ItemCard item={item} key={item.id} />
                  ))}
                </div>
                <Button
                  type="button"
                  // onClick={}
                  className="border-primary hover:text-primary-foreground bg-card text-primary mx-auto mt-8 flex h-12 w-80 text-base font-medium"
                >
                  Показать все
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
