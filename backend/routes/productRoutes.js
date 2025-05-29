const express = require("express");
const multer = require("multer");
const path = require("path");
const { addProduct, getAllProducts, deleteProduct, editProduct } = require("../controllers/productController");
const uploads = require("../middleware/uploadMiddleware")
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
router.put("/:id", uploads.single("image"), editProduct)
router.delete("/:id", deleteProduct)

module.exports = router;
