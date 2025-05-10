import express from "express";
import { getAllImages, uploadImage, cropImage }  from "../controllers/imageController.js";
import imageUploadHandler from "../middlewares/imageUploadHandler.js"

const router = express.Router();

// TODO: extract out route paths into constants.ts file or other images-specific constants file
router.get("/", getAllImages);
router.post("/upload", imageUploadHandler.single("file"), uploadImage);
router.post("/crop", cropImage);

export default router;
