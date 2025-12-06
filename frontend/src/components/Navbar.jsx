// src/components/Navbar.jsx
import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../pages/auth/authSlice";

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, fullName, email } = useSelector((state) => state.auth || {});

  const displayName =
    user?.fullName || fullName || user?.email || email || "User";

  const initials = (displayName || "U")
    .split(" ")
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const topNavItems = [{ name: "Sign Out", icon: LogOut, path: null }];

  const handleButtonClick = (item) => {
    if (item.name === "Sign Out") {
      handleSignOut();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-950 via-teal-900 to-cyan-900 shadow-md">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        {/* LEFT: Hamburger (mobile) + Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden mr-1 rounded-md p-1.5 text-teal-200 hover:bg-teal-800/70 hover:text-white transition"
            onClick={onToggleSidebar}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-inner border border-teal-300">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                IN
              </span>
            </div>
            <div className="leading-tight hidden xs:block">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Inventory Nexus
              </h1>
              <p className="text-[10px] sm:text-xs text-teal-200">
                Smart stock &amp; sales control
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Actions + Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            {topNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleButtonClick(item)}
                  className="flex items-center justify-center rounded-full p-2 hover:bg-teal-800/70 text-teal-200 hover:text-teal-50 transition-colors"
                  title={item.name}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              );
            })}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-teal-700 rounded-full flex items-center justify-center border border-teal-300 shadow">
              <span className="text-xs sm:text-sm font-semibold text-white">
                {initials}
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs sm:text-sm text-cyan-100 font-medium max-w-[160px] truncate">
                {displayName}
              </span>
              <button
                onClick={() => navigate("/profile")}
                className="text-[10px] text-teal-300 hover:text-teal-100 underline-offset-2 hover:underline text-left"
              >
                View profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile quick actions (only sign out right now) */}
      <div className="flex sm:hidden justify-end gap-2 px-4 pb-2 text-teal-100">
        {topNavItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => handleButtonClick(item)}
              className="flex items-center justify-center rounded-full p-2 hover:bg-teal-800/70 text-teal-200 hover:text-teal-50 transition-colors"
              title={item.name}
            >
              <IconComponent className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </header>
  );
}
