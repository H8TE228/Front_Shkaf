import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

export function Layout() {
  // мб + lg:px-12
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="min-w-0 flex-1 px-0 lg:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
