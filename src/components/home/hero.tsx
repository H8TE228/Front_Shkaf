import { useMobileSearch } from "@/hooks";
import { Button } from "../ui/button";

export function Hero() {
  const { openMobileSearchModal } = useMobileSearch();

  return (
    <section className="mx-auto w-full max-w-[1550px] px-0">
      <div className="bg-muted relative grid aspect-2/1 grid-cols-2 overflow-hidden rounded-b-2xl md:aspect-auto md:h-132">
        <img
          className="absolute inset-0 size-full object-cover dark:brightness-90"
          src="/src/assets/images/hero-shelter-scene.webp"
          alt="На общей поверхности: слева коробка с одеждой и книгой, справа сложенные вещи, книги и деревянные игрушки"
        />
        <div className="relative z-10 min-w-0">
          <Button
            type="button"
            className="dark:text-foreground absolute bottom-2 left-1/2 h-11 w-[calc(100%-0.5rem)] -translate-x-1/2 text-sm font-semibold md:bottom-8 md:h-12 md:w-70 md:text-base dark:bg-[#0e6f73] dark:hover:bg-[#0e6f73]/80"
          >
            Отдать вещь
          </Button>
        </div>
        <div className="relative z-10 min-w-0">
          <Button
            variant="defaultWhite"
            type="button"
            onClick={() => {
              if (window.matchMedia("(min-width: 48rem)").matches) {
                document
                  .querySelector<HTMLInputElement>("#header-search")
                  ?.focus();
              } else {
                openMobileSearchModal();
              }
            }}
            className="absolute bottom-2 left-1/2 h-11 w-[calc(100%-0.5rem)] -translate-x-1/2 text-sm font-semibold md:bottom-8 md:h-12 md:w-70 md:text-base"
          >
            Найти вещь
          </Button>
        </div>
      </div>
    </section>
  );
}
