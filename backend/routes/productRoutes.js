const express = require("express");
const multer = require("multer");
const path = require("path");
const { addProduct, getAllProducts } = require("../controllers/productController");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), addProduct);
router.get("/", getAllProducts);

module.exports = router;
