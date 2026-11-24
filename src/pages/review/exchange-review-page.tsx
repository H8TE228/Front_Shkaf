import { ExchangeReview } from "@/components";
import { useParams } from "react-router-dom";

export function ExchangeReviewPage() {
  const { id, exchangeId } = useParams();

  return <ExchangeReview userId={id ?? ""} exchangeId={exchangeId ?? ""} />;
}
