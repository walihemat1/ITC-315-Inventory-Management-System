import { Warehouse, BadgeDollarSign, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../pages/auth/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const topNavItems = [
    { name: "Sales", icon: BadgeDollarSign },
    { name: "Inventory", icon: Warehouse },
    { name: "Sign Out", icon: LogOut },
  ];

  const handleButtonClick = (name) => {
    if (name === "Sign Out") {
      handleSignOut();
      return;
    } else {
      navigate(`/${name}`);
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
    <div className="bg-teal-900 max-h-15">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="justify-start">
          <h1 className="text-xl font-bold text-white">IMS</h1>
        </div>
        <div className="md:flex inline-flex items-center space-x-6">
          {topNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleButtonClick(item.name)}
                className="flex items-center bg-transparent text-teal-400 hover:text-teal-600 transition-colors"
                title={item.name}
              >
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {user && (
              <span className="text-cyan-100 text-sm hidden sm:inline">
                {user.fullName || user.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
