import { useSearchParams, Link, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Favorites } from "../favorites";
import { useMe } from "@/hooks";
import { ProfileHistory } from "./profile-history";
import { ProfileNav, profileTabs, type ProfileTab } from "./profile-nav";
import { ProfileNotifications } from "./profile-notifications";
import { ProfileOverview } from "./profile-overview";
import { ProfileSettings } from "./profile-settings";

function isProfileTab(value: string | null): value is ProfileTab {
  return profileTabs.some((item) => item.id === value);
}

export function Profile() {
  const { data: user, isLoading, isError } = useMe();
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: ProfileTab = isProfileTab(requested) ? requested : "profile";
  const current = profileTabs.find((item) => item.id === tab);

  function select(next: ProfileTab) {
    if (next === "profile") {
      setParams({});
      return;
    }
    setParams({ tab: next });
  }

  if (requested === "chats") {
    return <Navigate to="/chats" replace />;
  }

  if (requested === "items") {
    return <Navigate to="/my-items" replace />;
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Загрузка...</span>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <span>Ошибка загрузки данных</span>
      </section>
    );
  }

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex flex-wrap items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          {tab === "profile" ? (
            <Link
              to="/profile"
              className="hover:underline hover:underline-offset-4"
            >
              Мой профиль
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => select("profile")}
                className="cursor-pointer hover:underline hover:underline-offset-4"
              >
                Мой профиль
              </button>
              <ChevronRight />
              <Link
                to={`?tab=${tab}`}
                className="hover:underline hover:underline-offset-4"
              >
                {current?.label}
              </Link>
            </>
          )}
        </nav>
        <h1 className="mb-7 text-[32px] leading-10 font-semibold tracking-tight">
          {current?.label}
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-[1550px] items-start gap-6 px-6 pb-12 lg:grid-cols-[246px_minmax(0,1fr)] lg:px-0">
        <ProfileNav user={user} tab={tab} onSelect={select} />
        <div className="min-w-0">
          {tab === "profile" && (
            <ProfileOverview onHistory={() => select("history")} />
          )}
          {tab === "history" && <ProfileHistory />}
          {tab === "favorites" && <Favorites embedded />}
          {tab === "notifications" && <ProfileNotifications />}
          {tab === "settings" && (
            <ProfileSettings
              user={user}
              onNotifications={() =>
                setParams({ tab: "notifications", section: "subscriptions" })
              }
            />
          )}
        </div>
      </section>
    </div>
  );
}
