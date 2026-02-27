const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /products - список товаров
router.get('/', async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                { model: db.Department, as: 'departments' },
                { model: db.Seller, as: 'sellers' },
                { model: db.Store, as: 'store' }
            ],
        });
        res.render('products/index', { title: 'Товары', products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /products/create - форма создания товара
router.get('/create', async (req, res) => {
    try {
        const [departments, sellers] = await Promise.all([
            db.Department.findAll(),
            db.Seller.findAll()
        ]);
        res.render('products/create', {
            title: 'Добавить товар',
            departments,
            sellers
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST /products - создание товара
router.post('/', async (req, res) => {
    try {
        const product = await db.Product.create(req.body);

        // Если указано количество на складе
        if (req.body.store_count && req.body.store_count > 0) {
            await db.Store.create({
                product_id: product.id,
                count: req.body.store_count,
                position: req.body.position
            });
        }

        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /products/:id - просмотр товара
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
            return res.status(404).render('error', { error: 'Товар не найден' });
        }

        res.render('products/show', { title: product.name, product });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /products/:id/edit - форма редактирования
router.get('/:id/edit', async (req, res) => {
    try {
        const [product, departments, sellers] = await Promise.all([
            db.Product.findByPk(req.params.id, {
                include: [{ model: db.Store, as: 'store' }]
            }),
            db.Department.findAll(),
            db.Seller.findAll()
        ]);

        if (!product) {
            return res.status(404).send('Товар не найден');
        }

        res.render('products/edit', {
            title: 'Редактировать товар',
            product,
            departments,
            sellers
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT /products/:id - обновление товара
router.put('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send('Товар не найден');
        }

        await product.update(req.body);
        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /products/:id - удаление товара
router.delete('/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send('Товар не найден');
        }

        await product.destroy();
        res.redirect('/products');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;