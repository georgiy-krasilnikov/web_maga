const express = require('express');
const router = express.Router();
const { db } = require('../models');

// GET /api/store - получить все товары на складе
router.get('/', async (req, res) => {
    try {
        const storeItems = await db.Store.findAll({
            include: [{ model: db.Product, as: 'products' }]
        });
        res.json(storeItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // GET /api/store/low-stock - товары с низким запасом (< 10)
// router.get('/low-stock', async (req, res) => {
//     try {
//         const lowStock = await db.Store.findAll({
//             where: { count: { [Op.lt]: 10 } },
//             include: [{ model: db.Product, as: 'products' }]
//         });
//         res.json(lowStock);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // POST /api/store/movement - перемещение товара (приход/расход)
// router.post('/movement', async (req, res) => {
//     try {
//         const { product_id, quantity, type } = req.body; // type: 'in' or 'out'

//         let storeItem = await db.Store.findAll({ where: { product_id } });

//         if (!storeItem && type === 'in') {
//             // Если товара нет на складе и это приход - создаем запись
//             storeItem = await db.Store.create({
//                 product_id,
//                 count: quantity,
//                 position: req.body.position || ''
//             });
//         } else if (storeItem) {
//             // Обновляем количество
//             if (type === 'in') {
//                 storeItem.count += parseInt(quantity);
//             } else if (type === 'out') {
//                 if (storeItem.count < quantity) {
//                     return res.status(400).json({ error: 'Insufficient stock' });
//                 }
//                 storeItem.count -= parseInt(quantity);
//             }
//             await storeItem.save();
//         } else {
//             return res.status(404).json({ error: 'Product not found in store' });
//         }

//         res.json(storeItem);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// PUT /api/store/:id - обновить позицию на складе
router.put('/:id', async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id);
        if (!storeItem) {
            return res.status(404).json({ error: 'Store item not found' });
        }

        await storeItem.update(req.body);
        res.json(storeItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;