const express = require("express");
const router = express.Router();
const db = require("../models");

function test() {
    throw new Error("test error");
}

// GET /sellers - список продавцов
router.get("/", async (req, res) => {
    try {
        const sellers = await db.Seller.findAll({
            include: [
                { model: db.Department, as: "departments" },
                { model: db.Product, as: "products" },
            ],
        });
        res.render("sellers/index", {
            title: "Продавцы",
            error: "",
            sellers,
        });
    } catch (error) {
        res.status(500).render("sellers/index", {
            title: "Продавцы",
            error: error.message,
            sellers: [],
        });
    }
});

// GET / sellers / create - форма создания продавца
router.get("/create", async (req, res) => {
    try {
        const departments = await db.Department.findAll();
        const selectedDepartmentId = req.query.department_id;
        res.render("sellers/create", {
            title: "Добавление продавца",
            error: "",
            departments,
            seller: null,
            selectedDepartmentId: selectedDepartmentId,
        });
    } catch (error) {
        res.status(500).render("sellers/create", {
            title: "Ошибка",
            error: error.message,
            departments: [],
            seller: null,
            selectedDepartmentId: "",
        });
    }
});

// POST /sellers - создание продавца
router.post("/", async (req, res) => {
    try {
        if (req.body.department_id === "") {
            req.body.department_id = null;
        }
        await db.Seller.create(req.body);
        res.redirect("/sellers");
    } catch (error) {
        res.status(500).render("sellers/create", {
            title: "Ошибка",
            error: error.message,
            departments: [],
            seller: null,
            selectedDepartmentId: "",
        });
    }
});

// GET /sellers/:id - просмотр продавца
router.get("/:id", async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id, {
            include: [
                { model: db.Department, as: "departments" },
                {
                    model: db.Product,
                    as: "products",
                    include: [{ model: db.Department, as: "departments" }],
                },
            ],
        });
        if (!seller) {
            return res.status(404).render("sellers/show", {
                title: "Ошибка",
                error: "Продавец не найден",
                seller,
                totalProducts: "",
                totalValue: "",
                avgPrice: "",
            });
        }
        const totalProducts = seller.products.length;
        const totalValue = seller.products.reduce((sum, p) => sum + p.price, 0);

        res.render("sellers/show", {
            title: seller.name,
            error: "",
            seller,
            totalProducts,
            totalValue,
        });
    } catch (error) {
        res.status(500).render("sellers/show", {
            title: "Ошибка",
            error: error.message,
            seller: null,
            totalProducts: "",
            totalValue: "",
        });
    }
});

// GET /sellers/:id/edit - форма редактирования
router.get("/:id/edit", async (req, res) => {
    try {
        const [seller, departments] = await Promise.all([
            db.Seller.findByPk(req.params.id),
            db.Department.findAll(),
        ]);
        if (!seller) {
            return res.status(404).render("sellers/edit", {
                title: "Ошибка",
                error: "Продавец не найден",
                seller,
                departments: [],
            });
        }
        res.render("sellers/edit", {
            title: seller.name,
            error: "",
            seller,
            departments,
        });
    } catch (error) {
        res.status(500).render("sellers/edit", {
            title: "Ошибка",
            error: error.message,
            seller: null,
            departments: [],
        });
    }
});

// PUT /sellers/:id - обновление продавца
router.put("/:id", async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id);

        if (!seller) {
            return res.status(404).render("sellers/edit", {
                title: "Ошибка",
                error: "Продавец не найден",
                seller,
                departments: [],
            });
        }
        if (req.body.department_id === "") {
            req.body.department_id = null;
            await db.Product.update(
                { department_id: null },
                {
                    where: {
                        seller_id: seller.id,
                    },
                },
            );
        } else if (req.body.department_id !== "") {
            await db.Product.update(
                { department_id: req.body.department_id },
                {
                    where: {
                        seller_id: seller.id,
                    },
                },
            );
        }
        await seller.update(req.body);
        res.redirect("/sellers");
    } catch (error) {
        res.status(500).render("sellers/edit", {
            title: "Ошибка",
            error: error.message,
            seller: null,
            departments: [],
        });
    }
});

// DELETE /sellers/:id - удаление продавца
router.delete("/:id", async (req, res) => {
    try {
        const seller = await db.Seller.findByPk(req.params.id);
        if (!seller) {
            return res.status(404).render("sellers/edit", {
                title: "Ошибка",
                error: "Продавец не найден",
                seller,
                departments: [],
            });
        }
        await seller.destroy();
        res.redirect("/sellers");
    } catch (error) {
        res.status(500).render("sellers/edit", {
            title: "Ошибка",
            error: error.message,
            seller: null,
            departments: [],
        });
    }
});

module.exports = router;
