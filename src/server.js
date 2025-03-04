import express from "express";
import cors from "cors";
import logger from "./utils/logger.js";
import imageRoutes from "./routes/imageRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import { IMAGES_ROUTES_URLS_ROOT, IMAGES_UPLOADED_WRITE_PATH, IMAGES_UPLOADED_READ_URL } from "./constants.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(IMAGES_UPLOADED_READ_URL, express.static(IMAGES_UPLOADED_WRITE_PATH));
app.use(IMAGES_ROUTES_URLS_ROOT, imageRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));