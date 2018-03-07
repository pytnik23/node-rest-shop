const mongoose = require('mongoose');
const baseUrl = require('../../constants').BASE_URL;

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders = async (req, res, next) => {
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
                        url: `${baseUrl}/orders/${item._id}`,
                    },
                };
            }),
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
};

exports.create_order = async (req, res, next) => {
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
                url: `${baseUrl}/orders/${result._id}`,
            },
        });
    } catch (e) {
        next(e);
    }
};

exports.get_order = async (req, res, next) => {
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
                url: `${baseUrl}/orders`,
            }
        });
    } catch (e) {
        next(e);
    }
};

exports.delete_order = async (req, res, next) => {
    const id = req.params.orderId;
    try {
        const result = await Order.findByIdAndRemove(id);

        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: `Order with id:${id} have been deleted`,
            request: {
                type: 'POST',
                url: `${baseUrl}/orders`,
                body: {
                    productId: 'ID',
                    quantity: 'Number',
                },
            },
        });
    } catch (e) {
        next(e);
    }
};
