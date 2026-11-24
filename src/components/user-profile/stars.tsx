import { Star } from "lucide-react";

export function Stars({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "lg";
}) {
  const icon = size === "lg" ? "size-8" : "size-4";

  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`Оценка ${value} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(value);
        return (
          <Star
            key={index}
            className={`${icon} ${
              filled ? "fill-current text-primary" : "text-muted-foreground"
            }`}
          />
        );
      })}
    </span>
  );
}

export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Ваша оценка обмена"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const score = index + 1;
        const filled = score <= value;
        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={value === score}
            aria-label={String(score)}
            onClick={() => onChange(score)}
            className="grid size-10 cursor-pointer place-items-center"
          >
            <Star
              className={`size-8 ${
                filled ? "fill-current text-primary" : "text-muted-foreground"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
