const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ POST: Save a mutual fund
router.post("/save", verifyToken, async (req, res) => {
  const { schemeCode, schemeName } = req.body;

  if (!schemeCode || !schemeName) {
    return res.status(400).json({ message: "Scheme code and name are required" });
  }

  try {
    const user = await User.findById(req.userId);

    // Check if the fund is already saved
    const alreadySaved = user.savedFunds.some(f => f.schemeCode === schemeCode);
    if (alreadySaved) {
      return res.status(409).json({ message: "Fund already saved" });
    }

    // Save fund
    user.savedFunds.push({ schemeCode, schemeName });
    await user.save();

    res.json({ message: "Fund saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Retrieve saved mutual funds
router.get("/saved", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.savedFunds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE: Remove a saved fund by schemeCode
router.delete("/delete/:code", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.savedFunds = user.savedFunds.filter(f => f.schemeCode !== req.params.code);
    await user.save();
    res.json({ message: "Fund removed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
