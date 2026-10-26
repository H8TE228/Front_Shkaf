import { collectionPoints, mapImage } from "@/constants";

export function CollectionPoints() {
  return (
    <section className="border-border bg-card mx-auto mt-16 grid h-90 w-full max-w-[1550px] grid-cols-1 overflow-hidden rounded-2xl border px-6 lg:grid-cols-[7fr_5fr] lg:px-0">
      <div className="bg-secondary relative min-w-0 overflow-hidden">
        <img
          className="size-full object-cover grayscale dark:brightness-75 dark:invert"
          src={mapImage}
          alt="Карта Екатеринбурга"
        />
        <span className="bg-primary ring-primary/15 absolute top-[26%] left-[49%] size-3 rounded-full border-2 border-white ring-6" />
        <span className="bg-primary ring-primary/15 absolute top-[48%] left-[40%] size-3 rounded-full border-2 border-white ring-6" />
        <span className="bg-primary ring-primary/15 absolute top-[70%] left-[35%] size-3 rounded-full border-2 border-white ring-6" />
      </div>
      <div className="bg-card min-w-0 pt-7 pr-6 pb-6 pl-0 lg:pl-6">
        <h2 className="mb-3 text-2xl leading-8 font-semibold tracking-tight">
          Пункты приёма
        </h2>
        <div className="h-66 space-y-2 overflow-y-auto pr-3">
          {collectionPoints.map((point) => (
            <div
              className="border-border bg-muted min-h-32 rounded-xl border p-4"
              key={point.id}
            >
              <h3 className="text-base leading-6 font-semibold">
                {point.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-[13px] leading-5">
                {point.address}
              </p>
              <p className="text-primary mt-1 text-[13px] leading-5 font-medium">
                {point.hours}
              </p>
              <p className="text-muted-foreground mt-1 text-[13px] leading-5">
                {point.accepts}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
