// routes/image-routes.js
const express = require("express");
const authMiddleware = require('../middlewares/auth-middleware.js');
const adminMiddleware = require("../middlewares/admin-middleware.js");
const uploadMiddleware = require('../middlewares/uploadmiddleware.js');
const {uploadImageController , fetchImageController , deleteImageController} = require("../controllers/image-controller.js");

const router = express.Router();

// POST method, not GET
router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single('image'),
  uploadImageController
);

router.get("/get",authMiddleware,fetchImageController)
router.delete(':id/',authMiddleware,adminMiddleware,deleteImageController)
module.exports = router;
