const express = require('express');
const router = express.Router();
const db = require('../models')

// GET /api/departments - получить все филиалы
router.get('/', async (req, res) => {
    try {
        const departments = await db.Department.findAll({
            include: [
                { model: db.Seller, as: 'sellers' },
                { model: db.Product, as: 'products' }
            ]
        });
        res.json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/departments/:id - получить филиал по ID
router.get('/:id', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id)
        //     , {
        //     include: [
        //         { model: Seller, as: 'sellers' },
        //         { model: Product, as: 'products' }
        //     ]
        // });
        if (!department) {
            return res.status(404).json({ error: 'Филиал не был найден' });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/departments - создать филиал
router.post('/', async (req, res) => {
    try {
        const department = await db.Department.create(req.body);
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/departments/:id - обновить филиал
router.put('/:id', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Филиал не был найден' });
        }

        await department.update(req.body);
        res.json(department);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/departments/:id - удалить филиал
router.delete('/:id', async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Филиал не был найден' });
        }

        await department.destroy();
        res.json({ message: 'Филиал был удален' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;