import logger from "../utils/logger.js";

export default (err, req, res, next) => {
    logger.error("Error: " + err.message);
    res.status(500).json({ error: "Internal Server Error" });
};
