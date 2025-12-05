import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categorySlice";

import Layout from "../../components/Layout";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const { items, loading, error, saving, deleting } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await dispatch(
          updateCategory({
            id: editingId,
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      } else {
        await dispatch(
          createCategory({
            name: formData.name,
            description: formData.description,
          })
        ).unwrap();
      }
      resetForm();
    } catch (err) {
      console.error("Save category error:", err);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
    } catch (err) {
      console.error("Delete category error:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-cyan-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-cyan-200 text-sm">
              Manage product categories. Both admin and staff can access this.
            </p>
          </div>
          <div className="text-cyan-200 text-sm">
            {loading ? "Loading..." : `Total categories: ${items.length}`}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-700 text-white text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Category name"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-cyan-100 text-sm mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-cyan-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Short description"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              >
                {saving
                  ? editingId
                    ? "Updating..."
                    : "Creating..."
                  : editingId
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Existing Categories
          </h2>

          {loading ? (
            <p className="text-cyan-200">Loading categories...</p>
          ) : items.length === 0 ? (
            <p className="text-cyan-200">No categories found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-cyan-700 text-cyan-200">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-b border-cyan-800 hover:bg-cyan-800/60"
                    >
                      <td className="py-2 pr-4 text-white">{cat.name}</td>
                      <td className="py-2 pr-4 text-cyan-100">
                        {cat.description || "-"}
                      </td>
                      <td className="py-2 pr-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-xs md:text-sm font-bold py-1 px-3 rounded bg-blue-600 hover:bg-blue-800 text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          disabled={deleting}
                          className="text-xs md:text-sm font-bold py-1 px-3 rounded bg-red-600 hover:bg-red-800 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-2 text-xs text-cyan-300 md:hidden">
                Tip: Scroll horizontally to see all columns.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
