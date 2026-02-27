const express = require('express');
const router = express.Router();
// const { Department, Seller, Product } = require('../models');
const db = require('../models')

// GET /departments - список филиалов
router.get('/', async (req, res) => {
    try {
        const departments = await db.Department.findAll({
            include: [
                { model: db.Seller, as: 'sellers' },
                { model: db.Product, as: 'products' }
            ]
        });
        res.render('departments/index', {
            title: 'Филиалы',
            departments
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST /departments/create - для формы создания филиала
router.get('/create', async (req, res) => {
    try {
        res.render('departments/create', {
            title: 'Добавить филиал',
            department: null
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST /departments - создание филиала
router.post('/', async (req, res) => {
    try {
        await db.Department.create(req.body);
        res.redirect('/departments');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /departments/:id - просмотр филиала
router.get('/:id', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id, {
            include: [
                {
                    model: db.Seller,
                    as: 'sellers',
                    include: [{ model: db.Product, as: 'products' }]
                },
                {
                    model: db.Product,
                    as: 'products',
                    include: [{ model: db.Seller, as: 'sellers' }]
                }
            ]
        });

        if (!department) {
            return res.status(404).send('Филиал не найден');
        }

        const totalProducts = department.products.length;
        const totalSellers = department.sellers.length;
        const totalValue = department.products.reduce((sum, p) => sum + (p.price * 1), 0);

        res.render('departments/show', {
            title: department.name,
            department,
            totalProducts,
            totalSellers,
            totalValue
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /departments/:id/edit - форма редактирования
router.get('/:id/edit', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);

        if (!department) {
            return res.status(404).send('Филиал не найден');
        }

        res.render('departments/edit', {
            title: 'Редактировать филиал',
            department
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT /departments/:id - обновление филиала
router.put('/:id', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Филиал не найден');
        }

        await department.update(req.body);
        res.redirect('/departments');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /departments/:id - удаление филиала
router.delete('/:id', async (req, res) => {
    try {
        const department = await dbDepartment.findByPk(req.params.id);
        if (!department) {
            return res.status(404).send('Филиал не найден');
        }

        await department.destroy();
        res.redirect('/departments');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;