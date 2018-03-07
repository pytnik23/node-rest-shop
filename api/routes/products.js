const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, './uploads/');
    },
    filename (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
            cb(null, true);
            break;
        default:
            cb(null, false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        filesize: 1024 * 1024 * 5,
    },
});

router.get('/', ProductController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductController.create_product);

router.get('/:productId', ProductController.get_product);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

module.exports = router;
