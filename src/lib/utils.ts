import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function getCurrentDay() {
  const daysOfWeek: { [key: number]: string } = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat",
  };

  const day = new Date().getDay();

  return daysOfWeek[day];
}
