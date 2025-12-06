// src/components/Layout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-teal-950 flex">
      {/* DESKTOP SIDEBAR (always visible on md+) */}
      <aside className="hidden md:block h-screen w-56 lg:w-64 sticky top-0">
        <Sidebar />
      </aside>

      {/* RIGHT SIDE: NAVBAR + PAGE + FOOTER */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Navbar at top of content column */}
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Scrollable content area */}
        <main className="flex-1 flex flex-col overflow-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-teal-950 shadow-xl border-r border-cyan-800">
            <Sidebar onLinkClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
