import { homeItems } from "@/constants";
import { Button } from "../ui/button";
import { ProductCard } from "./product-card";

export function Catalog() {
  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-16 lg:px-0">
      <h1 className="text-[32px] leading-10 font-semibold tracking-tight">
        Вещи в Екатеринбурге
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {homeItems.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
      <Button
        type="button"
        className="border-primary hover:text-primary-foreground bg-card text-primary mx-auto mt-8 flex h-12 w-80 text-base font-medium"
      >
        Все вещи
      </Button>
    </section>
  );
}
