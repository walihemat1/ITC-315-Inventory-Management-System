import { useState, useMemo } from "react";
import {DeleteIcon, Pen} from 'lucide-react';
import { Link } from "react-router-dom";

export default function ProductsList({ products, onEditProduct }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // ---- FILTER & SEARCH LOGIC ----
  const filteredProducts = useMemo(() => {
  return products.filter(product => {
    const nameMatch = (product?.name ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const skuMatch = (product?.sku ?? "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const categoryMatch =
      category === "all" ||
      (product.categoryId?.name === category);

    const price = Number(product?.sellingPrice ?? 0);
    const priceMatch =
      (minPrice === "" || price >= Number(minPrice)) &&
      (maxPrice === "" || price <= Number(maxPrice));

    const lowStockMatch = lowStockOnly
      ? Number(product.currentQuantity) < Number(product.minimumQuantity)
      : true;

    return (nameMatch || skuMatch) && categoryMatch && priceMatch && lowStockMatch;
  });
}, [products, searchTerm, category, minPrice, maxPrice, lowStockOnly]);
  // Extract unique categories
  const uniqueCategories = [
    ...new Map(
      products
        .filter((p) => p.categoryId)
        .map((p) => [p.categoryId._id, p.categoryId])
    ).values(),
  ];

  // Extract unique suppliers
  const uniqueSuppliers = [
    ...new Map(
      products
        .filter((p) => p.supplierId)
        .map((p) => [p.supplierId._id, p.supplierId])
    ).values(),
  ];

  return (
    <div className="space-y-4">
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by name or SKU..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full bg-cyan-700 text-white"
      />

      {/* FILTERS */}
      <div className="grid md:flex gap-3 space-x-2 mb-4 space-y-2">
        {/* Category Filter */}
        <select
          className="border p-2 rounded bg-cyan-700 text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {/* Map dynamic categories */}
          {[...new Set(products.map(p => p.categoryId?.name))].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex gap-2 justify-center">
          <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded w-24 bg-cyan-700 text-white"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-24 bg-cyan-700 text-white"
        />
        </div>

        {/* Low Stock Toggle */}
        <label className="flex items-center gap-2 bg-cyan-700 text-white p-2 rounded border">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={() => setLowStockOnly(!lowStockOnly)}
          />
          Low Stock
        </label>
      </div>

      {/* STOCK IN */}
          <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
            {!filteredProducts  || filteredProducts.length == 0 ? (
              <p className="text-cyan-200">No products found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-left">
                  <thead>
                    <tr className="border-b border-cyan-700 text-cyan-200">
                      <th className="py-2 pr-3">Image</th>
                      <th className="py-2 pr-3">Product</th>
                      <th className="py-2 pr-3">SKU</th>
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3">Price</th>
                      <th className="py-2 pr-3">Stock</th>
                      <th className="py-2 pr-3">Min Stock</th>
                      <th className="py-2 pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-cyan-800 hover:bg-cyan-800/60"
                      >
                        <td className="py-2 pr-3 text-white">
                          <img 
                            className="w-16"
                            src={`http://localhost:5000${p.imageUrl}`}>

                            </img>
                        </td>
                        <td className="py-2 pr-3 text-white">
                          {p.name || "-"}
                        </td>
                        <td className="py-2 pr-3 text-green-400">
                          {p.sku}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {p.categoryId?.name}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {p.sellingPrice}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {p.currentQuantity}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          {p.minimumQuantity}
                        </td>
                        <td className="py-2 pr-3 text-cyan-100">
                          <div className="flex gap-0.5">
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();  // stops navigation
                              onEditProduct(p, uniqueCategories, uniqueSuppliers );
                              console.log(p);
                            }}
                            
                            className="mt-2 h-8 w-8 hover:scale-105"
                          >
                            <Pen className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-md h-8 w-8 p-2" />
                          </Link>
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();  // stops navigation
                              onEditProduct(p, uniqueCategories, uniqueSuppliers );
                              console.log(p);
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
