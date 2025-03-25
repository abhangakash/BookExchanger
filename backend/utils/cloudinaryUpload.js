const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const uploadImagesToCloudinary = async (files) => {
    try {
        console.log("📤 Preparing to upload images to Cloudinary...");
        let imageUrls = [];

        for (const file of files) {
            // ✅ Normalize file path
            const filePath = path.resolve(file.path);
            console.log(`📤 Uploading ${filePath}...`);

            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: "book-images",
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                    resource_type: "image",
                    timeout: 300000, // ⏳ Increase timeout
                    quality: "auto",
                    transformation: [{ width: 800, height: 800, crop: "limit" }],
                });

                console.log("✅ Uploaded:", result.secure_url);
                imageUrls.push(result.secure_url);

                // ✅ Delete file after successful upload
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error("❌ Cloudinary Upload Error:", error);
                throw new Error("Cloudinary Upload Failed: " + JSON.stringify(error, null, 2));
            }
        }

        return imageUrls;
    } catch (error) {
        console.error("❌ Failed to upload images to Cloudinary:", error.message);
        throw new Error("Failed to upload images to Cloudinary: " + error.message);
    }
};

module.exports = uploadImagesToCloudinary;

