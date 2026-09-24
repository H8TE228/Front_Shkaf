import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";
import { useEffect } from "react";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]); //мб + search

  return (
    <div>
      <div className="flex min-h-svh flex-1 flex-col">
        <Header />
        <main className="flex flex-1 flex-col px-0 pt-6 pb-12 lg:px-12">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
