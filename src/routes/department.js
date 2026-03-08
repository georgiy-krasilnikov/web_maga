const express = require("express");
const router = express.Router();
const db = require("../models");

// GET /departments - список филиалов
router.get("/", async (req, res) => {
    try {
        departments = await db.Department.findAll({
            include: [
                { model: db.Seller, as: "sellers" },
                { model: db.Product, as: "products" },
            ],
        });
        res.render("departments/index", {
            title: "Филиалы",
            error: "",
            departments,
        });
    } catch (error) {
        res.status(500).render("departments/index", {
            title: "Ошибка",
            error: error.message,
            departments: [],
        });
    }
});

// POST /departments/create - для формы создания филиала
router.get("/create", async (req, res) => {
    try {
        res.render("departments/create", {
            title: "Создание филиала",
            error: "",
            department: null,
        });
    } catch (error) {
        res.status(500).render("departments/create", {
            title: "Ошибка",
            error: error.message,
        });
    }
});

// POST /departments - создание филиала
router.post("/", async (req, res) => {
    try {
        await db.Department.create(req.body);
        res.redirect("/departments");
    } catch (error) {
        res.status(500).render("departments/create", {
            title: "Ошибка",
            error: error.message,
        });
    }
});

// GET /departments/:id - просмотр филиала
router.get("/:id", async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id, {
            include: [
                {
                    model: db.Seller,
                    as: "sellers",
                    include: [{ model: db.Product, as: "products" }],
                },
                {
                    model: db.Product,
                    as: "products",
                    include: [{ model: db.Seller, as: "sellers" }],
                },
            ],
        });
        if (!department) {
            return res.status(404).render("departments/show", {
                title: "Ошибка",
                error: "Филиал не найден",
                department,
                totalProducts: "",
                totalSellers: "",
                totalValue: "",
            });
        }
        const totalProducts = department.products.length;
        const totalSellers = department.sellers.length;
        const totalValue = department.products.reduce(
            (sum, p) => sum + p.price * 1,
            0,
        );
        res.render("departments/show", {
            title: department.name,
            error: "",
            department,
            totalProducts,
            totalSellers,
            totalValue,
        });
    } catch (error) {
        res.status(500).render("departments/show", {
            title: "Ошибка",
            error: error.message,
            department: null,
            totalProducts: "",
            totalSellers: "",
            totalValue: "",
        });
    }
});

// GET /departments/:id/edit - форма редактирования
router.get("/:id/edit", async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).render("departments/edit", {
                title: "Ошибка",
                error: "Филиал не найден",
                department,
            });
        }
        res.render("departments/edit", {
            title: department.name,
            error: "",
            department,
        });
    } catch (error) {
        res.status(500).render("departments/edit", {
            title: "Ошибка",
            error: error.message,
            department: null,
        });
    }
});

// PUT /departments/:id - обновление филиала
router.put("/:id", async (req, res) => {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).render("departments/edit", {
                title: "Ошибка",
                error: "Филиал не найден",
                department,
            });
        }
        await department.update(req.body);
        res.redirect("/departments");
    } catch (error) {
        res.status(500).render("departments/edit", {
            title: "Ошибка",
            error: error.message,
            department: null,
        });
    }
});

// DELETE /departments/:id - удаление филиала
router.delete("/:id", async (req, res) => {
    try {
        const department = await dbDepartment.findByPk(req.params.id);
        if (!department) {
            return res.status(404).render("departments/edit", {
                title: "Ошибка",
                error: "Филиал не найден",
                department,
            });
        }

        await department.destroy();
        res.redirect("/departments");
    } catch (error) {
        res.status(500).render("departments/edit", {
            title: "Ошибка",
            error: error.message,
            department: null,
        });
    }
});

module.exports = router;
