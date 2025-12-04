import { useState, useMemo, useEffect } from "react";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";

export default function PurchasesList({ Purchases, onEditPurchase }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredPurchases = useMemo(() => {
    return Purchases.filter((p) => {
      const invoiceMatch = (p.invoiceNumber ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const supplierMatch = (p.supplierId?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const productMatch = p.items.some((item) =>
        (item.productId?.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      const totalMatch =
        (minTotal === "" || p.totalAmount >= Number(minTotal)) &&
        (maxTotal === "" || p.totalAmount <= Number(maxTotal));

      const unpaidMatch = showUnpaid ? p.balanceRemaining > 0 : true;

      const date = new Date(p.date);
      const dateMatch =
        (!startDate || date >= new Date(startDate)) &&
        (!endDate || date <= new Date(endDate));

      return (invoiceMatch || supplierMatch || productMatch) &&
             totalMatch &&
             unpaidMatch &&
             dateMatch;
    });
  }, [Purchases, searchTerm, minTotal, maxTotal, showUnpaid, startDate, endDate]);

  return (
    <div className="space-y-4">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search invoice, supplier, or product..."
        className="border p-2 rounded w-full bg-cyan-700 text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* FILTERS */}
      <div className="grid gap-3 lg:flex mb-4">

        {/* Total Amount Range */}
        <input
          type="number"
          placeholder="Min Total"
          className="border p-2 rounded bg-cyan-700 text-white w-28"
          value={minTotal}
          onChange={(e) => setMinTotal(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Total"
          className="border p-2 rounded bg-cyan-700 text-white w-28"
          value={maxTotal}
          onChange={(e) => setMaxTotal(e.target.value)}
        />

        {/* Unpaid Only */}
        <label className="flex items-center gap-2 bg-cyan-700 text-white p-2 rounded border">
          <input
            type="checkbox"
            checked={showUnpaid}
            onChange={() => setShowUnpaid(!showUnpaid)}
          />
          Unpaid Only
        </label>

        {/* Date Range */}
        <input
          type="date"
          className="border p-2 rounded bg-cyan-700 text-white"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded bg-cyan-700 text-white"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* PURCHASE LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredPurchases.map((p) => (
          <div key={p._id} className="bg-cyan-800 p-4 rounded-md shadow-md">

            {/* Edit Button */}
            <div className="flex justify-end">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onEditPurchase(p);
                }}
                className="h-8 w-8 hover:scale-105"
              >
                <Pen className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md h-8 w-8 p-2" />
              </Link>
            </div>

            <h2 className="text-xl font-bold text-white">
              Invoice #{p.invoiceNumber}
            </h2>

            <p className="text-gray-300">
              Supplier: {p.supplierId?.name ?? "N/A"}
            </p>

            <p className="text-gray-300">
              Date: {new Date(p.date).toLocaleDateString()}
            </p>

            <p className="text-gray-300 mt-2">
              Total Amount: ${p.totalAmount.toFixed(2)}
            </p>

            <p className="text-gray-300">
              Paid: ${p.amountPaid.toFixed(2)}
            </p>

            <p className="text-red-400">
              Balance: ${p.balanceRemaining.toFixed(2)}
            </p>

            <div className="mt-3 text-gray-200">
              <h3 className="font-semibold">Items:</h3>
              <ul className="ml-4 list-disc">
                {p.items.map((item) => (
                  <li key={item._id}>
                    {item.productId?.name ?? "Unknown"}  
                    — Qty: {item.quantity}, Cost: ${item.totalCost}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
