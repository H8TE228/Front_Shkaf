import { heroScene } from "@/constants";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1550px] px-0">
      <div className="bg-muted relative grid h-132 grid-cols-2 overflow-hidden rounded-b-2xl">
        <img
          className="absolute inset-0 size-full object-cover dark:brightness-90"
          src={heroScene.src}
          alt={heroScene.alt}
        />
        <div className="relative z-10 min-w-0">
          <Button
            type="button"
            className="dark:text-foreground absolute bottom-8 left-1/2 h-12 w-70 -translate-x-1/2 text-base font-semibold dark:bg-[#0e6f73] dark:hover:bg-[#0e6f73]/80"
          >
            Отдать вещь
          </Button>
        </div>
        <div className="relative z-10 min-w-0">
          <Button
            variant="defaultWhite"
            type="button"
            className="absolute bottom-8 left-1/2 h-12 w-70 -translate-x-1/2 rounded-full text-base font-semibold"
          >
            Найти вещь
          </Button>
        </div>
      </div>
    </section>
  );
}
