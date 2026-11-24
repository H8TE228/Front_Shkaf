import { Camera, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { TItem } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  useBookmarks,
  useCreateItemBookmark,
  useDeleteItemBookmark,
  useMe,
} from "@/hooks";

const exchangeFormatTitle: Record<TItem["exchange_format"], string> = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "Баллы",
};

const conditionTitle: Record<TItem["condition"], string> = {
  new: "Новое",
  good: "Хорошее состояние",
  used: "Есть следы использования",
};

type TItemCardProps = {
  item: TItem;
};

export function ItemCard({ item }: TItemCardProps) {
  const navigate = useNavigate();
  const { data: user, isLoading: isUserLoading } = useMe();
  const { data: bookmarks, isLoading: areBookmarksLoading } = useBookmarks(
    { type: "item" },
    !!user,
  );
  const bookmarksData = bookmarks?.results;
  const { mutate: createBookmark, isPending: isCreatingBookmark } =
    useCreateItemBookmark();
  const { mutate: deleteBookmark, isPending: isDeletingBookmark } =
    useDeleteItemBookmark();

  const photo = [...item.photos].sort((a, b) => a.position - b.position)[0];
  const isBookmarked = bookmarksData?.some(
    (bookmark) => bookmark.item?.id === item.id,
  );
  const isBookmarkPending = isCreatingBookmark || isDeletingBookmark;

  return (
    <Card
      onClick={() => navigate(`/item/${item.id}`)}
      className="min-w-0 cursor-pointer gap-3 overflow-visible bg-transparent p-2 shadow-none ring-0 transition-all hover:-translate-y-1 hover:shadow"
    >
      <div className="border-border bg-muted relative aspect-square overflow-hidden rounded-[14px] border">
        {photo ? (
          <img
            src={photo.image}
            alt={item.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">
            <Camera className="size-12 stroke-[1.5]" />
          </div>
        )}
        <Badge
          className={`absolute top-3 left-3 h-6 text-[10px] font-bold tracking-wider uppercase ${
            item.exchange_format === "swap"
              ? "bg-primary text-primary-foreground border-0"
              : "border-border bg-card text-foreground"
          }`}
        >
          {exchangeFormatTitle[item.exchange_format]}
        </Badge>
        <Button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            if (isUserLoading || isBookmarkPending || areBookmarksLoading) {
              return;
            }

            if (!user) {
              navigate("/login");
              return;
            }

            if (isBookmarked) {
              deleteBookmark(String(item.id));
            } else {
              createBookmark(String(item.id));
            }
          }}
          type="button"
          variant="ghost"
          size="icon"
          disabled={isUserLoading || isBookmarkPending || areBookmarksLoading}

          className="text-foreground absolute top-2 right-2 rounded-none"
        >
          <Heart
            className={`size-6 stroke-2 ${
              isBookmarked ? "fill-destructive text-destructive" : "fill-white"
            }`}
          />
        </Button>
      </div>
      <CardContent className="flex min-w-0 flex-col items-start p-0">
        <h2 className="line-clamp-2 text-base leading-5 font-bold sm:text-lg">
          {item.title}
        </h2>
        <p className="mt-1 line-clamp-1 text-sm leading-5 font-medium">
          {item.size || conditionTitle[item.condition]}
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-4">
          {item.district}
        </p>
      </CardContent>
    </Card>
  );
}
