import { Button } from "../ui/button";
import { ItemCard } from "../item-card";
import { useItems } from "@/hooks";
import { useNavigate } from "react-router-dom";

export function Recomendations() {
  const navigate = useNavigate();

  // * в дальнейшем тут будет ручкка на рекомендации
  const { data: items, isLoading, isError } = useItems();

  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-16 lg:px-0">
      <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
        Вещи в Екатеринбурге
      </h1>

      {isLoading && <span>Загрузка...</span>}

      {!isLoading && isError && <span>Ошибка загрузки данных</span>}

      {!isLoading && !isError && items?.length === 0 && (
        <span>Нет доступных вещей</span>
      )}

      {!isLoading && !isError && items?.length && (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items?.map((item) => (
            <ItemCard item={item} key={item.id} />
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={() => navigate("/catalog")}
        className="border-primary hover:text-primary-foreground bg-card text-primary mx-auto mt-8 flex h-12 w-80 text-base font-medium"
      >
        Все вещи
      </Button>
    </section>
  );
}
