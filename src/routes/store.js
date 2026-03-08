const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /store - склад
router.get("/", async (req, res) => {
    try {
        const storeItems = await db.Store.findAll({
            include: [
                {
                    model: db.Product,
                    as: "products",
                    include: [
                        { model: db.Department, as: "departments" },
                        { model: db.Seller, as: "sellers" },
                    ],
                },
            ],
        });

        // Статистика склада
        const totalItems = storeItems.reduce(
            (sum, item) => sum + item.count,
            0,
        );
        const totalValue = storeItems.reduce((sum, item) => {
            return sum + item.count * (item.products?.price || 0);
        }, 0);
        const lowStockItems = storeItems.filter((item) => item.count < 10);
        const emptyPositions = storeItems.filter((item) => item.count === 0);

        res.render("store/index", {
            title: "Склад",
            error: "",
            storeItems,
            totalItems,
            totalValue,
            lowStockItems: lowStockItems.length,
            emptyPositions: emptyPositions.length,
        });
    } catch (error) {
        res.status(500).render("store/index", {
            title: "Ошибка",
            error: error.message,
            storeItems: "",
            totalItems: "",
            totalValue: "",
            lowStockItems: "",
            emptyPositions: "",
        });
    }
});

// GET /store/ create - форма создания продавца
router.get("/create", async (req, res) => {
    try {
        const products = await db.Product.findAll();
        res.render("store/create", {
            title: "Добавление товара на склад",
            error: "",
            products,
            storeItem: null,
        });
    } catch (error) {
        res.status(500).render("store/create", {
            title: "Ошибка",
            error: error.message,
            products: [],
            storeItem: null,
        });
    }
});

// POST /store - создание записи о товаре на складе
router.post("/", async (req, res) => {
    try {
        await db.Store.create(req.body);
        res.redirect("/store");
    } catch (error) {
        res.status(500).render("store/create", {
            title: "Ошибка",
            error: error.message,
            products: [],
            storeItem: null,
        });
    }
});

// GET /store/:id - просмотр позиции на складе
router.get("/:id", async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id, {
            include: [{ model: db.Product, as: "products" }],
        });
        if (!storeItem) {
            return res.status(404).render("store/show", {
                title: storeItem.products.name,
                error: "Такая позиция не найдена на складе",
                storeItem,
            });
        }
        res.render("store/show", {
            title: storeItem.products.name,
            error: "",
            storeItem,
        });
    } catch (error) {
        res.status(500).render("store/show", {
            title: "Ошибка",
            error: error.message,
            storeItem: null,
        });
    }
});

// GET /store/:id/edit - форма редактирования позиции на складе
router.get("/:id/edit", async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id, {
            include: [{ model: db.Product, as: "products" }],
        });

        if (!storeItem) {
            return res.status(404).render("store/edit", {
                title: storeItem.products.name,
                error: "Такая позиция не найдена на складе",
                storeItem,
            });
        }

        res.render("store/edit", {
            title: storeItem.products.name,
            error: "",
            storeItem,
        });
    } catch (error) {
        res.status(500).render("store/edit", {
            title: "Ошибка",
            error: error.message,
            storeItem: null,
        });
    }
});

// PUT /store/:id - обновление позиции на складе
router.put("/:id", async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id);
        if (!storeItem) {
            return res.status(404).render("store/edit", {
                title: storeItem.products.name,
                error: "Такая позиция не найдена на складе",
                storeItem,
            });
        }
        await storeItem.update(req.body);
        res.redirect("/store");
    } catch (error) {
        res.status(500).render("store/edit", {
            title: "Ошибка",
            error: error.message,
            storeItem: null,
        });
    }
});

// DELETE /store/:id - удаление позиции со склада
router.delete("/:id", async (req, res) => {
    try {
        const storeItem = await db.Store.findByPk(req.params.id);
        if (!storeItem) {
            return res.status(404).render("store/edit", {
                title: storeItem.products.name,
                error: "Такая позиция не найдена на складе",
                storeItem,
            });
        }
        await storeItem.destroy();
        res.redirect("/store");
    } catch (error) {
        res.status(500).render("store/edit", {
            title: "Ошибка",
            error: error.message,
            storeItem: null,
        });
    }
});

module.exports = router;
