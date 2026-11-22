import { useItemById } from "@/hooks";
import { useParams } from "react-router-dom";

export function ItemPage() {
  const { id } = useParams();

  useItemById(id as string);

  return <div>вещь</div>;
}
