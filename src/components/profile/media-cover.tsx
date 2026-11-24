import { Camera } from "lucide-react";

export function MediaCover({ src }: { src?: string | null }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="size-14 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <span className="bg-muted text-muted-foreground grid size-14 shrink-0 place-items-center rounded-xl">
      <Camera className="size-5" />
    </span>
  );
}
