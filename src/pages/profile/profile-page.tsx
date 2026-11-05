import { useLogout } from "@/hooks";

export function ProfilePage() {
  const { mutate: logout } = useLogout();
  return (
    <>
      <span>Профиль</span>
      <button
        onClick={() => logout()}
        type="button"
        className="text-foreground hover:text-foreground/80 flex h-12 w-13 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg text-xs transition-colors"
      >
        <span className="hidden sm:block">Выйти</span>
      </button>
    </>
  );
}
