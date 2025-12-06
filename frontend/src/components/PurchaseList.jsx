import { useState, useMemo, useEffect } from "react";
import { Pen, DeleteIcon } from "lucide-react";
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

      {/* Purchases */}
      <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
        {!filteredPurchases  || filteredPurchases.length == 0 ? (
          <p className="text-cyan-200">No purchases found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm text-left">
              <thead>
                <tr className="border-b border-cyan-700 text-cyan-200">
                  <th className="py-2 pr-3">Invoice #</th>
                  <th className="py-2 pr-3">Created By</th>
                  <th className="py-2 pr-3">Updated By</th>
                  <th className="py-2 pr-3">Supplier</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Total</th>
                  <th className="py-2 pr-3">Paid</th>
                  <th className="py-2 pr-3">Balance</th>
                  <th className="py-2 pr-3">Items</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-cyan-800 hover:bg-cyan-800/60"
                  >
                    <td className="py-2 pr-3 text-white">
                      {p.invoiceNumber || "-"}
                    </td>
                    <td className="py-2 pr-3 text-white">
                      {p.userId?.fullName || "-"}
                    </td>
                    <td className="py-2 pr-3 text-white">
                      {p.updatedBy?.fullName || "-"}
                    </td>
                    <td className="py-2 pr-3 text-white">
                      {p.supplierId?.name || "-"}
                    </td>
                    <td className="py-2 pr-3 text-green-400">
                      {p.date || "-"}
                    </td>
                    <td className="py-2 pr-3 text-cyan-100">
                      {p.totalAmount || "-"}
                    </td>
                    <td className="py-2 pr-3 text-cyan-100">
                      {p.amountPaid || ""}
                    </td>
                    <td className="py-2 pr-3 text-cyan-100">
                      {p.balanceRemaining || ""}
                    </td>
                    <td className="py-2 pr-3 text-cyan-100">
                      <ul className="ml-4 list-disc">
                        {p.items.map((item) => (
                          <li key={item._id}>
                            {item.productId?.name ?? "Unknown"}  
                            — Qty: {item.quantity}, Cost: ${item.totalCost}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2 pr-3 text-cyan-100">
                      <div className="flex gap-0.5">
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();  // stops navigation
                          onEditPurchase(p);
                        }}
                        
                        className="mt-2 h-8 w-8 hover:scale-105"
                      >
                        <Pen className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md h-8 w-8 p-2" />
                      </Link>
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();  // stops navigation
                          onEditPurchase(p);
                        }}
                        
                        className="mt-2 h-8 w-8 hover:scale-105"
                      >
                        <DeleteIcon className="bg-red-600 hover:bg-red-700 text-white rounded-md h-8 w-8 p-2" />
                      </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
