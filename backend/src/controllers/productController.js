import Product from "../models/productModel";

export const createProduct = async (req, res) => {
  try {
    const { productName, description, quantity } = req.body;
    const product = await Product.create(req.body);
  } catch (error) {}
};

// get all products
export const getProducts = async () => {};

// get a single a product
export const getProduct = async () => {};

export const updateProduct = async () => {};

export const deleteProduct = async () => {};
