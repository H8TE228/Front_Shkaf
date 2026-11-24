import { cn } from "cn";

export function UserAvatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  const letter = name.trim().charAt(0).toUpperCase();
  if (!letter) return null;

  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground grid shrink-0 place-items-center rounded-full font-semibold",
        className,
      )}
    >
      {letter}
    </span>
  );
}
