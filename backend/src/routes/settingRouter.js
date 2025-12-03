import express from 'express'

import {
  getSettings,
  updateSettings,
  createSetting
}  from "../controllers/settingController.js"

const router = express.Router();

// create setting
router.post("/", createSetting)

// GET /settings 
router.get("/", getSettings);

// PATCH /settings 
router.patch("/", updateSettings);

export default  router;
