const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', async (req, res, next) => {
    try {
        const result = await Product.find();
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });

    try {
        const result = await product.save();
        res.status(201).json({
            message: 'Handling POST requests to /products',
            product,
        });
    } catch (e) {
        next(e);
    }
});

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        const result = await Product.findById(id);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
            });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    if (id === 'special') {
        res.status(200).json({
            message: 'Congrats! This is the special ID!!',
            id,
        });
    } else {
        res.status(200).json({
            message: 'This is some boring ID',
        });
    }
});

router.patch('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try {
        await Product.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            message: `Product with id:${id}, have been patched`,
        });
    } catch (e) {
        next(e);
    }
});

router.delete('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    try {
        await Product.findByIdAndRemove(id);
        res.status(200).json({
            message: `Product with id:${id}, have been removed`,
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
