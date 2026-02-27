const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /store - склад
router.get('/', async (req, res) => {
    try {
        const storeItems = await db.Store.findAll({
            include: [{
                model: db.Product,
                as: 'products',
                include: [
                    { model: db.Department, as: 'departments' },
                    { model: db.Seller, as: 'sellers' }
                ]
            }],
            order: [['position', 'ASC']]
        });

        // Статистика склада
        const totalItems = storeItems.reduce((sum, item) => sum + item.count, 0);
        // const totalValue = storeItems.reduce((sum, item) => {
        //     return sum + (item.count * (item.products?.price || 0));
        // }, 0);
        const lowStockItems = storeItems.filter(item => item.count < 10);
        const emptyPositions = storeItems.filter(item => item.count === 0);

        res.render('store/index', {
            title: 'Склад',
            storeItems,
            totalItems,
            // totalValue,
            lowStockItems: lowStockItems.length,
            emptyPositions: emptyPositions.length
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET / sellers / create - форма создания продавца
// router.get('/create', async (req, res) => {
//     try {
//         const departments = await db.Department.findAll();
//         res.render('sellers/create', {
//             title: 'Добавить продавца',
//             departments,
//             seller: null
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// POST /store - создание записи о товаре на складе
router.post('/', async (req, res) => {
    try {
        await db.Store.create(req.body);
        res.redirect('/store');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /store/movements - движения товаров
// router.get('/movements', async (req, res) => {
//     try {
//         // Здесь можно добавить модель для истории движений
//         // Пока просто показываем форму
//         const products = await Product.findAll({
//             include: [{ model: db.Store, as: 'store' }],
//             where: {
//                 '$stores.id$': { [Op.ne]: null }
//             }
//         });

//         res.render('store/movements', {
//             title: 'Движения товаров',
//             products
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// POST /store/movement - добавление движения
// router.post('/movement', async (req, res) => {
//     try {
//         const { product_id, quantity, type, comment } = req.body;

//         let storeItem = await db.Store.findOne({ where: { product_id } });

//         if (!storeItem && type === 'in') {
//             // Если товара нет на складе и это приход - создаем запись
//             storeItem = await db.Store.create({
//                 product_id,
//                 count: parseInt(quantity),
//                 position: req.body.position || 'Не указано'
//             });
//             req.session.message = { type: 'success', text: 'Товар добавлен на склад' };
//         } else if (storeItem) {
//             // Обновляем количество
//             if (type === 'in') {
//                 storeItem.count += parseInt(quantity);
//                 req.session.message = { type: 'success', text: 'Приход товара оформлен' };
//             } else if (type === 'out') {
//                 if (storeItem.count < quantity) {
//                     req.session.message = { type: 'error', text: 'Недостаточно товара на складе' };
//                     return res.redirect('/store/movements');
//                 }
//                 storeItem.count -= parseInt(quantity);
//                 req.session.message = { type: 'success', text: 'Расход товара оформлен' };
//             }

//             if (req.body.position) {
//                 storeItem.position = req.body.position;
//             }

//             await storeItem.save();
//         } else {
//             req.session.message = { type: 'error', text: 'Товар не найден на складе' };
//             return res.redirect('/store/movements');
//         }

//         res.redirect('/store');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// GET /store/:id/edit - редактирование позиции на складе
router.get('/:id/edit', async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id, {
            include: [{ model: db.Product, as: 'products' }]
        });

        if (!storeItem) {
            return res.status(404).send('Позиция на складе не найдена');
        }

        res.render('store/edit', {
            title: 'Редактировать позицию на складе',
            storeItem
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT /store/:id - обновление позиции на складе
router.put('/:id', async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id);
        if (!storeItem) {
            return res.status(404).send('Позиция на складе не найдена');
        }

        await storeItem.update(req.body);
        req.session.message = { type: 'success', text: 'Позиция обновлена' };
        res.redirect('/store');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// DELETE /store/:id - удаление позиции со склада
router.delete('/:id', async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id);
        if (!storeItem) {
            return res.status(404).send('Позиция на складе не найдена');
        }

        await storeItem.destroy();
        req.session.message = { type: 'success', text: 'Позиция удалена со склада' };
        res.redirect('/store');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET /store/report - отчет по складу
router.get('/report', async (req, res) => {
    try {
        const storeItems = await db.Store.findAll({
            include: [{
                model: db.Product,
                as: 'products'
            }],
            order: [['count', 'DESC']]
        });

        // Статистика по категориям
        const categoryStats = {};
        storeItems.forEach(item => {
            if (item.products) {
                const category = item.products.category;
                if (!categoryStats[category]) {
                    categoryStats[category] = {
                        count: 0,
                        totalItems: 0,
                        totalValue: 0
                    };
                }
                categoryStats[category].count++;
                categoryStats[category].totalItems += item.count;
                categoryStats[category].totalValue += item.count * item.products.price;
            }
        });

        res.render('store/report', {
            title: 'Отчет по складу',
            storeItems,
            categoryStats
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;