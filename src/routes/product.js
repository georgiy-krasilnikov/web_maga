const express = require("express");
const router = express.Router();
const db = require("../models");
const { OPEN_READWRITE } = require("sqlite3");

// GET /products - список товаров
router.get("/", async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                { model: db.Department, as: "departments" },
                { model: db.Seller, as: "sellers" },
                { model: db.Store, as: "store" },
            ],
        });
        res.render("products/index", { title: "Товары", error: "", products });
    } catch (error) {
        res.status(500).render("products/index", {
            title: "Ошибка",
            error: error.message,
            products: [],
        });
    }
});

// GET /products/create - форма создания товара
router.get("/create", async (req, res) => {
    try {
        const [departments, sellers] = await Promise.all([
            db.Department.findAll({
                include: [{ model: db.Seller, as: "sellers" }],
            }),
            db.Seller.findAll(),
        ]);
        const selectedDepartmentId = req.query.department_id;
        const selectedSellerId = req.query.seller_id;
        res.render("products/create", {
            title: "Добавление товара",
            error: "",
            product: null,
            departments,
            sellers,
            selectedDepartmentId: selectedDepartmentId,
            selectedSellerId: selectedSellerId,
        });
    } catch (error) {
        res.status(500).render("products/create", {
            title: "Ошибка",
            error: error.message,
            product: null,
            departments: [],
            sellers: [],
            selectedDepartmentId: "",
            selectedSellerId: "",
        });
    }
});

// POST /products - создание товара
router.post("/", async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.body.seller_id);
        if (seller) {
            req.body.department_id = seller.department_id;
        } else {
            res.status(400).render("products/create", {
                title: "Ошибка",
                error: "Ошибка создания товара",
                product: null,
                departments: [],
                sellers: [],
                selectedDepartmentId: "",
                selectedSellerId: "",
            });
        }

        const product = await db.Product.create(req.body);

        // Если указано количество на складе
        if (req.body.store_count > 0) {
            await db.Store.create({
                product_id: product.id,
                count: req.body.store_count,
                position: req.body.position,
            });
        }
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("products/create", {
            title: "Ошибка",
            error: error.message,
            product: null,
            departments: [],
            sellers: [],
            selectedDepartmentId: "",
            selectedSellerId: "",
        });
    }
});

// GET /products/:id - просмотр товара
router.get("/:id", async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id, {
            include: [
                { model: db.Department, as: "departments" },
                { model: db.Seller, as: "sellers" },
                { model: db.Store, as: "store" },
            ],
        });

        if (!product) {
            return res.status(404).render("products/show", {
                title: "Ошибка",
                error: "Товар не найден",
                product: null,
            });
        }

        res.render("products/show", {
            title: product.name,
            error: "",
            product,
        });
    } catch (error) {
        res.status(500).render("products/show", {
            title: "Ошибка",
            error: error.message,
            product: null,
        });
    }
});

// GET /products/:id/edit - форма редактирования
router.get("/:id/edit", async (req, res) => {
    try {
        const [product, departments, sellers] = await Promise.all([
            db.Product.findByPk(req.params.id, {
                include: [{ model: db.Store, as: "store" }],
            }),
            db.Department.findAll(),
            db.Seller.findAll(),
        ]);
        if (!product) {
            return res.status(404).render("products/edit", {
                title: "Ошибка",
                error: "Товар не найден",
                product: null,
                departments: [],
                sellers: [],
            });
        }
        res.render("products/edit", {
            title: product.name,
            error: "",
            product,
            departments,
            sellers,
        });
    } catch (error) {
        res.status(500).render("products/edit", {
            title: "Ошибка",
            error: "Товар не найден",
            product: null,
            departments: [],
            sellers: [],
        });
    }
});

// PUT /products/:id - обновление товара
router.put("/:id", async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).render("products/edit", {
                title: "Ошибка",
                error: "Товар не найден",
                product: null,
                departments: [],
                sellers: [],
            });
        }

        const seller = await db.Seller.findByPk(req.body.seller_id);
        if (seller) {
            req.body.department_id = seller.department_id;
        }
        await product.update(req.body);
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("products/edit", {
            title: "Ошибка",
            error: error.message,
            product: null,
            departments: [],
            sellers: [],
        });
    }
});

// DELETE /products/:id - удаление товара
router.delete("/:id", async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).render("products/edit", {
                title: "Ошибка",
                error: "Товар не найден",
                product: null,
                departments: [],
                sellers: [],
            });
        }
        await product.destroy();
        res.redirect("/products");
    } catch (error) {
        res.status(500).render("products/edit", {
            title: "Ошибка",
            error: error.message,
            product: null,
            departments: [],
            sellers: [],
        });
    }
});

module.exports = router;
