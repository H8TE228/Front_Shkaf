import { Camera, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { TItem } from "@/types";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TItemCardProps = {
  item: TItem;
};

export function ItemCard({ item: item }: TItemCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/items/${item.id}`)}
      className="min-w-0 cursor-pointer gap-3 overflow-visible bg-transparent p-4 shadow-none ring-0 transition-all hover:-translate-y-1 hover:shadow"
    >
      <div className="border-border bg-muted relative aspect-square overflow-hidden rounded-[14px] border">
        <div className="text-muted-foreground flex size-full items-center justify-center">
          <Camera className="size-12 stroke-[1.5]" />
        </div>
        <Badge className="border-border bg-card text-foreground absolute top-3 left-3 h-6 text-[10px] font-bold tracking-wider uppercase">
          {item.exchange_format}
        </Badge>
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
          }}
          type="button"
          variant="ghost"
          size="icon"
          className="text-foreground absolute top-2 right-2 rounded-none"
        >
          <Heart className="size-6 fill-white stroke-2" />
        </Button>
      </div>
      <CardContent className="flex min-w-0 flex-col items-start p-0">
        <h2 className="text-lg leading-5.75 font-bold">{item.title}</h2>
        <p className="mt-1 line-clamp-3 text-sm leading-5 font-medium">
          {item.description}
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-4">
          {item.district}
        </p>
      </CardContent>
    </Card>
  );
}
