// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config();


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto",
//         });

//         console.log("File upload success", response.url);

//         // Clean up local file after upload
//         fs.unlinkSync(localFilePath);

//         return response;
//     } catch (error) {
//         console.error("Error during file upload:", error);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath); // Remove the file if it exists
//         }
//         throw error;
//     }
// };

// export { uploadOnCloudinary };


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Determine the file type
        const fileExtension = path.extname(localFilePath).toLowerCase();
        const isPDF = fileExtension === ".pdf";

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: isPDF ? "raw" : "auto", // Use "raw" for PDFs
        });

        console.log("File upload success", response.url);

        // Clean up local file after upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.error("Error during file upload:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the file if it exists
        }
        throw error;
    }
};

export { uploadOnCloudinary };