const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /sellers - список продавцов
router.get('/', async (req, res) => {
    try {
        const sellers = await db.Seller.findAll({
            include: [
                { model: db.Department, as: 'departments' },
                { model: db.Product, as: 'products' }
            ],
        });
        console.log(sellers[2].departments)
        res.render('sellers/index', {
            title: 'Продавцы',
            sellers
        });
    } catch (error) {
        console.log(error.message)
        res.json(error.message);
    }
});

// GET / sellers / create - форма создания продавца
router.get('/create', async (req, res) => {
    try {
        const departments = await db.Department.findAll();
        res.render('sellers/create', {
            title: 'Добавить продавца',
            departments,
            seller: null
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST /sellers - создание продавца
router.post('/', async (req, res) => {
    try {
        await db.Seller.create(req.body);
        res.redirect('/sellers');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /sellers/:id - просмотр продавца
router.get('/:id', async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id, {
            include: [
                { model: db.Department, as: 'departments' },
                {
                    model: db.Product,
                    as: 'products',
                    include: [{ model: db.Department, as: 'departments' }]
                }
            ]
        });

        if (!seller) {
            return res.status(404).send('Продавец не найден');
        }

        // Статистика по продавцу
        const totalProducts = seller.products.length;
        const totalValue = seller.products.reduce((sum, p) => sum + (p.price * 1), 0);
        const avgPrice = totaldb.Products > 0 ? Math.round(totalValue / totalProducts) : 0;

        res.render('sellers/show', {
            title: seller.name,
            seller,
            totalProducts,
            totalValue,
            avgPrice
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /sellers/:id/edit - форма редактирования
router.get('/:id/edit', async (req, res) => {
    try {
        const [seller, departments] = await db.Promise.all([
            db.Seller.findByPk(req.params.id),
            db.Department.findAll()
        ]);

        if (!seller) {
            return res.status(404).send('Продавец не найден');
        }

        res.render('sellers/edit', {
            title: 'Редактирование продавца',
            seller,
            departments
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT /sellers/:id - обновление продавца
router.put('/:id', async (req, res) => {
    console.log(req.body)
    try {
        const seller = await db.Seller.findByPk(req.params.id);
        if (!seller) {
            return res.status(404).send('Продавец не найден');
        }
        await seller.update(req.body);
        res.redirect('/sellers');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /sellers/:id - удаление продавца
router.delete('/:id', async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id);
        if (!seller) {
            return res.status(404).send('Продавец не найден');
        }

        await seller.destroy();
        res.redirect('/sellers');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;