import express from "express";
import { getImages, uploadImage, cropImage }  from "../controllers/imageController.js";

const router = express.Router();

router.get("/", getImages);
router.post("/upload", uploadImage);
router.post("/crop", cropImage);

export default router;
