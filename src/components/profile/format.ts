import type { TExchange, TExchangeStatus } from "@/types";

export function personName(person: {
  first_name?: string | null;
  username?: string | null;
}) {
  const first = person.first_name?.trim();
  if (first) return first;
  return person.username?.trim() ?? "";
}

export function formatDayMonth(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function exchangeMoment(exchange: TExchange) {
  return exchange.completed_at || exchange.updated_at || exchange.created_at;
}

export const exchangeStatusLabel: Record<TExchangeStatus, string> = {
  requested: "Запрошено",
  agreed: "Договорились",
  completed: "Передано",
  declined: "Отклонено",
  cancelled: "Отменено",
};

export function reviewsDative(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыву";
  return "отзывам";
}
