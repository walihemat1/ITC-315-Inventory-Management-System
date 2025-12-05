import Customer from "../models/customerModel.js";

// ================== CREATE CUSTOMER ==================
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, address, balance } = req.body;

    if (!name || !phone)
      return res.status(400).json({ success: false, message: "Name and phone are required" });

    const newCustomer = await Customer.create({
      name,
      phone,
      address,
      balance: balance || 0,
    });

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================== GET ALL CUSTOMERS ==================
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Get Customers Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================== GET SINGLE CUSTOMER ==================
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    res.json(customer);
  } catch (error) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================== UPDATE CUSTOMER ==================
export const updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Customer not found" });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================== DELETE CUSTOMER ==================
export const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Customer not found" });

    res.json({ success: true, message: "Customer deleted" });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================== UPDATE BALANCE ==================
export const updateCustomerBalance = async (req, res) => {
  try {
    const { amount } = req.body; // amount to add (+) or subtract (-)

    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    customer.balance = customer.balance + Number(amount);
    await customer.save();

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error("Balance Update Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
