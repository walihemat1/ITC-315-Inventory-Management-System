import { useState, useMemo } from "react";
import { Pen } from "lucide-react";
import { Link } from "react-router-dom";

export default function SalesList({ Sales, onEditSale }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredSales = useMemo(() => {
    return Sales.filter((s) => {
      const customerMatch = (s.customerId?.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const productMatch = s.items.some((item) =>
        (item.productId?.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

      const totalMatch =
        (minTotal === "" || s.totalAmount >= Number(minTotal)) &&
        (maxTotal === "" || s.totalAmount <= Number(maxTotal));

      const unpaidMatch = showUnpaid ? s.totalAmount - s.amountPaid > 0 : true;

      const date = new Date(s.date);
      const dateMatch =
        (!startDate || date >= new Date(startDate)) &&
        (!endDate || date <= new Date(endDate));

      return (customerMatch || productMatch) &&
             totalMatch &&
             unpaidMatch &&
             dateMatch;
    });
  }, [Sales, searchTerm, minTotal, maxTotal, showUnpaid, startDate, endDate]);

  return (
    <div className="space-y-4">

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search invoice, customer, or product..."
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

      {/* Sale LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredSales.map((s) => (
          <div key={s._id} className="bg-cyan-800 p-4 rounded-md shadow-md">

            {/* Edit Button */}
            <div className="flex justify-end">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  onEditSale(s);
                }}
                className="h-8 w-8 hover:scale-105"
              >
                <Pen className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md h-8 w-8 p-2" />
              </Link>
            </div>

            <p className="text-gray-300">
              Customer: {s.customerId?.name ?? "N/A"}
            </p>

            <p className="text-gray-300">
              Date: {new Date(s.date).toLocaleDateString()}
            </p>

            <p className="text-gray-300">
              Invoice #: {s.invoiceNumber ?? "—"}
            </p>

            <p className="text-gray-300 mt-2">
              Subtotal: ${s.subtotal?.toFixed(2) ?? "0.00"}
            </p>

            <p className="text-gray-300">
              Tax: ${s.tax?.toFixed(2) ?? "0.00"}
            </p>

            <p className="text-gray-300">
              Discount: ${s.discount?.toFixed(2) ?? "0.00"}
            </p>

            <p className="text-gray-300 font-semibold mt-2">
              Total Amount: ${s.totalAmount?.toFixed(2)}
            </p>

            <p className="text-gray-300">
              Paid: ${s.amountPaid?.toFixed(2)}
            </p>

            <p className="text-red-400 font-semibold">
              Balance: ${(s.totalAmount - s.amountPaid).toFixed(2)}
            </p>

            <div className="mt-3 text-gray-200">
              <h3 className="font-semibold">Items:</h3>
              <ul className="ml-4 list-disc">
                {s.items.map((item) => (
                  <li key={item._id}>
                    {item.productId?.name ?? "Unknown"}  
                    — Qty: {item.quantity}, Price: ${item.price}, Total: ${item.total}
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
