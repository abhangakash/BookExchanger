const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testUpload = async () => {
    try {
        const result = await cloudinary.uploader.upload("uploads/test-image.png", {
            folder: "test-uploads",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });

        console.log("✅ Upload Success:", result.secure_url);
    } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", JSON.stringify(error, null, 2));
    }
};

testUpload();
