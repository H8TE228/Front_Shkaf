import { cn } from "cn";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        `header bg-header flex min-h-22 px-0 py-4 lg:px-12`,
        className,
      )}
    ></header>
  );
}
