import { cn } from "cn";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        `footer text-footer-foreground bg-footer flex min-h-20 px-0 py-2 lg:px-12`,
        className,
      )}
    ></footer>
  );
}
