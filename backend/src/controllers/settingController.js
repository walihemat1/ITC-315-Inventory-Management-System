import Setting from "../models/settingModel.js";

export const createSetting = async (req, res) => {
  try {
    const { shopName, address, currency, taxRate, logUrl } = req.body;

    // check all fields
    if (!shopName || !address || !currency || !!taxRate || logUrl)
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });

    // create setting
    const setting = await Setting.create(req.body);

    // return a created response (201)
    res.status(201).json({
      success: true,
      message: "setting added successfully",
      data: setting,
    });
  } catch (error) {
    console.log("Error in createSetting controller: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error" || error.message,
    });
  }
};

// Get settings (only one settings document expected)
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne({});
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({});

    if (!settings) {
      settings = await Setting.create(req.body);
      return res.status(201).json(settings);
    }

    const updated = await Setting.findByIdAndUpdate(settings._id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
