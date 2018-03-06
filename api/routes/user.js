const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(409).json({
            message: 'Mail exists',
        });
    } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash,
                });

                user
                .save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json({
                        message: 'User created',
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
            }
        });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                message: 'Auth failed',
            });
        } else {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Auth failed',
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            id: user._id,
                        },
                        process.env.JWT_KEY,
                        { expiresIn: '1h' }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token,
                    });
                }

                res.status(401).json({
                    message: 'Auth failed',
                });
            });
        }
    } catch (e) {
        next(e);
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {
        const result = await User.findByIdAndRemove(req.params.userId);
        if (result) {
            res.status(200).json({
                message: 'User deleted',
            });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
