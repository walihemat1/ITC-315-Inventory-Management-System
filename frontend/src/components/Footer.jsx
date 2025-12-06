// src/components/Footer.jsx
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-cyan-950 border-t border-teal-800 px-4 sm:px-6 lg:px-10 py-4 mt-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-gray-300">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Inventory Nexus
          </h2>
          <p className="text-sm text-gray-400">
            Inventory Nexus helps small shops keep products, stock levels, and
            sales under control with clear dashboards and simple workflows.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            Quick Links
          </h3>
          <ul className="space-y-1 text-sm list-none">
            <li>
              <a
                href="/admin/dashboard"
                className="hover:text-white transition no-underline text-gray-400"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="hover:text-white transition no-underline text-gray-400"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="/purchases"
                className="hover:text-white transition no-underline text-gray-400"
              >
                Purchases
              </a>
            </li>
            <li>
              <a
                href="/sales"
                className="hover:text-white transition no-underline text-gray-400"
              >
                Sales
              </a>
            </li>
            <li>
              <a
                href="/stockflow"
                className="hover:text-white transition no-underline text-gray-400"
              >
                Stock Flow
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            Stay Connected
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            Follow us for tips on managing stock and keeping your shop running
            smoothly.
          </p>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Inventory Nexus. All rights reserved.
      </div>
    </footer>
  );
}
