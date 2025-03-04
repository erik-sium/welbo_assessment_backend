import path from "path";
import fs from "fs";
import sharp from "sharp";
import ensureUploadsFolder from "../utils/fileUtils.js";
import { IMAGES_UPLOAD_DIRECTORY } from "../constants.js"

ensureUploadsFolder(IMAGES_UPLOAD_DIRECTORY);

export const saveOriginalImage = async (file) => {
    const originalExtension = path.extname(file.originalname);

    let targetExtension = originalExtension.toLowerCase()
    if (targetExtension === ".jpeg") {
        targetExtension = ".jpg"
    }

    const filename = path.basename(file.originalname, originalExtension) + "_orig" + targetExtension;
    const filePath = path.join(IMAGES_UPLOAD_DIRECTORY, filename);

    fs.renameSync(file.path, filePath);

    return { filename, url: `/uploads/${filename}` };
};

// TODO: feature to complete
export const processImageCropping = async (filename, crop) => {
    const origPath = path.join(IMAGES_UPLOAD_DIRECTORY, filename);
    const baseName = filename.replace(/_orig\.\w+$/, "");
    const resized1920 = path.join(IMAGES_UPLOAD_DIRECTORY, `${baseName}_1920x1080.jpg`);
    const thumbnail = path.join(IMAGES_UPLOAD_DIRECTORY, `${baseName}_thumb.jpg`);

    await sharp(origPath)
        .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
        .resize(1920, 1080)
        .jpeg({ quality: 70 })
        .toFile(resized1920);

    await sharp(origPath)
        .extract({ left: crop.x, top: crop.y, width: crop.width, height: crop.height })
        .resize(192, 108)
        .jpeg({ quality: 70 })
        .toFile(thumbnail);

    return {
        cropped: `/uploads/${baseName}_1920x1080.jpg`,
        thumbnail: `/uploads/${baseName}_thumb.jpg`,
    };
};

export const retrieveImagesData = async () => {
    const files = fs.readdirSync(IMAGES_UPLOAD_DIRECTORY);

    return files
        .filter((file) => file.endsWith("_orig.jpg") || file.endsWith("_orig.png"))
        .map((file) => {
            const baseName = file.replace(/_orig\.\w+$/, "");
            return {
                filename: file,
                thumbnail: files.includes(`${baseName}_thumb.jpg`)
                    ? `/uploads/${baseName}_thumb.jpg`
                    : null,
                cropped: files.includes(`${baseName}_1920x1080.jpg`),
            };
        });
};
