const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleWare');
const controller = require('../controllers/stocksController');

const multer = require("multer");
const path = require("path");

// Configuración de multer
const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


router.get('/', verifyToken, controller.getAllStocks);
//router.get('/', controller.getAllStocks);
router.get('/:id', controller.getStockById);
router.post("/", upload.single("image"), controller.createStock);
router.put("/:id", upload.single("image"), controller.updateStock);
router.delete('/:id', controller.deleteStock);
router.put('/increaseStock/:id',controller.increaseStock);

module.exports = router;