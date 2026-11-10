import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { useEffect } from "react";

// <div className="flex min-h-svh flex-1 flex-col"> - елси надо будет чтобы футер был снизу, а не на экране

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  // мб + lg:px-12
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex min-h-[90svh] flex-1 flex-col md:min-h-[85svh]">
        <Header />
        <main className="min-w-0 flex-1 px-0 pb-16 lg:px-12">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
