const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', async (req, res, next) => {
    try {
        const result = await Order
            .find({}, '_id quantity product')
            .populate('product', 'name');

        const response = {
            count: result.length,
            orders: result.map((item) => {
                return {
                    _id: item._id,
                    quantity: item.quantity,
                    product: item.product,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + item._id,
                    },
                };
            }),
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    const productId = req.body.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: productId,
        });

        const result = await order.save();

        res.status(201).json({
            message: 'Order was created',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id,
            },
        });
    } catch (e) {
        next(e);
    }
});

router.get('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;

    try {
        const order = await Order
            .findById(id, '_id quantity product')
            .populate('product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders',
            }
        });
    } catch (e) {
        next(e);
    }
});

router.delete('/:orderId', async (req, res, next) => {
    const id = req.params.orderId;
    try {
        await Order.findByIdAndRemove(id);
        res.status(200).json({
            message: `Order with id:${id} have been deleted`,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: 'ID',
                    quantity: 'Number',
                },
            },
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
