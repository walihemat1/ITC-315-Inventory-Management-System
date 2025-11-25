import Product from "../models/productModel.js";

// Create a product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all products
export const getProducts = async () => {};
try {
  const products = await Product.find({});
  res.status(200).json(products);
} catch (error) {
  res.status(500).json({ message: error.message });
}

// get a single product By Id
export const getProduct = async () => {};
try {
  const { id } = req.params;
  const product = await product.findById(id);
} catch (error) {
  res.status(500).json({ message: error.message });
}

//update Product
export const updateProduct = async () => {};

//Delete Product
export const deleteProduct = async () => {};

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
