import { retrieveImagesData, processImageCropping, saveOriginalImage } from "../services/imageService.js";
import fs from "fs";
import logger from "../utils/logger.js";
import path from "path";
import sharp from "sharp";
import { IMAGES_UPLOAD_DIRECTORY, IMAGES_DESIRED_THUMBNAIL_HEIGHT, IMAGES_DESIRED_THUMBNAIL_WIDTH, IMAGES_DESIRED_IMAGE_QUALITY } from "../constants.js"


export const uploadImage = async (req, res, next) => {
    try {
        // Sample of my personal approach to logging in backend
        logger.info(`uploadImage: beginning of request`)

        if (!req.file) {
            logger.info(`Error: No file uploaded`)
            return res.status(400).json({ error: "No file uploaded" });
        }

        const image = await saveOriginalImage(req.file);
        logger.info(`Success`)
        res.status(201).send("Image uploaded!");
    } catch (error) {
        logger.error(`Error: `, error)
        next(error);
    }
};

// TODO: feature to complete
export const cropImage = async (req, res, next) => {
    try {
        const { filename, x, y, width, height } = req.body;
        if (!filename || !x || !y || !width || !height) {
            return res.status(400).json({ error: "Invalid crop parameters" });
        }

        const croppedImages = await processImageCropping(filename, { x, y, width, height });
        res.status(200).json(croppedImages);
    } catch (error) {
        next(error);
    }
};

export const getAllImages = async (req, res, next) => {
    try {
        const images = await retrieveImagesData();

        logger.info(images.length);
        
        const updatedImages = await Promise.all(images.map(async (image) => {
            const originalPath = path.join(IMAGES_UPLOAD_DIRECTORY, image.filename);
            const baseFilename = image.filename.slice(0, -9) // Remove "_orig.jpg"

            const croppedFileName = `${baseFilename}_1920x1080.jpg`;
            const croppedPath = path.join(IMAGES_UPLOAD_DIRECTORY, croppedFileName);

            const thumbnailFilename = `${baseFilename}_thumb.jpg`;
            const thumbnailPath = path.join(IMAGES_UPLOAD_DIRECTORY, thumbnailFilename);

            let imageUrl = `${IMAGES_UPLOAD_DIRECTORY}/${thumbnailFilename}`;

            if (!fs.existsSync(thumbnailPath)) {
                await sharp(originalPath)
                    .resize(IMAGES_DESIRED_THUMBNAIL_WIDTH, IMAGES_DESIRED_THUMBNAIL_HEIGHT)
                    .jpeg({ quality: IMAGES_DESIRED_IMAGE_QUALITY })
                    .toFile(thumbnailPath);
            }

            logger.info(croppedPath)
            logger.info(thumbnailPath)

            return {
                filename: image.filename,
                thumbnailUrl: imageUrl,
                cropped: fs.existsSync(croppedPath)
            };
        }));


        res.status(200).json(updatedImages);
    } catch (error) {
        next(error);
    }
};