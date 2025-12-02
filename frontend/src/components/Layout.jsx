import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="grid bg-teal-950 min-h-screen min-w-100vw">
      <Navbar />
      <div className="md:flex flex-1 min-h-[calc(100vh-<navbar-height>)]"> 
        <Sidebar />
        <main className="flex flex-col sm:max-w-[calc(screen-2rem)] md:w-auto flex-1 py-4 px-3 md:p-8 bg-cyan-950 m-4 rounded-lg overflow-y-auto h-[calc(100vh-9rem)]">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

