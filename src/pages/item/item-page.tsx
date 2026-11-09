import { useItemById } from "@/hooks";
import { useParams } from "react-router-dom";

export function ItemPage() {
  const { id } = useParams();

  const { data: item } = useItemById(id as string);

  return <div>вещь</div>;
}
