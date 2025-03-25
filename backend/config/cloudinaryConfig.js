require("dotenv").config(); // Ensure .env is loaded

const cloudinary = require("cloudinary").v2;

console.log("✅ ENV Loaded:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ MISSING",
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
