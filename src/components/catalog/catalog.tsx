import { useItems } from "@/hooks";
import { useSearchParams } from "react-router-dom";

export function Catalog() {
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search")?.trim() ?? "";

  const { data: items } = useItems(
    searchText ? { search: searchText } : undefined,
  );

  return (
    <div>
      {items?.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
