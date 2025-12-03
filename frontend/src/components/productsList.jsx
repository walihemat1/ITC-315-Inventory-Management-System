import { useState, useMemo } from "react";

export default function ProductsList({ products }) {
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
      <div className="flex gap-3">
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

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product._id}
            className="bg-cyan-800 hover:scale-103 border p-4 grid items-center justify-center rounded shadow-sm"
          >
            <img
                className="w-48 h-48 object-cover mr-4 rounded mb-4"
                src={`http://localhost:5000${product.imageUrl}`}
                alt={product.name} 
             />
            <div className="flex flex-cols-2 gap-8 justify-between">
                <div>
                    <h2 className="font-bold">{product.name}</h2>
                    <div>
                        <p>Category: {product.categoryId ? product.categoryId.name : "N/A"}</p>
                        <p>SKU: {product.sku}</p>
                    </div>
                </div>
                <div>
                    <div className="text-green-400">
                        <p className="text-orange-300">Price: ${Number(product.sellingPrice || 0).toFixed(2)}</p>
                        <p>Qty: {product.currentQuantity}</p>
                        <p>Min Qty: {product.minimumQuantity}</p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
