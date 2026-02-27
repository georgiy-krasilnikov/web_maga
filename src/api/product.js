const express = require('express');
const router = express.Router();
const { db } = require('../models');
const { body, validationResult } = require('express-validator');

// GET /api/products - получить все товары
router.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                { model: Department, as: 'departments' },
                { model: Seller, as: 'sellers' },
                { model: Store, as: 'store' }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/:id - получить товар по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id, {
            include: [
                { model: db.Department, as: 'departments' },
                { model: db.Seller, as: 'sellers' },
                { model: db.Store, as: 'store' }
            ]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/products - создать товар
router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isInt({ min: 0 }).withMessage('Price must be positive integer'),
    body('cost_price').isInt({ min: 0 }).withMessage('Cost price must be positive integer'),
    body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const product = await db.Product.create(req.body);

        // Если указано количество товара на складе при создании
        if (req.body.store_count && req.body.store_count > 0) {
            await db.Store.create({
                product_id: product.id,
                count: req.body.store_count,
                position: req.body.position || ''
            });
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/products/:id - обновить товар
router.put('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.update(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/products/:id - удалить товар
router.delete('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;