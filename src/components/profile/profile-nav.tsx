import { Link } from "react-router-dom";
import {
  Bell,
  Clock3,
  Heart,
  MessageSquare,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import { useConversations, useNotifications } from "@/hooks";
import type { TUser } from "@/types";
import { personName } from "./format";
import { UserAvatar } from "./user-avatar";

export const profileTabs = [
  { id: "profile", label: "Мой профиль", icon: UserRound },
  { id: "history", label: "История обменов", icon: Clock3 },
  { id: "favorites", label: "Избранное", icon: Heart },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "settings", label: "Настройки", icon: Settings },
] as const;

const profileNav = [
  profileTabs[0],
  { id: "items", label: "Мои вещи", icon: Package, to: "/my-items" },
  profileTabs[1],
  profileTabs[2],
  profileTabs[3],
  { id: "chats", label: "Чаты", icon: MessageSquare, to: "/chats" },
  profileTabs[4],
];

export type ProfileTab = (typeof profileTabs)[number]["id"];

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="bg-primary text-primary-foreground ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-semibold">
      {count}
    </span>
  );
}

export function ProfileNav({
  user,
  tab,
  onSelect,
}: {
  user: TUser;
  tab: ProfileTab;
  onSelect: (tab: ProfileTab) => void;
}) {
  const name = personName(user);
  const notifications = useNotifications();
  const conversations = useConversations();
  const unreadNotifications =
    notifications.data?.results.filter((item) => !item.read_at).length ?? 0;
  const unreadChats =
    conversations.data?.results.reduce(
      (sum, item) => sum + item.unread_count,
      0,
    ) ?? 0;

  function badge(id: string) {
    if (id === "notifications") return unreadNotifications;
    if (id === "chats") return unreadChats;
    return 0;
  }

  return (
    <aside className="border-border bg-card h-fit rounded-2xl border p-3">
      <div className="flex items-center gap-3 px-2 py-2">
        <UserAvatar
          src={user.avatar}
          name={name}
          className="size-10 text-base"
        />
        {name && (
          <span className="truncate text-[17px] leading-6 font-semibold">
            {name}
          </span>
        )}
      </div>
      <div
        className="mt-2 grid gap-1"
        role="tablist"
        aria-label="Разделы профиля"
      >
        {profileNav.map((item) => {
          const Icon = item.icon;
          const className =
            "flex h-10 w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 text-sm";
          const count = <CountBadge count={badge(item.id)} />;
          if ("to" in item) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`${className} text-foreground hover:bg-muted font-medium`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
                {count}
              </Link>
            );
          }
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onSelect(item.id)}
              className={`${className} ${
                selected
                  ? "bg-secondary text-secondary-foreground font-semibold"
                  : "text-foreground hover:bg-muted font-medium"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
              {count}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
