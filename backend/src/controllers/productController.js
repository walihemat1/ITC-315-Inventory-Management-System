import Product from "../models/productModel.js";

// Create a product
export const createProduct = async (req, res) => {
  try {
    const ifExists = await product.findOne({ name: req.body.name });
    if (ifExists) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const product = await Product.create(req.body);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch products by category name
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category){
      return res.status(400).json({
        success: false,
        message: "Category name is required" });
    }

    const products = await Product.find({ category });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id){
      return res.status(400).json({
        success: false,
        message: "Product ID is required" });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id){
      return res.status(400).json({
        success: false,
        message: "Product ID is required" });
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id){
      return res.status(400).json({
        success: false,
        message: "Product ID is required" });
    }
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


