import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: path.join(process.cwd(), "static", "uploadedImages"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const imageUploadHandler = multer({ storage });

export default imageUploadHandler;
