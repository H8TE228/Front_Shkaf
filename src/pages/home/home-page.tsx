import { Catalog } from "@/components/home/catalog";
import { CollectionPoints } from "@/components/home/collection-points";
import { Hero } from "@/components/home/hero";

export function HomePage() {
  return (
    <>
      <Hero />
      <Catalog />
      <CollectionPoints />
    </>
  );
}
