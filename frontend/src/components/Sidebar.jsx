import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Warehouse, BadgeDollarSign, LayoutDashboard, ChartCandlestick } from "lucide-react";


export default function Sidebar() {
    const [activeNav, setActiveNav] = useState("Dashboard");
    const location = useLocation();
    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard},
        { name: "Products", icon: Warehouse },
        { name: "Purchases", icon: ShoppingCart },
        { name: "Sales", icon: BadgeDollarSign },
        { name: "Stock Flow", icon: ChartCandlestick },
    ];

    useEffect(() => {
        const currentPath = location.pathname.split("/")[1];
        const match = navItems.find(
            (item) => item.name.toLowerCase() === currentPath
        );

        if (match) {
            setActiveNav(match.name);
        }
    }, [location.pathname]);
    return (
        <div className="md:w-52 bg-teal-900 m-4 ml-0 rounded-tr-lg py-4 px-0 rounded-br-lg max-h-78">
          <nav className="">
            <ul className="p-0 grid grid-cols-1 md:grid-cols-1 gap-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <ul key={item.name} className="mx-6 md:mx-auto hover:scale-105 transition-transform w-auto md:w-48">
                    <Link to={`/${item.name.toLowerCase()}`}
                      onClick={() => setActiveNav(item.name)}
                      className={`flex hover:text-teal-200 no-underline items-center p-1 md:px-6 md:py-3 text-left transition-colors ${
                        activeNav === item.name
                          ? "text-white text-l font-extrabold pl-6 scale-[1.02] bg-cyan-800"
                          : "text-cyan-200 font-bold hover:scale-103 transition-all duration-300 hover:bg-cyan-800"
                      }`}
                    >
                      <IconComponent className=" w-5 h-5 mr-3" />
                      <span className="md:inline">{item.name}</span>
                    </Link>
                  </ul>
                );
              })}
            </ul>
          </nav>
        </div>
    );
}