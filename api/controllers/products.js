const mongoose = require('mongoose');
const baseUrl = require('../../constants').BASE_URL;

const Product = require('../models/product');

exports.get_all_products = async (req, res, next) => {
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
                        url: `${baseUrl}/products/${item._id}`,
                    },
                };
            }),
        };

        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
};

exports.create_product = async (req, res, next) => {
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
                    url: `${baseUrl}/products/${result._id}`,
                },
            },
        });
    } catch (e) {
        next(e);
    }
};

exports.get_product = async (req, res, next) => {
    const id = req.params.productId;

    try {
        const result = await Product.findById(id, 'name price _id productImage');

        if (result) {
            res.status(200).json({
                product: result,
                request: {
                    type: 'GET',
                    url: `${baseUrl}/products`,
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
};

exports.update_product = async (req, res, next) => {
    const id = req.params.productId;

    try {
        await Product.findByIdAndUpdate(id, req.body);
        res.status(200).json({
            message: `Product with id: ${id} have been updated`,
            request: {
                type: 'GET',
                url: `${baseUrl}/products/${id}`,
            },
        });
    } catch (e) {
        next(e);
    }
};

exports.delete_product = async (req, res, next) => {
    const id = req.params.productId;
    try {
        const result = await Product.findByIdAndRemove(id);

        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: `Product with id:${id} have been deleted`,
            request: {
                type: 'POST',
                url: `${baseUrl}/products`,
                body: {
                    name: 'String',
                    price: 'Number',
                },
            },
        });
    } catch (e) {
        next(e);
    }
};
