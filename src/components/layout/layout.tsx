import { Outlet } from "react-router-dom";
import { Footer } from "./footer";
import { Header } from "./header";

// <div className="flex min-h-svh flex-1 flex-col"> - елси надо будет чтобы футер был снизу, а не на экране

export function Layout() {
  // мб + lg:px-12
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="min-w-0 flex-1 px-0 pb-16 lg:px-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
