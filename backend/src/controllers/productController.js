import Product from "../models/productModel.js";

// Create a product
export const createProduct = async (req, res) => {
  try {
    const { name, sku, createdBy, categoryId, supplierId } = req.body;

    if (!name || !sku || !createdBy || !categoryId || !supplierId) {
      return res.status(400).json({
        success: false,
        message:
          "Name, SKU, CreatedBy, CategoryId, and SupplierId are required",
      });
    }

    // Check if name already exists
    const exists = await Product.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Add image URL if uploaded
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      ...req.body,
      imageUrl,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categoryId", "name"); // get only category name

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get products by category name
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const products = await Product.find({ category });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get low-stock items bsed on minimumQuantity on each product
// Get low-stock items based on minimumQuantity for each product
export const getLowStockItems = async (req, res) => {
  try {
    const items = await Product.find({
      $expr: { $lt: ["$currentQuantity", "$minimumQuantity"] }
    })
      .select("name sku currentQuantity minimumQuantity")
      .sort({ currentQuantity: 1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (error) {
    console.error("Low-stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch low stock items",
      error: error.message
    });
  }
};


// Get one product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });

    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (with optional new image)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });

    let updateData = { ...req.body };

    // If new image uploaded → replace imageUrl
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
