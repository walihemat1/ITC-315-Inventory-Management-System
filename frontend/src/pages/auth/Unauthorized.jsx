// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-teal-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-cyan-900 rounded-xl shadow-lg p-8 border border-cyan-700 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Unauthorized</h1>
        <p className="text-cyan-200 mb-4">
          You do not have permission to view this page.
        </p>
        <Link
          to="/user-dashboard"
          className="inline-block bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
