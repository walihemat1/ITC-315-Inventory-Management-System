import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="max-w-screen m-2 bg-cyan-950 rounded-lg text-gray-300 px-6 mt-6">
      <div className="border-t border-teal-700 mb-4 text-center text-sm text-teal-500">
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo & About */}
        <div>
          <h2 className="text-2xl font-bold text-gray-300 mb-3">IMS</h2>
          <p className="text-sm text-gray-400">
            Inventory Management System (IMS) is a comprehensive solution designed to streamline inventory tracking, management, and reporting for businesses of all sizes.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm list-none">
            <li><a href="/Dashboard" className="hover:text-white transition no-underline text-gray-400">Dashboard</a></li>
            <li><a href="/products" className="hover:text-white transition no-underline text-gray-400">Products</a></li>
            <li><a href="/purchases" className="hover:text-white transition no-underline text-gray-400">Purchases</a></li>
            <li><a href="/sales" className="hover:text-white transition no-underline text-gray-400">Sales</a></li>
            <li><a href="/stockFlow" className="hover:text-white transition no-underline text-gray-400">Stock Flow</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Follow Us</h3>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20}/></a>
            <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20}/></a>
            <a href="#" className="text-gray-400 hover:text-white"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-teal-700 mt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} IMS. All rights reserved.
      </div>
    </footer>
  );
}
