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

export default function Sidebar() {
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);
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
      name: "Categories",
      icon: FolderTree,
      path: "/categories",
    },
    {
      name: "Stock Flow",
      icon: Activity,
      path: "/stockflow",
    },
  ];

  const adminItems = [
    {
      name: "Purchases",
      icon: ShoppingCart,
      path: "/admin/purchases",
    },
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

  if (role === "admin") {
    navItems.push({
      name: "Suppliers",
      path: "/admin/suppliers",
      icon: User2Icon,
    });
  }
  if (role === "admin") {
    navItems.push({
      name: "Customers",
      path: "/admin/customers",
      icon: UserIcon,
    });
  }

  useEffect(() => {
    const current =
      location.pathname.split("/")[2] || location.pathname.split("/")[1];
    const match = navItems.find((item) =>
      item.path.toLowerCase().includes(current.toLowerCase())
    );

    if (match) setActiveNav(match.name);
  }, [location.pathname]);

  return (
    <div
      className="md:w-52 bg-teal-900 m-4 md:ml-0 rounded-lg py-4 px-0 
     max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-teal-900"
    >
      <nav>
        <ul className="grid grid-cols-1 gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.name}
                className="mx-6 md:mx-auto hover:scale-105 transition-transform w-auto md:w-48"
              >
                <Link
                  to={item.path}
                  onClick={() => setActiveNav(item.name)}
                  className={`flex items-center no-underline p-1 md:px-6 md:py-3 rounded transition-all ${
                    activeNav === item.name
                      ? "text-white font-extrabold bg-cyan-800 scale-[1.02]"
                      : "text-cyan-200 font-bold hover:bg-cyan-800 hover:text-teal-200"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
