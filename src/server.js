import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import imageRoutes from "./routes/imageRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { IMAGES_ROUTES_ROOT, IMAGES_UPLOAD_DIRECTORY } from "./constants.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(STATIC_UPLOADED_IMAGES_ROOT, express.static(IMAGES_UPLOAD_DIRECTORY));
app.use(IMAGES_ROUTES_ROOT, imageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));