async function updateLowStock(product) {
  product.lowStock = product.currentQuantity < product.minimumQuantity;
  await product.save();
}

export default updateLowStock;
