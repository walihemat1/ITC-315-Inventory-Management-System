// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Warehouse,
  BadgeDollarSign,
  LayoutDashboard,
  FolderTree,
  User2Icon,
  UserIcon,
  UserCog,
  Settings2,
  Activity,
  Cog,
  BarChart3,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Sidebar({ onLinkClick }) {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth || {});
  const [activeNav, setActiveNav] = useState("");

  const sharedItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: role === "admin" ? "/admin/dashboard" : "/staff/dashboard",
    },
    {
      name: "Products",
      icon: Warehouse,
      path: "/products",
    },
    {
      name: "Stock Flow",
      icon: Activity,
      path: "/stockflow",
    },
    {
      name: "Purchases",
      icon: ShoppingCart,
      path: "/purchases",
    },
  ];

  const adminItems = [
    {
      name: "Sales",
      icon: BadgeDollarSign,
      path: "/admin/sales",
    },
    {
      name: "Users",
      icon: UserCog,
      path: "/admin/users",
    },
    {
      name: "Adjust Stock",
      icon: Settings2,
      path: "/stock-adjustment",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      name: "Settings",
      icon: Cog,
      path: "/admin/settings",
    },
    {
      name: "Suppliers",
      path: "/admin/suppliers",
      icon: User2Icon,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: UserIcon,
    },
    {
      name: "Categories",
      icon: FolderTree,
      path: "/admin/categories",
    },
  ];

  const staffItems = [
    {
      name: "Sales",
      icon: BadgeDollarSign,
      path: "/sales",
    },
  ];

  const navItems = [
    ...sharedItems,
    ...(role === "admin" ? adminItems : staffItems),
  ];

  useEffect(() => {
    const current =
      location.pathname.split("/")[2] || location.pathname.split("/")[1];
    const match = navItems.find((item) =>
      item.path.toLowerCase().includes(current.toLowerCase())
    );

    if (match) setActiveNav(match.name);
  }, [location.pathname, role]);

  const handleItemClick = (name) => {
    setActiveNav(name);
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="h-full bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 border-r border-cyan-800 flex flex-col">
      {/* Header / label */}
      <div className="px-4 py-3 border-b border-teal-800 hidden md:block">
        <p className="text-xs font-semibold tracking-wide text-teal-300 uppercase">
          Navigation
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-teal-950">
        <ul className="py-3 space-y-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeNav === item.name;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item.name)}
                  className={`mx-2 flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-all no-underline ${
                    isActive
                      ? "bg-cyan-800 text-white shadow-sm"
                      : "text-cyan-200 hover:bg-cyan-800/70 hover:text-teal-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-3 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
