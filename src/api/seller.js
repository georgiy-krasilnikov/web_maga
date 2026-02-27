const express = require('express');
const router = express.Router();
const { db } = require('../models');

// GET /api/sellers - получить всех продавцов
router.get('/', async (req, res) => {
    try {
        const sellers = await db.Seller.findAll({
            include: [
                { model: db.Department, as: 'departments' },
                { model: db.Product, as: 'products' }
            ]
        });
        res.json(sellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/sellers/:id - получить продавца по ID
router.get('/:id', async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id)
        //     , {
        //     include: [
        //         { model: Department, as: 'departments' },
        //         { model: Product, as: 'products' }
        //     ]
        // });
        if (!seller) {
            return res.status(404).json({ error: 'db.Seller not found' });
        }
        res.json(seller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/sellers - создать продавца
router.post('/', async (req, res) => {
    try {
        const seller = await db.Seller.create(req.body);
        res.status(201).json(seller);
    } catch (error) {

        res.status(500).json({ error: error.message });

    }
});

// PUT /api/sellers/:id - обновить продавца
router.put('/:id', async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id);
        if (!seller) {
            return res.status(404).json({ error: 'db.Seller not found' });
        }

        await seller.update(req.body);
        res.json(seller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/sellers/:id - удалить продавца
router.delete('/:id', async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id);
        if (!seller) {
            return res.status(404).json({ error: 'db.Seller not found' });
        }

        await seller.destroy();
        res.json({ message: 'db.Seller deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;