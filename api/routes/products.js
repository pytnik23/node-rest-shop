const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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

const Product = require('../models/product');

router.get('/', async (req, res, next) => {
    try {
        const result = await Product.find({}, 'name price _id productImage');

        const response = {
            count: result.length,
            products: result.map((item) => {
                return {
                    name: item.name,
                    price: item.price,
                    _id: item._id,
                    productImage: item.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + item._id,
                    },
                };
            }),
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
});

router.post('/', checkAuth, upload.single('productImage'), async (req, res, next) => {
    const filePath = req.file ? req.file.path : null;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: filePath,
    });

    try {
        const result = await product.save();
        res.status(201).json({
            message: 'Created product successfuly',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id,
                },
            },
        });
    } catch (e) {
        next(e);
    }
});

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        const result = await Product.findById(id, 'name price _id productImage');

        if (result) {
            res.status(200).json({
                product: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products',
                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
            });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        const result = await Product.findById(id, 'name price _id');

        res.status(200).json({
            product: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products',
            }
        });
    } catch (e) {
        next(e);
    }
});

router.patch('/:productId', checkAuth, async (req, res, next) => {
    const id = req.params.productId;

    try {
        await Product.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            message: `Product with id: ${id} have been updated`,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id,
            },
        });
    } catch (e) {
        next(e);
    }
});

router.delete('/:productId', checkAuth, async (req, res, next) => {
    const id = req.params.productId;
    try {
        await Product.findByIdAndRemove(id);
        res.status(200).json({
            message: `Product with id:${id} have been deleted`,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: {
                    name: 'String',
                    price: 'Number',
                },
            },
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
